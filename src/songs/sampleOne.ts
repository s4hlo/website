import type { Song } from "../types/rhythm-game";
import { Midi } from "@tonejs/midi";

export const old: Song = {
  name: "Sample Rhythm Song",
  quarterNoteDuration: 600,
  notes: [
    { value: "C5", position: 0, instrument: 0, time: 0 },
    { value: "D5", position: 1, instrument: 0, time: 1 },
    { value: "E5", position: 2, instrument: 1, time: 2 },
    { value: "F5", position: 0, instrument: 0, time: 3 },
    { value: "F5", position: 1, instrument: 0, time: 4 },
    { value: "F5", position: 2, instrument: 0, time: 5 },
    { value: "C5", position: 0, instrument: 0, time: 6 },
    { value: "D5", position: 1, instrument: 0, time: 7 },
    { value: "C5", position: 2, instrument: 0, time: 8 },
    { value: "D5", position: 0, instrument: 0, time: 9 },
    { value: "D5", position: 1, instrument: 0, time: 10 },
    { value: "D5", position: 2, instrument: 0, time: 11 },
    { value: "C5", position: 0, instrument: 0, time: 12 },
    { value: "D5", position: 1, instrument: 0, time: 13 },
    { value: "E5", position: 2, instrument: 1, time: 14 },
    { value: "F5", position: 0, instrument: 0, time: 15 },
    { value: "F5", position: 1, instrument: 0, time: 16 },
    { value: "F5", position: 2, instrument: 0, time: 17 },
    { value: "C5", position: 0, instrument: 0, time: 18 },
    { value: "D5", position: 1, instrument: 0, time: 19 },
    { value: "C5", position: 2, instrument: 0, time: 20 },
    { value: "D5", position: 0, instrument: 0, time: 21 },
    { value: "D5", position: 1, instrument: 0, time: 22 },
    { value: "D5", position: 2, instrument: 0, time: 23 },
  ],
};


export const notePositionMap: Record<string, number> = {
  // --- Oitava 3 ---
  C3: 0,  "C#3": 0,
  D3: 1,  "D#3": 1,
  E3: 2,
  F3: 3,  "F#3": 3,
  G3: 4,  "G#3": 4,
  A3: 5,  "A#3": 5,
  B3: 0,

  // --- Oitava 4 ---
  C4: 0,  "C#4": 0,
  D4: 1,  "D#4": 1,
  E4: 2,
  F4: 3,  "F#4": 3,
  G4: 4,  "G#4": 4,
  A4: 5,  "A#4": 5,
  B4: 0,

  // --- Oitava 5 ---
  C5: 0,  "C#5": 0,
  D5: 1,  "D#5": 1,
  E5: 2,
  F5: 3,  "F#5": 3,
  G5: 4,  "G#5": 4,
  A5: 5,  "A#5": 5,
  B5: 0,

  // --- Oitava 6 ---
  C6: 0,  "C#6": 0,
  D6: 1,  "D#6": 1,
  E6: 2,
  F6: 3,  "F#6": 3,
  G6: 4,  "G#6": 4,
  A6: 5,  "A#6": 5,
  B6: 0,

  // --- Oitava 7 ---
  C7: 0,  "C#7": 0,
  D7: 1,  "D#7": 1,
  E7: 2,
  F7: 3,  "F#7": 3,
  G7: 4,  "G#7": 4,
  A7: 5,  "A#7": 5,
  B7: 0,

  // --- Oitava 8 ---
  C8: 0,  "C#8": 0,
  D8: 1,  "D#8": 1,
  E8: 2,
  F8: 3,  "F#8": 3,
  G8: 4,  "G#8": 4,
  A8: 5,  "A#8": 5,
  B8: 0,
};


function makeNotes(data: [string, number, number | undefined][]) {
  let times = 0;
  return data.map((item) => {
    const [value, instrument, time] = item;
    return {
      value,
      instrument,
      time: time ?? times++,
      position: notePositionMap[value] ?? 0, // fallback caso não exista no mapa
    };
  });
}

export const sampleSong: Song = {
  name: "cantabile_in_C_grand",
  quarterNoteDuration: 200, // ~120 BPM
  notes: makeNotes([
    // A (mm. 1–8) – motivo inicial
    ["C4", 2, 0],
    ["E4", 1, 2],
    ["G4", 1, 3],
    ["A4", 2, 4],
    ["G4", 1, 6],
    ["E4", 1, 7],
    ["F4", 2, 8],
    ["D4", 2, 10],
    ["C4", 4, 12],

    // B (mm. 9–16) – desenvolvimento no dominante
    ["G4", 2, 16],
    ["B4", 1, 18],
    ["D5", 1, 19],
    ["E5", 2, 20],
    ["D5", 1, 22],
    ["B4", 1, 23],
    ["C5", 2, 24],
    ["A4", 2, 26],
    ["G4", 4, 28],

    // Ponte (mm. 17–24) – cor em Am
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

    // A’ (mm. 25–32) – variação
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

    // Coda (mm. 33–48) – encerramento expansivo
    ["E4", 2, 96],
    ["C4", 2, 98],
    ["F4", 2, 100],
    ["A4", 2, 102],
    ["G4", 4, 104], // IV – V

    ["C4", 2, 108],
    ["E4", 2, 110],
    ["G4", 2, 112],
    ["B4", 2, 114],
    ["C5", 4, 116], // I prolongado

    ["A4", 2, 120],
    ["F4", 2, 122],
    ["D4", 2, 124],
    ["G4", 2, 126],
    ["E4", 2, 128],
    ["C4", 2, 130],
    ["G3", 2, 132],
    ["C4", 4, 134],
    // V – I – cadência final

    ["C4", 8, 138], // Fermata na tônica
  ]),
};

export function convertMidiToSong(midiFile: File): Promise<Song> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const midi = new Midi(arrayBuffer);
        
        // Pega o primeiro track que tenha notas
        const track = midi.tracks.find(t => t.notes.length > 0);
        if (!track) {
          reject(new Error("No notes found in MIDI file"));
          return;
        }
        
        // Converte as notas do MIDI para o formato Song
        const notes = track.notes.map((midiNote) => ({
          // value: midiNote.name + midiNote.octave,
          value: "C4",
          position: Math.floor(Math.random() * 6), // Posição aleatória de 0 a 5
          instrument: Math.floor(Math.random() * 2), // Instrumento aleatório 0 ou 1
          time: Math.floor(midiNote.time * 4), // Converte para quarter notes
        }));
        
        const song: Song = {
          name: midiFile.name.replace('.mid', '').replace('.midi', ''),
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
