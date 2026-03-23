import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameStatus } from '../utils/gameLogic';

interface GameStatusProps {
  status: GameStatus;
  winner: string | null;
  currentPlayer: string;
}

export const GameStatusDisplay = ({
  status,
  winner,
  currentPlayer,
}: GameStatusProps) => {
  const getStatusMessage = (): string => {
    if (winner) {
      return `Player ${winner} wins! 🎉`;
    } else if (status === 'draw') {
      return "It's a draw! 🤝";
    } else {
      return `Current player: ${currentPlayer}`;
    }
  };

  return (
    <View testID="game-status" style={styles.statusContainer}>
      <Text style={styles.status}>{getStatusMessage()}</Text>
    </View>
  );
};

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
});