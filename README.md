# Paper Pilot ✉️✈️

> *Fold a memory. Catch the thermal.*

**Paper Pilot** is a minimalist endless-flying mobile game for React Native and Expo. Inspired by vintage travel journals, stationery, old postcards, and Japanese paper goods, players guide a small folded paper airplane through a hand-crafted sky—gliding past drafting pencils, soft clouds, and town clock towers while gathering little postage stamps along the breeze.

---

## 🎨 Visual Atmosphere & Art Direction

- **Warm, Nostalgic Palette**: Warm ivory paper, muted sky blue, dusty teal, deep ink navy, and soft coral accents.
- **Folded Paper Airplane**: Multi-faceted origami silhouette with natural paper lighting and authentic folding creases.
- **Hand-Crafted Scenery**: Layered skies with distant mountain ridges, rolling hills, village windmills, and faint travel-journal draft lines.
- **Editorial Typography**: Classic serif headings paired with clean modern numbers for distances and scores.
- **Travel Postcard Results**: Flight logs are delivered as vintage correspondence cards with postmark cancellation seals and milestone notes.

---

## 🎮 How to Play

1. **Flight Controls**:
   - **Tap & Hold**: Catches the updraft, lifting the paper plane into the sky.
   - **Release**: Levels out and lets the plane glide gently downward.
   - **Dynamic Tilt**: The plane tilts naturally as you climb and descend.
2. **Dodge Obstacles**:
   - Wooden drafting pencils with graphite tips.
   - Old town clock towers and spires.
   - Windmills and cottage weather vanes.
   - Hanging airmail letters and soft ink clouds.
3. **Collect Stamps**:
   - Collectible postage stamps with scalloped edges appear along your flight path.
   - Pickups produce a gentle chime, tactile feedback, and a floating indicator.
4. **Replayability**:
   - Each flight lasts around 15–60 seconds.
   - Easy to learn within seconds, rewarding to master.

---

## 📱 Game Screens

- **Home Screen**: Open your travel journal with a drifting paper plane, personal best records, and quick access to flights.
- **Gameplay**: Full-screen illustrated sky with smooth parallax movement, clean distance tracker, stamp counter, and pause menu.
- **Flight Dispatched (Game Over)**: A vintage postcard detailing your distance, stamps gathered, and new records.
- **Postcard Collection**: 10 unlockable illustrated postcards celebrating flight milestones with travel stories and quotes.
- **Settings**: Simple toggles for sound effects, haptic vibrations, reduced motion, and record resets.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- [Expo Go](https://expo.dev/go) app on your phone (or a web browser / emulator)

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the game:
   ```bash
   npx expo start
   ```

3. Open the game:
   - **On Phone**: Scan the QR code in the terminal using the **Expo Go** app (Android) or **Camera** app (iOS).
   - **In Web Browser**: Press **`w`** in the terminal to play in your browser.
   - **On Android Emulator**: Press **`a`** in the terminal.

---

## 📁 Project Structure

```
paper-pilot/
├── assets/                  # App icon and splash graphics
├── src/
│   ├── types/               # Game state and data definitions
│   ├── constants/           # Color palette, fonts, and postcard stories
│   ├── services/            # Storage, audio, and haptics
│   ├── game/                # Flight physics and collision handling
│   └── components/
│       ├── common/          # Paper background and buttons
│       ├── vectors/         # Paper airplane, stamps, and obstacles
│       ├── game/            # Canvas, scenery, and HUD
│       └── screens/         # Home, Game Over, Postcards, and Settings
├── App.tsx                  # App root and screen transitions
└── package.json             # Dependencies and scripts
```

---

## 📜 License

MIT License. Crafted with care for fans of quiet, peaceful games.
