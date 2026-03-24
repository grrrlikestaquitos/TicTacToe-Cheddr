import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useGameState } from './hooks/useGameState';
import { GameBoard } from './components/GameBoard';
import { GameStatusDisplay } from './components/GameStatus';
import { ResetButton } from './components/ResetButton';
import { GameModeSelector } from './components/GameModeSelector';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 350);

function GameContent() {
  const {
    // Board state
    board,
    status,
    winner,
    currentPlayer,
    
    // Game mode state
    gameMode,
    humanPlayer,
    difficulty,
    isComputerThinking,
    
    // Callbacks
    handleSquarePress,
    resetGame,
    startGame,
  } = useGameState();

  // Memoize board size calculation
  const boardSize = useMemo(() => BOARD_SIZE, []);

  /**
   * Show game mode selector if game hasn't been started yet
   */
  if (gameMode === null) {
    return <GameModeSelector onStartGame={startGame} />;
  }

  /**
   * Show game board and controls after mode selection
   */
  return (
    <LinearGradient
      colors={['#0f0f1e', '#1a0a2e', '#16213e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Tic-Tac-Toe</Text>

        {/* Show difficulty and mode info for computer games */}
        {gameMode === 'computer' && (
          <View style={styles.modeInfo}>
            <Text style={styles.modeInfoText}>
              {humanPlayer} vs {humanPlayer === 'X' ? 'O' : 'X'} ({difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Hard'})
            </Text>
          </View>
        )}

        <GameStatusDisplay
          status={status}
          winner={winner}
          currentPlayer={currentPlayer}
          isComputerThinking={isComputerThinking}
          gameMode={gameMode}
          difficulty={difficulty}
        />

        <GameBoard
          board={board}
          boardSize={boardSize}
          onSquarePress={handleSquarePress}
          disabled={isComputerThinking}
        />

        <ResetButton onPress={resetGame} />
      </View>

      <StatusBar style="light" />
    </LinearGradient>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 2,
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  modeInfo: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  modeInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
    letterSpacing: 0.5,
  },
});
