import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Square } from './Square';
import { Board } from '../utils/gameLogic';

interface GameBoardProps {
  board: Board;
  boardSize: number;
  onSquarePress: (index: number) => void;
}

const GameBoardComponent = ({
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

// Memoize GameBoard to prevent re-renders when parent updates
// Only re-render if board content, boardSize, or onSquarePress reference changes
export const GameBoard = memo(
  GameBoardComponent,
  (prevProps, nextProps) => {
    // Custom comparison: check if board array content is the same
    const boardsEqual = prevProps.board.every(
      (val, idx) => val === nextProps.board[idx]
    );
    return (
      boardsEqual &&
      prevProps.boardSize === nextProps.boardSize &&
      prevProps.onSquarePress === nextProps.onSquarePress
    );
  }
);

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
    backgroundColor: '#0a0e1a',
  },
  row: {
    flexDirection: 'row',
  },
});