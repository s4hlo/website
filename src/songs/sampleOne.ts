import type { Song } from "../types/rhythm-game";
import { Midi } from "@tonejs/midi";

/** we check the position by prefix */
export const notePositionMap: Record<string, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 0,
};

function getNotePosition(note: string) {
  return notePositionMap[note[0].toUpperCase()] ?? 0;
}

function makeNotes(data: [string, number, number | undefined][]) {
  let times = 0;
  return data.map((item) => {
    const [value, instrument, time] = item;
    return {
      value,
      instrument,
      time: time ?? times++,
      position: getNotePosition(value), // fallback caso não exista no mapa
    };
  });
}

export const sampleSong: Song = {
  name: "cantabile_in_C_grand",
  quarterNoteDuration: 200, // ~120 BPM
  notes: makeNotes([
    ["C4", 2, 0],
    ["E4", 1, 2],
    ["G4", 1, 3],
    ["A4", 2, 4],
    ["G4", 1, 6],
    ["E4", 1, 7],
    ["F4", 2, 8],
    ["D4", 2, 10],
    ["C4", 4, 12],
    ["G4", 2, 16],
    ["B4", 1, 18],
    ["D5", 1, 19],
    ["E5", 2, 20],
    ["D5", 1, 22],
    ["B4", 1, 23],
    ["C5", 2, 24],
    ["A4", 2, 26],
    ["G4", 4, 28],
    ["A4", 2, 32],
    ["C5", 1, 34],
    ["E5", 1, 35],
    ["F5", 2, 36],
    ["E5", 1, 38],
    ["C5", 1, 39],
    ["B4", 2, 40],
    ["G4", 2, 42],
    ["A4", 4, 44],
    ["E5", 2, 48],
    ["D5", 1, 50],
    ["B4", 1, 51],
    ["C5", 2, 52],
    ["G4", 1, 54],
    ["A4", 1, 55],
    ["B4", 2, 56],
    ["G4", 2, 58],
    ["C5", 4, 60],
    ["C4", 2, 64],
    ["E4", 1, 66],
    ["G4", 1, 67],
    ["A4", 2, 68],
    ["G4", 1, 70],
    ["E4", 1, 71],
    ["F4", 2, 72],
    ["D4", 2, 74],
    ["E4", 1, 76],
    ["F4", 1, 77],
    ["G4", 2, 78],
    ["E4", 2, 80],
    ["D4", 2, 82],
    ["G4", 1, 84],
    ["F4", 1, 85],
    ["E4", 2, 86],
    ["D4", 2, 88],
    ["G4", 2, 90],
    ["C5", 4, 92],
    ["E4", 2, 96],
    ["C4", 2, 98],
    ["F4", 2, 100],
    ["A4", 2, 102],
    ["G4", 4, 104],
    ["C4", 2, 108],
    ["E4", 2, 110],
    ["G4", 2, 112],
    ["B4", 2, 114],
    ["C5", 4, 116],
    ["A4", 2, 120],
    ["F4", 2, 122],
    ["D4", 2, 124],
    ["G4", 2, 126],
    ["E4", 2, 128],
    ["C4", 2, 130],
    ["G3", 2, 132],
    ["C4", 4, 134],
    ["C4", 8, 138],
  ]),
};

export function convertMidiToSong(
  midiFile: File,
  maxOctave: number = 8,
  minOctave: number = 3
): Promise<Song> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const midi = new Midi(arrayBuffer);

        // Pega o primeiro track que tenha notas
        const track = midi.tracks.find((t) => t.notes.length > 0);
        if (!track) {
          reject(new Error("No notes found in MIDI file"));
          return;
        }

        console.log("original notes", track.notes);

        const notes = track.notes.map((midiNote) => {
          if (midiNote.octave > maxOctave || midiNote.octave < minOctave) {
            return null;
          }
          return {
            value: midiNote.name,
            position: getNotePosition(midiNote.name),
            instrument: 0,
            // time: Math.floor(midiNote.time * 4), // Converte para quarter notes
            time: midiNote.time * 4, // Converte para quarter notes
          };
        }).filter((note) => note !== null);

        const song: Song = {
          name: midiFile.name.replace(".mid", "").replace(".midi", ""),
          quarterNoteDuration: 200, // Valor padrão, pode ser ajustado
          notes: notes,
        };

        resolve(song);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(midiFile);
  });
}
