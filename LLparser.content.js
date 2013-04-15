

	var _LL = {
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

	var	_COMBINATORS = {
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
			if (selector[i] != ' ' && selector[i] != '\n' && selector[i] != '\r' && selector[i] != '\t') {
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
				else if (c != ' ' && c!= '\n' && c != '\r' && c != '\t') {
					obj.left += c;
				}
			}
			else if (c != ' ' && c!= '\n' && c != '\r' && c != '\t') {
				obj.right += c;
			}
		}
		error('invalid attribute', start);
		return selector.length - 1;
	}

	function parseRecursivePseudo(start, selector, obj) {
		obj.value = '';

		var paranthCount = 1;	

		for (var i = start; i < selector.length; i++) {
			var c = selector[i];

			if (c == '(') {
				paranthCount++;
			}
			
			if (c == ')') {
				if (--paranthCount == 0) {
					obj.value = _LL.lex(obj.value);
					return i;
				}
			}

			obj.value += c;
		}
		error('invalid attribute', start);
		return selector.length - 1;
	}

	function parseNth(start, selector, obj) {
		obj.value = '';

		for (var i = start; i < selector.length; i++) {
			var c = selector[i];
			
			if (c == ')') {
				return i;
			}

			obj.value += c;
		}
		error('invalid attribute', start);
		return selector.length - 1;
	}

	_LL.lex = function lexer(selector) {
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
			else if (character in _COMBINATORS 
				&& characterAhead != '='
				&& (lastInStack.type != _LL.PSCLS 
					|| lastInStack.value.indexOf('nth-child') == -1 
					|| lastInStack.value[lastInStack.value.length-1] == ')')) {

				// COMBINATOR
				if (!lastInStack || lastInStack.type != _LL.COMB) {
					i = nextNonSpace(selector, i+1);

					if (selector[i+1] in _COMBINATORS) {
						character = selector[i+1];
						i = nextNonSpace(selector, i+2);
					}
					selectorStack.push({
						type: _LL.COMB,
						value: character
					});					
				}
			}
			else {
				// SELECTOR
				var type;
				if ((selectorStack.length == 0 
					|| lastInStack.type == _LL.COMB
					|| character in { '[':0, '.':1, '#':2, '*':3, '\\':4 }
					|| (character == ':'
						&& selector[i-1] != ':'))
					&& character != '\\') {

					switch(character) {
						case '*' : {
							type = _LL.UNIV;
							break;
						}
						case '.' : {
							type = _LL.CLS;
							break;
						}
						case '#': {
							type = _LL.ID;
							break;
						}
						case ':': {
							if (selector[i+1] == ':') {
								type = _LL.PSEL;
							}
							else {
								if (selector.substr(i + 1, 3) == 'not') {
									character = {
										value: '',
										op: 'NOT'
									}
									i = parseRecursivePseudo(i+5, selector, character)
									character = character.value;
									type = _LL.NOT;
								}
								else if (selector.substr(i + 1, 8) == 'contains') {
									character = {
										value: '',
										op: 'CONTAINS'
									}
									i = parseRecursivePseudo(i+10, selector, character);
									character = character.value;
									type = _LL.CONT;
								}
								else if (selector.substr(i +1, 3) == 'nth') {
									character= {
										value: '',
										op: 'NTH'
									}
									i = parseNth(i+11, selector, character);
									character = character.value;
									type = _LL.NTH;
								}
								else {
									type = _LL.PSCLS;
								}
							}

							if (selector[i+2] == ':') {
								error('invalid pseudo class', i+2);
							}
							break;
						}
						case '[': {
							type = _LL.ATTR;
							character = {
								left: '',
								right: '', 
								op: ''
							}
							i = parseAttribute(i+1, selector, character);
							
							break;
						}
						default: {
							type = _LL.TYPE;
							break;
						}
					}
					selectorStack.push({
						type: type,
						value: character
					});
				}
				else {
					if (character == '\\') {
						i++;
						character = selector[i];
					}
					lastInStack.value += character;
				}
			}
		}

		groups.push(selectorStack.slice(0));
		return groups;
	}
