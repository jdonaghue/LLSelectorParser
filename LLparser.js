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

function lexer(selector) {
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
			&& characterAhead != EQ 
			&& (lastInStack.type != PSEUDOCLASS 
				|| lastInStack.val.indexOf('nth-child') == -1 
				|| lastInStack.val[lastInStack.val.length-1] == ')')) {

			// COMBINATOR
			if (!lastInStack || lastInStack.type != COMBINATOR) {
				selectorStack.push({
					type: COMBINATOR,
					val: character
				});
				i = nextNonSpace(selector, i+1);
			}
		}
		else {
			// SELECTOR
			if (selectorStack.length == 0 
				|| lastInStack.type == COMBINATOR 
				|| character in {'[':0, '.':1, '#':2, ':':3}) {
				
				type = 'here is the type';
				switch(character) {
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
								character = {
									val: '',
									op: 'NOT'
								}
								i = parseRecursivePseudo(i+5, selector, character)
								type = NOT;
							}
							else if (selector.substr(i + 1, 8) == 'contains') {
								c = {
									val: '',
									op: 'CONTAINS'
								}
								i = parseRecursivePseudo(i+10, selector, character);
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
						character = {
							left: '',
							right: '', 
							op: ''
						}
						i = parseAttribute(i+1, selector, character);
						
						break;
					}
					default: {
						type = TYPE;
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