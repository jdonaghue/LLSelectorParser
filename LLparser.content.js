﻿
	window.LL = window.LL || {};

	LL = {
		UNIV: 0,
		TYPE: 1,
		ID: 2,
		CLS: 3,
		ATTR: 4,
		COMB: 5,
		PSEL: 6,
		PSCLS: 7,
		NOT: 8,
		CONT: 9,
		NTH: 10
	};

	var	COMBINATORS = {
			'+': 0,
			'>': 1,
			'~': 2,
			' ': 3
		};

	function error(message, ch) {
		if (console && console.log) {
			console.error('error: ' + message + ' char: ' + ch);
		}
	}

	function nextNonSpace(selector, start) {
		for (var i = start; i < selector.length; i++) {
			if (selector[i] != ' ') {
				return i-1;
			}
		}
		return selector.length - 1;
	}

	function parseAttribute(start, selector, obj) {
		obj.left = '';
		obj.right = '';
		obj.op

		for (var i = start; i < selector.length; i++) {
			var c = selector[i];
			
			if (c == ']') {
				return i;
			}

			if (obj.op.indexOf('=') == -1) {
				if (c in {'+':0, '~': 1, '=': 2, '$': 3, '|': 4, '^': 5, '*': 6}) {
					obj.op += c;
				}
				else {
					obj.left += c;
				}
			}
			else {
				obj.right += c;
			}
		}
		error('invalid attribute', start);
		return selector.length - 1;
	}

	function parseRecursivePseudo(start, selector, obj) {
		obj.val = '';

		var paranthCount = 1;	

		for (var i = start; i < selector.length; i++) {
			var c = selector[i];

			if (c == '(') {
				paranthCount++;
			}
			
			if (c == ')') {
				if (--paranthCount == 0) {
					obj.val = lexer(obj.val);
					return i;
				}
			}

			obj.val += c;
		}
		error('invalid attribute', start);
		return selector.length - 1;
	}

	function parseNth(start, selector, obj) {
		obj.val = '';

		for (var i = start; i < selector.length; i++) {
			var c = selector[i];
			
			if (c == ')') {
				return i;
			}

			obj.val += c;
		}
		error('invalid attribute', start);
		return selector.length - 1;
	}

	window.LL.lex = function lexer(selector) {
		var groups = [],
			selectorStack = [];

		for (var i = 0, len = selector.length; i < len; i++) {
			var character = selector[i],
				characterAhead = selector[i + 1],
				lastInStack = selectorStack[selectorStack.length-1];


			if (character == ',') {
				// GROUP
				groups.push(selectorStack.slice(0));
				selectorStack = [];
				i = nextNonSpace(selector, i+1);
			}
			else if (character in COMBINATORS 
				&& characterAhead != '='
				&& (lastInStack.type != LL.PSCLS 
					|| lastInStack.val.indexOf('nth-child') == -1 
					|| lastInStack.val[lastInStack.val.length-1] == ')')) {

				// COMBINATOR
				if (!lastInStack || lastInStack.type != LL.COMB) {
					selectorStack.push({
						type: LL.COMB,
						val: character
					});
					i = nextNonSpace(selector, i+1);
				}
			}
			else {
				// SELECTOR
				var type;
				if (selectorStack.length == 0 
					|| lastInStack.type == LL.COMB
					|| character in { '[':0, '.':1, '#':2, '*':3 }
					|| (character == ':'
						&& selector[i-1] != ':')) {

					switch(character) {
						case '*' : {
							type = LL.UNIV;
							break;
						}
						case '.' : {
							type = LL.CLS;
							break;
						}
						case '#': {
							type = LL.ID;
							break;
						}
						case ':': {
							if (selector[i+1] == ':') {
								type = LL.PSEL;
							}
							else {
								if (selector.substr(i + 1, 3) == 'not') {
									character = {
										val: '',
										op: 'NOT'
									}
									i = parseRecursivePseudo(i+5, selector, character)
									type = LL.NOT;
								}
								else if (selector.substr(i + 1, 8) == 'contains') {
									character = {
										val: '',
										op: 'CONTAINS'
									}
									i = parseRecursivePseudo(i+10, selector, character);
									type = LL.CONT;
								}
								else if (selector.substr(i +1, 3) == 'nth') {
									character= {
										val: '',
										op: 'NTH'
									}
									i = parseNth(i+11, selector, character);
									type = LL.NTH;
								}
								else {
									type = LL.PSCLS;
								}
							}

							if (selector[i+2] == ':') {
								error('invalid pseudo class', i+2);
							}
							break;
						}
						case '[': {
							type = LL.ATTR;
							character = {
								left: '',
								right: '', 
								op: ''
							}
							i = parseAttribute(i+1, selector, character);
							
							break;
						}
						default: {
							type = LL.TYPE;
							break;
						}
					}
					selectorStack.push({
						type: type,
						val: character
					});
				}
				else {
					lastInStack.val += character;
				}
			}
		}

		groups.push(selectorStack.slice(0));
		return groups;
	}