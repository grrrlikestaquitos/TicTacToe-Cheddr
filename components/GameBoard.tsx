import React, { memo } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Square } from './Square';
import { Board } from '../utils/gameLogic';

interface GameBoardProps {
  board: Board;
  boardSize: number;
  onSquarePress: (index: number) => void;
  disabled?: boolean;
}

const GameBoardComponent = ({
  board,
  boardSize,
  onSquarePress,
  disabled = false,
}: GameBoardProps) => {
  return (
    <View style={styles.boardWrapper}>
      <View testID="game-board" style={[styles.board, disabled && styles.boardDisabled]}>
        {[0, 1, 2].map((rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {[0, 1, 2].map((colIndex) => {
              const index = rowIndex * 3 + colIndex;
              return (
                <Square
                  key={`square-${index}`}
                  value={board[index]}
                  index={index}
                  onPress={disabled ? () => {} : onSquarePress}
                  boardSize={boardSize}
                />
              );
            })}
          </View>
        ))}
      </View>
      {disabled && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00d4ff" />
        </View>
      )}
    </View>
  );
};

// Memoize GameBoard to prevent re-renders when parent updates
// Only re-render if board content, boardSize, onSquarePress, or disabled changes
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
      prevProps.onSquarePress === nextProps.onSquarePress &&
      prevProps.disabled === nextProps.disabled
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
    position: 'relative',
  },
  board: {
    marginBottom: 0,
    backgroundColor: '#0a0e1a',
  },
  boardDisabled: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 20, 40, 0.5)',
    borderRadius: 4,
  },
});