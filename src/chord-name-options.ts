
/**
 * Options used when forming the name of a chord. Some options also apply to the name of a note.
 */
export type ChordNameOptions = {
  /**
   * Whether to use flats. For example, if false, chord/note name could be F#, if true it is Gb.
   * Default: `false`
   */
  useFlats?: boolean;
  
  /**
   * Symbol used to represent a major chord.
   * Default: `maj`
   */
  majorSymbol?: 'maj'|'M';
  
  /**
   * Whether to omit the major symbol, when possible.
   * For example, if true a C Major chord is just "C", but if false it is "Cmaj".
   * For some chords, the major symbol cannot be omitted (for example, "Cmaj7").
   * Default: `true`
   */
  omitMajor?: boolean;
  
  /**
   * Symbol used to represent a minor chord.
   * Default: `m`
   */
  minorSymbol?: 'min'|'m'|'-';
  
  /**
   * Whether to omit minor chord symbol when possible.
   * If true, a minor chord is represented by a lower-case letter.
   * Default: `false`
   */
  omitMinor?: boolean;
  
  /**
   * Symbol to use for augmented chord.
   * Default: `aug`
   */
  augSymbol?: 'aug'|'+';
  
  /** 
   * Symbol to used for a dimished chord.
   * **Note:** special value "unicode" will be changed to unicode degree symbol (`\u1D52`)
   * Default: `dim`
   */
  dimSymbol?: 'dim'|'o'|'\u1D52'|'unicode';
  
  /**
   * Whether to use unicode symbols for accidentals.
   * If true, sharp is represented by `\u266F`, flat by `\d266D`.
   * If false, sharp is represented by `#`, flat by `b`.
   * Default: `true`
   */
  unicodeAccidentals?: boolean;
  
  /**
   * Whether to use unicode symbol `\u00F8` for half-dimished chord.
   * If false, it will be called a `m7b5` chord.
   * Default: `false`
   */
  unicodeHalfDiminished?: boolean;
  
  /**
   * If true, some chord names will have HTML in the output. This only applies to 6/9 or 2/4 chords.
   * Default: `false`
   */
  useHtml?: boolean;
  
  /**
   * Whether to include verbose information as to why a particular chord name was chosen.
   * Default: `false`
   */
  verbose?: boolean;
}

/**
 * Similar to ChordNameOptions, but with all options specified, and a few extra derived options provided.
 */
export type SanitizedChordNameOptions = {
  useFlats: boolean;
  unicodeAccidentals: boolean;
  flatSymbol: '\u266D'|'b';
  sharpSymbol: '\u266F'|'#';
  majorSymbol: 'maj'|'M';
  omitMajor: boolean;
  minorSymbol: 'min'|'m'|'-';
  omitMinor: boolean;
  augSymbol: 'aug'|'+';
  dimSymbol: 'dim'|'o'|'\u1D52';
  unicodeHalfDiminished: boolean;
  halfDimSymbol: '\u00F8'|'';
  useHtml: boolean;
  verbose: boolean;
}

/**
 * Takes chord names options parameter and sanitizes them to ensure that all options are
 * specified or defaulted.
 */
export const sanitizeChordNameOptions = (options?: ChordNameOptions): SanitizedChordNameOptions => {
  if('object' !== typeof options || options === null || options === undefined)
    options = {};
  
  const useFlats = options.useFlats === true;
  const unicodeAccidentals = options.unicodeAccidentals !== false;
  const flatSymbol = unicodeAccidentals ? '\u266D' : 'b';
  const sharpSymbol = unicodeAccidentals ? '\u266F' : '#';
  const majorSymbol = (options.majorSymbol === 'maj' || options.majorSymbol === 'M') ? options.majorSymbol : 'maj';
  const omitMajor = options.omitMajor !== false;
  const minorSymbol = (options.minorSymbol === 'min' || options.minorSymbol === 'm' || options.minorSymbol === '-') ? options.minorSymbol : 'm';
  const omitMinor = options.omitMinor === true;
  const augSymbol = (options.augSymbol === 'aug' || options.augSymbol === '+') ? options.augSymbol : 'aug';
  const dimSymbol = (options.dimSymbol === '\u1D52' || options.dimSymbol === 'unicode') ? '\u1D52' : (options.dimSymbol === 'o' ? 'o' : 'dim');
  const unicodeHalfDiminished = options.unicodeHalfDiminished === true;
  const halfDimSymbol = unicodeHalfDiminished ? '\u00F8' : '';
  const useHtml = options.useHtml === true;
  const verbose = options.verbose === true;
  
  return {
    useFlats,
    unicodeAccidentals,
    flatSymbol,
    sharpSymbol,
    majorSymbol,
    omitMajor,
    minorSymbol,
    omitMinor,
    augSymbol,
    dimSymbol,
    unicodeHalfDiminished,
    halfDimSymbol,
    useHtml,
    verbose,
  };
}
