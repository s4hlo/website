# Portfolio - Interactive Developer Showcase

A modern, interactive portfolio built with React, TypeScript, and Three.js featuring various interactive components and games.

## Features

### 🎮 Interactive Components
- **3D World**: Navigate through a Three.js-powered 3D environment
- **Rhythm Game**: A MIDI-compatible rhythm game with customizable tracks
- **GitHub Integration**: Display repositories and contribution graphs
- **Interactive Resume**: Dynamic resume with interactive elements

### 🎵 Rhythm Game MIDI Support

The rhythm game now supports loading and playing MIDI files! Here's what you can do:

#### Loading MIDI Files
- **Drag & Drop**: Simply drag a MIDI file onto the upload area
- **File Browser**: Click to browse and select MIDI files
- **Demo Files**: Download and try the included demo MIDI files

#### Supported Features
- **Multi-track MIDI files**: Load complex compositions with multiple instruments
- **Automatic tempo detection**: Game speed adjusts to the MIDI file's BPM
- **Smart note mapping**: Notes are automatically mapped to the 6 available lanes (SDF JKL)
- **Real-time playback**: Notes appear and fall in sync with the music

#### How to Use
1. Navigate to the Rhythm Game page
2. Upload a MIDI file (.mid or .midi format)
3. The game will automatically parse the file and display song information
4. Click "Start Game" to begin playing
5. Use the DF JK keys to hit notes as they fall

#### Demo MIDI Files
- **Simple Demo**: Basic C major scale melody (120 BPM)
- **Complex Demo**: Multi-track composition with melody, bass, and harmony (140 BPM)

#### Technical Details
- **File Format**: Standard MIDI (.mid, .midi)
- **File Size**: Up to 10MB
- **Note Mapping**: Automatic mapping from MIDI notes to game lanes
- **Tempo Support**: 60-200+ BPM
- **Track Support**: Multiple tracks automatically merged

## Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Building for Production
```bash
yarn build
yarn preview
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **3D Graphics**: Three.js, React Three Fiber
- **Styling**: Material-UI, CSS-in-JS
- **Audio**: Tone.js, @tonejs/midi
- **Build Tool**: Vite
- **Package Manager**: Yarn

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── threejs/        # Three.js 3D components
│   └── rhythm-game/    # Rhythm game components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── midiLoader.ts   # MIDI file parsing
│   └── midiGenerator.ts # Demo MIDI generation
├── types/              # TypeScript type definitions
└── theme.ts            # Design system and colors
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


TODO: contact 

cnpq
orcid
linkdin
instagram
letterbox
goodreads
resume-pdf
leetcode
github