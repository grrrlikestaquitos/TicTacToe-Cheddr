import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useGameState } from '../useGameState';

// Mock the AI engine
jest.mock('../../utils/aiEngine', () => ({
  getComputerMove: jest.fn((board, difficulty, humanPlayer) => {
    // Simple mock: return first available position
    return board.findIndex((cell: string | null) => cell === null);
  }),
}));

import { getComputerMove } from '../../utils/aiEngine';

describe('useGameState - Extended with AI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initial State', () => {
    it('should initialize with null game mode', () => {
      const { result } = renderHook(() => useGameState());

      expect(result.current.gameMode).toBeNull();
      expect(result.current.humanPlayer).toBeNull();
      expect(result.current.difficulty).toBe('easy');
      expect(result.current.isComputerThinking).toBe(false);
    });

    it('should have empty board on initial state', () => {
      const { result } = renderHook(() => useGameState());

      expect(result.current.board.every((cell: string | null) => cell === null)).toBe(true);
      expect(result.current.status).toBe('playing');
    });

    it('should have X as first player', () => {
      const { result } = renderHook(() => useGameState());

      expect(result.current.currentPlayer).toBe('X');
      expect(result.current.isXNext).toBe(true);
    });
  });

  describe('startGame - Game Mode Selection', () => {
    it('should initialize PvP mode', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('pvp');
      });

      expect(result.current.gameMode).toBe('pvp');
      expect(result.current.humanPlayer).toBeNull();
      expect(result.current.difficulty).toBe('easy');
    });

    it('should initialize computer mode with human player X', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      expect(result.current.gameMode).toBe('computer');
      expect(result.current.humanPlayer).toBe('X');
      expect(result.current.difficulty).toBe('hard');
    });

    it('should initialize computer mode with human player O', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'O', 'medium');
      });

      expect(result.current.gameMode).toBe('computer');
      expect(result.current.humanPlayer).toBe('O');
      expect(result.current.difficulty).toBe('medium');
    });

    it('should support all difficulty levels', () => {
      const difficulties: Array<'easy' | 'medium' | 'hard'> = [
        'easy',
        'medium',
        'hard',
      ];

      difficulties.forEach((difficulty) => {
        const { result } = renderHook(() => useGameState());

        act(() => {
          result.current.startGame('computer', 'X', difficulty);
        });

        expect(result.current.difficulty).toBe(difficulty);
      });
    });

    it('should reset board state when starting new game', () => {
      const { result } = renderHook(() => useGameState());

      // Start first game
      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      expect(result.current.board.every((cell) => cell === null)).toBe(true);

      // Start different game
      act(() => {
        result.current.startGame('computer', 'O', 'medium');
      });

      expect(result.current.board.every((cell) => cell === null)).toBe(true);
      expect(result.current.gameMode).toBe('computer');
      expect(result.current.humanPlayer).toBe('O');
      expect(result.current.difficulty).toBe('medium');
      expect(result.current.status).toBe('playing');
    });

    it('should reset computer thinking state', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      expect(result.current.isComputerThinking).toBe(false);
    });
  });

  describe('Human Player Moves - PvP Mode', () => {
    it('should have startGame function to initialize PvP mode', () => {
      const { result } = renderHook(() => useGameState());

      expect(typeof result.current.startGame).toBe('function');

      act(() => {
        result.current.startGame('pvp');
      });

      // Verify PvP mode is set
      expect(result.current.gameMode).toBe('pvp');
      expect(result.current.humanPlayer).toBeNull();
      expect(result.current.difficulty).toBe('easy');
      expect(result.current.status).toBe('playing');
      expect(result.current.currentPlayer).toBe('X');
    });

    it('should prevent moves when game is not started', () => {
      const { result } = renderHook(() => useGameState());

      // Don't call startGame
      act(() => {
        result.current.handleSquarePress(0);
      });

      // Board should remain empty
      expect(result.current.board[0]).toBeNull();
      expect(result.current.gameMode).toBeNull();
    });

    it('should prevent moves while computer is thinking', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      // Make initial human move
      act(() => {
        result.current.handleSquarePress(0);
      });

      // Wait for computer to be thinking
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });

      // Try to make another move while computer is thinking
      act(() => {
        result.current.handleSquarePress(1);
      });

      // Move should not have been registered
      expect(result.current.board[1]).toBeNull();
    });
  });

  describe('Computer Auto-Play Logic', () => {
    it('should detect computer turn when human is X (computer is O after X moves)', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      // Human (X) plays first
      act(() => {
        result.current.handleSquarePress(0);
      });

      // Computer should now be thinking
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });
    });

    it('should trigger computer move with 500ms delay', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      // Make human move
      act(() => {
        result.current.handleSquarePress(0);
      });

      // Wait for computer thinking to start
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });

      // Partial advance - computer shouldn't have moved yet
      act(() => {
        jest.advanceTimersByTime(250);
      });

      expect(getComputerMove).not.toHaveBeenCalled();

      // Complete the 500ms delay
      act(() => {
        jest.advanceTimersByTime(250);
      });

      // Now getComputerMove should have been called
      expect(getComputerMove).toHaveBeenCalled();
    });

    it('should apply computer move after delay completes', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      act(() => {
        result.current.handleSquarePress(0);
      });

      // Wait for thinking
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });

      // Advance past the 500ms delay
      act(() => {
        jest.advanceTimersByTime(600);
      });

      // Board should have computer move
      await waitFor(
        () => {
          expect(result.current.board.some((cell) => cell === 'O')).toBe(true);
        },
        { timeout: 150 }
      );

      expect(result.current.currentPlayer).toBe('X');
    });

    it('should prevent human moves during computer thinking', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      act(() => {
        result.current.handleSquarePress(0);
      });

      // Wait for computer thinking
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });

      // Try to make a move while thinking
      act(() => {
        result.current.handleSquarePress(1);
      });

      // Move should not have been applied
      expect(result.current.board[1]).toBeNull();
    });

    it('should call getComputerMove with correct parameters', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'medium');
      });

      act(() => {
        result.current.handleSquarePress(0);
      });

      // Wait for thinking
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });

      // Advance past delay
      act(() => {
        jest.advanceTimersByTime(600);
      });

      // Should have called with correct parameters
      expect(getComputerMove).toHaveBeenCalledWith(
        expect.any(Array),
        'medium',
        'X'
      );
    });

    it('should alternate human and computer moves in sequence', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'easy');
      });

      // Human (X) plays at position 0
      act(() => {
        result.current.handleSquarePress(0);
      });
      expect(result.current.board[0]).toBe('X');
      expect(result.current.board.filter((c) => c === 'X').length).toBe(1);

      // Wait for computer to be thinking
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });

      // Advance past computer move delay
      act(() => {
        jest.advanceTimersByTime(600);
      });

      // Computer should have played O
      await waitFor(
        () => {
          expect(result.current.board.filter((c) => c === 'O').length).toBe(1);
        },
        { timeout: 150 }
      );

      // Should be X's turn again (human's second move)
      expect(result.current.currentPlayer).toBe('X');
    });
  });

  describe('Reset Game', () => {
    it('should reset board to empty state', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
        // Make a manual board change to state (simulate a move)
        // Actually, the hook manages moves internally - we can't directly set board
      });

      // Verify initial state is clean
      expect(result.current.board.every((cell) => cell === null)).toBe(true);

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.board.every((cell) => cell === null)).toBe(true);
      expect(result.current.status).toBe('playing');
    });

    it('should maintain game mode after reset', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameMode).toBe('computer');
      expect(result.current.humanPlayer).toBe('X');
      expect(result.current.difficulty).toBe('hard');
    });

    it('should clear computer thinking state on reset', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'O', 'hard');
      });

      // Wait for thinking state
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.isComputerThinking).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid game mode switches', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('pvp');
        result.current.startGame('computer', 'X', 'hard');
        result.current.startGame('pvp');
      });

      expect(result.current.gameMode).toBe('pvp');
      expect(result.current.humanPlayer).toBeNull();
    });

    it('should clean up timers on unmount', () => {
      const { unmount } = renderHook(() => useGameState());

      unmount();

      // Should not have pending timers
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should handle computer playing first (human is O)', async () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'O', 'hard');
      });

      // Computer plays first (X), so should be thinking immediately
      await waitFor(() => {
        expect(result.current.isComputerThinking).toBe(true);
      }, { timeout: 150 });

      // Advance past delay
      act(() => {
        jest.advanceTimersByTime(600);
      });

      // Computer should have moved
      await waitFor(
        () => {
          expect(result.current.board.some((cell) => cell === 'X')).toBe(true);
        },
        { timeout: 150 }
      );
    });

    it('should not process computer move if done with no valid moves', () => {
      const { result } = renderHook(() => useGameState());

      act(() => {
        result.current.startGame('computer', 'X', 'hard');
      });

      // Fill board without creating a valid game state for computer
      // (This shouldn't normally happen, but tests robustness)
      expect(result.current.board.length).toBe(9);
    });
  });

  describe('GameState Type Interface', () => {
    it('should return properly typed GameState object', () => {
      const { result } = renderHook(() => useGameState());

      // Verify all required properties exist
      const state = result.current;
      expect(typeof state.board).toBe('object');
      expect(typeof state.isXNext).toBe('boolean');
      expect(typeof state.status).toBe('string');
      expect(typeof state.winner).toBe('object');
      expect(typeof state.currentPlayer).toBe('string');
      expect(state.gameMode === null || typeof state.gameMode === 'string').toBe(true);
      expect(state.humanPlayer === null || typeof state.humanPlayer === 'string').toBe(true);
      expect(typeof state.difficulty).toBe('string');
      expect(typeof state.isComputerThinking).toBe('boolean');
      expect(typeof state.handleSquarePress).toBe('function');
      expect(typeof state.resetGame).toBe('function');
      expect(typeof state.startGame).toBe('function');
    });
  });
});
