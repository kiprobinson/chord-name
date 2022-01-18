import { expect } from "chai";
import Note from "../src/note";
import Pitch from "../src/pitch";
import Chord from "../src/chord";

//shortcuts to make tests less tedious to write...
const c = new Note('C');
const crd = (noteList:string) => new Chord(noteList.split(' ').map(s => new Note(s)));

describe('test Chord class', () => {
  it('get chord name - single note "chord"', () => {
    expect(crd('C').getName(c).name).to.equal('C');
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
});