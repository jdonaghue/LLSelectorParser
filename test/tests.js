/**
	http://www.w3.org/TR/css3-selectors/#selectors
 
 	Pattern				Meaning	
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
		deepEqual([[{ type: LL.UNIV, val: '*'}]], LL.lex('*'), '* PASSED');
	});

	test('basic type selector', function() {
		var selector = 'div';
		deepEqual([[{ type: LL.TYPE, val: 'div'}]], LL.lex(selector), selector + ' PASSED');
		
		selector = 'body';
		deepEqual([[{ type: LL.TYPE, val: 'body'}]], LL.lex(selector), selector + ' PASSED');

		selector = 'p';
		deepEqual([[{ type: LL.TYPE, val: 'p'}]], LL.lex(selector), selector + ' PASSED');

		selector = 'br';
		deepEqual([[{ type: LL.TYPE, val: 'br'}]], LL.lex(selector), selector + ' PASSED');
	});

	test('basic class selector', function() {
		var selector = '.class';
		deepEqual([[{ type: LL.CLS, val: '.class'}]], LL.lex(selector), selector + ' PASSED');

		selector = '*.class';
		deepEqual([[{ type: LL.UNIV, val: '*'}, { type: LL.CLS, val: '.class'}]], LL.lex(selector), selector + ' PASSED');		

		selector = 'div.class';
		deepEqual([[{ type: LL.TYPE, val: 'div'}, { type: LL.CLS, val: '.class'}]], LL.lex(selector), selector + ' PASSED');		
	});

	test('basic attribute selector', function() {
		var selector = '*[test=value]';
		deepEqual([
			[
				{ type: LL.UNIV, val: '*'}, 
				{ type: LL.ATTR, val: {
					op: '=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');

		selector = '.class[test=value]';
		deepEqual([
			[
				{ type: LL.CLS, val: '.class'}, 
				{ type: LL.ATTR, val: {
					op: '=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');

		selector = '*.class[test=value]';
		deepEqual([
			[
				{ type: LL.UNIV, val: '*'}, 
				{ type: LL.CLS, val: '.class'}, 
				{ type: LL.ATTR, val: {
					op: '=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');

		selector = 'div.class[test=value]';
		deepEqual([
			[
				{ type: LL.TYPE, val: 'div'}, 
				{ type: LL.CLS, val: '.class'}, 
				{ type: LL.ATTR, val: {
					op: '=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');

		selector = '*.class[test~=value]';
		deepEqual([
			[
				{ type: LL.UNIV, val: '*'}, 
				{ type: LL.CLS, val: '.class'}, 
				{ type: LL.ATTR, val: {
					op: '~=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');

		selector = '*.class[test^=value]';
		deepEqual([
			[
				{ type: LL.UNIV, val: '*'}, 
				{ type: LL.CLS, val: '.class'}, 
				{ type: LL.ATTR, val: {
					op: '^=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');

		selector = '*.class[test$=value]';
		deepEqual([
			[
				{ type: LL.UNIV, val: '*'}, 
				{ type: LL.CLS, val: '.class'}, 
				{ type: LL.ATTR, val: {
					op: '$=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');

		selector = '*.class[test*=value]';
		deepEqual([
			[
				{ type: LL.UNIV, val: '*'}, 
				{ type: LL.CLS, val: '.class'}, 
				{ type: LL.ATTR, val: {
					op: '*=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');

		selector = '*.class[test|=value]';
		deepEqual([
			[
				{ type: LL.UNIV, val: '*'}, 
				{ type: LL.CLS, val: '.class'}, 
				{ type: LL.ATTR, val: {
					op: '|=',
					left: 'test',
					right: 'value'
				}}
			]
		], LL.lex(selector), selector + ' PASSED');
	});

}());