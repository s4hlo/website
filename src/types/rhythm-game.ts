export interface Note {
  name: string; 
  position: number; // 0-3 (DF JK) position where the note will be spawned
  time: number; 
}
export interface SongArena {
  earlyNormalZoneHeight: number;
  earlyGoodZoneHeight: number;
  perfectZoneHeight: number;
  lateGoodZoneHeight: number;
  lateNormalZoneHeight: number;
}

export interface Song {
  name: string;
  notes: Note[];
}
/** how much points each accuracy level will provide */
export interface Score {
  perfect: number;
  good: number;
  normal: number;
}

export const keyMapsByLanes = ["D", "F", "J", "K"];
