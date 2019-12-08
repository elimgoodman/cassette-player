# Overview

This is just a little toy game engine that I'm writing to explore some ideas. It's a work in progress - read with a big grain of salt!

# Running

```sh
$ npm install
$ npm start
```

The server should start on http://localhost:3000

# What's the Idea?

I'm interested in seeing if I can specify a game in a relatively straightforward declarative structure (a "[cassette](https://github.com/elimgoodman/cassette-player/blob/master/src/sample-cassette.ts)"), which can then be read and rendered on a canvas element.

The eventual goal is to design a UI capable of manipulating the cassette defition (a "cassette editor"). However, I want to ensure that the cassette data structure can actually specify a complete and playable game, so I'm making this player first. Additionally, if I do build a cassette editor, it will need a way for the user to see the results of their edits, so this component is a prerequesite for that as well.
