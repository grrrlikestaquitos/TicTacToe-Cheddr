import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SquareProps {
  value: string | null;
  index: number;
  onPress: (index: number) => void;
  boardSize: number;
}

export const Square = ({ value, index, onPress, boardSize }: SquareProps) => {
  const squareSize = boardSize / 3;

  return (
    <TouchableOpacity
      style={[
        styles.square,
        { width: squareSize, height: squareSize },
        value === 'X' && styles.squareX,
        value === 'O' && styles.squareO,
      ]}
      onPress={() => onPress(index)}
      activeOpacity={0.7}
    >
      <Text style={[styles.squareText, value === 'O' && styles.squareTextO]}>
        {value}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
  },
  squareX: {
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
  squareO: {
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  squareText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#00d4ff',
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  squareTextO: {
    color: '#ff6b6b',
    textShadowColor: '#ff6b6b',
  },
});