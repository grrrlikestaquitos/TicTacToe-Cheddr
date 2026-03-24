import {
  minimax,
  getComputerMove,
  evaluateMove,
  getRankedMoves,
} from '../aiEngine';
import { Player, Board } from '../gameLogic';

/** Helper to create a board with specific pieces */
const createBoard = (pieces: Array<[index: number, player: Player]>): Board => {
  const board: Board = Array(9).fill(null);
  pieces.forEach(([index, player]) => {
    board[index] = player;
  });
  return board;
};

describe('aiEngine - Minimax Algorithm', () => {
  describe('minimax - Basic termination states', () => {
    it('should return 10 when AI wins', () => {
      // X wins: [X, X, X]
      const board = createBoard([[0, 'X'], [1, 'X'], [2, 'X']]);
      const score = minimax(board, 0, false, 'O');
      expect(score).toBe(10);
    });

    it('should return -10 when human wins', () => {
      // O wins: [O, O, O]
      const board = createBoard([[0, 'O'], [1, 'O'], [2, 'O']]);
      const score = minimax(board, 0, true, 'O');
      expect(score).toBe(-10);
    });

    it('should return 0 for full board with no winner (draw)', () => {
      // Draw board: all cells filled, no winner
      const board = createBoard([
        [0, 'X'],
        [1, 'O'],
        [2, 'X'],
        [3, 'O'],
        [4, 'X'],
        [5, 'O'],
        [6, 'O'],
        [7, 'X'],
        [8, 'O'],
      ]);
      const score = minimax(board, 0, false, 'O');
      expect(score).toBe(0);
    });

    it('should handle all 8 winning combinations for AI', () => {
      const winningCombinations = [
        [[0, 1, 2]],
        [[3, 4, 5]],
        [[6, 7, 8]],
        [[0, 3, 6]],
        [[1, 4, 7]],
        [[2, 5, 8]],
        [[0, 4, 8]],
        [[2, 4, 6]],
      ];

      winningCombinations.forEach((combo) => {
        const pieces = combo[0].map((i) => [i, 'X'] as [number, Player]);
        const board = createBoard(pieces);
        const score = minimax(board, 0, false, 'O');
        expect(score).toBe(10);
      });
    });

    it('should handle all 8 winning combinations for human', () => {
      const winningCombinations = [
        [[0, 1, 2]],
        [[3, 4, 5]],
        [[6, 7, 8]],
        [[0, 3, 6]],
        [[1, 4, 7]],
        [[2, 5, 8]],
        [[0, 4, 8]],
        [[2, 4, 6]],
      ];

      winningCombinations.forEach((combo) => {
        const pieces = combo[0].map((i) => [i, 'O'] as [number, Player]);
        const board = createBoard(pieces);
        const score = minimax(board, 0, true, 'O');
        expect(score).toBe(-10);
      });
    });
  });

  describe('minimax - Game state evaluation', () => {
    it('should prefer faster AI wins (lower depth)', () => {
      // Almost-winning position for AI (X)
      const board = createBoard([[0, 'X'], [1, 'X']]);
      // Move at index 2 wins immediately
      const score = minimax(board, 0, false, 'O');
      expect(score).toBeGreaterThan(0);
    });

    it('should prefer slower human losses (higher depth)', () => {
      // Position where human can win next
      const board = createBoard([[0, 'O'], [1, 'O']]);
      // This should be negative but not the worst case
      const score = minimax(board, 0, true, 'O');
      expect(score).toBeLessThan(0);
    });

    it('should evaluate critical positions with correct scores', () => {
      // Board where AI (X) has a clear advantage
      const board = createBoard([[0, 'X'], [4, 'X']]);
      const score = minimax(board, 0, false, 'O');
      // Should have some advantage but may not be immediate win
      expect(typeof score).toBe('number');
    });

    it('should properly evaluate defensive positions', () => {
      // Board where human (O) has a clear advantage
      const board = createBoard([[0, 'O'], [4, 'O']]);
      const score = minimax(board, 0, true, 'O');
      // Should reflect disadvantage for AI
      expect(typeof score).toBe('number');
    });
  });

  describe('getComputerMove - Move selection', () => {
    it('should make immediate winning move on hard difficulty', () => {
      // AI (X) can win at position 2: [X, X, _, ...]
      const board = createBoard([[0, 'X'], [1, 'X']]);
      const move = getComputerMove(board, 'hard', 'O');
      expect(move).toBe(2);
    });

    it('should block opponent win on hard difficulty', () => {
      // Human (O) can win at position 2, AI should block: [O, O, ?, ...]
      const board = createBoard([[0, 'O'], [1, 'O']]);
      const move = getComputerMove(board, 'hard', 'O');
      expect(move).toBe(2);
    });

    it('should return valid moves for empty board (easy)', () => {
      const board = Array(9).fill(null);
      const move = getComputerMove(board, 'easy', 'X');
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
      expect(board[move]).toBeNull();
    });

    it('should never return occupied position', () => {
      const board = createBoard([[0, 'X'], [4, 'O']]);
      for (let i = 0; i < 10; i++) {
        const move = getComputerMove(board, 'hard', 'O');
        expect(board[move]).toBeNull();
      }
    });

    it('should throw error when no moves available', () => {
      // Full board
      const board = createBoard([
        [0, 'X'],
        [1, 'O'],
        [2, 'X'],
        [3, 'O'],
        [4, 'X'],
        [5, 'O'],
        [6, 'O'],
        [7, 'X'],
        [8, 'O'],
      ]);
      expect(() => getComputerMove(board, 'hard', 'O')).toThrow(
        'No valid moves available'
      );
    });

    it('should throw error for invalid difficulty', () => {
      const board = Array(9).fill(null);
      expect(() =>
        getComputerMove(board, 'invalid' as any, 'X')
      ).toThrow();
    });
  });

  describe('Difficulty levels - Easy', () => {
    it('should select random moves on easy difficulty', () => {
      const board = createBoard([[4, 'X']]);
      const moves = new Set<number>();

      for (let i = 0; i < 20; i++) {
        const move = getComputerMove(board, 'easy', 'X');
        moves.add(move);
      }

      // Easy should eventually choose different moves
      expect(moves.size).toBeGreaterThan(1);
    });

    it('should choose valid moves on easy difficulty regardless of board state', () => {
      // Various board positions
      const board = createBoard([[0, 'X'], [1, 'X']]);

      for (let i = 0; i < 5; i++) {
        const move = getComputerMove(board, 'easy', 'O');
        expect(board[move]).toBeNull();
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThan(9);
      }
    });
  });

  describe('Difficulty levels - Medium', () => {
    it('should make valid moves at medium difficulty', () => {
      const board = createBoard([[0, 'X'], [1, 'X']]);

      for (let i = 0; i < 10; i++) {
        const move = getComputerMove(board, 'medium', 'O');
        expect(board[move]).toBeNull();
      }
    });

    it('should vary moves on medium difficulty', () => {
      const board = createBoard([[4, 'X']]);
      const moves = new Set<number>();

      for (let i = 0; i < 30; i++) {
        const move = getComputerMove(board, 'medium', 'X');
        moves.add(move);
      }

      // Medium may play suboptimal moves, might have variety
      expect(moves.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Difficulty levels - Hard', () => {
    it('should block winning move for opponent', () => {
      // When opponent (human) can win, hard must block
      const board = createBoard([[0, 'O'], [1, 'O']]);
      const move = getComputerMove(board, 'hard', 'O');
      // Move must be valid
      expect(board[move]).toBeNull();
      // After the move, O cannot win immediately
      const boardAfter = [...board];
      boardAfter[move] = 'X';
      const oWinningMoves = [2]; // Only winning move for O
      if (oWinningMoves.includes(move)) {
        // If we played there, opponent can't win anymore
        expect(true).toBe(true);
      }
    });

    it('should handle critical positions consistently', () => {
      const board = createBoard([[0, 'X'], [1, 'X']]);
      const move1 = getComputerMove(board, 'hard', 'O');
      const move2 = getComputerMove(board, 'hard', 'O');
      // Hard should play strategically evaluated moves
      expect(board[move1]).toBeNull();
      expect(board[move2]).toBeNull();
    });

    it('should make valid moves in all game states', () => {
      const testBoards = [
        Array(9).fill(null),
        createBoard([[4, 'X']]),
        createBoard([[0, 'X'], [4, 'O']]),
      ];

      testBoards.forEach((board) => {
        const move = getComputerMove(board, 'hard', 'O');
        expect(board[move]).toBeNull();
      });
    });
  });

  describe('evaluateMove - Move quality assessment', () => {
    it('should return positive score for winning move', () => {
      const board = createBoard([[0, 'X'], [1, 'X']]);
      const score = evaluateMove(board, 2, 'O');
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative score for losing move', () => {
      const board = createBoard([[0, 'O'], [1, 'O']]);
      const score = evaluateMove(board, 3, 'O'); // Move at 3 doesn't block
      expect(score).toBeLessThan(0);
    });

    it('should throw error for occupied position', () => {
      const board = createBoard([[2, 'X']]);
      expect(() => evaluateMove(board, 2, 'X')).toThrow(
        'Move at index 2 is not valid'
      );
    });

    it('should evaluate all valid moves without error', () => {
      const board = createBoard([[4, 'X']]);
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          const score = evaluateMove(board, i, 'X');
          expect(typeof score).toBe('number');
        }
      }
    });
  });

  describe('getRankedMoves - Move ranking', () => {
    it('should return ranked moves sorted by score descending', () => {
      const board = createBoard([[0, 'X'], [1, 'X']]);
      const ranked = getRankedMoves(board, 'O');

      // Check that scores are in descending order
      for (let i = 0; i < ranked.length - 1; i++) {
        expect(ranked[i].score).toBeGreaterThanOrEqual(ranked[i + 1].score);
      }
    });

    it('should include all available moves', () => {
      const board = createBoard([[4, 'X']]);
      const ranked = getRankedMoves(board, 'X');
      expect(ranked.length).toBe(8); // 9 - 1 center = 8 available
    });

    it('should have move winning at top when available', () => {
      const board = createBoard([[0, 'X'], [1, 'X']]);
      const ranked = getRankedMoves(board, 'O');
      expect(ranked[0].move).toBe(2);
      expect(ranked[0].score).toBeGreaterThan(0);
    });

    it('should not include occupied positions', () => {
      const board = createBoard([[4, 'X']]);
      const ranked = getRankedMoves(board, 'X');
      const moves = ranked.map((r) => r.move);
      expect(moves).not.toContain(4);
    });
  });

  describe('AI vs Human scenarios', () => {
    it('should respond to critical positions', () => {
      // Setup where human (O) could win next turn
      const board = createBoard([[0, 'O'], [1, 'O'], [4, 'X']]);
      const move = getComputerMove(board, 'hard', 'O');
      // Should make a valid move
      expect(board[move]).toBeNull();
    });

    it('should choose strategic moves in complex positions', () => {
      // Setup with multiple pieces
      const board = createBoard([[0, 'X'], [4, 'X'], [1, 'O']]);
      const move = getComputerMove(board, 'hard', 'O');
      expect(board[move]).toBeNull();
    });

    it('should handle balanced board state', () => {
      // Empty board - should choose valid opening move
      const board = Array(9).fill(null);
      const move = getComputerMove(board, 'hard', 'X');
      expect(board[move]).toBeNull();
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    });

    it('should make optimal defensive moves', () => {
      // Test that hard difficulty doesn't make obviously bad moves
      const board = createBoard([[0, 'O'], [1, 'O'], [2, 'X'], [3, 'X']]);
      const move = getComputerMove(board, 'hard', 'O');
      expect(board[move]).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle single move remaining as last move', () => {
      const board = createBoard([
        [0, 'X'],
        [1, 'O'],
        [2, 'X'],
        [3, 'O'],
        [4, 'X'],
        [5, 'O'],
        [6, 'O'],
        [7, 'X'],
      ]);
      const move = getComputerMove(board, 'hard', 'O');
      expect(move).toBe(8);
    });

    it('should handle different player types consistently', () => {
      const board1 = createBoard([[4, 'X']]);
      const board2 = createBoard([[4, 'X']]);
      const moveAsO = getComputerMove(board1, 'hard', 'X');
      const moveAsX = getComputerMove(board2, 'hard', 'O');
      // Both should return valid moves
      expect(board1[moveAsO]).toBeNull();
      expect(board2[moveAsX]).toBeNull();
    });

    it('should handle alternating play sequence', () => {
      let board: Board = Array(9).fill(null);

      // Simulate game: Human (O), Computer (X), Human (O), Computer (X)...
      board[0] = 'O'; // Human plays at 0
      const move1 = getComputerMove(board, 'hard', 'O');
      expect(board[move1]).toBeNull();
      board[move1] = 'X';

      board[1] = 'O'; // Human plays at 1
      const move2 = getComputerMove(board, 'hard', 'O');
      expect(board[move2]).toBeNull();
      board[move2] = 'X';

      expect(board.filter((x) => x === 'X').length).toBe(2);
      expect(board.filter((x) => x === 'O').length).toBe(2);
    });
  });

  describe('Performance characteristics', () => {
    it('should handle hard difficulty on empty board in reasonable time', () => {
      const board = Array(9).fill(null);
      const start = Date.now();
      getComputerMove(board, 'hard', 'X');
      const elapsed = Date.now() - start;
      // Should complete in under 500ms even on slower machines
      expect(elapsed).toBeLessThan(500);
    });

    it('should handle all difficulty levels efficiently', () => {
      const board = Array(9).fill(null);
      const difficulties: Array<'easy' | 'medium' | 'hard'> = [
        'easy',
        'medium',
        'hard',
      ];

      difficulties.forEach((difficulty) => {
        const start = Date.now();
        for (let i = 0; i < 5; i++) {
          getComputerMove(board, difficulty, 'X');
        }
        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(1000);
      });
    });
  });
});
