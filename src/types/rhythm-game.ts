export interface Note {
  value: string; // A5, B#4, etc. 
  position: number; // 0-5 (SDF JKL) position where the note will be spawned
  instrument: number; // 0-1 (dois instrumentos) song that will be played when player hit the note
  time: number; // time in quarter notes when the note will be spawned
}
export interface SongArena {
  earlyNormalZoneHeight: number;
  earlyGoodZoneHeight: number;
  perfectZoneHeight: number;
  lateGoodZoneHeight: number;
  lateNormalZoneHeight: number;
}
export interface Song {
  /** duration of a quarter note in milliseconds 
   * IMPORTANT: this defines the value of quarter notes so the speed of everything is relative to this value 
   * in specifc for the Note.time
  */
  quarterNoteDuration: number; 
  /** name of the song */
  name: string;
  notes: Note[];
}
/** how much points each accuracy level will provide */
export interface Score {
  perfect: number;
  good: number;
  normal: number;
}
