import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ResetButtonProps {
  onPress: () => void;
}

export const ResetButton = ({ onPress }: ResetButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.resetButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['#00d4ff', '#0099cc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.resetButtonGradient}
      >
        <Text style={styles.resetButtonText}>New Game</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    width: 200,
    height: 54,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  resetButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f0f1e',
    letterSpacing: 1,
  },
});