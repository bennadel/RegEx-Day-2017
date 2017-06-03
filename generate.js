
var generator = require( "@sbj42/word-search-generator" );

var puzzle = generator.generate({
	words: [
		"programmer", 	// program+er
		"javascript", 	// .{4}script
		"oop",			// ..p
		"function",		// f.{4}ion
		"closure",		// clos.*?e
		"ecmascript",	// emca.+?t
		"noop",			// n(.)\1p
		"array",		// (a)(r)\1\2
		"lexical",		// (.)exica\1
		"prototype",	// pr(ot)+?ype
		"constructor",	// con.{5}tor
		"boolean",		// .oo.ean
		"truthy",		// ...thy
		"falsey",		// false[aeiouy]
		"comment",		// co(.)\1ent
		"variable",		// var.{5}
		"method",		// .etho.
	]
});

console.info(puzzle.toString());
console.info(puzzle.words.join(','));
