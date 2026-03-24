import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ExitButtonProps {
  onPress: () => void;
}

const ExitButtonComponent = ({ onPress }: ExitButtonProps) => {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      testID="exit-button"
      style={styles.exitButton}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['#ff6b6b', '#cc3333']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.exitButtonGradient}
      >
        <Text style={styles.exitButtonText}>Exit Game</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Memoize ExitButton to prevent unnecessary re-renders
export const ExitButton = memo(ExitButtonComponent);

const styles = StyleSheet.create({
  exitButton: {
    width: 200,
    height: 54,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  exitButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
