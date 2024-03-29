# chord-name

A library to generate the potential chord names, given a set of notes.

An example app that uses this library is [Chord-o-matic Chord Constructor](https://tilde.ampersand.space/chord-o-matic/).


## Documentation 

Below is a very brief overview. [More complete documentation is on GitHub project wiki](https://github.com/kiprobinson/chord-name/wiki).

Additionally, if your editor recognizes typescript types, all methods/types are documented.


## Types

Typescript type definitions are provided. No `@types` import is required.


## Overview

```
const {Chord} = require('chord-name');

const chord = new Chord('A C E G');

// If you know the root note, use .getName(rootNote)
console.log(chord.getName('A'));

OUTPUT:
{
  "name": "Am7",
  "intervals": [
    {
      "interval": "R",
      "note": "A"
    },
    {
      "interval": "m3",
      "note": "C"
    },
    {
      "interval": "5",
      "note": "E"
    },
    {
      "interval": "7",
      "note": "G"
    }
  ],
  "score": 33
}


// If you want to get ALL POTENTIAL names for the set of notes, use .getNames()
console.log(chord.getNames());

OUTPUT:
[
  {
    "name": "Am7",
    "intervals": [
      {
        "interval": "R",
        "note": "A"
      },
      {
        "interval": "m3",
        "note": "C"
      },
      {
        "interval": "5",
        "note": "E"
      },
      {
        "interval": "7",
        "note": "G"
      }
    ],
    "score": 33
  },
  {
    "name": "C6",
    "intervals": [
      {
        "interval": "R",
        "note": "C"
      },
      {
        "interval": "3",
        "note": "E"
      },
      {
        "interval": "5",
        "note": "G"
      },
      {
        "interval": "6",
        "note": "A"
      }
    ],
    "score": 31
  },
  {
    "name": "Em(♯5)add11",
    "intervals": [
      {
        "interval": "R",
        "note": "E"
      },
      {
        "interval": "m3",
        "note": "G"
      },
      {
        "interval": "♯5",
        "note": "C"
      },
      {
        "interval": "11",
        "note": "A"
      }
    ],
    "score": 18
  },
  {
    "name": "G6/9sus4(no5)",
    "intervals": [
      {
        "interval": "R",
        "note": "G"
      },
      {
        "interval": "6",
        "note": "E"
      },
      {
        "interval": "9",
        "note": "A"
      },
      {
        "interval": "4",
        "note": "C"
      }
    ],
    "score": 2
  }
]

```


## Methodology

Beyond well-defined chords like majors/minors/sevenths, there can be surprising variation in what a chord is called. What I've written reflects my best understanding of chord names, but I'm [always open to feedback](https://github.com/kiprobinson/chord-name/issues).

### Two-note chords

I need to make a special mention of two-note chords. In the traditional definition of "chord", at least three notes are required to define a chord. But that completely ignores the ubiquitous power chord! Rather than throw an error, my algorithm will return the following names for two-note chords:

| Intervals                | Name                     | Example          |
|--------------------------|--------------------------|------------------|
| Root + minor third       | \<root\>m(no5)           | C + E♭ = Cm(no5) |
| Root + major third       | \<root\>(no5)            | C + E = C(no5)   |
| Root + flat fifth        | \<root\>dim5             | C + G♭ = Cdim5   |
| Root + fifth             | \<root\>5                | C + G = C5       |
| Root + sharp fifth       | \<root\>aug5             | C + G♯ = Caug5   |
| _All other combinations_ | \<root\>\~\<other-note\> | C + A = C\~A     |

I'm really not happy with that "All other combinations" row, but it's the best I could come up with. I'm [certainly open to feedback](https://github.com/kiprobinson/chord-name/issues) if you have a better idea!
