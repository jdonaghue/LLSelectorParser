var COMBINATORS = {
		'+': 0,
		'>': 1,
		'~': 2,
		' ': 3
	},
	EQ = '=',
	LB = '[',
	RB = ']',
	PLUS = 0,
	GT = 1,
	TILDA = 2,
	SPACE = 3,
	COMBINATOR = 4,
	PSEUDOEL = 5,
	PSEUDOCLASS = 6,
	ATTR = 7,
	CLS = 8,
	ID = 9,
	TYPE = 10,
	NOT = 11,
	CONTAINS = 12;

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
			if (c in {'+':0, '~': 1, '=': 2}) {
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

function parsePseudo(start, selector, obj) {
	obj.val = '';	

	for (var i = start; i < selector.length; i++) {
		var c = selector[i];
		
		if (c == ')') {
			obj.val = lexer(obj.val);
			return i;
		}

		obj.val += c;
	}
	error('invalid attribute', start);
	return selector.length - 1;
}

function lexer(selector) {
	var groups = [],
		selectorStack = [];

	for (var i = 0, len = selector.length; i < len; i++) {
		var c = selector[i],
			cAhead = selector[i + 1];

		if (c == ',') {
			// GROUP
			groups.push(selectorStack.slice(0));
			selectorStack = [];
			i = nextNonSpace(selector, i+1);
		}
		else if (c in COMBINATORS && cAhead != EQ) {
			// COMBINATOR
			if (!selectorStack[selectorStack.length] || selectorStack[selectorStack.length-1].type != COMBINATOR) {
				selectorStack.push({
					type: COMBINATOR,
					val: c
				});
				i = nextNonSpace(selector, i+1);
			}
		}
		else {
			// SELECTOR
			if (selectorStack.length == 0 || selectorStack[selectorStack.length - 1].type == COMBINATOR || c in {'[':0, '.':1, '#':2, ':':3}) {
				type = 'here is the type';
				switch(c) {
					case '.' : {
						type = CLS;
						break;
					}
					case '#': {
						type = ID;
						break;
					}
					case ':': {
						if (selector[i+1] == ':') {
							type = PSEUDOEL;
						}
						else {
							if (selector.substr(i + 1, 3) == 'not') {
								c = {
									val: '',
									op: 'NOT'
								}
								i = parsePseudo(i+5, selector, c)
								type = NOT;
							}
							else if (selector.substr(i + 1, 8) == 'contains') {
								c = {
									val: '',
									op: 'CONTAINS'
								}
								i = parsePseudo(i+10, selector, c);
								type = CONTAINS;
							}
							else {
								type = PSEUDOCLASS;
							}
						}

						if (selector[i+2] == ':') {
							error('invalid pseudo class', i+2)
						}
						break;
					}
					case '[': {
						type = ATTR;
						c = {
							left: '',
							right: '', 
							op: ''
						}
						i = parseAttribute(i+1, selector, c);
						
						break;
					}
					default: {
						type = TYPE;
						break;
					}
				}
				selectorStack.push({
					type: type,
					val: c
				});
			}
			else {
				selectorStack[selectorStack.length - 1].val += c;
			}
		}
	}

	groups.push(selectorStack.slice(0));
	return groups;
}