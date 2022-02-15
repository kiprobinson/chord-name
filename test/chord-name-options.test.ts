import { expect } from "chai";
import { sanitizeChordNameOptions } from "../src/chord-name-options";

//shortcuts to make tests less tedious to write...
const SANITIZED_DEFAULTS = {
  useFlats: false,
  unicodeAccidentals: true,
  flatSymbol: '♭',
  sharpSymbol: '♯',
  majorSymbol: 'maj',
  omitMajor: true,
  minorSymbol: 'm',
  omitMinor: false,
  augSymbol: 'aug',
  dimSymbol: 'dim',
  unicodeHalfDiminished: false,
  halfDimSymbol: '',
  useHtml: false,
  verbose: false,
}

describe('test chord name options class', () => {
  it('test sanitizeChordNameOptions - defaults', () => {
    expect(sanitizeChordNameOptions()).to.deep.equal(SANITIZED_DEFAULTS);
  });
  
  it('test sanitizeChordNameOptions - useFlats', () => {
    expect(sanitizeChordNameOptions({useFlats: false})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({useFlats: true})).to.deep.equal({...SANITIZED_DEFAULTS, useFlats: true});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({useFlats: 1})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - majorSymbol', () => {
    expect(sanitizeChordNameOptions({majorSymbol: 'maj'})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({majorSymbol: 'M'})).to.deep.equal({...SANITIZED_DEFAULTS, majorSymbol: 'M'});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({majorSymbol: 'bogus'})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - omitMajor', () => {
    expect(sanitizeChordNameOptions({omitMajor: false})).to.deep.equal({...SANITIZED_DEFAULTS, omitMajor: false});
    expect(sanitizeChordNameOptions({omitMajor: true})).to.deep.equal({...SANITIZED_DEFAULTS});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({omitMajor: 0})).to.deep.equal({...SANITIZED_DEFAULTS});
    
    //omitMajor doesn't override majorSymbol
    expect(sanitizeChordNameOptions({omitMajor: true, majorSymbol: 'M'})).to.deep.equal({...SANITIZED_DEFAULTS, majorSymbol: 'M'});
    expect(sanitizeChordNameOptions({omitMajor: false, majorSymbol: 'M'})).to.deep.equal({...SANITIZED_DEFAULTS, omitMajor: false, majorSymbol: 'M'});
  });
  
  it('test sanitizeChordNameOptions - minorSymbol', () => {
    expect(sanitizeChordNameOptions({minorSymbol: 'm'})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({minorSymbol: 'min'})).to.deep.equal({...SANITIZED_DEFAULTS, minorSymbol: 'min'});
    expect(sanitizeChordNameOptions({minorSymbol: '-'})).to.deep.equal({...SANITIZED_DEFAULTS, minorSymbol: '-'});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({minorSymbol: 'bogus'})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - omitMinor', () => {
    expect(sanitizeChordNameOptions({omitMinor: false})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({omitMinor: true})).to.deep.equal({...SANITIZED_DEFAULTS, omitMinor: true});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({omitMinor: 1})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - augSymbol', () => {
    expect(sanitizeChordNameOptions({augSymbol: 'aug'})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({augSymbol: '+'})).to.deep.equal({...SANITIZED_DEFAULTS, augSymbol: '+'});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({augSymbol: 'bogus'})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - dimSymbol', () => {
    expect(sanitizeChordNameOptions({dimSymbol: 'dim'})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({dimSymbol: 'o'})).to.deep.equal({...SANITIZED_DEFAULTS, dimSymbol: 'o'});
    expect(sanitizeChordNameOptions({dimSymbol: '\u1D52'})).to.deep.equal({...SANITIZED_DEFAULTS, dimSymbol: '\u1D52'});
    expect(sanitizeChordNameOptions({dimSymbol: 'unicode'})).to.deep.equal({...SANITIZED_DEFAULTS, dimSymbol: '\u1D52'});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({useFlats: 'bogus'})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - unicodeAccidentals', () => {
    expect(sanitizeChordNameOptions({unicodeAccidentals: false})).to.deep.equal({...SANITIZED_DEFAULTS, unicodeAccidentals: false, flatSymbol: 'b', sharpSymbol: '#'});
    expect(sanitizeChordNameOptions({unicodeAccidentals: true})).to.deep.equal({...SANITIZED_DEFAULTS});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({useFlats: 'true'})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - unicodeHalfDiminished', () => {
    expect(sanitizeChordNameOptions({unicodeHalfDiminished: false})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({unicodeHalfDiminished: true})).to.deep.equal({...SANITIZED_DEFAULTS, unicodeHalfDiminished: true, halfDimSymbol: '\u00F8'});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({useFlats: 'true'})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - useHtml', () => {
    expect(sanitizeChordNameOptions({useHtml: false})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({useHtml: true})).to.deep.equal({...SANITIZED_DEFAULTS, useHtml: true});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({useHtml: 'true'})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
  
  it('test sanitizeChordNameOptions - verbose', () => {
    expect(sanitizeChordNameOptions({verbose: false})).to.deep.equal({...SANITIZED_DEFAULTS});
    expect(sanitizeChordNameOptions({verbose: true})).to.deep.equal({...SANITIZED_DEFAULTS, verbose: true});
    //@ts-expect-error
    expect(sanitizeChordNameOptions({verbose: 'true'})).to.deep.equal({...SANITIZED_DEFAULTS});
  });
});
