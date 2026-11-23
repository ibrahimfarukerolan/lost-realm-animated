# The Lost Realm — Animated Fantasy Game Start Screen

## Project Overview

The Lost Realm is a fantasy-themed mobile game start screen developed using React Native, Expo, and TypeScript.

The application features a medieval-style interface with animated burning torches, a flying dragon, custom typography, and an interactive Start Game button.

This project was developed for the **Development of Hybrid Mobile Applications — Laboratory 6** assignment.

## Features

- **Dynamic Game Information:** Loads the game title and version from a bundled text file.
- **Medieval Background:** Displays a scalable raster background using `ImageBackground`.
- **Custom Font:** Uses Cinzel Decorative through the `useFonts` hook.
- **Animated Torches:** Displays two continuously burning torches using Lottie JSON animations.
- **Flying Dragon:** Animates a fantasy dragon from left to right every five seconds using React Native's `Animated` API.
- **Random Trajectory:** Changes the dragon's vertical flight path for each animation cycle.
- **Error Handling:** Validates the game information and provides fallback values when the bundled content is invalid or cannot be read at runtime.
- **Orientation Lock:** Requests portrait orientation using `expo-screen-orientation`.
- **Interactive Button:** Uses `Pressable` to provide visual feedback when Start Game is pressed.

## Technologies Used

- React Native
- Expo
- TypeScript
- Expo Router
- Expo Font
- Expo Asset
- Expo File System
- Expo Screen Orientation
- Lottie React Native
- React Native Animated API

## Project Structure

```text
lost-realm-animated/
├── assets/
│   ├── animations/
│   │   └── torch.json
│   ├── backgrounds/
│   │   └── medieval_wood.jpg
│   ├── data/
│   │   ├── game-info.txt
│   │   └── default-game-info.txt
│   ├── fonts/
│   └── images/
│       └── dragon.png
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   └── utils/
│       └── gameInfo.ts
├── app.json
├── metro.config.js
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ibrahimfarukerolan/lost-realm-animated.git
cd lost-realm-animated
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the application

```bash
npx expo start
```

Open the application using Expo Go on a compatible mobile device or run it in a supported emulator.

## Game Information Format

The `assets/data/game-info.txt` file contains the game title on the first line and its version on the second line.

Example:

```text
The Lost Realm
1.0.0
```

The application validates the title and version before displaying them.

If the file contains invalid information or cannot be read at runtime, the application uses fallback values.

**Note:** The text file is referenced through a static Metro asset import. Physically removing it from the source project before bundling causes a build error; this scenario is not covered by the runtime fallback.

## Dragon Animation

The dragon animation uses React Native's built-in `Animated` API.

Each flight:

1. Begins outside the left edge of the screen.
2. Moves horizontally toward the right edge.
3. Uses randomized vertical start and end positions.
4. Takes approximately three seconds.
5. Repeats every five seconds.

## Lottie Torch Animations

Two Lottie components display animated burning torches on opposite sides of the screen.

Both components use the same `torch.json` animation with `autoPlay` and `loop` enabled.

## Testing

The following functionality was tested:

- Game information loading
- Invalid text-file fallback
- Medieval font rendering
- Background image scaling
- Lottie torch animations
- Flying dragon animation
- Randomized flight paths
- Portrait orientation
- Start Game button interaction
- TypeScript validation using `npx tsc --noEmit`

## Author

Ibrahim Faruk Erolan

## Course

Development of Hybrid Mobile Applications — Laboratory 6
