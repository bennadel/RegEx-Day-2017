
# Regular Expression Day 2017

by [Ben Nadel][bennadel] (on [Google+][googleplus])

For the [10th annual Regular Expression Day][regexday], I was trying to come up with an 
interactive game that was like "word search", except you are searching for "pattern
matches". Under the hood, it was still doing a simple word search; but, the game board 
was constructed using words that I knew would adhere to established regular expression 
patterns.

The underlying technology is a [Word Search Node.js module][generator] written by 
[James Clark][jamesclark]. Then, I took it and tried to wrap it in an Angular (v4) 
application. Things were going fairly well until I realized that there wasn't enough 
visual distinction between the selections; and, that overlapping selections weren't 
obvious enough to the user. In order to do that, I think I would have had to use SVG in
order to outline the selections. Unfortunately, this is beyond my current skill set.

__[Play the game for yourself][game]__.

Still, was fun to try!


[bennadel]: http://www.bennadel.com
[googleplus]: https://plus.google.com/108976367067760160494?rel=author
[regexday]: https://www.bennadel.com/blog/3282-the-10th-annual-regular-expression-day---june-1st-2017.htm
[generator]: https://www.npmjs.com/package/@sbj42/word-search-generator
[jamesclark]: http://arbitraryclark.blogspot.com/
[game]: http://bennadel.github.io/RegEx-Day-2017/
