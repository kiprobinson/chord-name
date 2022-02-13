import { expect } from "chai";
import {Note, Pitch, Chord, ChordNameOptions} from "../src";

//shortcuts to make tests less tedious to write...
const c = new Note('C');
const crd = (noteList:string) => new Chord(noteList);

describe('test Chord class', () => {
  it('chord constructor - string', () => {
    const chord = new Chord('   C    EB,G,    b,c,');
    expect(chord.getName(c).name).to.equal('Cm(maj7)');
    expect(chord.getBassNote()).to.be.null;
    expect(chord.getNotes().map(note => note.toString()).join(' ')).to.equal('C D# G B');
  });
  
  it('chord constructor - string array', () => {
    const chord = new Chord(['C', 'EB', 'G', 'b', 'c']);
    expect(chord.getName(c).name).to.equal('Cm(maj7)');
    expect(chord.getBassNote()).to.be.null;
    expect(chord.getNotes().map(note => note.toString()).join(' ')).to.equal('C D# G B');
  });
  
  it('chord constructor - Note array', () => {
    const chord = new Chord([new Note('C'), new Note('EB'), new Note('G'), new Note('b'), new Note('c')]);
    expect(chord.getName(c).name).to.equal('Cm(maj7)');
    expect(chord.getBassNote()).to.be.null;
    expect(chord.getNotes().map(note => note.toString()).join(' ')).to.equal('C D# G B');
  });
  
  it('chord constructor - Pitch array', () => {
    const chord = new Chord([new Pitch('C5'), new Pitch('EB6'), new Pitch('G4'), new Pitch('b3'), new Pitch('c2')]);
    expect(chord.getName(c).name).to.equal('Cm(maj7)');
    expect(chord.getBassNote()?.getName()).to.equal('C');
    expect(chord.getNotes().map(note => note.toString()).join(' ')).to.equal('C D# G B');
  });
  
  it('chord constructor - mixed array', () => {
    const chord = new Chord(['C', new Note('EB'), new Pitch('G5'), new Note('b'), 'c']);
    expect(chord.getName(c).name).to.equal('Cm(maj7)');
    expect(chord.getBassNote()).to.be.null;
    expect(chord.getNotes().map(note => note.toString()).join(' ')).to.equal('C D# G B');
  });
  
  it('chord constructor - negative tests', () => {
    // @ts-expect-error
    expect(() => new Chord()).to.throw;
    // @ts-expect-error
    expect(() => new Chord(null)).to.throw;
    expect(() => new Chord('')).to.throw;
    expect(() => new Chord([])).to.throw;
    // @ts-expect-error
    expect(() => new Chord([1])).to.throw;
    // @ts-expect-error
    expect(() => new Chord([new Date()])).to.throw;
  });
  
  it('get chord name - single note "chord"', () => {
    expect(crd('C').getName(c).name).to.equal('C');
    expect(crd('C').getName('C').name).to.equal('C');
  });
  
  it('get chord name - two-note "chords"', () => {
    expect(crd('C Db').getName(c).name).to.equal('C~C#');
    expect(crd('C D').getName(c).name).to.equal('C~D');
    expect(crd('C Eb').getName(c).name).to.equal('Cm(no5)');
    expect(crd('C E').getName(c).name).to.equal('C(no5)');
    expect(crd('C F').getName(c).name).to.equal('C~F');
    expect(crd('C Gb').getName(c).name).to.equal('Cdim5');
    expect(crd('C G').getName(c).name).to.equal('C5');
    expect(crd('C Ab').getName(c).name).to.equal('Caug5');
    expect(crd('C A').getName(c).name).to.equal('C~A');
    expect(crd('C Bb').getName(c).name).to.equal('C~A#');
    expect(crd('C B').getName(c).name).to.equal('C~B');
  });
  
  it('get chord name - major/minor/aug/dim', () => {
    expect(crd('C E G').getName(c).name).to.equal('C');
    expect(crd('C Eb G').getName(c).name).to.equal('Cm');
    expect(crd('C E G#').getName(c).name).to.equal('Caug');
    expect(crd('C Eb Gb').getName(c).name).to.equal('Cdim');
    expect(crd('C E Gb').getName(c).name).to.equal('C(b5)');
    expect(crd('C Eb G#').getName(c).name).to.equal('Cm(#5)');
  });
  
  it('get chord name - sevenths', () => {
    expect(crd('C E G Bb').getName(c).name).to.equal('C7');
    expect(crd('C Eb G Bb').getName(c).name).to.equal('Cm7');
    expect(crd('C E G B').getName(c).name).to.equal('Cmaj7');
    expect(crd('C Eb G B').getName(c).name).to.equal('Cm(maj7)');
    expect(crd('C E G# Bb').getName(c).name).to.equal('Caug7');
    expect(crd('C E G# B').getName(c).name).to.equal('Caug(maj7)');
    
    expect(crd('C Eb Gb A').getName(c).name).to.equal('Cdim7');
    expect(crd('C Eb Gb Bb').getName(c).name).to.equal('Cm7(b5)');
    expect(crd('C Eb Gb B').getName(c).name).to.equal('Cdim(maj7)');
  });
  
  it('get chord name - ninths', () => {
    expect(crd('C E G Bb D').getName(c).name).to.equal('C9');
    expect(crd('C E G B D').getName(c).name).to.equal('Cmaj9');
    expect(crd('C E G D').getName(c).name).to.equal('Cadd9');
    expect(crd('C Eb G Bb D').getName(c).name).to.equal('Cm9');
    expect(crd('C Eb G B D').getName(c).name).to.equal('Cm(maj9)');
    expect(crd('C Eb G D').getName(c).name).to.equal('Cm(add9)');
    
    expect(crd('C E G Bb D#').getName(c).name).to.equal('C7(#9)');
    expect(crd('C E G B D#').getName(c).name).to.equal('Cmaj7(#9)');
    
    expect(crd('C Eb Gb A D').getName(c).name).to.equal('Cdim9');
    expect(crd('C Eb Gb D').getName(c).name).to.equal('Cdim(add9)');
    
    expect(crd('C E G# A D').getName(c).name).to.equal('Caug6/9');
    expect(crd('C E G# Bb D').getName(c).name).to.equal('Caug9');
    expect(crd('C E G# B D').getName(c).name).to.equal('Caug(maj9)');
    expect(crd('C E G# D').getName(c).name).to.equal('Caug(add9)');
  });
  
  it('get chord name - elevenths', () => {
    //note- I treat 9th as optional in 11th chord
    expect(crd('C E G Bb D F').getName(c).name).to.equal('C11');
    expect(crd('C E G Bb F').getName(c).name).to.equal('C11');
    expect(crd('C E G F').getName(c).name).to.equal('Cadd11');
    expect(crd('C E G B D F').getName(c).name).to.equal('Cmaj11');
    expect(crd('C E G B F').getName(c).name).to.equal('Cmaj11');
    
    expect(crd('C Eb G Bb D F').getName(c).name).to.equal('Cm11');
    expect(crd('C Eb G Bb F').getName(c).name).to.equal('Cm11');
    expect(crd('C Eb G F').getName(c).name).to.equal('Cm(add11)');
    expect(crd('C Eb G B D F').getName(c).name).to.equal('Cm(maj11)');
    expect(crd('C Eb G B F').getName(c).name).to.equal('Cm(maj11)');
    
    expect(crd('C Eb Gb A D F').getName(c).name).to.equal('Cdim11');
    expect(crd('C Eb Gb A F').getName(c).name).to.equal('Cdim11');
    expect(crd('C Eb Gb F').getName(c).name).to.equal('Cdim(add11)');
    
    expect(crd('C E G# Bb D F').getName(c).name).to.equal('Caug11');
    expect(crd('C E G# Bb F').getName(c).name).to.equal('Caug11');
    expect(crd('C E G# F').getName(c).name).to.equal('Caug(add11)');
    expect(crd('C E G# B D F').getName(c).name).to.equal('Caug(maj11)');
    expect(crd('C E G# B F').getName(c).name).to.equal('Caug(maj11)');
  });
  
  it('get chord name - thirteenths', () => {
    expect(crd('C E G Bb D F A').getName(c).name).to.equal('C13');
    expect(crd('C E G Bb D A').getName(c).name).to.equal('C13');
    expect(crd('C E G Bb F A').getName(c).name).to.equal('C13');
    expect(crd('C E G Bb A').getName(c).name).to.equal('C13');
    expect(crd('C E G B D F A').getName(c).name).to.equal('Cmaj13');
    expect(crd('C E G B D A').getName(c).name).to.equal('Cmaj13');
    expect(crd('C E G B F A').getName(c).name).to.equal('Cmaj13');
    expect(crd('C E G B A').getName(c).name).to.equal('Cmaj13');
    
    expect(crd('C Eb G Bb D F A').getName(c).name).to.equal('Cm13');
    expect(crd('C Eb G Bb D A').getName(c).name).to.equal('Cm13');
    expect(crd('C Eb G Bb F A').getName(c).name).to.equal('Cm13');
    expect(crd('C Eb G Bb A').getName(c).name).to.equal('Cm13');
    expect(crd('C Eb G B D F A').getName(c).name).to.equal('Cm(maj13)');
    expect(crd('C Eb G B D A').getName(c).name).to.equal('Cm(maj13)');
    expect(crd('C Eb G B F A').getName(c).name).to.equal('Cm(maj13)');
    expect(crd('C Eb G B A').getName(c).name).to.equal('Cm(maj13)');
    
    //no dim13 - 13th is same as 6th same as double-flat 7th (that creates dim chord)
    expect(crd('C E G# Bb D F A').getName(c).name).to.equal('Caug13');
    expect(crd('C E G# Bb D A').getName(c).name).to.equal('Caug13');
    expect(crd('C E G# Bb F A').getName(c).name).to.equal('Caug13');
    expect(crd('C E G# Bb A').getName(c).name).to.equal('Caug13');
    expect(crd('C E G# B D F A').getName(c).name).to.equal('Caug(maj13)');
    expect(crd('C E G# B D A').getName(c).name).to.equal('Caug(maj13)');
    expect(crd('C E G# B F A').getName(c).name).to.equal('Caug(maj13)');
    expect(crd('C E G# B A').getName(c).name).to.equal('Caug(maj13)');
  });
  
  it('get chord name - sixths', () => {
    expect(crd('C E G A').getName(c).name).to.equal('C6');
    expect(crd('C E A').getName(c).name).to.equal('C6(no5)');
    expect(crd('C E Gb A').getName(c).name).to.equal('C6(b5)');
    expect(crd('C E G# A').getName(c).name).to.equal('Caug6');
    expect(crd('C Eb G A').getName(c).name).to.equal('Cm6');
    expect(crd('C Eb A').getName(c).name).to.equal('Cm6(no5)');
    expect(crd('C Eb G# A').getName(c).name).to.equal('Cm6(#5)');
    
    expect(crd('C E G A D').getName(c).name).to.equal('C6/9');
    expect(crd('C Eb G A D').getName(c).name).to.equal('Cm6/9');
  });
  
  it('get chord name - suspended', () => {
    expect(crd('C D G').getName(c).name).to.equal('Csus2');
    expect(crd('C F G').getName(c).name).to.equal('Csus4');
    expect(crd('C D F G').getName(c).name).to.equal('Csus2/4');
  });
  
  it('get chord name - suspended sixths', () => {
    expect(crd('C A G').getName(c).name).to.equal('C6sus');
    expect(crd('C A G D').getName(c).name).to.equal('C6/9sus');
    expect(crd('C A G F').getName(c).name).to.equal('C6/11sus');
    expect(crd('C A G D F').getName(c).name).to.equal('C6/9sus4');
    
    expect(crd('C A D').getName(c).name).to.equal('C6/9sus(no5)');
    expect(crd('C A F').getName(c).name).to.equal('C6/11sus(no5)');
    expect(crd('C A D F').getName(c).name).to.equal('C6/9sus4(no5)');
  });
  
  it('get chord name - suspended sevenths', () => {
    expect(crd('C G Bb').getName(c).name).to.equal('C7sus');
    expect(crd('C G B').getName(c).name).to.equal('Cmaj7sus');
  });
  
  it('get chord name - suspended ninths', () => {
    expect(crd('C G Bb D').getName(c).name).to.equal('C9sus');
    expect(crd('C G B D').getName(c).name).to.equal('Cmaj9sus');
  });
  
  it('get chord name - suspended elevenths', () => {
    expect(crd('C G Bb D F').getName(c).name).to.equal('C11sus');
    expect(crd('C G Bb F').getName(c).name).to.equal('C11sus');
    expect(crd('C G B D F').getName(c).name).to.equal('Cmaj11sus');
    expect(crd('C G B F').getName(c).name).to.equal('Cmaj11sus');
  });
  
  it('get chord name - suspended thirteenths', () => {
    expect(crd('C G Bb D F A').getName(c).name).to.equal('C13sus');
    expect(crd('C G Bb D A').getName(c).name).to.equal('C13sus');
    expect(crd('C G Bb F A').getName(c).name).to.equal('C13sus');
    expect(crd('C G Bb A').getName(c).name).to.equal('C13sus');
    expect(crd('C G B D F A').getName(c).name).to.equal('Cmaj13sus');
    expect(crd('C G B D A').getName(c).name).to.equal('Cmaj13sus');
    expect(crd('C G B F A').getName(c).name).to.equal('Cmaj13sus');
    expect(crd('C G B A').getName(c).name).to.equal('Cmaj13sus');
  });
  
  it('get chord name - others', () => {
    //not sure about below!
    expect(crd('C Eb E G').getName(c).name).to.equal('Cadd(m3)'); //is this right??
    
    expect(crd('C E G Bb B').getName(c).name).to.equal('C7add(maj7)'); //this is C13. Maybe I meant C E G Bb B ?? Would that be C7add7?
    
    //need more...
  });
  
  it('chord name options - massive test', () => {
    //these tests all use F# as the root note, because it is the only major chord where all notes have accidentals,
    //making the test for different symbols easier
    let root = new Note('F#');
    
    //below test assertions generated by spreadsheet ChordNameOptionsTestMatrix.ods
    let testMatrix:Record<string, Array<{o:ChordNameOptions, x:string}>> = {
      "F#":[{o:{}, x:"F#"},{o:{useFlats:true}, x:"Gb"},{o:{majorSymbol:"M"}, x:"F#"},{o:{omitMajor:false}, x:"F#"},{o:{omitMinor:true}, x:"F#"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#"},{o:{unicodeAccidentals:true}, x:"F♯"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭"}],
      "F# G":[{o:{}, x:"F#~G"},{o:{useFlats:true}, x:"Gb~G"},{o:{majorSymbol:"M"}, x:"F#~G"},{o:{omitMajor:false}, x:"F#~G"},{o:{omitMinor:true}, x:"F#~G"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#~G"},{o:{unicodeAccidentals:true}, x:"F♯~G"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭~G"}],
      "F# G#":[{o:{}, x:"F#~G#"},{o:{useFlats:true}, x:"Gb~Ab"},{o:{majorSymbol:"M"}, x:"F#~G#"},{o:{omitMajor:false}, x:"F#~G#"},{o:{omitMinor:true}, x:"F#~G#"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#~G#"},{o:{unicodeAccidentals:true}, x:"F♯~G♯"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭~A♭"}],
      "F# A":[{o:{}, x:"F#m(no5)"},{o:{useFlats:true}, x:"Gbm(no5)"},{o:{majorSymbol:"M"}, x:"F#m(no5)"},{o:{omitMajor:false}, x:"F#m(no5)"},{o:{omitMinor:true}, x:"f#(no5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-(no5)"},{o:{unicodeAccidentals:true}, x:"F♯m(no5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(no5)"}],
      "F# A#":[{o:{}, x:"F#(no5)"},{o:{useFlats:true}, x:"Gb(no5)"},{o:{majorSymbol:"M"}, x:"F#(no5)"},{o:{omitMajor:false}, x:"F#maj(no5)"},{o:{omitMinor:true}, x:"F#(no5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#(no5)"},{o:{unicodeAccidentals:true}, x:"F♯(no5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭(no5)"}],
      "F# B":[{o:{}, x:"F#~B"},{o:{useFlats:true}, x:"Gb~B"},{o:{majorSymbol:"M"}, x:"F#~B"},{o:{omitMajor:false}, x:"F#~B"},{o:{omitMinor:true}, x:"F#~B"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#~B"},{o:{unicodeAccidentals:true}, x:"F♯~B"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭~B"}],
      "F# C":[{o:{}, x:"F#dim5"},{o:{useFlats:true}, x:"Gbdim5"},{o:{majorSymbol:"M"}, x:"F#dim5"},{o:{omitMajor:false}, x:"F#dim5"},{o:{omitMinor:true}, x:"F#dim5"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒ5"},{o:{unicodeAccidentals:true}, x:"F♯dim5"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim5"}],
      "F# C#":[{o:{}, x:"F#5"},{o:{useFlats:true}, x:"Gb5"},{o:{majorSymbol:"M"}, x:"F#5"},{o:{omitMajor:false}, x:"F#5"},{o:{omitMinor:true}, x:"F#5"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#5"},{o:{unicodeAccidentals:true}, x:"F♯5"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭5"}],
      "F# D":[{o:{}, x:"F#aug5"},{o:{useFlats:true}, x:"Gbaug5"},{o:{majorSymbol:"M"}, x:"F#aug5"},{o:{omitMajor:false}, x:"F#aug5"},{o:{omitMinor:true}, x:"F#aug5"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+5"},{o:{unicodeAccidentals:true}, x:"F♯aug5"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug5"}],
      "F# D#":[{o:{}, x:"F#~D#"},{o:{useFlats:true}, x:"Gb~Eb"},{o:{majorSymbol:"M"}, x:"F#~D#"},{o:{omitMajor:false}, x:"F#~D#"},{o:{omitMinor:true}, x:"F#~D#"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#~D#"},{o:{unicodeAccidentals:true}, x:"F♯~D♯"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭~E♭"}],
      "F# E":[{o:{}, x:"F#~E"},{o:{useFlats:true}, x:"Gb~E"},{o:{majorSymbol:"M"}, x:"F#~E"},{o:{omitMajor:false}, x:"F#~E"},{o:{omitMinor:true}, x:"F#~E"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#~E"},{o:{unicodeAccidentals:true}, x:"F♯~E"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭~E"}],
      "F# F":[{o:{}, x:"F#~F"},{o:{useFlats:true}, x:"Gb~F"},{o:{majorSymbol:"M"}, x:"F#~F"},{o:{omitMajor:false}, x:"F#~F"},{o:{omitMinor:true}, x:"F#~F"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#~F"},{o:{unicodeAccidentals:true}, x:"F♯~F"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭~F"}],
      "F# A# C#":[{o:{}, x:"F#"},{o:{useFlats:true}, x:"Gb"},{o:{majorSymbol:"M"}, x:"F#"},{o:{omitMajor:false}, x:"F#maj"},{o:{omitMinor:true}, x:"F#"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#"},{o:{unicodeAccidentals:true}, x:"F♯"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭"}],
      "F# A C#":[{o:{}, x:"F#m"},{o:{useFlats:true}, x:"Gbm"},{o:{majorSymbol:"M"}, x:"F#m"},{o:{omitMajor:false}, x:"F#m"},{o:{omitMinor:true}, x:"f#"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-"},{o:{unicodeAccidentals:true}, x:"F♯m"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m"}],
      "F# A# D":[{o:{}, x:"F#aug"},{o:{useFlats:true}, x:"Gbaug"},{o:{majorSymbol:"M"}, x:"F#aug"},{o:{omitMajor:false}, x:"F#aug"},{o:{omitMinor:true}, x:"F#aug"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+"},{o:{unicodeAccidentals:true}, x:"F♯aug"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug"}],
      "F# A C":[{o:{}, x:"F#dim"},{o:{useFlats:true}, x:"Gbdim"},{o:{majorSymbol:"M"}, x:"F#dim"},{o:{omitMajor:false}, x:"F#dim"},{o:{omitMinor:true}, x:"F#dim"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒ"},{o:{unicodeAccidentals:true}, x:"F♯dim"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim"}],
      "F# A# C":[{o:{}, x:"F#(b5)"},{o:{useFlats:true}, x:"Gb(b5)"},{o:{majorSymbol:"M"}, x:"F#(b5)"},{o:{omitMajor:false}, x:"F#maj(b5)"},{o:{omitMinor:true}, x:"F#(b5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#(b5)"},{o:{unicodeAccidentals:true}, x:"F♯(♭5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭(♭5)"}],
      "F# A D":[{o:{}, x:"F#m(#5)"},{o:{useFlats:true}, x:"Gbm(#5)"},{o:{majorSymbol:"M"}, x:"F#m(#5)"},{o:{omitMajor:false}, x:"F#m(#5)"},{o:{omitMinor:true}, x:"f#(#5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-(#5)"},{o:{unicodeAccidentals:true}, x:"F♯m(♯5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(♯5)"}],
      "F# A# C# E":[{o:{}, x:"F#7"},{o:{useFlats:true}, x:"Gb7"},{o:{majorSymbol:"M"}, x:"F#7"},{o:{omitMajor:false}, x:"F#7"},{o:{omitMinor:true}, x:"F#7"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#7"},{o:{unicodeAccidentals:true}, x:"F♯7"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭7"}],
      "F# A C# E":[{o:{}, x:"F#m7"},{o:{useFlats:true}, x:"Gbm7"},{o:{majorSymbol:"M"}, x:"F#m7"},{o:{omitMajor:false}, x:"F#m7"},{o:{omitMinor:true}, x:"f#7"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-7"},{o:{unicodeAccidentals:true}, x:"F♯m7"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m7"}],
      "F# A# C# F":[{o:{}, x:"F#maj7"},{o:{useFlats:true}, x:"Gbmaj7"},{o:{majorSymbol:"M"}, x:"F#M7"},{o:{omitMajor:false}, x:"F#maj7"},{o:{omitMinor:true}, x:"F#maj7"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj7"},{o:{unicodeAccidentals:true}, x:"F♯maj7"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj7"}],
      "F# A C# F":[{o:{}, x:"F#m(maj7)"},{o:{useFlats:true}, x:"Gbm(maj7)"},{o:{majorSymbol:"M"}, x:"F#m(M7)"},{o:{omitMajor:false}, x:"F#m(maj7)"},{o:{omitMinor:true}, x:"f#maj7"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-maj7"},{o:{unicodeAccidentals:true}, x:"F♯m(maj7)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(maj7)"}],
      "F# A# D E":[{o:{}, x:"F#aug7"},{o:{useFlats:true}, x:"Gbaug7"},{o:{majorSymbol:"M"}, x:"F#aug7"},{o:{omitMajor:false}, x:"F#aug7"},{o:{omitMinor:true}, x:"F#aug7"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+7"},{o:{unicodeAccidentals:true}, x:"F♯aug7"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug7"}],
      "F# A# D F":[{o:{}, x:"F#aug(maj7)"},{o:{useFlats:true}, x:"Gbaug(maj7)"},{o:{majorSymbol:"M"}, x:"F#aug(M7)"},{o:{omitMajor:false}, x:"F#aug(maj7)"},{o:{omitMinor:true}, x:"F#aug(maj7)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+maj7"},{o:{unicodeAccidentals:true}, x:"F♯aug(maj7)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(maj7)"}],
      "F# A C D#":[{o:{}, x:"F#dim7"},{o:{useFlats:true}, x:"Gbdim7"},{o:{majorSymbol:"M"}, x:"F#dim7"},{o:{omitMajor:false}, x:"F#dim7"},{o:{omitMinor:true}, x:"F#dim7"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒ7"},{o:{unicodeAccidentals:true}, x:"F♯dim7"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim7"}],
      "F# A C E":[{o:{}, x:"F#m7(b5)"},{o:{useFlats:true}, x:"Gbm7(b5)"},{o:{majorSymbol:"M"}, x:"F#m7(b5)"},{o:{omitMajor:false}, x:"F#m7(b5)"},{o:{omitMinor:true}, x:"f#7(b5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ø"},{o:{unicodeAccidentals:true}, x:"F♯m7(♭5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m7(♭5)"}],
      "F# A C F":[{o:{}, x:"F#dim(maj7)"},{o:{useFlats:true}, x:"Gbdim(maj7)"},{o:{majorSymbol:"M"}, x:"F#dim(M7)"},{o:{omitMajor:false}, x:"F#dim(maj7)"},{o:{omitMinor:true}, x:"F#dim(maj7)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒmaj7"},{o:{unicodeAccidentals:true}, x:"F♯dim(maj7)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim(maj7)"}],
      "F# A# C# E G#":[{o:{}, x:"F#9"},{o:{useFlats:true}, x:"Gb9"},{o:{majorSymbol:"M"}, x:"F#9"},{o:{omitMajor:false}, x:"F#9"},{o:{omitMinor:true}, x:"F#9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#9"},{o:{unicodeAccidentals:true}, x:"F♯9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭9"}],
      "F# A# C# F G#":[{o:{}, x:"F#maj9"},{o:{useFlats:true}, x:"Gbmaj9"},{o:{majorSymbol:"M"}, x:"F#M9"},{o:{omitMajor:false}, x:"F#maj9"},{o:{omitMinor:true}, x:"F#maj9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj9"},{o:{unicodeAccidentals:true}, x:"F♯maj9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj9"}],
      "F# A# C# G#":[{o:{}, x:"F#add9"},{o:{useFlats:true}, x:"Gbadd9"},{o:{majorSymbol:"M"}, x:"F#add9"},{o:{omitMajor:false}, x:"F#add9"},{o:{omitMinor:true}, x:"F#add9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#add9"},{o:{unicodeAccidentals:true}, x:"F♯add9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭add9"}],
      "F# A C# E G#":[{o:{}, x:"F#m9"},{o:{useFlats:true}, x:"Gbm9"},{o:{majorSymbol:"M"}, x:"F#m9"},{o:{omitMajor:false}, x:"F#m9"},{o:{omitMinor:true}, x:"f#9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-9"},{o:{unicodeAccidentals:true}, x:"F♯m9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m9"}],
      "F# A C# F G#":[{o:{}, x:"F#m(maj9)"},{o:{useFlats:true}, x:"Gbm(maj9)"},{o:{majorSymbol:"M"}, x:"F#m(M9)"},{o:{omitMajor:false}, x:"F#m(maj9)"},{o:{omitMinor:true}, x:"f#maj9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-maj9"},{o:{unicodeAccidentals:true}, x:"F♯m(maj9)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(maj9)"}],
      "F# A C# G#":[{o:{}, x:"F#m(add9)"},{o:{useFlats:true}, x:"Gbm(add9)"},{o:{majorSymbol:"M"}, x:"F#m(add9)"},{o:{omitMajor:false}, x:"F#m(add9)"},{o:{omitMinor:true}, x:"f#add9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-add9"},{o:{unicodeAccidentals:true}, x:"F♯m(add9)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(add9)"}],
      "F# A# C# E A":[{o:{}, x:"F#7(#9)"},{o:{useFlats:true}, x:"Gb7(#9)"},{o:{majorSymbol:"M"}, x:"F#7(#9)"},{o:{omitMajor:false}, x:"F#7(#9)"},{o:{omitMinor:true}, x:"F#7(#9)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#7(#9)"},{o:{unicodeAccidentals:true}, x:"F♯7(♯9)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭7(♯9)"}],
      "F# A# C# F A":[{o:{}, x:"F#maj7(#9)"},{o:{useFlats:true}, x:"Gbmaj7(#9)"},{o:{majorSymbol:"M"}, x:"F#M7(#9)"},{o:{omitMajor:false}, x:"F#maj7(#9)"},{o:{omitMinor:true}, x:"F#maj7(#9)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj7(#9)"},{o:{unicodeAccidentals:true}, x:"F♯maj7(♯9)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj7(♯9)"}],
      "F# A C D# G#":[{o:{}, x:"F#dim9"},{o:{useFlats:true}, x:"Gbdim9"},{o:{majorSymbol:"M"}, x:"F#dim9"},{o:{omitMajor:false}, x:"F#dim9"},{o:{omitMinor:true}, x:"F#dim9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒ9"},{o:{unicodeAccidentals:true}, x:"F♯dim9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim9"}],
      "F# A C G#":[{o:{}, x:"F#dim(add9)"},{o:{useFlats:true}, x:"Gbdim(add9)"},{o:{majorSymbol:"M"}, x:"F#dim(add9)"},{o:{omitMajor:false}, x:"F#dim(add9)"},{o:{omitMinor:true}, x:"F#dim(add9)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒadd9"},{o:{unicodeAccidentals:true}, x:"F♯dim(add9)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim(add9)"}],
      "F# A# D D# G#":[{o:{}, x:"F#aug6/9"},{o:{useFlats:true}, x:"Gbaug6/9"},{o:{majorSymbol:"M"}, x:"F#aug6/9"},{o:{omitMajor:false}, x:"F#aug6/9"},{o:{omitMinor:true}, x:"F#aug6/9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+6/9"},{o:{unicodeAccidentals:true}, x:"F♯aug6/9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug6/9"}],
      "F# A# D E G#":[{o:{}, x:"F#aug9"},{o:{useFlats:true}, x:"Gbaug9"},{o:{majorSymbol:"M"}, x:"F#aug9"},{o:{omitMajor:false}, x:"F#aug9"},{o:{omitMinor:true}, x:"F#aug9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+9"},{o:{unicodeAccidentals:true}, x:"F♯aug9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug9"}],
      "F# A# D F G#":[{o:{}, x:"F#aug(maj9)"},{o:{useFlats:true}, x:"Gbaug(maj9)"},{o:{majorSymbol:"M"}, x:"F#aug(M9)"},{o:{omitMajor:false}, x:"F#aug(maj9)"},{o:{omitMinor:true}, x:"F#aug(maj9)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+maj9"},{o:{unicodeAccidentals:true}, x:"F♯aug(maj9)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(maj9)"}],
      "F# A# D G#":[{o:{}, x:"F#aug(add9)"},{o:{useFlats:true}, x:"Gbaug(add9)"},{o:{majorSymbol:"M"}, x:"F#aug(add9)"},{o:{omitMajor:false}, x:"F#aug(add9)"},{o:{omitMinor:true}, x:"F#aug(add9)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+add9"},{o:{unicodeAccidentals:true}, x:"F♯aug(add9)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(add9)"}],
      "F# A# C# E G# B":[{o:{}, x:"F#11"},{o:{useFlats:true}, x:"Gb11"},{o:{majorSymbol:"M"}, x:"F#11"},{o:{omitMajor:false}, x:"F#11"},{o:{omitMinor:true}, x:"F#11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#11"},{o:{unicodeAccidentals:true}, x:"F♯11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭11"}],
      "F# A# C# E B":[{o:{}, x:"F#11"},{o:{useFlats:true}, x:"Gb11"},{o:{majorSymbol:"M"}, x:"F#11"},{o:{omitMajor:false}, x:"F#11"},{o:{omitMinor:true}, x:"F#11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#11"},{o:{unicodeAccidentals:true}, x:"F♯11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭11"}],
      "F# A# C# B":[{o:{}, x:"F#add11"},{o:{useFlats:true}, x:"Gbadd11"},{o:{majorSymbol:"M"}, x:"F#add11"},{o:{omitMajor:false}, x:"F#add11"},{o:{omitMinor:true}, x:"F#add11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#add11"},{o:{unicodeAccidentals:true}, x:"F♯add11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭add11"}],
      "F# A# C# F G# B":[{o:{}, x:"F#maj11"},{o:{useFlats:true}, x:"Gbmaj11"},{o:{majorSymbol:"M"}, x:"F#M11"},{o:{omitMajor:false}, x:"F#maj11"},{o:{omitMinor:true}, x:"F#maj11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj11"},{o:{unicodeAccidentals:true}, x:"F♯maj11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj11"}],
      "F# A# C# F B":[{o:{}, x:"F#maj11"},{o:{useFlats:true}, x:"Gbmaj11"},{o:{majorSymbol:"M"}, x:"F#M11"},{o:{omitMajor:false}, x:"F#maj11"},{o:{omitMinor:true}, x:"F#maj11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj11"},{o:{unicodeAccidentals:true}, x:"F♯maj11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj11"}],
      "F# A C# E G# B":[{o:{}, x:"F#m11"},{o:{useFlats:true}, x:"Gbm11"},{o:{majorSymbol:"M"}, x:"F#m11"},{o:{omitMajor:false}, x:"F#m11"},{o:{omitMinor:true}, x:"f#11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-11"},{o:{unicodeAccidentals:true}, x:"F♯m11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m11"}],
      "F# A C# E B":[{o:{}, x:"F#m11"},{o:{useFlats:true}, x:"Gbm11"},{o:{majorSymbol:"M"}, x:"F#m11"},{o:{omitMajor:false}, x:"F#m11"},{o:{omitMinor:true}, x:"f#11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-11"},{o:{unicodeAccidentals:true}, x:"F♯m11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m11"}],
      "F# A C# B":[{o:{}, x:"F#m(add11)"},{o:{useFlats:true}, x:"Gbm(add11)"},{o:{majorSymbol:"M"}, x:"F#m(add11)"},{o:{omitMajor:false}, x:"F#m(add11)"},{o:{omitMinor:true}, x:"f#add11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-add11"},{o:{unicodeAccidentals:true}, x:"F♯m(add11)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(add11)"}],
      "F# A C# F G# B":[{o:{}, x:"F#m(maj11)"},{o:{useFlats:true}, x:"Gbm(maj11)"},{o:{majorSymbol:"M"}, x:"F#m(M11)"},{o:{omitMajor:false}, x:"F#m(maj11)"},{o:{omitMinor:true}, x:"f#maj11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-maj11"},{o:{unicodeAccidentals:true}, x:"F♯m(maj11)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(maj11)"}],
      "F# A C# F B":[{o:{}, x:"F#m(maj11)"},{o:{useFlats:true}, x:"Gbm(maj11)"},{o:{majorSymbol:"M"}, x:"F#m(M11)"},{o:{omitMajor:false}, x:"F#m(maj11)"},{o:{omitMinor:true}, x:"f#maj11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-maj11"},{o:{unicodeAccidentals:true}, x:"F♯m(maj11)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(maj11)"}],
      "F# A C D# G# B":[{o:{}, x:"F#dim11"},{o:{useFlats:true}, x:"Gbdim11"},{o:{majorSymbol:"M"}, x:"F#dim11"},{o:{omitMajor:false}, x:"F#dim11"},{o:{omitMinor:true}, x:"F#dim11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒ11"},{o:{unicodeAccidentals:true}, x:"F♯dim11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim11"}],
      "F# A C D# B":[{o:{}, x:"F#dim11"},{o:{useFlats:true}, x:"Gbdim11"},{o:{majorSymbol:"M"}, x:"F#dim11"},{o:{omitMajor:false}, x:"F#dim11"},{o:{omitMinor:true}, x:"F#dim11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒ11"},{o:{unicodeAccidentals:true}, x:"F♯dim11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim11"}],
      "F# A C B":[{o:{}, x:"F#dim(add11)"},{o:{useFlats:true}, x:"Gbdim(add11)"},{o:{majorSymbol:"M"}, x:"F#dim(add11)"},{o:{omitMajor:false}, x:"F#dim(add11)"},{o:{omitMinor:true}, x:"F#dim(add11)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#ᵒadd11"},{o:{unicodeAccidentals:true}, x:"F♯dim(add11)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭dim(add11)"}],
      "F# A# D E G# B":[{o:{}, x:"F#aug11"},{o:{useFlats:true}, x:"Gbaug11"},{o:{majorSymbol:"M"}, x:"F#aug11"},{o:{omitMajor:false}, x:"F#aug11"},{o:{omitMinor:true}, x:"F#aug11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+11"},{o:{unicodeAccidentals:true}, x:"F♯aug11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug11"}],
      "F# A# D E B":[{o:{}, x:"F#aug11"},{o:{useFlats:true}, x:"Gbaug11"},{o:{majorSymbol:"M"}, x:"F#aug11"},{o:{omitMajor:false}, x:"F#aug11"},{o:{omitMinor:true}, x:"F#aug11"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+11"},{o:{unicodeAccidentals:true}, x:"F♯aug11"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug11"}],
      "F# A# D B":[{o:{}, x:"F#aug(add11)"},{o:{useFlats:true}, x:"Gbaug(add11)"},{o:{majorSymbol:"M"}, x:"F#aug(add11)"},{o:{omitMajor:false}, x:"F#aug(add11)"},{o:{omitMinor:true}, x:"F#aug(add11)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+add11"},{o:{unicodeAccidentals:true}, x:"F♯aug(add11)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(add11)"}],
      "F# A# D F G# B":[{o:{}, x:"F#aug(maj11)"},{o:{useFlats:true}, x:"Gbaug(maj11)"},{o:{majorSymbol:"M"}, x:"F#aug(M11)"},{o:{omitMajor:false}, x:"F#aug(maj11)"},{o:{omitMinor:true}, x:"F#aug(maj11)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+maj11"},{o:{unicodeAccidentals:true}, x:"F♯aug(maj11)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(maj11)"}],
      "F# A# D F B":[{o:{}, x:"F#aug(maj11)"},{o:{useFlats:true}, x:"Gbaug(maj11)"},{o:{majorSymbol:"M"}, x:"F#aug(M11)"},{o:{omitMajor:false}, x:"F#aug(maj11)"},{o:{omitMinor:true}, x:"F#aug(maj11)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+maj11"},{o:{unicodeAccidentals:true}, x:"F♯aug(maj11)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(maj11)"}],
      "F# A# C# E G# B D#":[{o:{}, x:"F#13"},{o:{useFlats:true}, x:"Gb13"},{o:{majorSymbol:"M"}, x:"F#13"},{o:{omitMajor:false}, x:"F#13"},{o:{omitMinor:true}, x:"F#13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#13"},{o:{unicodeAccidentals:true}, x:"F♯13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭13"}],
      "F# A# C# E G# D#":[{o:{}, x:"F#13"},{o:{useFlats:true}, x:"Gb13"},{o:{majorSymbol:"M"}, x:"F#13"},{o:{omitMajor:false}, x:"F#13"},{o:{omitMinor:true}, x:"F#13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#13"},{o:{unicodeAccidentals:true}, x:"F♯13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭13"}],
      "F# A# C# E B D#":[{o:{}, x:"F#13"},{o:{useFlats:true}, x:"Gb13"},{o:{majorSymbol:"M"}, x:"F#13"},{o:{omitMajor:false}, x:"F#13"},{o:{omitMinor:true}, x:"F#13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#13"},{o:{unicodeAccidentals:true}, x:"F♯13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭13"}],
      "F# A# C# E D#":[{o:{}, x:"F#13"},{o:{useFlats:true}, x:"Gb13"},{o:{majorSymbol:"M"}, x:"F#13"},{o:{omitMajor:false}, x:"F#13"},{o:{omitMinor:true}, x:"F#13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#13"},{o:{unicodeAccidentals:true}, x:"F♯13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭13"}],
      "F# A# C# F G# B D#":[{o:{}, x:"F#maj13"},{o:{useFlats:true}, x:"Gbmaj13"},{o:{majorSymbol:"M"}, x:"F#M13"},{o:{omitMajor:false}, x:"F#maj13"},{o:{omitMinor:true}, x:"F#maj13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj13"},{o:{unicodeAccidentals:true}, x:"F♯maj13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj13"}],
      "F# A# C# F G# D#":[{o:{}, x:"F#maj13"},{o:{useFlats:true}, x:"Gbmaj13"},{o:{majorSymbol:"M"}, x:"F#M13"},{o:{omitMajor:false}, x:"F#maj13"},{o:{omitMinor:true}, x:"F#maj13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj13"},{o:{unicodeAccidentals:true}, x:"F♯maj13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj13"}],
      "F# A# C# F B D#":[{o:{}, x:"F#maj13"},{o:{useFlats:true}, x:"Gbmaj13"},{o:{majorSymbol:"M"}, x:"F#M13"},{o:{omitMajor:false}, x:"F#maj13"},{o:{omitMinor:true}, x:"F#maj13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj13"},{o:{unicodeAccidentals:true}, x:"F♯maj13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj13"}],
      "F# A# C# F D#":[{o:{}, x:"F#maj13"},{o:{useFlats:true}, x:"Gbmaj13"},{o:{majorSymbol:"M"}, x:"F#M13"},{o:{omitMajor:false}, x:"F#maj13"},{o:{omitMinor:true}, x:"F#maj13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj13"},{o:{unicodeAccidentals:true}, x:"F♯maj13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj13"}],
      "F# A C# E G# B D#":[{o:{}, x:"F#m13"},{o:{useFlats:true}, x:"Gbm13"},{o:{majorSymbol:"M"}, x:"F#m13"},{o:{omitMajor:false}, x:"F#m13"},{o:{omitMinor:true}, x:"f#13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-13"},{o:{unicodeAccidentals:true}, x:"F♯m13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m13"}],
      "F# A C# E G# D#":[{o:{}, x:"F#m13"},{o:{useFlats:true}, x:"Gbm13"},{o:{majorSymbol:"M"}, x:"F#m13"},{o:{omitMajor:false}, x:"F#m13"},{o:{omitMinor:true}, x:"f#13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-13"},{o:{unicodeAccidentals:true}, x:"F♯m13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m13"}],
      "F# A C# E B D#":[{o:{}, x:"F#m13"},{o:{useFlats:true}, x:"Gbm13"},{o:{majorSymbol:"M"}, x:"F#m13"},{o:{omitMajor:false}, x:"F#m13"},{o:{omitMinor:true}, x:"f#13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-13"},{o:{unicodeAccidentals:true}, x:"F♯m13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m13"}],
      "F# A C# E D#":[{o:{}, x:"F#m13"},{o:{useFlats:true}, x:"Gbm13"},{o:{majorSymbol:"M"}, x:"F#m13"},{o:{omitMajor:false}, x:"F#m13"},{o:{omitMinor:true}, x:"f#13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-13"},{o:{unicodeAccidentals:true}, x:"F♯m13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m13"}],
      "F# A C# F G# B D#":[{o:{}, x:"F#m(maj13)"},{o:{useFlats:true}, x:"Gbm(maj13)"},{o:{majorSymbol:"M"}, x:"F#m(M13)"},{o:{omitMajor:false}, x:"F#m(maj13)"},{o:{omitMinor:true}, x:"f#maj13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-maj13"},{o:{unicodeAccidentals:true}, x:"F♯m(maj13)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(maj13)"}],
      "F# A C# F G# D#":[{o:{}, x:"F#m(maj13)"},{o:{useFlats:true}, x:"Gbm(maj13)"},{o:{majorSymbol:"M"}, x:"F#m(M13)"},{o:{omitMajor:false}, x:"F#m(maj13)"},{o:{omitMinor:true}, x:"f#maj13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-maj13"},{o:{unicodeAccidentals:true}, x:"F♯m(maj13)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(maj13)"}],
      "F# A C# F B D#":[{o:{}, x:"F#m(maj13)"},{o:{useFlats:true}, x:"Gbm(maj13)"},{o:{majorSymbol:"M"}, x:"F#m(M13)"},{o:{omitMajor:false}, x:"F#m(maj13)"},{o:{omitMinor:true}, x:"f#maj13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-maj13"},{o:{unicodeAccidentals:true}, x:"F♯m(maj13)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(maj13)"}],
      "F# A C# F D#":[{o:{}, x:"F#m(maj13)"},{o:{useFlats:true}, x:"Gbm(maj13)"},{o:{majorSymbol:"M"}, x:"F#m(M13)"},{o:{omitMajor:false}, x:"F#m(maj13)"},{o:{omitMinor:true}, x:"f#maj13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-maj13"},{o:{unicodeAccidentals:true}, x:"F♯m(maj13)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m(maj13)"}],
      "F# A# D E G# B D#":[{o:{}, x:"F#aug13"},{o:{useFlats:true}, x:"Gbaug13"},{o:{majorSymbol:"M"}, x:"F#aug13"},{o:{omitMajor:false}, x:"F#aug13"},{o:{omitMinor:true}, x:"F#aug13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+13"},{o:{unicodeAccidentals:true}, x:"F♯aug13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug13"}],
      "F# A# D E G# D#":[{o:{}, x:"F#aug13"},{o:{useFlats:true}, x:"Gbaug13"},{o:{majorSymbol:"M"}, x:"F#aug13"},{o:{omitMajor:false}, x:"F#aug13"},{o:{omitMinor:true}, x:"F#aug13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+13"},{o:{unicodeAccidentals:true}, x:"F♯aug13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug13"}],
      "F# A# D E B D#":[{o:{}, x:"F#aug13"},{o:{useFlats:true}, x:"Gbaug13"},{o:{majorSymbol:"M"}, x:"F#aug13"},{o:{omitMajor:false}, x:"F#aug13"},{o:{omitMinor:true}, x:"F#aug13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+13"},{o:{unicodeAccidentals:true}, x:"F♯aug13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug13"}],
      "F# A# D E D#":[{o:{}, x:"F#aug13"},{o:{useFlats:true}, x:"Gbaug13"},{o:{majorSymbol:"M"}, x:"F#aug13"},{o:{omitMajor:false}, x:"F#aug13"},{o:{omitMinor:true}, x:"F#aug13"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+13"},{o:{unicodeAccidentals:true}, x:"F♯aug13"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug13"}],
      "F# A# D F G# B D#":[{o:{}, x:"F#aug(maj13)"},{o:{useFlats:true}, x:"Gbaug(maj13)"},{o:{majorSymbol:"M"}, x:"F#aug(M13)"},{o:{omitMajor:false}, x:"F#aug(maj13)"},{o:{omitMinor:true}, x:"F#aug(maj13)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+maj13"},{o:{unicodeAccidentals:true}, x:"F♯aug(maj13)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(maj13)"}],
      "F# A# D F G# D#":[{o:{}, x:"F#aug(maj13)"},{o:{useFlats:true}, x:"Gbaug(maj13)"},{o:{majorSymbol:"M"}, x:"F#aug(M13)"},{o:{omitMajor:false}, x:"F#aug(maj13)"},{o:{omitMinor:true}, x:"F#aug(maj13)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+maj13"},{o:{unicodeAccidentals:true}, x:"F♯aug(maj13)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(maj13)"}],
      "F# A# D F B D#":[{o:{}, x:"F#aug(maj13)"},{o:{useFlats:true}, x:"Gbaug(maj13)"},{o:{majorSymbol:"M"}, x:"F#aug(M13)"},{o:{omitMajor:false}, x:"F#aug(maj13)"},{o:{omitMinor:true}, x:"F#aug(maj13)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+maj13"},{o:{unicodeAccidentals:true}, x:"F♯aug(maj13)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(maj13)"}],
      "F# A# D F D#":[{o:{}, x:"F#aug(maj13)"},{o:{useFlats:true}, x:"Gbaug(maj13)"},{o:{majorSymbol:"M"}, x:"F#aug(M13)"},{o:{omitMajor:false}, x:"F#aug(maj13)"},{o:{omitMinor:true}, x:"F#aug(maj13)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+maj13"},{o:{unicodeAccidentals:true}, x:"F♯aug(maj13)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug(maj13)"}],
      "F# A# C# D#":[{o:{}, x:"F#6"},{o:{useFlats:true}, x:"Gb6"},{o:{majorSymbol:"M"}, x:"F#6"},{o:{omitMajor:false}, x:"F#6"},{o:{omitMinor:true}, x:"F#6"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6"},{o:{unicodeAccidentals:true}, x:"F♯6"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6"}],
      "F# A# D#":[{o:{}, x:"F#6(no5)"},{o:{useFlats:true}, x:"Gb6(no5)"},{o:{majorSymbol:"M"}, x:"F#6(no5)"},{o:{omitMajor:false}, x:"F#6(no5)"},{o:{omitMinor:true}, x:"F#6(no5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6(no5)"},{o:{unicodeAccidentals:true}, x:"F♯6(no5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6(no5)"}],
      "F# A# C D#":[{o:{}, x:"F#6(b5)"},{o:{useFlats:true}, x:"Gb6(b5)"},{o:{majorSymbol:"M"}, x:"F#6(b5)"},{o:{omitMajor:false}, x:"F#6(b5)"},{o:{omitMinor:true}, x:"F#6(b5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6(b5)"},{o:{unicodeAccidentals:true}, x:"F♯6(♭5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6(♭5)"}],
      "F# A# D D#":[{o:{}, x:"F#aug6"},{o:{useFlats:true}, x:"Gbaug6"},{o:{majorSymbol:"M"}, x:"F#aug6"},{o:{omitMajor:false}, x:"F#aug6"},{o:{omitMinor:true}, x:"F#aug6"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#+6"},{o:{unicodeAccidentals:true}, x:"F♯aug6"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭aug6"}],
      "F# A C# D#":[{o:{}, x:"F#m6"},{o:{useFlats:true}, x:"Gbm6"},{o:{majorSymbol:"M"}, x:"F#m6"},{o:{omitMajor:false}, x:"F#m6"},{o:{omitMinor:true}, x:"f#6"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-6"},{o:{unicodeAccidentals:true}, x:"F♯m6"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m6"}],
      "F# A D#":[{o:{}, x:"F#m6(no5)"},{o:{useFlats:true}, x:"Gbm6(no5)"},{o:{majorSymbol:"M"}, x:"F#m6(no5)"},{o:{omitMajor:false}, x:"F#m6(no5)"},{o:{omitMinor:true}, x:"f#6(no5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-6(no5)"},{o:{unicodeAccidentals:true}, x:"F♯m6(no5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m6(no5)"}],
      "F# A D D#":[{o:{}, x:"F#m6(#5)"},{o:{useFlats:true}, x:"Gbm6(#5)"},{o:{majorSymbol:"M"}, x:"F#m6(#5)"},{o:{omitMajor:false}, x:"F#m6(#5)"},{o:{omitMinor:true}, x:"f#6(#5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-6(#5)"},{o:{unicodeAccidentals:true}, x:"F♯m6(♯5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m6(♯5)"}],
      "F# A# C# D# G#":[{o:{}, x:"F#6/9"},{o:{useFlats:true}, x:"Gb6/9"},{o:{majorSymbol:"M"}, x:"F#6/9"},{o:{omitMajor:false}, x:"F#6/9"},{o:{omitMinor:true}, x:"F#6/9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6/9"},{o:{unicodeAccidentals:true}, x:"F♯6/9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6/9"}],
      "F# A C# D# G#":[{o:{}, x:"F#m6/9"},{o:{useFlats:true}, x:"Gbm6/9"},{o:{majorSymbol:"M"}, x:"F#m6/9"},{o:{omitMajor:false}, x:"F#m6/9"},{o:{omitMinor:true}, x:"f#6/9"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#-6/9"},{o:{unicodeAccidentals:true}, x:"F♯m6/9"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭m6/9"}],
      "F# G# C#":[{o:{}, x:"F#sus2"},{o:{useFlats:true}, x:"Gbsus2"},{o:{majorSymbol:"M"}, x:"F#sus2"},{o:{omitMajor:false}, x:"F#sus2"},{o:{omitMinor:true}, x:"F#sus2"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#sus2"},{o:{unicodeAccidentals:true}, x:"F♯sus2"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭sus2"}],
      "F# B C#":[{o:{}, x:"F#sus4"},{o:{useFlats:true}, x:"Gbsus4"},{o:{majorSymbol:"M"}, x:"F#sus4"},{o:{omitMajor:false}, x:"F#sus4"},{o:{omitMinor:true}, x:"F#sus4"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#sus4"},{o:{unicodeAccidentals:true}, x:"F♯sus4"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭sus4"}],
      "F# G# B C#":[{o:{}, x:"F#sus2/4"},{o:{useFlats:true}, x:"Gbsus2/4"},{o:{majorSymbol:"M"}, x:"F#sus2/4"},{o:{omitMajor:false}, x:"F#sus2/4"},{o:{omitMinor:true}, x:"F#sus2/4"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#sus2/4"},{o:{unicodeAccidentals:true}, x:"F♯sus2/4"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭sus2/4"}],
      "F# D# C#":[{o:{}, x:"F#6sus"},{o:{useFlats:true}, x:"Gb6sus"},{o:{majorSymbol:"M"}, x:"F#6sus"},{o:{omitMajor:false}, x:"F#6sus"},{o:{omitMinor:true}, x:"F#6sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6sus"},{o:{unicodeAccidentals:true}, x:"F♯6sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6sus"}],
      "F# D# C# G#":[{o:{}, x:"F#6/9sus"},{o:{useFlats:true}, x:"Gb6/9sus"},{o:{majorSymbol:"M"}, x:"F#6/9sus"},{o:{omitMajor:false}, x:"F#6/9sus"},{o:{omitMinor:true}, x:"F#6/9sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6/9sus"},{o:{unicodeAccidentals:true}, x:"F♯6/9sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6/9sus"}],
      "F# D# C# B":[{o:{}, x:"F#6/11sus"},{o:{useFlats:true}, x:"Gb6/11sus"},{o:{majorSymbol:"M"}, x:"F#6/11sus"},{o:{omitMajor:false}, x:"F#6/11sus"},{o:{omitMinor:true}, x:"F#6/11sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6/11sus"},{o:{unicodeAccidentals:true}, x:"F♯6/11sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6/11sus"}],
      "F# D# C# G# B":[{o:{}, x:"F#6/9sus4"},{o:{useFlats:true}, x:"Gb6/9sus4"},{o:{majorSymbol:"M"}, x:"F#6/9sus4"},{o:{omitMajor:false}, x:"F#6/9sus4"},{o:{omitMinor:true}, x:"F#6/9sus4"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6/9sus4"},{o:{unicodeAccidentals:true}, x:"F♯6/9sus4"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6/9sus4"}],
      "F# D# G#":[{o:{}, x:"F#6/9sus(no5)"},{o:{useFlats:true}, x:"Gb6/9sus(no5)"},{o:{majorSymbol:"M"}, x:"F#6/9sus(no5)"},{o:{omitMajor:false}, x:"F#6/9sus(no5)"},{o:{omitMinor:true}, x:"F#6/9sus(no5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6/9sus(no5)"},{o:{unicodeAccidentals:true}, x:"F♯6/9sus(no5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6/9sus(no5)"}],
      "F# D# B":[{o:{}, x:"F#6/11sus(no5)"},{o:{useFlats:true}, x:"Gb6/11sus(no5)"},{o:{majorSymbol:"M"}, x:"F#6/11sus(no5)"},{o:{omitMajor:false}, x:"F#6/11sus(no5)"},{o:{omitMinor:true}, x:"F#6/11sus(no5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6/11sus(no5)"},{o:{unicodeAccidentals:true}, x:"F♯6/11sus(no5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6/11sus(no5)"}],
      "F# D# G# B":[{o:{}, x:"F#6/9sus4(no5)"},{o:{useFlats:true}, x:"Gb6/9sus4(no5)"},{o:{majorSymbol:"M"}, x:"F#6/9sus4(no5)"},{o:{omitMajor:false}, x:"F#6/9sus4(no5)"},{o:{omitMinor:true}, x:"F#6/9sus4(no5)"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#6/9sus4(no5)"},{o:{unicodeAccidentals:true}, x:"F♯6/9sus4(no5)"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭6/9sus4(no5)"}],
      "F# C# E":[{o:{}, x:"F#7sus"},{o:{useFlats:true}, x:"Gb7sus"},{o:{majorSymbol:"M"}, x:"F#7sus"},{o:{omitMajor:false}, x:"F#7sus"},{o:{omitMinor:true}, x:"F#7sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#7sus"},{o:{unicodeAccidentals:true}, x:"F♯7sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭7sus"}],
      "F# C# F":[{o:{}, x:"F#maj7sus"},{o:{useFlats:true}, x:"Gbmaj7sus"},{o:{majorSymbol:"M"}, x:"F#M7sus"},{o:{omitMajor:false}, x:"F#maj7sus"},{o:{omitMinor:true}, x:"F#maj7sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj7sus"},{o:{unicodeAccidentals:true}, x:"F♯maj7sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj7sus"}],
      "F# C# E G#":[{o:{}, x:"F#9sus"},{o:{useFlats:true}, x:"Gb9sus"},{o:{majorSymbol:"M"}, x:"F#9sus"},{o:{omitMajor:false}, x:"F#9sus"},{o:{omitMinor:true}, x:"F#9sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#9sus"},{o:{unicodeAccidentals:true}, x:"F♯9sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭9sus"}],
      "F# C# F G#":[{o:{}, x:"F#maj9sus"},{o:{useFlats:true}, x:"Gbmaj9sus"},{o:{majorSymbol:"M"}, x:"F#M9sus"},{o:{omitMajor:false}, x:"F#maj9sus"},{o:{omitMinor:true}, x:"F#maj9sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj9sus"},{o:{unicodeAccidentals:true}, x:"F♯maj9sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj9sus"}],
      "F# C# E G# B":[{o:{}, x:"F#11sus"},{o:{useFlats:true}, x:"Gb11sus"},{o:{majorSymbol:"M"}, x:"F#11sus"},{o:{omitMajor:false}, x:"F#11sus"},{o:{omitMinor:true}, x:"F#11sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#11sus"},{o:{unicodeAccidentals:true}, x:"F♯11sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭11sus"}],
      "F# C# E B":[{o:{}, x:"F#11sus"},{o:{useFlats:true}, x:"Gb11sus"},{o:{majorSymbol:"M"}, x:"F#11sus"},{o:{omitMajor:false}, x:"F#11sus"},{o:{omitMinor:true}, x:"F#11sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#11sus"},{o:{unicodeAccidentals:true}, x:"F♯11sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭11sus"}],
      "F# C# F G# B":[{o:{}, x:"F#maj11sus"},{o:{useFlats:true}, x:"Gbmaj11sus"},{o:{majorSymbol:"M"}, x:"F#M11sus"},{o:{omitMajor:false}, x:"F#maj11sus"},{o:{omitMinor:true}, x:"F#maj11sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj11sus"},{o:{unicodeAccidentals:true}, x:"F♯maj11sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj11sus"}],
      "F# C# F B":[{o:{}, x:"F#maj11sus"},{o:{useFlats:true}, x:"Gbmaj11sus"},{o:{majorSymbol:"M"}, x:"F#M11sus"},{o:{omitMajor:false}, x:"F#maj11sus"},{o:{omitMinor:true}, x:"F#maj11sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj11sus"},{o:{unicodeAccidentals:true}, x:"F♯maj11sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj11sus"}],
      "F# C# E G# B D#":[{o:{}, x:"F#13sus"},{o:{useFlats:true}, x:"Gb13sus"},{o:{majorSymbol:"M"}, x:"F#13sus"},{o:{omitMajor:false}, x:"F#13sus"},{o:{omitMinor:true}, x:"F#13sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#13sus"},{o:{unicodeAccidentals:true}, x:"F♯13sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭13sus"}],
      "F# C# E G# D#":[{o:{}, x:"F#13sus"},{o:{useFlats:true}, x:"Gb13sus"},{o:{majorSymbol:"M"}, x:"F#13sus"},{o:{omitMajor:false}, x:"F#13sus"},{o:{omitMinor:true}, x:"F#13sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#13sus"},{o:{unicodeAccidentals:true}, x:"F♯13sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭13sus"}],
      "F# C# E B D#":[{o:{}, x:"F#13sus"},{o:{useFlats:true}, x:"Gb13sus"},{o:{majorSymbol:"M"}, x:"F#13sus"},{o:{omitMajor:false}, x:"F#13sus"},{o:{omitMinor:true}, x:"F#13sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#13sus"},{o:{unicodeAccidentals:true}, x:"F♯13sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭13sus"}],
      "F# C# E D#":[{o:{}, x:"F#13sus"},{o:{useFlats:true}, x:"Gb13sus"},{o:{majorSymbol:"M"}, x:"F#13sus"},{o:{omitMajor:false}, x:"F#13sus"},{o:{omitMinor:true}, x:"F#13sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#13sus"},{o:{unicodeAccidentals:true}, x:"F♯13sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭13sus"}],
      "F# C# F G# B D#":[{o:{}, x:"F#maj13sus"},{o:{useFlats:true}, x:"Gbmaj13sus"},{o:{majorSymbol:"M"}, x:"F#M13sus"},{o:{omitMajor:false}, x:"F#maj13sus"},{o:{omitMinor:true}, x:"F#maj13sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj13sus"},{o:{unicodeAccidentals:true}, x:"F♯maj13sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj13sus"}],
      "F# C# F G# D#":[{o:{}, x:"F#maj13sus"},{o:{useFlats:true}, x:"Gbmaj13sus"},{o:{majorSymbol:"M"}, x:"F#M13sus"},{o:{omitMajor:false}, x:"F#maj13sus"},{o:{omitMinor:true}, x:"F#maj13sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj13sus"},{o:{unicodeAccidentals:true}, x:"F♯maj13sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj13sus"}],
      "F# C# F B D#":[{o:{}, x:"F#maj13sus"},{o:{useFlats:true}, x:"Gbmaj13sus"},{o:{majorSymbol:"M"}, x:"F#M13sus"},{o:{omitMajor:false}, x:"F#maj13sus"},{o:{omitMinor:true}, x:"F#maj13sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj13sus"},{o:{unicodeAccidentals:true}, x:"F♯maj13sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj13sus"}],
      "F# C# F D#":[{o:{}, x:"F#maj13sus"},{o:{useFlats:true}, x:"Gbmaj13sus"},{o:{majorSymbol:"M"}, x:"F#M13sus"},{o:{omitMajor:false}, x:"F#maj13sus"},{o:{omitMinor:true}, x:"F#maj13sus"},{o:{minorSymbol:"-",augSymbol:"+",dimSymbol:"o",unicodeHalfDiminished:true}, x:"F#maj13sus"},{o:{unicodeAccidentals:true}, x:"F♯maj13sus"},{o:{unicodeAccidentals:true,useFlats:true}, x:"G♭maj13sus"}],
    };
    
    //short example of what this test matrix looks like:
    /*
    let testMatrix = {
      'F# A# C#': [
        {o: {}, x: 'F#'},
        {o: {useFlats:true}, x: 'Gb'}
      ],
      'F# A C#': [
        {o: {}, x: 'F#m'},
        {o: {useFlats:true}, x: 'Gbm'}
      ]
    };
    */
    
    const chords:string[] = Object.keys(testMatrix).sort();
    for(const chordNotes of chords) {
      const tests = testMatrix[chordNotes];
      for(const test of tests) {
        const expected = test.x;
        const options = test.o;
        const optionsJson = JSON.stringify(options);
        const chord = new Chord(chordNotes);
        expect(chord.getName(root, options).name, `Chord("${chordNotes}").getName(root=F#, options=${optionsJson})`).to.equal(expected);
      }
    }

  });
});