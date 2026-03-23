import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Square } from './Square';
import { Board } from '../utils/gameLogic';

interface GameBoardProps {
  board: Board;
  boardSize: number;
  onSquarePress: (index: number) => void;
}

export const GameBoard = ({
  board,
  boardSize,
  onSquarePress,
}: GameBoardProps) => {
  return (
    <View style={styles.boardWrapper}>
      <View testID="game-board" style={styles.board}>
        {[0, 1, 2].map((rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {[0, 1, 2].map((colIndex) => {
              const index = rowIndex * 3 + colIndex;
              return (
                <Square
                  key={`square-${index}`}
                  value={board[index]}
                  index={index}
                  onPress={onSquarePress}
                  boardSize={boardSize}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardWrapper: {
    marginBottom: 50,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  board: {
    marginBottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0a0e1a',
  },
  row: {
    flexDirection: 'row',
  },
});