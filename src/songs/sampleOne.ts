import type { Song } from "../types/rhythm-game";
import { Midi, Track } from "@tonejs/midi";

type TrackProcessor<T> = (
  track: Track,
  maxOctave?: number,
  minOctave?: number
) => T;

export interface OctaveStats {
  octave: number;
  noteCount: number;
  percentage: number;
}

// Interface para análise completa do MIDI
export interface MidiAnalysis {
  octaveStats: OctaveStats[];
  totalNotes: number;
  minOctave: number;
  maxOctave: number;
  recommendedMinOctave: number;
  recommendedMaxOctave: number;
}

function getNotePosition(note: string) {
  const NOTE_POSITION_MAP: Record<string, number> = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 0,
    A: 1,
    B: 2,
  };
  return NOTE_POSITION_MAP[note[0].toUpperCase()] ?? 0;
}

function makeNotes(data: string[]) {
  let times = 0;
  return data.map((item) => {
    return {
      name: item,
      time: times++,
      position: getNotePosition(item),
    };
  });
}

export function processTrack<T>(opts: {
  midiFile: File;
  maxOctave?: number;
  minOctave?: number;
  fn: TrackProcessor<T>;
}): Promise<T> {
  const { midiFile, maxOctave, minOctave, fn } = opts;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const midi = new Midi(arrayBuffer);
        /** get the first track with notes */
        const index = midi.tracks.findIndex((t) => t.notes.length > 0);
        if (index === -1) throw new Error("No notes found in MIDI file");
        const song = fn(midi.tracks[index], maxOctave, minOctave);
        resolve(song);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(midiFile);
  });
}

export const mapTrackToSong: TrackProcessor<Song> = (
  track,
  maxOctave,
  minOctave
) => {
  if (!track) {
    throw new Error("Track not found");
  }
  const SPEED_MULTIPLIER = 1;
  const MELODY_ONLY = true;

  const hasSomeThreshold = maxOctave !== undefined && minOctave !== undefined;

  const notes = track.notes
    .map((midiNote) => {
      if (
        hasSomeThreshold &&
        (midiNote.octave > maxOctave || midiNote.octave < minOctave)
      ) {
        return null;
      }
      return {
        name: midiNote.name,
        position: getNotePosition(midiNote.name),
        time: (midiNote.time / SPEED_MULTIPLIER) * 4,
      };
    })
    .filter((note) => note !== null);

  const melodyNotes = MELODY_ONLY
    ? (() => {
        const seenTimes = new Map<number, (typeof notes)[0]>();
        for (const note of notes) {
          if (!seenTimes.has(note.time)) {
            seenTimes.set(note.time, note);
          }
        }
        return Array.from(seenTimes.values());
      })()
    : notes;

  return {
    name: track.name,
    notes: melodyNotes,
  };
};

export const analyzeMidiOctaves: TrackProcessor<MidiAnalysis> = (track) => {
  if (!track) throw new Error("Track not found");

  const octaveCounts: Record<number, number> = {};
  let totalNotes = 0;

  track.notes.forEach((midiNote) => {
    const octave = midiNote.octave;
    octaveCounts[octave] = (octaveCounts[octave] || 0) + 1;
    totalNotes++;
  });

  const octaveStats: OctaveStats[] = Object.entries(octaveCounts)
    .map(([octave, count]) => ({
      octave: parseInt(octave),
      noteCount: count,
      percentage: (count / totalNotes) * 100,
    }))
    .sort((a, b) => a.octave - b.octave);

  const minOctave = Math.min(...Object.keys(octaveCounts).map(Number));
  const maxOctave = Math.max(...Object.keys(octaveCounts).map(Number));

  let bestRange = { min: minOctave, max: minOctave, noteCount: 0 };

  for (let start = minOctave; start <= maxOctave; start++) {
    const end = Math.min(start + 2, maxOctave);
    let windowCount = 0;

    for (let octave = start; octave <= end; octave++) {
      windowCount += octaveCounts[octave] || 0;
    }

    if (windowCount > bestRange.noteCount) {
      bestRange = { min: start, max: end, noteCount: windowCount };
    }
  }

  const recommendedMinOctave = bestRange.min;
  const recommendedMaxOctave = bestRange.max;

  return {
    octaveStats,
    totalNotes,
    minOctave,
    maxOctave,
    recommendedMinOctave,
    recommendedMaxOctave,
  };
};

export const sampleSong: Song = {
  name: "cantabile_in_C_grand",
  notes: makeNotes([
    "C4",
    "E4",
    "G4",
    "A4",
    "G4",
    "E4",
    "F4",
    "D4",
    "C4",
    "G4",
    "B4",
    "D5",
    "E5",
    "D5",
    "B4",
    "C5",
    "A4",
    "G4",
    "A4",
    "C5",
    "E5",
    "F5",
    "E5",
    "C5",
    "B4",
    "G4",
    "A4",
    "E5",
    "D5",
    "B4",
    "C5",
    "G4",
    "A4",
    "B4",
    "G4",
    "C5",
    "C4",
    "E4",
    "G4",
    "A4",
    "G4",
    "E4",
    "F4",
    "D4",
    "E4",
    "F4",
    "G4",
    "E4",
    "D4",
    "G4",
    "F4",
    "E4",
    "D4",
    "G4",
    "C5",
    "E4",
    "C4",
    "F4",
    "A4",
    "G4",
    "C4",
    "E4",
    "G4",
    "B4",
    "C5",
    "A4",
    "F4",
    "D4",
    "G4",
    "E4",
    "C4",
    "G3",
    "C4",
    "C4",
  ]),
};
