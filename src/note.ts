import { ChordNameOptions, sanitizeChordNameOptions, SanitizedChordNameOptions } from "./chord-name-options";

const NAMES_SHARP = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];
const NAMES_FLAT  = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ];

/**
 * A Note represents a musical note, with no octave specified. For example, "C", "Eb", F#".
 */
export default class Note {
  /** An integer from 0-11 indicating how many half-steps above C this note is. */
  private readonly id:number;
  
  /**
   * @param note Either a string representing a note, or a finite integer representing
   *             how many half-steps above or below C the note is. For the string
   *             representation, the value is not case-sensitive. You can specify flats
   *             with `b` or `\u266D`, and sharps with `#` or `\u266F`. String format
   *             can also include multiple flat/sharp symbols, which will be normalized.
   *             names like "Cb" or "E#" are also accepted.
   */
  constructor(note:string|number|Note) {
    // a copy of the input note, used for error messages
    const _note = note;
    
    if(typeof note === 'string' && /^[a-g][#b\u266D\u266F]*$/i.test(note)) {
      const baseNote = note[0].toUpperCase();
      const accidentals:string[] = note.substring(1).toLowerCase().split('');
      let accidentalAdjustment = 0;
      for(const accidental of accidentals) {
        if(accidental === 'b' || accidental === '\u266D')
          accidentalAdjustment--;
        else
          accidentalAdjustment++;
      }
      
      this.id = (NAMES_SHARP.indexOf(baseNote) + accidentalAdjustment) % 12;
      if(this.id < 0)
        this.id += 12;
      return;
    }
    else if(typeof note === 'number' && Number.isInteger(note)) {
      this.id = note % 12;
      if(this.id < 0)
        this.id += 12;
      return;
    }
    else if (note instanceof Note) {
      this.id = note.id;
      return;
    }
    
    throw new Error(`Invalid note: '${_note}'`);
  }
  
  /**
   * Returns the name of this note, per the provided options.
   * @param options Options for the name of this note.
   */
  getName(_options?:ChordNameOptions): string {
    const options: SanitizedChordNameOptions = sanitizeChordNameOptions(_options);
    
    let name = (options.useFlats ? NAMES_FLAT[this.id] : NAMES_SHARP[this.id]);
    if(name.length > 1 && options.unicodeAccidentals)
      name = name.charAt(0) + (options.useFlats ? options.flatSymbol : options.sharpSymbol);
    
    return name;
  }
  
  /**
   * Converts this note to a string, using default options. Equivalent to `getName()`
   */
  toString(): string {
    return this.getName()
  };
  
  /**
   * Returns the internal ID of this note: an integer from 0-11, indicating how many half
   * steps above C this note is.
   */
  getId(): number {
    return this.id;
  }
  
  /**
   * Transposes this note by the given number of half-steps.
   * @param n Number of half-steps (may be positive or negative, but must be an integer).
   * @returns a new Note, transposed by the provided amount.
   */
  transpose(n: number): Note {
    if(!Number.isInteger(n))
      throw new Error(`Invalid transpose amount: ${n}`);
    return new Note(this.id + n);
  }
  
  /**
   * Returns if this is equal to that. Allows equality comparison for two different
   * instances of Note.
   */
  equals(that: any): boolean {
    return (that instanceof Note && this.id === that.id);
  }
  
  /**
   * Returns the interval from this note to that note, as an integer from 0-11. Assumes this note is the root.
   * Another way of saying it: this is the number of half steps to get from this note to the next-highest that-note.
   */
  interval(that: Note|string): number {
    if(!(that instanceof Note))
      return this.interval(new Note(that));
    
    return that.id - this.id + (this.id > that.id ? 12 : 0);
  }
}
