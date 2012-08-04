/**
	http://www.w3.org/TR/css3-selectors/#selectors
 
 	Pattern					Meaning	
	E						an element of type E	
	E[foo]					an E element with a "foo" attribute	
	E[foo="bar"]			an E element whose "foo" attribute value is exactly equal to "bar"	
	E[foo~="bar"]			an E element whose "foo" attribute value is a list of whitespace-separated values, one of which is exactly equal to "bar"	
	E[foo^="bar"]			an E element whose "foo" attribute value begins exactly with the string "bar"
	E[foo$="bar"]			an E element whose "foo" attribute value ends exactly with the string "bar"	
	E[foo*="bar"]			an E element whose "foo" attribute value contains the substring "bar"	
	E[foo|="en"]			an E element whose "foo" attribute has a hyphen-separated list of values beginning (from the left) with "en"
	E:root					an E element, root of the document	
	E:nth-child(n)			an E element, the n-th child of its parent	
	E:nth-last-child(n)		an E element, the n-th child of its parent, counting from the last one	
	E:nth-of-type(n)		an E element, the n-th sibling of its type	
	E:nth-last-of-type(n)	an E element, the n-th sibling of its type, counting from the last one	
	E:first-child			an E element, first child of its parent	
	E:last-child			an E element, last child of its parent	
	E:first-of-type			an E element, first sibling of its type	
	E:last-of-type			an E element, last sibling of its type	
	E:only-child			an E element, only child of its parent	
	E:only-of-type			an E element, only sibling of its type	
	E:empty					an E element that has no children (including text nodes)	
	E:link
	E:visited				an E element being the source anchor of a hyperlink of which the target is not yet visited (:link) or already visited (:visited)	
	E:active
	E:hover
	E:focus					an E element during certain user actions	
	E:target				an E element being the target of the referring URI	
	E:lang(fr)				an element of type E in language "fr" (the document language specifies how language is determined)	
	E:enabled
	E:disabled				a user interface element E which is enabled or disabled	
	E:checked				a user interface element E which is checked (for instance a radio-button or checkbox)	
	E::first-line			the first formatted line of an E element	
	E::first-letter			the first formatted letter of an E element	
	E::before				generated content before an E element	
	E::after				generated content after an E element	
	E.warning				an E element whose class is "warning" (the document language specifies how class is determined).	
	E#myid					an E element with ID equal to "myid".	
	E:not(s)				an E element that does not match simple selector s	
	E F						an F element descendant of an E element	
	E > F					an F element child of an E element	
	E + F					an F element immediately preceded by an E element	
	E ~ F					an F element preceded by an E element	
**/
(function() {
	test('basic universal selector', function() {
		expect(1);

		deepEqual(
			LL.lex('*'),
			[
				[
					{ type: LL.UNIV, value: '*' }
				]
			],
			'* PASSED');
	});

	test('basic type selector', function() {
		expect(4);

		var selector = 'div';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div' }
				]
			], 
			selector + ' PASSED');
		
		selector = 'body';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'body' }
				]
			], 
			selector + ' PASSED');

		selector = 'p';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'p' }
				]
			], 
			selector + ' PASSED');

		selector = 'br';
		deepEqual(
			LL.lex(selector),
			[
				[	
					{ type: LL.TYPE, value: 'br' }
				]
			], 
			selector + ' PASSED');
	});

	test('basic class selector', function() {
		expect(3);

		var selector = '.class';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.CLS, value: '.class' }
				]
			], 
			selector + ' PASSED');

		selector = '*.class';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' }, 
					{ type: LL.CLS, value: '.class' }
				]
			], 
			selector + ' PASSED');		

		selector = 'div.class';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div' }, 
					{ type: LL.CLS, value: '.class' }
				]
			], 
			selector + ' PASSED');		
	});

	test('basic attribute selector', function() {
		expect(9);

		var selector = '*[test=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*'}, 
					{ type: LL.ATTR, value: {
						op: '=',
						left: 'test',
						right: 'value'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '.class[test=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.CLS, value: '.class'}, 
					{ type: LL.ATTR, value: {
						op: '=',
						left: 'test',
						right: 'value'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*.class[test=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*'}, 
					{ type: LL.CLS, value: '.class'}, 
					{ type: LL.ATTR, value: {
						op: '=',
						left: 'test',
						right: 'value'
					}}
				]
			], 
			selector + ' PASSED');

		selector = 'div.class[test=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div'}, 
					{ type: LL.CLS, value: '.class'}, 
					{ type: LL.ATTR, value: {
						op: '=',
						left: 'test',
						right: 'value'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*.class[test~=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*'}, 
					{ type: LL.CLS, value: '.class'}, 
					{ type: LL.ATTR, value: {
						op: '~=',
						left: 'test',
						right: 'value'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*.class[test^=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*'}, 
					{ type: LL.CLS, value: '.class'}, 
					{ type: LL.ATTR, value: {
						op: '^=',
						left: 'test',
						right: 'value'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*.class[test$=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*'}, 
					{ type: LL.CLS, value: '.class'}, 
					{ type: LL.ATTR, value: {
						op: '$=',
						left: 'test',
						right: 'value'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*.class[test*=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*'}, 
					{ type: LL.CLS, value: '.class'}, 
					{ type: LL.ATTR, value: {
						op: '*=',
						left: 'test',
						right: 'value'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*.class[test|=value]';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*'}, 
					{ type: LL.CLS, value: '.class'}, 
					{ type: LL.ATTR, value: {
						op: '|=',
						left: 'test',
						right: 'value'
					}}
				]
			],
			selector + ' PASSED');
	});

	test('basic pseudo class selector', function() {
		expect(24);

		var selector = '*:root';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':root' }
				]
			], 
			selector + ' PASSED');

		selector = '*:first-child';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':first-child'}
				]
			], 
			selector + ' PASSED');

		selector = '*:last-child';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':last-child'}
				]
			], 
			selector + ' PASSED');

		selector = '*:only-child';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':only-child'}
				]
			], 
			selector + ' PASSED');

		selector = '*:first-of-type';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':first-of-type'}
				]
			], 
			selector + ' PASSED');

		selector = '*:last-of-type';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':last-of-type'}
				]
			], 
			selector + ' PASSED');

		selector = '*:only-of-type';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':only-of-type'}
				]
			], 
			selector + ' PASSED');

		selector = '*:empty';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':empty'}
				]
			], 
			selector + ' PASSED');

		selector = '*:link';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':link'}
				]
			], 
			selector + ' PASSED');

		selector = '*:visited';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':visited'}
				]
			], 
			selector + ' PASSED');

		selector = '*:active';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':active'}
				]
			], 
			selector + ' PASSED');

		selector = '*:hover';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':hover'}
				]
			], 
			selector + ' PASSED');

		selector = '*:focus';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':focus'}
				]
			], 
			selector + ' PASSED');

		selector = '*:target';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':target'}
				]
			], 
			selector + ' PASSED');

		selector = '*:lang(fr)';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':lang(fr)'}
				]
			], 
			selector + ' PASSED');

		selector = '*:enabled';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':enabled'}
				]
			], 
			selector + ' PASSED');

		selector = '*:disabled';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':disabled'}
				]
			], 
			selector + ' PASSED');

		selector = '*:checked';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSCLS, value: ':checked'}
				]
			], 
			selector + ' PASSED');

		selector = '*:nth-child(n)';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.NTH, value: {
						op: 'NTH',
						value: 'n'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*:nth-child(n+1)';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.NTH, value: {
						op: 'NTH',
						value: 'n+1'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*:nth-child(2n+1)';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.NTH, value: {
						op: 'NTH',
						value: '2n+1'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*:nth-child(even)';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.NTH, value: {
						op: 'NTH',
						value: 'even'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*:nth-child(odd)';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.NTH, value: {
						op: 'NTH',
						value: 'odd'
					}}
				]
			], 
			selector + ' PASSED');

		selector = '*:nth-child(10n-1)';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.NTH, value: {
						op: 'NTH',
						value: '10n-1'
					}}
				]
			], 
			selector + ' PASSED');
	});

	test('basic psuedo element selector', function() {
		expect(4);

		var selector = '*::first-line';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSEL, value: '::first-line' }
				]
			], 
			selector + ' PASSED');

		selector = '*::first-letter';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSEL, value: '::first-letter' }
				]
			], 
			selector + ' PASSED');

		selector = '*::before';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSEL, value: '::before' }
				]
			], 
			selector + ' PASSED');

		selector = '*::after';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.UNIV, value: '*' },
					{ type: LL.PSEL, value: '::after' }
				]
			], 
			selector + ' PASSED');
	});

	// test('not selector', function() {

	// });

	// test('contains selector', function() {
		
	// });

	// test('group selector', function() {
		
	// });

	test('combinator', function() {
		expect(6);

		var selector = 'div div';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div' },
					{ type: LL.COMB, value: ' ' },
					{ type: LL.TYPE, value: 'div' }
				]
			], 
			selector + ' PASSED');

		selector = 'div + div';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div' },
					{ type: LL.COMB, value: '+' },
					{ type: LL.TYPE, value: 'div' }
				]
			], 
			selector + ' PASSED');

		selector = 'div ~ div';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div' },
					{ type: LL.COMB, value: '~' },
					{ type: LL.TYPE, value: 'div' }
				]
			], 
			selector + ' PASSED');

		selector = 'div > div';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div' },
					{ type: LL.COMB, value: '>' },
					{ type: LL.TYPE, value: 'div' }
				]
			], 
			selector + ' PASSED');

		selector = 'div+div';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div' },
					{ type: LL.COMB, value: '+' },
					{ type: LL.TYPE, value: 'div' }
				]
			], 
			selector + ' PASSED');

		selector = 'div +\t\rdiv';
		deepEqual(
			LL.lex(selector),
			[
				[
					{ type: LL.TYPE, value: 'div' },
					{ type: LL.COMB, value: '+' },
					{ type: LL.TYPE, value: 'div' }
				]
			], 
			'div +\\t\\rdiv PASSED');

	});

}());