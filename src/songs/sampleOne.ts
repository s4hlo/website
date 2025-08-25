import type { Song } from "../types/rhythm-game";
import { Midi } from "@tonejs/midi";

function getNotePosition(note: string) {
  const notePositionMap: Record<string, number> = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 0,
    A: 1,
    B: 2,
  };
  return notePositionMap[note[0].toUpperCase()] ?? 0;
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



export function mapTrackToSong(
  midi: Midi,
  index: number,
  maxOctave: number,
  minOctave: number
): Song {
  const track = midi.tracks[index];
  if (!track) {
    throw new Error(`Track ${index} not found in MIDI file`);
  }

  const notes = track.notes
    .map((midiNote) => {
      if (midiNote.octave > maxOctave || midiNote.octave < minOctave) {
        return null;
      }
      return {
        name: midiNote.name,
        position: getNotePosition(midiNote.name),
        time: midiNote.time * 4,
      };
    })
    .filter((note) => note !== null);

  return {
    name: midi.name,
    notes: notes,
  };
}

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
        const index = midi.tracks.findIndex((t) => t.notes.length > 0);
        const song = mapTrackToSong(midi, index, maxOctave, minOctave);
        resolve(song);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(midiFile);
  });
}

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

// Interface para estatísticas de oitavas
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

// Função para analisar as oitavas do arquivo MIDI
export function analyzeMidiOctaves(midiFile: File): Promise<MidiAnalysis> {
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

        // Conta notas por oitava
        const octaveCounts: Record<number, number> = {};
        let totalNotes = 0;

        track.notes.forEach((midiNote) => {
          const octave = midiNote.octave;
          octaveCounts[octave] = (octaveCounts[octave] || 0) + 1;
          totalNotes++;
        });

        // Converte para array e ordena por oitava
        const octaveStats: OctaveStats[] = Object.entries(octaveCounts)
          .map(([octave, count]) => ({
            octave: parseInt(octave),
            noteCount: count,
            percentage: (count / totalNotes) * 100,
          }))
          .sort((a, b) => a.octave - b.octave);

        const minOctave = Math.min(...Object.keys(octaveCounts).map(Number));
        const maxOctave = Math.max(...Object.keys(octaveCounts).map(Number));

        // Calcula oitavas recomendadas (onde há mais notas)
        const sortedByCount = [...octaveStats].sort(
          (a, b) => b.noteCount - a.noteCount
        );

        // Recomenda um range que cubra pelo menos 80% das notas
        let cumulativePercentage = 0;
        let recommendedMinOctave = minOctave;
        let recommendedMaxOctave = maxOctave;

        for (const stat of sortedByCount) {
          cumulativePercentage += stat.percentage;
          if (cumulativePercentage >= 80) {
            recommendedMaxOctave = stat.octave;
            break;
          }
        }

        // Ajusta o mínimo para manter um range razoável
        const range = recommendedMaxOctave - recommendedMinOctave;
        if (range < 2) {
          recommendedMinOctave = Math.max(minOctave, recommendedMaxOctave - 2);
        }

        resolve({
          octaveStats,
          totalNotes,
          minOctave,
          maxOctave,
          recommendedMinOctave,
          recommendedMaxOctave,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(midiFile);
  });
}

