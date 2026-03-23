import React, { memo, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface SquareProps {
  value: string | null;
  index: number;
  onPress: (index: number) => void;
  boardSize: number;
}

const SquareComponent = ({ value, index, onPress, boardSize }: SquareProps) => {
  const squareSize = boardSize / 3;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = React.useCallback(() => {
    onPress(index);
  }, [onPress, index]);

  // Trigger animation when value changes
  useEffect(() => {
    if (value) {
      // Reset and play animation
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [value, scaleAnim, opacityAnim, rotateAnim]);

  // Interpolate rotation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      { rotate },
    ],
    opacity: opacityAnim,
  };

  return (
    <TouchableOpacity
      testID={`square-${index}`}
      style={[
        styles.square,
        { width: squareSize, height: squareSize },
        value === 'X' && styles.squareX,
        value === 'O' && styles.squareO,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.Text
        style={[
          styles.squareText,
          value === 'O' && styles.squareTextO,
          animatedStyle as TextStyle,
        ]}
      >
        {value}
      </Animated.Text>
    </TouchableOpacity>
  );
};

// Memoize Square component with custom comparison
// Only re-render if value, index, boardSize, or onPress reference changes
export const Square = memo(
  SquareComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.index === nextProps.index &&
      prevProps.boardSize === nextProps.boardSize &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

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