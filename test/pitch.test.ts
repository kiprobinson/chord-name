import { expect } from "chai";
import {Note, Pitch} from "../src/index.js";


describe('test Pitch class', () => {
  it('create pitch', () => {
    expect(new Pitch(new Note('C'), 0).getName()).to.equal('C0');
    expect(new Pitch(new Note('B'), 8).getName()).to.equal('B8');
    expect(new Pitch(new Note('G#'), 5).getName()).to.equal('G♯5');
    expect(new Pitch(new Note('Gb'), 3).getName()).to.equal('F♯3');
  });
  
  it('create pitch from string', () => {
    expect(new Pitch('C0').getName()).to.equal('C0');
    expect(new Pitch('B8').getName()).to.equal('B8');
    expect(new Pitch('G#5').getName()).to.equal('G♯5');
    expect(new Pitch('Gb3').getName()).to.equal('F♯3');
    expect(new Pitch('b2').getName()).to.equal('B2');
    expect(new Pitch('bB4').getName()).to.equal('A♯4');
  });
  
  it('create pitch negative tests', () => {
    expect(()=>new Pitch('B-1')).to.throw();
    expect(()=>new Pitch(new Note('B'), -1)).to.throw();
    expect(()=>new Pitch('C9')).to.throw();
    expect(()=>new Pitch(new Note('C'), 9)).to.throw();
    expect(()=>new Pitch('C')).to.throw();
    expect(()=>new Pitch('H')).to.throw();
    // @ts-expect-error
    expect(()=>new Pitch(null, 4)).to.throw();
    // @ts-expect-error
    expect(()=>new Pitch(new Note('C'), null)).to.throw();
    expect(()=>new Pitch(new Note('C'), 2.5)).to.throw();
    expect(()=>new Pitch('C2', 2)).to.throw();
  });
  
  it('get pitch name as flats', () => {
    expect(new Pitch(new Note('C'), 0).getName({useFlats:true})).to.equal('C0');
    expect(new Pitch(new Note('B'), 8).getName({useFlats:true})).to.equal('B8');
    expect(new Pitch(new Note('G#'), 3).getName({useFlats:true})).to.equal('A♭3');
    expect(new Pitch(new Note('Gb'), 5).getName({useFlats:true})).to.equal('G♭5');
  });
  
  it('transpose pitch', () => {
    expect(new Pitch(new Note('C'), 4).transpose(3).getName()).to.equal('D♯4');
    expect(new Pitch(new Note('Bb'), 4).transpose(6).getName()).to.equal('E5');
    expect(new Pitch(new Note('B'), 0).transpose(1).getName()).to.equal('C1');
    expect(new Pitch(new Note('C'), 1).transpose(-1).getName()).to.equal('B0');
    
    expect(new Pitch(new Note('Ab'), 3).transpose(14).getName()).to.equal('A♯4');
    expect(new Pitch(new Note('Eb'), 3).transpose(-14).getName()).to.equal('C♯2');
    
    expect(new Pitch(new Note('C'), 0).transpose(0).getName()).to.equal('C0');
    expect(new Pitch(new Note('B'), 8).transpose(0).getName()).to.equal('B8');
    
    expect(new Pitch(new Note('C'), 0).transpose(107).getName()).to.equal('B8');
    expect(new Pitch(new Note('B'), 8).transpose(-107).getName()).to.equal('C0');
  });
  
  it('transpose pitch negative tests', () => {
    expect(()=>new Pitch(new Note('B'), 8).transpose(1)).to.throw();
    expect(()=>new Pitch(new Note('C'), 0).transpose(-1)).to.throw();
    expect(()=>new Pitch(new Note('C'), 0).transpose(108)).to.throw();
    expect(()=>new Pitch(new Note('B'), 8).transpose(-108)).to.throw();
  });
  
  it('equals pitch', () => {
    expect(new Pitch(new Note('Db'), 4).equals(new Pitch(new Note('C#'), 4))).to.be.true;
    expect(new Pitch(new Note('C'), 4).equals(new Pitch(new Note('C'), 3))).to.be.false;
  });
  
  it('compare pitches', () => {
    expect(new Pitch(new Note('Db'), 4).compareTo(new Pitch(new Note('C#'), 4))).to.equal(0);
    expect(new Pitch(new Note('Db'), 4).compareTo(new Pitch(new Note('C'), 4))).to.be.greaterThan(0);
    expect(new Pitch(new Note('Db'), 4).compareTo(new Pitch(new Note('D'), 4))).to.be.lessThan(0);
    
    //compare within octave, max range
    expect(new Pitch(new Note('C'), 4).compareTo(new Pitch(new Note('B'), 4))).to.be.lessThan(0);
    expect(new Pitch(new Note('B'), 4).compareTo(new Pitch(new Note('C'), 4))).to.be.greaterThan(0);
    
    //compare across octaves
    expect(new Pitch(new Note('F#'), 2).compareTo(new Pitch(new Note('F#'), 3))).to.be.lessThan(0);
    expect(new Pitch(new Note('F#'), 7).compareTo(new Pitch(new Note('F#'), 6))).to.be.greaterThan(0);
    
    expect(new Pitch(new Note('C'), 4).compareTo(new Pitch(new Note('B'), 3))).to.be.greaterThan(0);
    expect(new Pitch(new Note('B'), 4).compareTo(new Pitch(new Note('C'), 5))).to.be.lessThan(0);
  });
  
  it('pitch interval', () => {
    expect(new Pitch(new Note('Db'), 4).interval(new Pitch(new Note('C#'), 4))).to.equal(0);
    expect(new Pitch(new Note('Db'), 4).interval(new Pitch(new Note('C'), 4))).to.equal(-1);
    expect(new Pitch(new Note('Db'), 4).interval(new Pitch(new Note('D'), 4))).to.equal(1);
    
    //compare within octave, max range
    expect(new Pitch(new Note('C'), 4).interval(new Pitch(new Note('B'), 4))).to.equal(11);
    expect(new Pitch(new Note('B'), 4).interval(new Pitch(new Note('C'), 4))).to.equal(-11);
    
    //compare across octaves
    expect(new Pitch(new Note('F#'), 2).interval(new Pitch(new Note('F#'), 3))).to.equal(12);
    expect(new Pitch(new Note('F#'), 7).interval(new Pitch(new Note('F#'), 6))).to.equal(-12);
    
    expect(new Pitch(new Note('C'), 4).interval(new Pitch(new Note('B'), 3))).to.equal(-1);
    expect(new Pitch(new Note('B'), 4).interval(new Pitch(new Note('C'), 5))).to.equal(1);
  });
});