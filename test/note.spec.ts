import { expect } from "chai";
import Note from "../src/Note";


describe('test Note class', () => {
  it('create note from string', () => {
    expect(new Note('C').getName()).to.equal('C');
    expect(new Note('c').getName()).to.equal('C');
    expect(new Note('A#').getName()).to.equal('A#');
    expect(new Note('a#').getName()).to.equal('A#');
    
    expect(new Note('BB').getName()).to.equal('A#');
    expect(new Note('Bb').getName()).to.equal('A#');
    expect(new Note('bB').getName()).to.equal('A#');
    expect(new Note('bb').getName()).to.equal('A#');
    
    expect(new Note('AB').getName()).to.equal('G#');
    expect(new Note('Ab').getName()).to.equal('G#');
    expect(new Note('aB').getName()).to.equal('G#');
    expect(new Note('ab').getName()).to.equal('G#');
    
    expect(new Note('db').getName()).to.equal('C#');
    expect(new Note('d' ).getName()).to.equal('D');
    expect(new Note('eb').getName()).to.equal('D#');
    expect(new Note('e' ).getName()).to.equal('E');
    expect(new Note('f' ).getName()).to.equal('F');
    expect(new Note('gb').getName()).to.equal('F#');
    expect(new Note('g' ).getName()).to.equal('G');
    expect(new Note('ab').getName()).to.equal('G#');
    expect(new Note('a' ).getName()).to.equal('A');
    expect(new Note('bb').getName()).to.equal('A#');
    expect(new Note('b' ).getName()).to.equal('B');
    expect(new Note('c#').getName()).to.equal('C#');
    expect(new Note('d' ).getName()).to.equal('D');
    expect(new Note('d#').getName()).to.equal('D#');
    expect(new Note('e' ).getName()).to.equal('E');
    expect(new Note('f' ).getName()).to.equal('F');
    expect(new Note('f#').getName()).to.equal('F#');
    expect(new Note('g' ).getName()).to.equal('G');
    expect(new Note('g#').getName()).to.equal('G#');
    expect(new Note('a' ).getName()).to.equal('A');
    expect(new Note('a#').getName()).to.equal('A#');
    expect(new Note('b' ).getName()).to.equal('B');
  });
  
  it('get note names as flats', () => {
    expect(new Note('A#').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('A#').getName({useFlats:false})).to.equal('A#');
    
    expect(new Note('BB').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('Bb').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('bB').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('bb').getName({useFlats:true})).to.equal('Bb');
    
    expect(new Note('AB').getName({useFlats:true})).to.equal('Ab');
    expect(new Note('Ab').getName({useFlats:true})).to.equal('Ab');
    expect(new Note('aB').getName({useFlats:true})).to.equal('Ab');
    expect(new Note('ab').getName({useFlats:true})).to.equal('Ab');
    
    expect(new Note('db').getName({useFlats:true})).to.equal('Db');
    expect(new Note('d' ).getName({useFlats:true})).to.equal('D');
    expect(new Note('eb').getName({useFlats:true})).to.equal('Eb');
    expect(new Note('e' ).getName({useFlats:true})).to.equal('E');
    expect(new Note('f' ).getName({useFlats:true})).to.equal('F');
    expect(new Note('gb').getName({useFlats:true})).to.equal('Gb');
    expect(new Note('g' ).getName({useFlats:true})).to.equal('G');
    expect(new Note('ab').getName({useFlats:true})).to.equal('Ab');
    expect(new Note('a' ).getName({useFlats:true})).to.equal('A');
    expect(new Note('bb').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('b' ).getName({useFlats:true})).to.equal('B');
    expect(new Note('c#').getName({useFlats:true})).to.equal('Db');
    expect(new Note('d' ).getName({useFlats:true})).to.equal('D');
    expect(new Note('d#').getName({useFlats:true})).to.equal('Eb');
    expect(new Note('e' ).getName({useFlats:true})).to.equal('E');
    expect(new Note('f' ).getName({useFlats:true})).to.equal('F');
    expect(new Note('f#').getName({useFlats:true})).to.equal('Gb');
    expect(new Note('g' ).getName({useFlats:true})).to.equal('G');
    expect(new Note('g#').getName({useFlats:true})).to.equal('Ab');
    expect(new Note('a' ).getName({useFlats:true})).to.equal('A');
    expect(new Note('a#').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('b' ).getName({useFlats:true})).to.equal('B');
  });
  
  it('create/name notes with unicode', () => {
    expect(new Note('B♭').getName()).to.equal('A#');
    expect(new Note('b♭').getName()).to.equal('A#');
    expect(new Note('A♭').getName()).to.equal('G#');
    expect(new Note('a♭').getName()).to.equal('G#');
    expect(new Note('A♯').getName()).to.equal('A#');
    expect(new Note('a♯').getName()).to.equal('A#');
    
    expect(new Note('B♭').getName({useFlats:false, unicodeAccidentals: true})).to.equal('A♯');
    expect(new Note('b♭').getName({useFlats:false, unicodeAccidentals: true})).to.equal('A♯');
    expect(new Note('A♭').getName({useFlats:false, unicodeAccidentals: true})).to.equal('G♯');
    expect(new Note('a♭').getName({useFlats:false, unicodeAccidentals: true})).to.equal('G♯');
    expect(new Note('A♯').getName({useFlats:false, unicodeAccidentals: true})).to.equal('A♯');
    expect(new Note('a♯').getName({useFlats:false, unicodeAccidentals: true})).to.equal('A♯');
    
    expect(new Note('B♭').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('b♭').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('A♭').getName({useFlats:true})).to.equal('Ab');
    expect(new Note('a♭').getName({useFlats:true})).to.equal('Ab');
    expect(new Note('A♯').getName({useFlats:true})).to.equal('Bb');
    expect(new Note('a♯').getName({useFlats:true})).to.equal('Bb');
    
    expect(new Note('B♭').getName({useFlats:true, unicodeAccidentals: true})).to.equal('B♭');
    expect(new Note('b♭').getName({useFlats:true, unicodeAccidentals: true})).to.equal('B♭');
    expect(new Note('A♭').getName({useFlats:true, unicodeAccidentals: true})).to.equal('A♭');
    expect(new Note('a♭').getName({useFlats:true, unicodeAccidentals: true})).to.equal('A♭');
    expect(new Note('A♯').getName({useFlats:true, unicodeAccidentals: true})).to.equal('B♭');
    expect(new Note('a♯').getName({useFlats:true, unicodeAccidentals: true})).to.equal('B♭');
  });
  
  it('negative tests for creating notes', () => {
    expect(()=>new Note('')).to.throw('Invalid note: ');
    expect(()=>new Note('H')).to.throw('Invalid note: H');
    expect(()=>new Note(0.5)).to.throw('Invalid note: 0.5');
    
    //these are technically valid but I haven't implemented... maybe someday...
    expect(()=>new Note('Cb')).to.throw('Invalid note: Cb');
    expect(()=>new Note('Bbb')).to.throw('Invalid note: Bbb');
    expect(()=>new Note('B#')).to.throw('Invalid note: B#');
    expect(()=>new Note('A##')).to.throw('Invalid note: A##');
    
    //these are things that typescript won't allow, but a JS caller may do...
    // @ts-ignore
    expect(()=>new Note(null)).to.throw('Invalid note: null');
    // @ts-ignore
    expect(()=>new Note(undefined)).to.throw('Invalid note: undefined');
    // @ts-ignore
    expect(()=>new Note()).to.throw('Invalid note: undefined');
  });
  
  it('create note by id', () => {
    expect(new Note(0).getName()).to.equal('C');
    expect(new Note(1).getName()).to.equal('C#');
    expect(new Note(2).getName()).to.equal('D');
    expect(new Note(3).getName()).to.equal('D#');
    expect(new Note(4).getName()).to.equal('E');
    expect(new Note(5).getName()).to.equal('F');
    expect(new Note(6).getName()).to.equal('F#');
    expect(new Note(7).getName()).to.equal('G');
    expect(new Note(8).getName()).to.equal('G#');
    expect(new Note(9).getName()).to.equal('A');
    expect(new Note(10).getName()).to.equal('A#');
    expect(new Note(11).getName()).to.equal('B');
    
    //starts repeating above 11
    expect(new Note(12).getName()).to.equal('C');
    expect(new Note(13).getName()).to.equal('C#');
    expect(new Note(23).getName()).to.equal('B');
    expect(new Note(24).getName()).to.equal('C');
    
    //repeats in negatives too
    expect(new Note(-1).getName()).to.equal('B');
    expect(new Note(-2).getName()).to.equal('A#');
    expect(new Note(-11).getName()).to.equal('C#');
    expect(new Note(-12).getName()).to.equal('C');
    expect(new Note(-23).getName()).to.equal('C#');
    expect(new Note(-25).getName()).to.equal('B');
  });
  
  //TODO: is this functionality that I actually need??
  /*
  it('get note id', () => {
    expect(new Note(0).id).to.equal(0);
    expect(new Note(1).id).to.equal(1);
    expect(new Note(11).id).to.equal(11);
    
    //starts repeating above 11
    expect(new Note(12).id).to.equal(0);
    expect(new Note(13).id).to.equal(1);
    expect(new Note(23).id).to.equal(11);
    expect(new Note(24).id).to.equal(0);
    expect(new Note(67).id).to.equal(7);
    
    //repeats in negatives too
    expect(new Note(-1).id).to.equal(11);
    expect(new Note(-2).id).to.equal(10);
    expect(new Note(-11).id).to.equal(1);
    expect(new Note(-12).id).to.equal(0);
    expect(new Note(-13).id).to.equal(11);
    expect(new Note(-23).id).to.equal(1);
    expect(new Note(-25).id).to.equal(11);
    expect(new Note(-63).id).to.equal(9);
  });
  */
  
  it('transpose note', () => {
    expect(new Note('C').transpose(4).getName()).to.equal('E');
    expect(new Note('E').transpose(-4).getName()).to.equal('C');
    expect(new Note('G').transpose(12).getName()).to.equal('G');
    expect(new Note('G').transpose(-12).getName()).to.equal('G');
    expect(new Note('F#').transpose(7).getName()).to.equal('C#');
    expect(new Note('C#').transpose(-7).getName()).to.equal('F#');
  });
  
  it('equals note', () => {
    expect(new Note('A').equals(new Note(9))).to.be.true;
    expect(new Note('G#').equals(new Note(20))).to.be.true;
    expect(new Note('Eb').equals(new Note(-21))).to.be.true;
    expect(new Note('Eb').equals(new Note('D#'))).to.be.true;
    expect(new Note('Eb').equals(new Note('E'))).to.be.false;
    expect(new Note('Db').equals(new Note('D#'))).to.be.false;
  });
  
  it('note interval', () => {
    expect(new Note('C').interval(new Note('C'))).to.equal(0);
    expect(new Note('C').interval(new Note('Db'))).to.equal(1);
    expect(new Note('C').interval(new Note('D'))).to.equal(2);
    expect(new Note('C').interval(new Note('Bb'))).to.equal(10);
    expect(new Note('C').interval(new Note('B'))).to.equal(11);
    
    expect(new Note('Ab').interval(new Note('Ab'))).to.equal(0);
    expect(new Note('Ab').interval(new Note('A'))).to.equal(1);
    expect(new Note('Ab').interval(new Note('B'))).to.equal(3);
    expect(new Note('Ab').interval(new Note('C'))).to.equal(4);
    expect(new Note('Ab').interval(new Note('Db'))).to.equal(5);
    expect(new Note('Ab').interval(new Note('F#'))).to.equal(10);
    expect(new Note('Ab').interval(new Note('G'))).to.equal(11);
  });
});
