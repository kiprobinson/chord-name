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


TODO: TOC


## Note

A Note represents a musical note, devoid of any pitch information. For example, a "C" note is just a C, not a C4, C5, etc.

```
import {Note} from 'chord-name';

const c = new Note('C');

const cSharp = new Note('C#');
// Unicode sharp symbol also allowed;
// const cSharp = new Note('C♯');
// const cSharp = new Note('C\u266F');

const dFlat = new Note('Db');
// Unicode flat symbol also allowed:
// const dFlat = new Note('D♭')
// const dFlat = new Note('D\u266D')

cSharp.equals(dFlat); // true because these are the same note

// .toString() method prints the note name using default options
console.log(cSharp.toString()); // C#
console.log(dFlat.toString());  // C#
```

## Printing Notes

You can print a note (convert it to a string) using `.toString()` or `.getName(options)`:

```
console.log(new Note('C#').toString()); // C#
console.log(new Note('Db').toString()); // C#

console.log(new Note('C#').getName({useFlats: true})); // Db
console.log(new Note('Db').getName({useFlats: true})); // Db

console.log(new Note('C#').getName({unicodeAccidentals: true})); // C♯
console.log(new Note('Db').getName({useFlats: true, unicodeAccidentals: true})); // D♭
```

## Other Methods

```
// getId() - how many half steps above C this note is
console.log(new Note('C').getId());  // 0
console.log(new Note('C#').getId()); // 1
console.log(new Note('B').getId());  // 11

// transpose(n) - transposes this note n half-steps
console.log(new Note('C').transpose(0).toString());   // C
console.log(new Note('C').transpose(5).toString());   // F
console.log(new Note('C').transpose(-2).toString());  // A#
console.log(new Note('C').transpose(12).toString());  // C
console.log(new Note('C').transpose(23).toString());  // B
console.log(new Note('C').transpose(-23).toString()); // C#

// interval(that) - how many half-steps to get from this to that.
console.log(new Note('C').interval('C'));  // 0
console.log(new Note('C').interval('C#')); // 1
console.log(new Note('C').interval('B'));  // 11
```
