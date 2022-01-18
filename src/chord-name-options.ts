
export type ChordNameOptions = {
  useFlats?: boolean;
  majorSymbol?: 'maj'|'M';
  omitMajor?: boolean;
  minorSymbol?: 'min'|'m'|'-';
  omitMinor?: boolean;
  augSymbol?: 'aug'|'+';
  dimSymbol?: 'dim'|'o'|'\u1D52';
  unicodeAccidentals?: boolean;
  unicodeHalfDiminished?: boolean;
  useHtml?: boolean;
}

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
}

export const sanitizeChordNameOptions = (options?: ChordNameOptions): SanitizedChordNameOptions => {
  if('object' !== typeof options || options === null || options === undefined)
    options = {};
  
  const useFlats = options.useFlats === true;
  const unicodeAccidentals = options.unicodeAccidentals === true;
  const flatSymbol = unicodeAccidentals ? '\u266D' : 'b';
  const sharpSymbol = unicodeAccidentals ? '\u266F' : '#';
  const majorSymbol = (options.majorSymbol === 'maj' || options.majorSymbol === 'M') ? options.majorSymbol : 'maj';
  const omitMajor = options.omitMajor !== false;
  const minorSymbol = (options.minorSymbol === 'min' || options.minorSymbol === 'm' || options.minorSymbol === '-') ? options.minorSymbol : 'm';
  const omitMinor = options.omitMinor === true;
  const augSymbol = (options.augSymbol === 'aug' || options.augSymbol === '+') ? options.augSymbol : 'aug';
  const dimSymbol = (options.dimSymbol === 'dim' || options.dimSymbol === 'o' || options.dimSymbol === '\u1D52') ? options.dimSymbol : 'dim';
  const unicodeHalfDiminished = options.unicodeHalfDiminished === true;
  const halfDimSymbol = unicodeHalfDiminished ? '\u00F8' : '';
  const useHtml = options.useHtml === true;
  
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
  };
}
