import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameStatus } from '../utils/gameLogic';
import { Difficulty } from '../utils/aiEngine';

interface GameStatusProps {
  status: GameStatus;
  winner: string | null;
  currentPlayer: string;
  gameMode?: 'pvp' | 'computer';
  difficulty?: Difficulty;
  isComputerThinking?: boolean;
}

const GameStatusComponent = ({
  status,
  winner,
  currentPlayer,
  gameMode,
  difficulty,
  isComputerThinking = false,
}: GameStatusProps) => {
  // Memoize status message calculation
  const statusMessage = useMemo(() => {
    if (isComputerThinking) {
      return 'Computer thinking...';
    }
    if (winner) {
      return `Player ${winner} wins! 🎉`;
    } else if (status === 'draw') {
      return "It's a draw! 🤝";
    } else {
      return `Current player: ${currentPlayer}`;
    }
  }, [status, winner, currentPlayer, isComputerThinking]);

  const modeText = useMemo(() => {
    if (gameMode === 'computer') {
      return `Computer (${difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Hard'})`;
    }
    return 'Two Players';
  }, [gameMode, difficulty]);

  return (
    <View testID="game-status" style={styles.statusContainer}>
      <Text style={styles.status}>{statusMessage}</Text>
      {gameMode && (
        <Text style={styles.modeText}>Mode: {modeText}</Text>
      )}
    </View>
  );
};

// Memoize GameStatusDisplay to prevent unnecessary re-renders
export const GameStatusDisplay = memo(GameStatusComponent);

const styles = StyleSheet.create({
  statusContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  status: {
    fontSize: 18,
    color: '#00d4ff',
    fontWeight: '700',
    textAlign: 'center',
  },
  modeText: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
});