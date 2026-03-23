import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useGameState } from './hooks/useGameState';
import { GameBoard } from './components/GameBoard';
import { GameStatusDisplay } from './components/GameStatus';
import { ResetButton } from './components/ResetButton';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 350);

function GameContent() {
  const { board, status, winner, currentPlayer, handleSquarePress, resetGame } =
    useGameState();

  // Memoize board size calculation to prevent recalculation
  const boardSize = useMemo(() => BOARD_SIZE, []);

  return (
    <LinearGradient
      colors={['#0f0f1e', '#1a0a2e', '#16213e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Tic-Tac-Toe</Text>

        <GameStatusDisplay
          status={status}
          winner={winner}
          currentPlayer={currentPlayer}
        />

        <GameBoard
          board={board}
          boardSize={boardSize}
          onSquarePress={handleSquarePress}
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
});
