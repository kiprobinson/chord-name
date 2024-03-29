import { ChordNameOptions } from "./chord-name-options.js";
import Note from "./note.js";

/**
 * A Pitch is a combination of a Note and an octave, i.e. "C2", "Eb4", "F#0".
 * Valid pitches are in the range C0 - B8.
 */
export default class Pitch {
  private readonly note: Note;
  private readonly octave: number;
  
  /**
   * @param note Either a note instance, or a string that can be converted to one.
   * @param octave Must be an integer in the range 0-8.
   */
  constructor(note: Note, octave: number);
  /**
   * @param note If octave is provided, this should be a string that can be passed to the Note constructor.
   *             If octave is not provided, this should be a string representation of the pitch such as "C1".
   * @param octave An integer in the range 0-8.
   */
  constructor(note: string, octave?: number);
  constructor(note: Note|string, octave?: number) {
    let _note:Note|null = null;
    let _octave:number|null = null;
    
    if(('string' === typeof note)) {
      if('undefined' === typeof octave) {
        //just a string constructor
        _octave = Number(note.substring(note.length - 1));
        _note = new Note(note.substring(0, note.length - 1));
      }
      else {
        _note = new Note(note);
        _octave = octave;
      }
    }
    else if(note instanceof Note) {
      _note = note;
      // @ts-expect-error - allow this, the throws below will prevent an invalid state
      _octave = octave;
    }
    
    if(!(_note instanceof Note))
      throw new Error(`note is invalid: ${note}`);
    if('number' !== typeof _octave || !Number.isInteger(_octave) || _octave < 0 || _octave > 8)
      throw new Error(`octave is invalid: ${octave}`);
    
    this.note = _note;
    this.octave = _octave;
  }
  
  /**
   * Returns the name of this pitch, per the provided options.
   * @param options Options for the name of this pitch.
   */
  getName(_options?:ChordNameOptions): string {
    return this.note.getName(_options) + this.octave;
  }
  
  /**
   * Converts this pitch to a string, using default options. Equivalent to `getName()`
   */
  toString(): string {
    return this.getName();
  }
  
  /**
   * Returns the a new note matching the note of this pitch (without the octave)
   */
  getNote():Note {
    return new Note(this.note.getId());
  }
  
  /**
   * Returns the note of this pitch (without the octave);
   */
  getOctave():number {
    return this.octave;
  }
  
  /**
   * Transposes this pitch by the given number of half-steps.
   */
  transpose(n: number): Pitch {
    return new Pitch(this.note.transpose(n), this.octave + Math.floor((this.note.getId() + n)/12));
  }
  
  /**
   * Returns if this is equal to that.
   */
  equals(that: Pitch): boolean {
    return (that instanceof Pitch && this.note.equals(that.note) && this.octave == that.octave);
  }
  
  /**
   * Compares this pitch to that. Returns: Negative value if this < that, 0 if this == that, positive value if this > that.
   */
  compareTo(that: Pitch): number {
    if(this.octave !== that.octave)
      return this.octave - that.octave;
    
    return this.note.getId() - that.note.getId();
  }
  
  /**
   * Returns the interval from this pitch to that pitch, i.e. the number of half-steps to get from this pitch to that pitch.
   */
  interval(that: Pitch): number {
    return (that.octave * 12 + that.note.getId()) - (this.octave * 12 + this.note.getId());
  }
}
