import { ChordNameOptions, sanitizeChordNameOptions, SanitizedChordNameOptions } from "./chord-name-options";
import Note from "./note";
import Pitch from "./pitch";

export type IntervalName = 'R' | 'b2' | '\u266D2' | '2' | 'm3' | '3' | '4' | 'b5' | '\u266D5' | '5' | '#5' | '\u266F5' | '6' | 'bb7' | '\u266D\u266D7' | 'dom7' | '7' | 'maj7' | 'M7' | '9' | '#9' | '\u266F9' | '11' | '13';

export type Interval = {
  /** Shortened version of the interval this note represents in a chord. */
  interval: IntervalName;
  
  /** A note within a chord. */
  note: Note;
}

export type ChordNameInfo = {
  /** The name of this chord, based on the chord name options provided. */
  name: string;
  
  /** An arbitrary score assigned to this chord, used for ranking potential chord names. Higher score means a higher rank. */
  score: number;
  
  /** The notes (technically intervals) in this chord. */
  notes: Interval[];
  
  /** Verbose output of the chord naming algorithm, explaining how the given name was derived. */
  verbose?: string[];
}

/** Types that can be converted to Note. */
type NoteCastable = string | Note | Pitch;

/** Converts a NoteCastable into a Note. */
const toNote = (note:NoteCastable): Note => {
  if(note instanceof Note)
    return note;
  if(note instanceof Pitch)
    return note.getNote();
  if('string' === typeof note)
    return new Note(note);
  
  // if we get here, it is bypassing typescript type checking
  throw new Error("Invalid note: " + note);
}

/** Converts a NoteCastable into a Note, but also allows undefined value. */
const toNoteOptional = (note: NoteCastable|undefined): Note|undefined => {
  if(note === undefined)
    return undefined;
  return toNote(note);
}

/**
 * A chord is a collection of one or more notes. (We don't need three notes which is technically
 * required for a chord in music theory.) Determining the name of a chord is complicated... see
 * the getNames() method for more information about that.
 */
export default class Chord {
  private readonly notes: Note[] = [];
  private readonly bassNote: Note|null = null;
  
  /**
   * @param notes Can be an array of Note or Pitch objects, an array of strings, or a
   *              string of note names separated by space or comma.
   */
  constructor (notes: string|Array<NoteCastable>) {
    // convert plain string into string array
    if('string' === typeof notes)
      notes = notes.split(/[\s,]+/g).filter(s => s !== '');
    
    // at this point it should be an array unless we got something weird like null
    if(!Array.isArray(notes))
      throw new Error("Illegal argument to Chord constructor: " + notes);
    
    if(notes.length === 0)
      throw new Error("Chord cannot be empty");
    
    // if this array is all Pitch objects, then we can tell what the lowest pitch is
    let isPitchArray = true;
    let lowestPitch:Pitch|null = null;
    
    // keep track of what notes we've already encountered so that we don't have duplicates
    const allNoteIds = new Set<number>();
    
    for(let noteCastable of notes) {
      if(isPitchArray && (noteCastable instanceof Pitch)) {
        if(lowestPitch === null || noteCastable.compareTo(lowestPitch) < 0)
          lowestPitch = noteCastable;
      }
      else {
        isPitchArray = false;
        lowestPitch = null;
      }
      
      const note:Note = toNote(noteCastable);
      
      // if this note is already in the chord, don't add it again
      if(!allNoteIds.has(note.getId())) {
        this.notes.push(note);
        allNoteIds.add(note.getId());
      }
    }
    
    if(lowestPitch)
      this.bassNote = lowestPitch.getNote();
  }
  
  /**
   * Returns the notes of this chord, separated by a space.
   */
  toString(): string {
    return this.notes.map(n => n.toString()).join(' ');
  };
  
  /**
   * Returns all possible names of this chord, by returning determining the name of the chord with each note as root note.
   * @param rootNote The root note of this chord. Required to generate chord name.
   * @param _options Options to affect the name of the chord.
   * @param bassNote If provided, can influence the name of the chord (e.g. "D/F#" chord).
   */
  getNames(options?:ChordNameOptions, rootNote?:NoteCastable, bassNote?:NoteCastable): ChordNameInfo[] {
    rootNote = toNoteOptional(rootNote);
    bassNote = toNoteOptional(bassNote);
    
    if(rootNote)
      return [this.getName(rootNote, options, bassNote)];
    
    const names = this.notes.map(note => this.getName(note, options, bassNote));
    names.sort((a,b)=>b.score-a.score);
    return names;
  }
  
  /**
   * Returns whether this chord contains the given note.
   */
  hasNote(note: NoteCastable): boolean {
    note = toNote(note);
    return (this.notes.findIndex(n => n.equals(note)) >= 0);
  }
  
  /**
   * Returns an array of the notes in this chord.
   */
  getNotes(): Note[] {
    return this.notes.map(note => new Note(note));
  }
  
  /**
   * Returns the bass note, if one is known. There is only a bass note if an array of
   * pitches was passed to the constructor, otherwise null will be returned.
   */
  getBassNote(): Note|null {
    return this.bassNote;
  }
  
  /** 
   * THIS IS WHERE THE MAGIC HAPPENS.
   * 
   * Returns object like:
   * ```
   *   {
   *     name: 'C',
   *     notes: [
   *       {interval: 'R', note: C},
   *       {interval: '3', note: E},
   *       {interval: '5', note: G}
   *     ]
   *     verbose: [ 'assuming root is C', 'found a maj3 - this is a major chord', 'found 5th' ]
   *   }
   * ```
   * 
   * another example:
   * ``` 
   *   {
   *     name: 'Cm7',
   *     notes: [
   *       {interval: 'R', note: C},
   *       {interval: 'm3', note: Eb},
   *       {interval: '5', note: G}
   *       {interval: 'm7', note: Bb}
   *     ]
   *     verbose: [ 'assuming root is C', 'found a min3 - this is a minor chord', 'found 5th', 'found minor 7th' ]
   *   }
   * ```
   * 
   * @param _rootNote The root note of this chord. Required to generate chord name.
   * @param _options Options to affect the name of the chord.
   * @param _bassNote If provided, can influence the name of the chord (e.g. "D/F#" chord).
   */
  getName(_rootNote: NoteCastable, _options?:ChordNameOptions, _bassNote?: NoteCastable): ChordNameInfo {
    const rootNote = toNote(_rootNote);
    
    const options: SanitizedChordNameOptions = sanitizeChordNameOptions(_options);
    
    let rootName:string = rootNote.getName(options);
    let quality = '';
    let intervalName = '';
    let altFifth = '';
    let added = '';
    let omissions = '';
    let bass = '';
    
    const verbose: string[]|undefined = options.verbose ? [] : undefined;
    const noteDetails: Interval[] = [];
    let score = 0;
    
    let lowerCaseRoot = false; //will be true if this is a minor chord and omitMinor is true
    
    //if no bass note specified, assume the root note is bass note
    const bassNote = toNoteOptional(_bassNote) || this.bassNote || rootNote;
    
    //determine which intervals are present
    const intervals: boolean[] = new Array(12).fill(false);
    this.notes.forEach(note => intervals[rootNote.interval(note)] = true);
    
    //keep track of which notes have been "consumed"
    const consumed = new Array(12).fill(false);
    
    //interval ids
    const ROOT = 0;
    //const FLAT_SECOND = 1; //unused...
    const SECOND = 2;
    const MIN_THIRD = 3;
    const MAJ_THIRD = 4;
    const FOURTH = 5;
    const FLAT_FIFTH = 6;
    const FIFTH = 7;
    const SHARP_FIFTH = 8;
    const SIXTH = 9;
    const DOM_SEVENTH = 10;
    const MAJ_SEVENTH = 11;
    
    //convenient aliases
    const NINTH = SECOND;
    const ELEVENTH = FOURTH;
    const THIRTEENTH = SIXTH;
    const DOUBLE_FLAT_SEVENTH = SIXTH;
    const SHARP_NINTH = MIN_THIRD;
    
    const BASS = rootNote.interval(bassNote);
    
    //names for intervals (although some could have different names, like 2 could also be 9 in some contexts)
    const INTERVAL_NAMES:IntervalName[] = [ 'R', `${options.flatSymbol}2`, '2', 'm3', '3', '4', `${options.flatSymbol}5`, '5', `${options.sharpSymbol}5`, '6', 'dom7', 'maj7' ];
    
    if(!intervals[ROOT]) {
      score -= 20;
      verbose?.push('-20 root is not present. pretending like it is.')
      intervals[ROOT] = true;
    }
    consumed[ROOT] = true;
    noteDetails.push({interval: 'R', note: rootNote});
    
    if(!intervals[BASS]) {
      score -= 20;
      verbose?.push('-20 bass note is not present. pretending like it is.');
      intervals[BASS] = true;
      //note: not consuming the bass note yet
    }
    
    if(!bassNote.equals(rootNote)) {
      score -= 10;
      verbose?.push('-10 bass note is *NOT* the root note.');
      bass = `/${bassNote.getName(options)}`;
    }
    
    let noteCount:number = intervals.reduce((acc:number, val:boolean) => acc + (val ? 1 : 0), 0);
    
    if(noteCount == 1) {
      verbose?.push('+0  one-note "chord". name is just the root');
    }
    else if(noteCount == 2) {
      if(intervals[MIN_THIRD]) {
        score += 18;
        verbose?.push('+18 two-note "chord": minor chord with missing fifth');
        if(options.omitMinor)
          lowerCaseRoot = true;
        else
          quality = options.minorSymbol;
        consumed[MIN_THIRD] = true;
        noteDetails.push({interval: 'm3', note: rootNote.transpose(MIN_THIRD)});
        omissions += 'no5';
      }
      else if(intervals[MAJ_THIRD]) {
        score += 20;
        verbose?.push('+20 two-note "chord": major chord with missing fifth');
        consumed[MAJ_THIRD] = true;
        noteDetails.push({interval: '3', note: rootNote.transpose(MAJ_THIRD)});
        omissions += 'no5';
        if(!options.omitMajor)
          quality = options.majorSymbol;
      }
      else if(intervals[FLAT_FIFTH]) {
        score += 10;
        verbose?.push(`+10 two-note "chord": ${options.dimSymbol}5`);
        consumed[FLAT_FIFTH] = true;
        noteDetails.push({interval: `${options.flatSymbol}5`, note: rootNote.transpose(FLAT_FIFTH)});
        quality = options.dimSymbol;
        intervalName = '5';
      }
      else if(intervals[FIFTH]) {
        score += 30;
        verbose?.push('+30 power chord: root and fifth');
        consumed[FIFTH] = true;
        noteDetails.push({interval: '5', note: rootNote.transpose(FIFTH)});
        intervalName = '5';
      }
      else if(intervals[SHARP_FIFTH]) {
        score += 10;
        verbose?.push('+10 two-note "chord": aug5');
        consumed[SHARP_FIFTH] = true;
        noteDetails.push({interval: `${options.sharpSymbol}5`, note: rootNote.transpose(SHARP_FIFTH)});
        quality = options.augSymbol;
        intervalName = '5';
      }
      else {
        //if it's not one of of the two-note chords with a special name, just use a name like "C~F".
        //This is non-standard, but tilde was the only symbol I could think of that didn't already have some other meaning.
        for(let i = 0; i < INTERVAL_NAMES.length; i++) {
          if(intervals[i] && !consumed[i]) {
            let otherNote = rootNote.transpose(i);
            verbose?.push('+0  found two-note "chord" with no recognized name. Using non-standard nomenclature "root~other"');
            noteDetails.push({interval: INTERVAL_NAMES[i], note: otherNote});
            consumed[i] = true;
            quality = `~${otherNote.getName(options)}`;
          }
        }
      }
    }
    else if(intervals[MAJ_THIRD]) {
      score += 30;
      verbose?.push('+30 found major third. this is a major chord');
      noteDetails.push({interval: '3', note: rootNote.transpose(MAJ_THIRD)});
      consumed[MAJ_THIRD] = true;
      if(!options.omitMajor)
        quality = options.majorSymbol;
      let isAug = false;
      
      if(intervals[FIFTH]) {
        score += 10;
        verbose?.push('+10 found fifth');
        noteDetails.push({interval: '5', note: rootNote.transpose(FIFTH)});
        consumed[FIFTH] = true;
      }
      else {
        if(intervals[FLAT_FIFTH]) {
          score -= 3;
          verbose?.push('-3  found flat fifth.');
          noteDetails.push({interval: `${options.flatSymbol}5`, note: rootNote.transpose(FLAT_FIFTH)});
          consumed[FLAT_FIFTH] = true;
          altFifth = `${options.flatSymbol}5`;
        }
        else if(intervals[SHARP_FIFTH]) {
          score -= 3;
          verbose?.push('-3  found sharp fifth. this is augmented chord');
          noteDetails.push({interval: `${options.sharpSymbol}5`, note: rootNote.transpose(SHARP_FIFTH)});
          consumed[SHARP_FIFTH] = true;
          quality = options.augSymbol;
          isAug = true;
        }
        else {
          score -= 10;
          verbose?.push('-10 missing fifth');
          omissions += 'no5';
        }
      }
      
      if(intervals[DOM_SEVENTH]) {
        score -= 5;
        verbose?.push('-5  found dominant seventh');
        noteDetails.push({interval: '7', note: rootNote.transpose(DOM_SEVENTH)});
        consumed[DOM_SEVENTH] = true;
        intervalName = '7';
      }
      else if(intervals[MAJ_SEVENTH]) {
        score -= 5;
        verbose?.push('-5  found major seventh');
        noteDetails.push({interval: `${options.majorSymbol}7`, note: rootNote.transpose(MAJ_SEVENTH)});
        consumed[MAJ_SEVENTH] = true;
        intervalName = `${options.majorSymbol}7`;
      }
      
      if(intervals[NINTH]) {
        score -= 6;
        verbose?.push('-6  found ninth (second)');
        noteDetails.push({interval: '9', note: rootNote.transpose(NINTH)});
        consumed[NINTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push('+0  9 chord - 7 chord plus ninth');
          intervalName = '9';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.majorSymbol}9 chord - ${options.majorSymbol}7 chord plus ninth`);
          intervalName = `${options.majorSymbol}9`;
        }
        else if (intervals[SIXTH]) {
          verbose?.push('+0  6/9 chord - found sixth and ninth, but no seventh');
          noteDetails.push({interval: '6', note: rootNote.transpose(SIXTH)});
          consumed[SIXTH] = true;
          intervalName = (options.useHtml ? '<span class="supsub"><span>6</span><span>9</span></span>' : '6/9');
        }
        else {
          verbose?.push('+0  add9 chord - ninth chord with missing seventh')
          added += 'add9';
        }
      }
      else if(intervals[SHARP_NINTH] && !consumed[SHARP_NINTH]) {
        if(intervals[DOM_SEVENTH]) {
          score -= 9;
          verbose?.push(`-9  7(${options.sharpSymbol}9) chord - 7 chord plus sharp ninth`);
          noteDetails.push({interval: `${options.sharpSymbol}9`, note: rootNote.transpose(SHARP_NINTH)});
          intervalName = `7(${options.sharpSymbol}9)`;
          consumed[SHARP_NINTH] = true;
          intervalName = `7(${options.sharpSymbol}9)`;
        }
        else if(intervals[MAJ_SEVENTH]) {
          score -= 9;
          verbose?.push(`-9  ${options.majorSymbol}7(${options.sharpSymbol}9) chord - ${options.majorSymbol}7 chord plus sharp ninth`);
          noteDetails.push({interval: `${options.sharpSymbol}9`, note: rootNote.transpose(SHARP_NINTH)});
          intervalName = `${options.majorSymbol}7(${options.sharpSymbol}9)`;
          consumed[SHARP_NINTH] = true;
          intervalName = `${options.majorSymbol}7(${options.sharpSymbol}9)`;
        }
      }
      
      if(intervals[ELEVENTH]) {
        score -= 7;
        verbose?.push('-7  found eleventh (fourth)');
        noteDetails.push({interval: '11', note: rootNote.transpose(ELEVENTH)});
        consumed[ELEVENTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push('-11 11 chord - 7 chord plus eleventh');
          intervalName = '11';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.majorSymbol}11 chord - ${options.majorSymbol}7 chord plus eleventh`);
          intervalName = `${options.majorSymbol}11`;
        }
        else {
          verbose?.push('+0  add11 chord - eleventh chord with missing seventh')
          added = 'add11';
        }
      }
      
      if(intervals[THIRTEENTH] && (intervals[DOM_SEVENTH] || intervals[MAJ_SEVENTH])) {
        score -= 8;
        verbose?.push('-8  found thirteenth (sixth)');
        noteDetails.push({interval: '13', note: rootNote.transpose(THIRTEENTH)});
        consumed[THIRTEENTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push('+0  13 chord - 7 chord plus thirteenth');
          intervalName = '13';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.majorSymbol}13 chord - ${options.majorSymbol}7 chord plus thirteenth`);
          intervalName = `${options.majorSymbol}13`;
        }
        //note: no "add13" chord. if seventh is missing, this is just a "6" chord that will be handled later.
      }
      
      if(intervals[SIXTH] && !consumed[SIXTH]) {
        //we have a sixth that wasn't already identified as a thirteenth
        score -= 9;
        verbose?.push('-9  found sixth');
        noteDetails.push({interval: '6', note: rootNote.transpose(SIXTH)});
        consumed[SIXTH] = true;
        intervalName = '6';
      }
      
      if(!options.omitMajor && quality === options.majorSymbol && (intervalName !== '' || added !== ''))
        quality = '';
    }
    else if(intervals[MIN_THIRD]) {
      score += 28;
      verbose?.push('+28 found minor third. this is a minor chord');
      noteDetails.push({interval: 'm3', note: rootNote.transpose(MIN_THIRD)});
      if(options.omitMinor)
        lowerCaseRoot = true;
      else
        quality = options.minorSymbol;
      consumed[MIN_THIRD] = true;
      let isDim = false;
      
      if(intervals[FIFTH]) {
        score += 10;
        verbose?.push('+10 found fifth');
        noteDetails.push({interval: '5', note: rootNote.transpose(FIFTH)});
        consumed[FIFTH] = true;
      }
      else {
        if(intervals[FLAT_FIFTH]) {
          score -= 3;
          verbose?.push('-3  found flat fifth. this is diminshed chord');
          noteDetails.push({interval: `${options.flatSymbol}5`, note: rootNote.transpose(FLAT_FIFTH)});
          consumed[FLAT_FIFTH] = true;
          quality = options.dimSymbol;
          if(lowerCaseRoot)
            lowerCaseRoot = false;
          isDim = true;
        }
        else if(intervals[SHARP_FIFTH]) {
          score -= 3;
          verbose?.push('-3  found sharp fifth.');
          noteDetails.push({interval: `${options.sharpSymbol}5`, note: rootNote.transpose(SHARP_FIFTH)});
          consumed[SHARP_FIFTH] = true;
          altFifth += `${options.sharpSymbol}5`;
        }
        else {
          score -= 10;
          verbose?.push('-10 missing fifth');
          omissions += 'no5';
        }
      }
      
      if(intervals[DOM_SEVENTH]) {
        score -= 5;
        verbose?.push('-5  found dominant seventh');
        noteDetails.push({interval: '7', note: rootNote.transpose(DOM_SEVENTH)});
        consumed[DOM_SEVENTH] = true;
        intervalName = '7';
        if(isDim) {
          if(options.halfDimSymbol) {
            verbose?.push(`+0  flat fifth and dominant seventh - using option to call it ${options.halfDimSymbol}`);
            quality = options.halfDimSymbol;
            intervalName = '';
          }
          else {
            verbose?.push(`+0  flat fifth and dominant seventh - this is called ${options.minorSymbol}7${options.flatSymbol}5, not ${options.dimSymbol}7`);
            if(options.omitMinor) {
              lowerCaseRoot = true;
              quality = '';
            }
            else {
              quality = options.minorSymbol;
            }
            altFifth = `${options.flatSymbol}5`;
          }
          
          isDim = false;
        }
      }
      else if(intervals[MAJ_SEVENTH]) {
        score -= 5;
        verbose?.push('-5  found major seventh');
        noteDetails.push({interval: `${options.majorSymbol}7`, note: rootNote.transpose(MAJ_SEVENTH)});
        consumed[MAJ_SEVENTH] = true;
        intervalName = `${options.majorSymbol}7`;
      }
      else if(isDim && intervals[DOUBLE_FLAT_SEVENTH]) {
        score -= 5;
        verbose?.push(`-5  diminished chord with double-flat seventh - ${options.dimSymbol}7 chord`);
        noteDetails.push({interval: <IntervalName>`${options.flatSymbol}${options.flatSymbol}7`, note: rootNote.transpose(SIXTH)});
        consumed[SIXTH] = true;
        intervalName = '7';
      }
      
      if(intervals[NINTH]) {
        score -= 6;
        verbose?.push('-6  found ninth (second)');
        noteDetails.push({interval: '9', note: rootNote.transpose(NINTH)});
        consumed[NINTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push(`+0  ${options.minorSymbol}9 chord - ${options.minorSymbol}7 chord plus ninth`);
          intervalName = '9';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.minorSymbol}(${options.majorSymbol}9) chord - ${options.minorSymbol}(${options.majorSymbol}7) chord plus ninth`);
          intervalName = `${options.majorSymbol}9`;
        }
        else if(isDim && intervals[DOUBLE_FLAT_SEVENTH]) {
          verbose?.push(`+0  ${options.dimSymbol}9 chord - ${options.dimSymbol}7 chord plus ninth`);
          intervalName = '9';
        }
        else if (intervals[SIXTH] && !isDim) {
          verbose?.push(`+0  ${options.minorSymbol}6/9 chord - found sixth and ninth, but no seventh`);
          noteDetails.push({interval: '6', note: rootNote.transpose(SIXTH)});
          consumed[SIXTH] = true;
          intervalName = (options.useHtml ? '<span class="supsub"><span>6</span><span>9</span></span>' : '6/9');
        }
        else {
          verbose?.push(`+0  ${options.minorSymbol}(add9) chord - ninth chord with missing seventh`)
          added += 'add9';
        }
      }
      
      if(intervals[ELEVENTH]) {
        score -= 7;
        verbose?.push('-7  found eleventh (fourth)');
        noteDetails.push({interval: '11', note: rootNote.transpose(ELEVENTH)});
        consumed[ELEVENTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push(`+0  ${options.minorSymbol}11 chord - ${options.minorSymbol}7 chord plus eleventh`);
          intervalName = '11';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.minorSymbol}(${options.majorSymbol}11) chord - ${options.minorSymbol}(${options.majorSymbol}7) chord plus eleventh`);
          intervalName = `${options.majorSymbol}11`;
        }
        else if(isDim && intervals[DOUBLE_FLAT_SEVENTH]) {
          verbose?.push(`+0  ${options.dimSymbol}11 chord - ${options.dimSymbol}7 chord plus eleventh`);
          intervalName = '11';
        }
        else {
          verbose?.push(`+0  ${options.minorSymbol}(add11) chord - eleventh chord with missing seventh`)
          added += 'add11';
        }
      }
      
      if(intervals[THIRTEENTH] && (intervals[DOM_SEVENTH] || intervals[MAJ_SEVENTH])) {
        score -= 8;
        verbose?.push('-8  found thirteenth (sixth)');
        noteDetails.push({interval: '13', note: rootNote.transpose(THIRTEENTH)});
        consumed[THIRTEENTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push(`+0  ${options.minorSymbol}13 chord - 7 chord plus thirteenth`);
          intervalName = '13';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.minorSymbol}(${options.majorSymbol}13) chord - ${options.majorSymbol}7 chord plus thirteenth`);
          intervalName = `${options.majorSymbol}13`;
        }
        //note: no "m(add13)" chord. if seventh is missing, this is just a "6" chord that will be handled later.
      }
      
      if(intervals[SIXTH] && !consumed[SIXTH]) {
        //we have a sixth that wasn't already identified as a thirteenth
        score -= 9;
        verbose?.push('-9  found sixth');
        noteDetails.push({interval: '6', note: rootNote.transpose(SIXTH)});
        consumed[SIXTH] = true;
        intervalName = '6';
      }
    }
    else {
      verbose?.push('+0  found no third. this is a suspended chord');
      quality = 'sus';
      
      if(intervals[FIFTH]) {
        score += 10;
        verbose?.push('+10 found fifth');
        noteDetails.push({interval: '5', note: rootNote.transpose(FIFTH)});
        consumed[FIFTH] = true;
      }
      else {
        if(intervals[FLAT_FIFTH]) {
          score -= 3;
          verbose?.push('-3  found flat fifth');
          noteDetails.push({interval: `${options.flatSymbol}5`, note: rootNote.transpose(FLAT_FIFTH)});
          consumed[FLAT_FIFTH] = true;
          altFifth += `${options.flatSymbol}5`;
        }
        else if(intervals[SHARP_FIFTH]) {
          score -= 3;
          verbose?.push('-3  found sharp fifth');
          noteDetails.push({interval: `${options.sharpSymbol}5`, note: rootNote.transpose(SHARP_FIFTH)});
          consumed[SHARP_FIFTH] = true;
          altFifth += `${options.sharpSymbol}5`;
        }
        else {
          score -= 10;
          verbose?.push('-10 missing fifth');
          omissions += 'no5';
        }
      }
      
      let isSus7 = false;
      if(intervals[DOM_SEVENTH] && !consumed[DOM_SEVENTH]) {
        score -= 5;
        verbose?.push('-5  7sus chord - found dominant seventh');
        noteDetails.push({interval: '7', note: rootNote.transpose(DOM_SEVENTH)});
        consumed[DOM_SEVENTH] = true;
        intervalName = '7';
        isSus7 = true;
      }
      else if(intervals[MAJ_SEVENTH] && !consumed[MAJ_SEVENTH]) {
        score -= 5;
        verbose?.push(`-5  ${options.majorSymbol}7sus chord - found major seventh`);
        noteDetails.push({interval: `${options.majorSymbol}7`, note: rootNote.transpose(MAJ_SEVENTH)});
        consumed[MAJ_SEVENTH] = true;
        intervalName = `${options.majorSymbol}7`;
        isSus7 = true;
      }
      
      if(isSus7 && intervals[NINTH] && !consumed[NINTH]) {
        score -= 6;
        verbose?.push('-6  found ninth (second)');
        noteDetails.push({interval: '9', note: rootNote.transpose(NINTH)});
        consumed[NINTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push('+0  9sus chord - 7sus chord plus ninth');
          intervalName = '9';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.majorSymbol}9sus chord - ${options.majorSymbol}7sus chord plus ninth`);
          intervalName = `${options.majorSymbol}9`;
        }
      }
      
      if(isSus7 && intervals[ELEVENTH] && !consumed[ELEVENTH]) {
        score -= 7;
        verbose?.push('-7  found eleventh (fourth)');
        noteDetails.push({interval: '11', note: rootNote.transpose(ELEVENTH)});
        consumed[ELEVENTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push('+0  11sus chord - 7sus chord plus eleventh');
          intervalName = '11';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.majorSymbol}11sus chord - ${options.majorSymbol}7sus chord plus eleventh`);
          intervalName = `${options.majorSymbol}11`;
        }
      }
      
      if(isSus7 && intervals[THIRTEENTH] && !consumed[THIRTEENTH]) {
        score -= 8;
        verbose?.push('-8  found thirteenth (sixth)');
        noteDetails.push({interval: '13', note: rootNote.transpose(THIRTEENTH)});
        consumed[THIRTEENTH] = true;
        if(intervals[DOM_SEVENTH]) {
          verbose?.push('+0  13sus chord - 7sus chord plus thirteenth');
          intervalName = '13';
        }
        else if(intervals[MAJ_SEVENTH]) {
          verbose?.push(`+0  ${options.majorSymbol}13sus chord - ${options.majorSymbol}7sus chord plus thirteenth`);
          intervalName = `${options.majorSymbol}13`;
        }
      }
      
      if(intervals[SIXTH] && !consumed[SIXTH]) {
        score += 5;
        verbose?.push('+5  found sixth - this is a 6sus chord');
        noteDetails.push({interval: '6', note: rootNote.transpose(SIXTH)});
        consumed[SIXTH] = true;
        intervalName = '6';
        
        if(intervals[NINTH] && !consumed[NINTH]) {
          score -= 3;
          verbose?.push('-3  found ninth - this is a 6/9sus chord');
          noteDetails.push({interval: '9', note: rootNote.transpose(NINTH)});
          consumed[NINTH] = true;
          intervalName = (options.useHtml ? '<span class="supsub"><span>6</span><span>9</span></span>' : '6/9');
        }
        else if(intervals[ELEVENTH] && !consumed[ELEVENTH]) {
          score -= 4;
          verbose?.push('-4  found eleventh - this is a 6/11sus chord');
          noteDetails.push({interval: '11', note: rootNote.transpose(ELEVENTH)});
          consumed[ELEVENTH] = true;
          intervalName = (options.useHtml ? '<span class="supsub"><span>6</span><span>11</span></span>' : '6/11');
        }
      }
      
      if(intervals[SECOND] && intervals[FOURTH] && !consumed[SECOND] && !consumed[FOURTH]) {
        score += 5;
        verbose?.push('+5  found second and fourth. this is a sus2/4');
        noteDetails.push({interval: '2', note: rootNote.transpose(SECOND)});
        noteDetails.push({interval: '4', note: rootNote.transpose(FOURTH)});
        consumed[SECOND] = true;
        consumed[FOURTH] = true;
        quality += (options.useHtml ? '<span class="supsub"><span>2</span><span>4</span></span>' : '2/4');
      }
      else if(intervals[SECOND] && !consumed[SECOND]) {
        score += 10;
        verbose?.push('+10 found second. this is a sus2');
        noteDetails.push({interval: '2', note: rootNote.transpose(SECOND)});
        consumed[SECOND] = true;
        quality += '2';
      }
      else if(intervals[FOURTH] && !consumed[FOURTH]) {
        score += 10;
        verbose?.push('+10 found fourth. this is a sus4');
        noteDetails.push({interval: '4', note: rootNote.transpose(FOURTH)});
        consumed[FOURTH] = true;
        quality += '4';
      }
    }
    
    //if there are any notes in the chord that we still have not used, handle them here as add(whatever)
    for(let i = 1; i < INTERVAL_NAMES.length; i++) {
      if(intervals[i] && !consumed[i]) {
        let intervalName = INTERVAL_NAMES[i];
        score -= 10;
        verbose?.push(`-10 found ${intervalName} we have not used`);
        noteDetails.push({interval: intervalName, note: rootNote.transpose(i)});
        
        let wrappedIntervalName:string = intervalName;
        if(wrappedIntervalName.match(/^[a-z]/))
          wrappedIntervalName = `(${wrappedIntervalName})`;
        added += `add${wrappedIntervalName}`;
      }
    }
    
    if(lowerCaseRoot)
      rootName = rootName.toLowerCase();
    
    let bracketize = (s:string) => s === '' ? s : `(${s})`;
    
    //with sus chord, the interval name comes first (i.e. C6sus), otherwise quality comes first (Cm7)
    let qualitySus = '';
    if(quality.match(/^sus/)) {
      qualitySus = quality;
      quality = '';
    }
    
    if(quality.match(/[ac-z]$/) && intervalName.match(/^[a-z]/i))
      intervalName = bracketize(intervalName);
    
    let name = rootName + quality + intervalName + qualitySus + bracketize(altFifth);
    name += (name.match(/[ac-z]$/) && added.match(/^[a-z]/) ? bracketize(added) : added);
    name += bracketize(omissions) + bass;
    
    return {
      name,
      notes: noteDetails,
      score,
      verbose,
    };
  }
}
