
# Tic-Tac-Toe App Overview

## 🎮 Project Summary

A modern, fully-typed React Native Tic-Tac-Toe game built with TypeScript. The application emphasizes clean architecture, testability, and maintainability through separation of concerns and pure functional design.

---

## ✨ Key Features

- **Two-Player Gameplay** - Players alternate between X and O
- **Win Detection** - Automatically detects winners across all 8 combinations
- **Draw Recognition** - Identifies when the board is full with no winner
- **Game Reset** - Easy reset to start a new game
- **Modern UI** - Dark theme with cyan and red accents
- **Fully Typed** - Complete TypeScript implementation
- **Comprehensive Tests** - 40+ unit tests for game logic
- **Responsive Design** - Adapts to different screen sizes

---

## 📁 File Structure

```
myApp/
├── utils/
│   ├── gameLogic.ts               # Core game logic (pure functions)
│   └── __tests__/
│       └── gameLogic.test.ts       # Unit tests
│
├── hooks/
│   └── useGameState.ts             # State management hook
│
├── components/
│   ├── App.tsx                     # Root component
│   ├── GameBoard.tsx               # Board container
│   ├── Square.tsx                  # Individual square
│   ├── GameStatus.tsx              # Status display
│   └── ResetButton.tsx             # Reset button
│
├── jest.config.js                  # Jest configuration
├── tsconfig.json                   # TypeScript configuration
└── TIC_TAC_TOE_APP_OVERVIEW.md     # This file
```

---

## 🏗️ Architecture Overview

The application is structured in three distinct layers:

### 1. **Logic Layer** - `utils/gameLogic.ts`

Pure, testable functions that implement all game mechanics.

**Types:**
```typescript
type Board = (string | null)[];
type GameStatus = 'playing' | 'win' | 'draw';
type Player = 'X' | 'O';
```

**Functions:**

| Function | Purpose | Returns |
|----------|---------|---------|
| `createInitialBoard()` | Create empty 3x3 board | `Board` |
| `calculateWinner(board)` | Find winner from all 8 combinations | `string \| null` |
| `isBoardFull(board)` | Check if board is completely filled | `boolean` |
| `isValidMove(board, index, winner, status)` | Validate move legality | `boolean` |
| `makeMove(board, index, player)` | Place player immutably | `Board` |
| `determineGameStatus(board, winner)` | Get game state | `GameStatus` |
| `getNextPlayer(isXNext)` | Get current player | `Player` |

**Testing:** Fully covered with unit tests
- 9 tests for winner detection (all 8 combinations + no winner)
- 4 tests for board state validation
- 7 tests for move validation
- 5 tests for move execution
- 2 integration tests for game flows

### 2. **State Layer** - useGameState.ts

Custom React hook managing game state and orchestrating logic functions.

**Exported API:**
```typescript
{
  board: Board;                          // Current board state
  isXNext: boolean;                      // Is X's turn?
  status: GameStatus;                    // Game status
  winner: string | null;                 // Current winner
  currentPlayer: Player;                 // Current player (X or O)
  handleSquarePress: (index: number) => void;  // Handle clicks
  resetGame: () => void;                 // Reset to initial state
}
```

**Responsibilities:**
- Initialize and manage game state
- Derive computed values (winner, currentPlayer)
- Validate and execute moves
- Update game status after each move
- Provide reset functionality

### 3. **View Layer** - components

Presentational components that display state and handle interactions.

**Component Tree:**
```
App.tsx (Root)
├── GameStatusDisplay
├── GameBoard
│   └── Square[] (9 squares)
└── ResetButton
```

#### **Component Descriptions:**

**GameBoard** (`GameBoard.tsx`)
- Renders the 3x3 grid
- Props: `board`, `boardSize`, `onSquarePress`
- Handles grid layout and spacing

**Square** (`Square.tsx`)
- Clickable game square
- Props: `value`, `index`, `onPress`, `boardSize`
- Shows X, O, or empty
- Visual feedback on press

**GameStatusDisplay** (`GameStatus.tsx`)
- Shows game state message
- Props: `status`, `winner`, `currentPlayer`
- Displays: current player, winner, or draw status

**ResetButton** (`ResetButton.tsx`)
- Restart button with gradient
- Props: `onPress`
- Visual feedback on press

**App** (App.tsx)
- Root component
- Initializes game state
- Composes all sub-components
- Manages main layout and styling

---

## 🔄 Data Flow

```
User taps Square
    ↓
Square.onPress(index)
    ↓
App passes to useGameState.handleSquarePress(index)
    ↓
Logic functions execute:
├── isValidMove() - Check if legal
├── makeMove() - Place piece
├── calculateWinner() - Check for winner
└── determineGameStatus() - Update game state
    ↓
State updates: board, status, isXNext
    ↓
Components re-render with new state
    ↓
UI reflects updated game board and status
```

---

## 🎨 Design System

**Color Palette:**

```
Primary Background:    #0f0f1e (Very Dark Blue)
Secondary Background:  #1a0a2e (Dark Purple)
Tertiary Background:   #16213e (Dark Slate)
Accent (X Player):     #00d4ff (Cyan)
Accent (O Player):     #ff6b6b (Red)
Glow Color:            #00d4ff (Cyan)
Text Color:            #fff (White)
```

**Visual Features:**
- Gradient background (dark theme)
- Text shadow glows for depth
- Shadow effects on board
- Active opacity on buttons
- Rounded corners for modern feel

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on file changes)
npm test:watch

# Coverage report
npm test:coverage
```

### Test Coverage

**gameLogic.test.ts** includes:

✅ **createInitialBoard** (2 tests)
- Correct array length
- Immutability

✅ **calculateWinner** (9 tests)
- All 8 winning combinations
- No winner scenarios
- Partial board states

✅ **isBoardFull** (4 tests)
- Empty, partial, full boards
- Full board with winner

✅ **isValidMove** (7 tests)
- Valid/invalid moves
- Occupied squares
- Game status validation

✅ **makeMove** (5 tests)
- Correct placement
- Immutability
- All indices

✅ **determineGameStatus** (3 tests)
- Win, draw, playing states
- Status priority

✅ **getNextPlayer** (3 tests)
- X and O selection
- Valid player output

✅ **Integration** (2 tests)
- Complete game flows
- Win scenarios
- Draw scenarios

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn
- Expo CLI (for running on device/simulator)

### Installation

```bash
# Install dependencies
npm install

# Install development dependencies
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/react-native
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

---

## 📋 Game Rules

1. **Turn Order** - X always goes first, players alternate
2. **Valid Moves** - Can only place on empty squares
3. **Win Condition** - Get three in a row (horizontal, vertical, or diagonal)
4. **Draw** - Board fills with no winner
5. **Game End** - Game ends immediately on win or draw

---

## 🏆 Winning Combinations

The game checks for 8 possible winning combinations:

```
Rows:       [0,1,2]  [3,4,5]  [6,7,8]
Columns:    [0,3,6]  [1,4,7]  [2,5,8]
Diagonals:  [0,4,8]  [2,4,6]
```

---

## 🎯 Design Principles

✅ **Single Responsibility** - Each module has one clear purpose
✅ **Pure Functions** - Logic layer has no side effects
✅ **Immutability** - Board state never mutated directly
✅ **Type Safety** - Full TypeScript coverage, no `any` types
✅ **Testability** - Easy to test pure functions and hooks
✅ **Separation of Concerns** - Logic, state, and UI completely separate
✅ **DRY Principle** - No code duplication, reusable components
✅ **Accessibility** - Touch feedback and clear status messages

---

## 🔮 Future Enhancements

### Short Term
- [ ] Component integration tests
- [ ] Hook testing with `@testing-library/react-hooks`
- [ ] Animations for moves and wins
- [ ] Sound effects

### Medium Term
- [ ] AI opponent with difficulty levels
- [ ] Game history and undo functionality
- [ ] Statistics tracking (wins/losses)
- [ ] Dark/light theme toggle

### Long Term
- [ ] Multiplayer online mode
- [ ] Leaderboard system
- [ ] Advanced AI using minimax algorithm
- [ ] Screen reader accessibility
- [ ] Custom board sizes (4x4, 5x5)

---

## 📚 Code Examples

### Creating a Game

```typescript
const { board, status, winner, currentPlayer, handleSquarePress, resetGame } = useGameState();
```

### Making a Move

```typescript
// User taps square at index 4 (center)
handleSquarePress(4);

// Internally:
// 1. Validates move is legal
// 2. Places X or O on board
// 3. Checks for winner
// 4. Updates game status
// 5. Switches to next player
```

### Checking for Winner

```typescript
const winner = calculateWinner(board);
// Returns 'X', 'O', or null
```

### Testing Logic

```typescript
import { calculateWinner, makeMove, createInitialBoard } from '../gameLogic';

const board = createInitialBoard();
const newBoard = makeMove(board, 0, 'X');
expect(calculateWinner(newBoard)).toBeNull();
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Mobile app framework |
| **TypeScript** | Type-safe JavaScript |
| **Expo** | Development and deployment |
| **Jest** | Unit testing framework |
| **ts-jest** | TypeScript support for Jest |
| **React Hooks** | State management |
| **LinearGradient** | Background styling |

---

## 📝 Project Standards

### Code Style
- 2-space indentation
- PascalCase for components and types
- camelCase for functions and variables
- Meaningful variable names
- JSDoc comments for complex logic

### Naming Conventions
- Components: `GameBoard.tsx`, `ResetButton.tsx`
- Hooks: `useGameState.ts`
- Utilities: `gameLogic.ts`
- Tests: `*.test.ts`
- Types: Prefixed with capital letter

### File Organization
- One component per file
- Related logic grouped in utils/
- Tests in `__tests__` directory
- Imports organized by type

---

## 🐛 Troubleshooting

### Tests Not Running
```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### TypeScript Errors
```bash
# Check configuration
cat tsconfig.json

# Rebuild
npm run build
```

### App Not Starting
```bash
# Clear Expo cache
expo start --clear

# Reset Watchman (macOS)
watchman watch-del-all
```

---

## 📞 Support

For issues or questions:
1. Check the test file for usage examples
2. Review the component prop interfaces
3. Examine the data flow diagram
4. Check TypeScript types for available options

---

## 📄 License

This project is part of the Cheddr Assessment.

---

**Last Updated:** March 22, 2026
**Version:** 1.0.0