import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    exitGame,
    startGame,
  } = useGameState();

  // Get safe area insets for notch support
  const insets = useSafeAreaInsets();

  // Memoize board size calculation
  const boardSize = useMemo(() => BOARD_SIZE, []);

  /**
   * Handle exit with confirmation dialog
   */
  const handleExitWithConfirmation = () => {
    Alert.alert(
      'Exit Game',
      'Are you sure you want to leave? You will lose the current game.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: exitGame,
          style: 'destructive',
        },
      ]
    );
  };

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
      {/* Close button in top left with safe area support */}
      <TouchableOpacity
        style={[
          styles.closeButton,
          {
            top: insets.top + 12,
            left: insets.left + 12,
          },
        ]}
        onPress={handleExitWithConfirmation}
        activeOpacity={0.7}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Tic-Tac-Toe</Text>

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
    position: 'relative',
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
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#ff6b6b',
    lineHeight: 32,
  },
});
