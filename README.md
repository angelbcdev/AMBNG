#  MegaMan Battle Network-inspired Game (Vite + React + TypeScript)

A canvas-based game inspired by MegaMan Battle Network, built with Vite, React (SWC), and TypeScript. The game renders to a fixed 430x430 canvas and is driven by a scene manager that switches between Home, World (isometric), Battle, Options, and Chips management scenes.

## Features
- **Scene system** with `SceneManager` and multiple scenes:
  - `HomeScene` – Entry UI with menu buttons
  - `WorldScene` – Isometric overworld with collisions and random encounter zones
  - `BattleScene` – Battle arena and UI (WIP)
  - `OptionScene` – Keybinding rebinding UI
  - `ChipsScene` – Manage chips between Sack and Folder
- **Chips system** (`BattleShip`) with drawing helpers and chip movement between Sack and Folder
- **Pause menu** with animated side panels and button navigation
- **Isometric world renderer** with walk paths, walls, enemy zones
- **Keybinding system** with runtime rebinding
- **Collision detection** and random encounter mechanics

## Tech Stack
- Vite + React (SWC) + TypeScript
- Canvas 2D rendering
- TailwindCSS configured (see `tailwind.config.js`)

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Installation
```bash
npm install
```

### Run (dev)
```bash
npm run dev
```
Vite will print a local dev URL. Open it in your browser. The app mounts a 430x430 canvas and starts the main loop via `src/main.tsx`.

### Build (prod)
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## Project Structure
```
/ public
  / assects                # Game art, UI, tiles, sprites (typo kept to match project paths)
/ src
  / config
    keyBindings.ts         # Rebindable controls
  / data
    / player/player/chips  # Chips system: data, manager, classes
    gameBattle.ts          # Battle logic (shared/non-scene)
  / newUI
    / Button               # ButtonManager UI
    / menu                 # PauseMenu
    / backGround           # Parallax/background helpers
  / scenes
    / sceneManager.ts      # Central scene router and canvas loop integration
    / sceneROOT.ts         # Base scene class
    / homeScene            # HomeScene
    / worldScene           # WorldScene (sources with iso renderer)
      / sources
        gameiso.ts         # GameIso: world loop, camera, zones, pause
        isoEntitys.ts      # mySquare, WalkPath, Wall, EnemyZone
        isPlayer.ts        # PlayerIso
        utils.ts           # world data & helpers
    / battleScene          # Battle scene & UI
    / optionScene          # Keybinding rebinding UI
    / chipsScene           # ChipsScene: folder/sack navigation
  main.tsx                 # Game boot & animation loop
  index.html               # Root HTML with <canvas id="canvas">
```

## How it Works

### Scene Manager
- File: `src/scenes/sceneManager.ts`
- Initializes the canvas (`430x430`) and holds scene instances in `scenes`.
- Switch scenes with `GAME.changeScene(key)` or return using `GAME.returnToPreviousScene()`.
- Delegates `update(deltaTime)` and `draw(deltaTime)` to the active scene.
- Listens to clicks and forwards to `currentScene.checkClick(x, y)`.

### Scenes
- **Base**: `src/scenes/sceneROOT.ts` with lifecycle hooks `in()`, `out()`, `update()`, `draw()`, `checkKey()`, `checkClick()`.
- **Home**: `src/scenes/homeScene/homeScene.ts` uses `ButtonManager` to navigate.
- **World (Iso)**: `src/scenes/worldScene/sources/gameiso.ts`
  - Handles player movement, collisions, random encounters (`EnemyZone`).
  - Camera (`Camera`) with `isoFocus`.
  - Pause toggling integrates with `PauseMenu`.
- **Battle**: `src/scenes/battleScene/` (work in progress), initialized via world encounters.
- **Options**: `src/scenes/optionScene/optionScene.ts` provides key rebinding.
- **Chips**: `src/scenes/chipsScene/chipsScene.ts` manages Sack/Folder with arrow navigation and add/remove using keybindings.

### UI Components
- **`ButtonManager`** (`src/newUI/Button/buttonManager.ts`)
  - Keyboard navigation: ArrowUp/ArrowDown to change selection, Enter or `keyBindings.singleShoot` to activate.
  - Draws a green arrow indicator next to the active button.
- **`PauseMenu`** (`src/newUI/menu/pauseMenu.ts`)
  - Sliding side panels (left menu, right money panel) animated by `swapMenu()`.
  - Contains a `ButtonManager` to navigate options; currently provides a "Folder" option to open the Chips scene.

### Chips System
- **`BattleShip` class**: `src/data/player/player/chips/index.ts`
  - Auto-configures from `allChipsA` by `title`.
  - Exposes `drawFullImage(...)` and `drawName(...)` to render chip visuals.
  - Has `id` (base) and `idForMove` (ephemeral for moving within Folder).
- **`ChipManager`**: `src/data/player/player/chips/chipsManager.ts`
  - Single-instance via `CHIPS_MANAGER`.
  - Collections: `chipsSack`, `chipsFolder`, `chipsForBattle`.
  - Methods: `addChipToFolder(id)`, `removeChipFromFolder(idForMove)`, `addChip(chip)`, `clearShips()`.
- **Chips scene navigation** (`src/scenes/chipsScene/chipsScene.ts`)
  - Two panes (Folder and Sack) with paging of 7 items each.
  - ArrowUp/ArrowDown moves the cursor; ArrowLeft/Right switches panes.
  - `keyBindings.singleShoot` moves from Sack -> Folder (adds); same key on Folder removes and shifts selection.
  - `keyBindings.useChip` returns to the previous scene.

### World (Isometric)
- Entities in `src/scenes/worldScene/sources/isoEntitys.ts` render as isometric diamonds.
- `WalkPath` tiles define traversable areas; `Wall` blocks movement; `EnemyZone` triggers battles.
- `GameIso` assembles the map from numeric layers in `utils.ts`.

## Controls / Keybindings
Keybindings are defined in `src/config/keyBindings.ts` and can be changed at runtime in the Options scene.

**Default Controls** (names may vary depending on your current config):
- **Arrow keys**: Navigate menus, move player in world, move selection in Chips scene
- **Enter** or `singleShoot`: Activate menu buttons; add/remove chips in Chips scene
- **`useChip`**: Confirm/return to previous scene from Chips scene
- **Escape**: Toggle pause menu in world scene

*Note: If you customized `keyBindings.ts`, the Options scene allows rebinding to new keys (avoids arrow keys by default).*

## Assets
- All images loaded from `/assects/...` in `public/`.
- Keep the "assects" directory name as-is to match code paths.

## Next Steps & Roadmap

### 🎯 Short Term (Next Release)
- [ ] **Complete Battle System**
  - Finish `BattleScene` implementation
  - Add turn-based combat mechanics
  - Implement chip usage in battles
  - Add battle victory/defeat conditions

- [ ] **Expand Chip Collection**
  - Add 20+ new battle chips with unique effects
  - Implement chip rarity system (Common, Rare, Mega)
  - Add chip combination mechanics
  - Create chip trading/selling system

### 🌍 Medium Term (World Expansion)
- [ ] **Isometric World Enhancements**
  - Add multiple world areas/zones
  - Implement different terrain types (grass, water, cyber, industrial)
  - Add interactive NPCs and dialogue system
  - Create shop areas for chip purchasing
  - Add save points and fast travel system

- [ ] **Visual Improvements**
  - Animated sprite sheets for player and enemies
  - Particle effects for battles and interactions
  - Dynamic lighting system
  - Weather effects (rain, snow, cyber storms)
  - Tile variety (bridges, elevators, teleporters)

### 👾 Enemy & Combat System
- [ ] **Enemy Variety**
  - Design 15+ unique enemy types with distinct AI patterns
  - Implement boss battles with multi-phase mechanics
  - Add enemy formations and group encounters
  - Create roaming mini-bosses in world areas

- [ ] **Advanced Battle Features**
  - Real-time battle grid system (3x6 battlefield)
  - Elemental damage types and resistances
  - Status effects (poison, stun, boost, etc.)
  - Battle rank system based on performance

### 🎮 Gameplay Features
- [ ] **Player Progression**
  - Experience points and leveling system
  - Customizable player abilities/programs
  - Equipment system (armor, accessories)
  - Skill trees for different playstyles

- [ ] **Quality of Life**
  - Auto-save functionality
  - Settings menu (sound, graphics options)
  - Tutorial system for new players
  - Accessibility options (colorblind support, larger text)

### 🎨 Polish & Content
- [ ] **Audio System**
  - Background music for each scene
  - Sound effects for actions and battles
  - Dynamic audio mixing
  - Music that changes based on game state

- [ ] **Story & Lore**
  - Main storyline with multiple chapters
  - Side quests and optional objectives
  - Collectible lore items and world-building
  - Multiple endings based on player choices

### 🔧 Technical Improvements
- [ ] **Performance Optimization**
  - Sprite batching and object pooling
  - Optimize rendering pipeline
  - Memory management improvements
  - Mobile device compatibility

- [ ] **Developer Experience**
  - Level editor for creating new world areas
  - Chip editor for balancing and creating new chips
  - Debug tools and performance profiler
  - Automated testing for game systems

### 🌟 Long Term Vision
- [ ] **Multiplayer Features**
  - Local co-op battle mode
  - Online chip trading
  - Community-created content sharing
  - Leaderboards and achievements

- [ ] **Platform Expansion**
  - Mobile app version
  - Desktop app with Electron
  - Steam release preparation
  - Console controller support

## Development Tips
- The canvas and loop are started from `src/main.tsx`. Rendering calls flow to `GAME.draw(...)` within the RAF loop.
- Scenes should clean up listeners in `out()` and register in `in()`.
- When adding a new scene, register it in `src/scenes/sceneManager.ts` `statesKeys` and `scenes`.
- For isometric tiles, keep `TILE_W=16`, `TILE_H=8` consistent when drawing.

## Troubleshooting
- **Black screen or no input**:
  - Ensure the `<canvas id="canvas">` exists in `index.html` and `SceneManager` is created (`export const GAME = SceneManager.getInstance();`).
  - Check that `npm run dev` compiled without TypeScript errors.
- **Missing images**:
  - Verify the files exist under `public/assects/...` and paths are correct (case-sensitive).
- **ESLint errors like "Expected an assignment or function call and instead saw an expression"**:
  - Avoid using ternary operators for side-effects. Use explicit assignments like `Math.max/Math.min` clamping.
- **Chips lists empty**:
  - `ChipManager` populates `chipsSack` from `allChipsA`. Confirm `allChipsA` exports and image assets resolve.
- **Navigation glitches in Chips scene**:
  - Check `sliceIndex*` and `*Index` math and ensure bounds are clamped to `0..length-1`.

## Contributing
We welcome contributions! Please check the roadmap above for areas where help is needed. Before starting work on a major feature, please open an issue to discuss the implementation approach.

### Priority Areas for Contributors
- Battle system implementation
- New chip designs and mechanics
- Enemy AI patterns
- Isometric world art and level design
- Audio integration
- Mobile optimization

## License
MIT (or your preferred license) – update as needed.

---

**Current Status**: Alpha - Core systems functional, battle system in development
**Last Updated**: September 2025