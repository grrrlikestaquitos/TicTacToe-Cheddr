import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameMode, ComputerDifficulty } from '../hooks/useGameState';

export interface GameModeSelectorProps {
  onStartGame: (mode: GameMode, humanPlayer?: 'X' | 'O', difficulty?: ComputerDifficulty) => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  onStartGame,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<'X' | 'O' | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ComputerDifficulty | null>(null);

  // Get safe area insets for notch support
  const insets = useSafeAreaInsets();

  /**
   * Start PvP game (no difficulty selection needed)
   */
  const handlePvPStart = useCallback(() => {
    onStartGame('pvp');
  }, [onStartGame]);

  /**
   * Handle computer mode selection - show player/difficulty options
   */
  const handleComputerModeSelect = useCallback(() => {
    setSelectedMode('computer');
  }, []);

  /**
   * Back to main menu
   */
  const handleBack = useCallback(() => {
    setSelectedMode(null);
    setSelectedPlayer(null);
    setSelectedDifficulty(null);
  }, []);

  /**
   * Confirm player selection - proceed to difficulty
   */
  const handlePlayerSelect = useCallback((player: 'X' | 'O') => {
    setSelectedPlayer(player);
  }, []);

  /**
   * Start computer game with selected options
   */
  const handleDifficultySelect = useCallback(
    (difficulty: ComputerDifficulty) => {
      if (selectedPlayer) {
        onStartGame('computer', selectedPlayer, difficulty);
      }
    },
    [selectedPlayer, onStartGame]
  );

  return (
    <LinearGradient
      colors={['#0f0f1e', '#1a0a2e', '#16213e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Menu - Choose PvP or Computer */}
        {selectedMode === null && (
          <View style={styles.menuScreen}>
            <Text style={styles.title}>Tic-Tac-Toe</Text>
            <Text style={styles.subtitle}>Choose Game Mode</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.pvpButton]}
                onPress={handlePvPStart}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>👥 Player vs Player</Text>
                <Text style={styles.buttonSubtext}>Challenge a friend</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.computerButton]}
                onPress={handleComputerModeSelect}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>🤖 vs Computer</Text>
                <Text style={styles.buttonSubtext}>Test your skills</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Computer Mode - Choose Player Symbol */}
        {selectedMode === 'computer' && selectedPlayer === null && (
          <View style={styles.menuScreen}>
            <Text style={styles.title}>Choose Your Symbol</Text>
            <Text style={styles.subtitle}>Who goes first?</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.playerXButton]}
                onPress={() => handlePlayerSelect('X')}
                activeOpacity={0.7}
              >
                <Text style={styles.symbolText}>X</Text>
                <Text style={styles.buttonSubtext}>You go first</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.playerOButton]}
                onPress={() => handlePlayerSelect('O')}
                activeOpacity={0.7}
              >
                <Text style={styles.symbolText}>O</Text>
                <Text style={styles.buttonSubtext}>Computer goes first</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Computer Mode - Choose Difficulty */}
        {selectedMode === 'computer' && selectedPlayer !== null && (
          <View style={styles.menuScreen}>
            <Text style={styles.title}>Difficulty Level</Text>
            <Text style={styles.subtitle}>Playing as: {selectedPlayer}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.easyButton]}
                onPress={() => handleDifficultySelect('easy')}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>🎮 Easy</Text>
                <Text style={styles.buttonSubtext}>Random moves</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.mediumButton]}
                onPress={() => handleDifficultySelect('medium')}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>⚡ Medium</Text>
                <Text style={styles.buttonSubtext}>Smart play (90% of the time)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.hardButton]}
                onPress={() => handleDifficultySelect('hard')}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>🏆 Hard</Text>
                <Text style={styles.buttonSubtext}>Unbeatable AI</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Back button positioned at top level for proper placement */}
      {(selectedMode === 'computer' && selectedPlayer === null) ||
       (selectedMode === 'computer' && selectedPlayer !== null) ? (
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              top: insets.top + 12,
              left: insets.left + 12,
            },
          ]}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      ) : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  menuScreen: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00d4ff',
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a8a8c8',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: '100%',
    maxWidth: 280,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  pvpButton: {
    backgroundColor: '#6c5ce7',
    borderWidth: 2,
    borderColor: '#a29bfe',
  },
  computerButton: {
    backgroundColor: '#00b894',
    borderWidth: 2,
    borderColor: '#55efc4',
  },
  playerXButton: {
    backgroundColor: '#d63031',
    borderWidth: 2,
    borderColor: '#ff7675',
  },
  playerOButton: {
    backgroundColor: '#0984e3',
    borderWidth: 2,
    borderColor: '#74b9ff',
  },
  easyButton: {
    backgroundColor: '#fdcb6e',
    borderWidth: 2,
    borderColor: '#ffe66d',
  },
  mediumButton: {
    backgroundColor: '#fd79a8',
    borderWidth: 2,
    borderColor: '#ff6b9d',
  },
  hardButton: {
    backgroundColor: '#e84393',
    borderWidth: 2,
    borderColor: '#ff6b9d',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  symbolText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  buttonSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.3,
  },
});
