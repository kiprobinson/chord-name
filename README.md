# chord-name

A library to generate the potential chord names, given a set of notes.

## Documentation 

Below is a very brief overview. [More complete documentation is on GitHub project Wiki](https://github.com/kiprobinson/chord-name/wiki).

Additionally, if your editor recognizes typescript types, all methods/types are documented.

## Types

Typescript type definitions are provided. No `@types` import is required.


## Overview

```
import {Chord, Note} from 'chord-name';

const chord = new Chord('A C E G');

// If you know the root note, use .getName(rootNote)
console.log(chord.getName('A'));

OUTPUT:
{
  "name": "Am7",
  "notes": [
    {
      "interval": "R",
      "note": new Note("A")
    },
    {
      "interval": "m3",
      "note": new Note("C")
    },
    {
      "interval": "5",
      "note": new Note("E")
    },
    {
      "interval": "7",
      "note": new Note("G")
    }
  ],
  "score": 33,
  "verbose": [ .... ]
}


// If you want to get ALL POTENTIAL names for the set of notes, use .getNames()
console.log(chord.getNames());

OUTPUT:
[
  {
    "name": "Am7",
    "notes": [
      {
        "interval": "R",
        "note": new Note("A")
      },
      {
        "interval": "m3",
        "note": new Note("C")
      },
      {
        "interval": "5",
        "note": new Note("E")
      },
      {
        "interval": "7",
        "note": new Note("G")
      }
    ],
    "score": 33,
    "verbose": [ .... ]
  },
  {
    "name": "C6",
    "notes": [
      {
        "interval": "R",
        "note": new Note("C")
      },
      {
        "interval": "3",
        "note": new Note("E")
      },
      {
        "interval": "5",
        "note": new Note("G")
      },
      {
        "interval": "6",
        "note": new Note("A")
      }
    ],
    "score": 31,
    "verbose": [ .... ]
  },
  {
    "name": "Em(#5)add11",
    "notes": [
      {
        "interval": "R",
        "note": new Note("E")
      },
      {
        "interval": "m3",
        "note": new Note("G")
      },
      {
        "interval": "#5",
        "note": new Note("C")
      },
      {
        "interval": "11",
        "note": new Note("A")
      }
    ],
    "score": 18,
    "verbose": [ .... ]
  },
  {
    "name": "G6/9sus4(no5)",
    "notes": [
      {
        "interval": "R",
        "note": new Note("G")
      },
      {
        "interval": "6",
        "note": new Note("E")
      },
      {
        "interval": "9",
        "note": new Note("A")
      },
      {
        "interval": "4",
        "note": new Note("C")
      }
    ],
    "score": 2,
    "verbose": [ .... ]
  }
]

```
