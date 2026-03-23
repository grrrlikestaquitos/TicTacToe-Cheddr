import {
  calculateWinner,
  isBoardFull,
  isValidMove,
  makeMove,
  determineGameStatus,
  getNextPlayer,
  createInitialBoard,
  Board,
} from '../gameLogic';

describe('gameLogic', () => {
  describe('createInitialBoard', () => {
    it('should create a board with 9 null values', () => {
      const board = createInitialBoard();
      expect(board).toHaveLength(9);
      expect(board.every((square) => square === null)).toBe(true);
    });

    it('should return a new array each time', () => {
      const board1 = createInitialBoard();
      const board2 = createInitialBoard();
      expect(board1).not.toBe(board2);
      expect(board1).toEqual(board2);
    });
  });

  describe('calculateWinner', () => {
    it('should return null for an empty board', () => {
      const board = createInitialBoard();
      expect(calculateWinner(board)).toBeNull();
    });

    it('should detect a winner on the first row', () => {
      const board: Board = ['X', 'X', 'X', null, null, null, null, null, null];
      expect(calculateWinner(board)).toBe('X');
    });

    it('should detect a winner on the second row', () => {
      const board: Board = [null, null, null, 'O', 'O', 'O', null, null, null];
      expect(calculateWinner(board)).toBe('O');
    });

    it('should detect a winner on the third row', () => {
      const board: Board = [null, null, null, null, null, null, 'X', 'X', 'X'];
      expect(calculateWinner(board)).toBe('X');
    });

    it('should detect a winner on the first column', () => {
      const board: Board = ['X', null, null, 'X', null, null, 'X', null, null];
      expect(calculateWinner(board)).toBe('X');
    });

    it('should detect a winner on the second column', () => {
      const board: Board = [null, 'O', null, null, 'O', null, null, 'O', null];
      expect(calculateWinner(board)).toBe('O');
    });

    it('should detect a winner on the third column', () => {
      const board: Board = [null, null, 'X', null, null, 'X', null, null, 'X'];
      expect(calculateWinner(board)).toBe('X');
    });

    it('should detect a winner on the diagonal (top-left to bottom-right)', () => {
      const board: Board = ['X', null, null, null, 'X', null, null, null, 'X'];
      expect(calculateWinner(board)).toBe('X');
    });

    it('should detect a winner on the diagonal (top-right to bottom-left)', () => {
      const board: Board = [null, null, 'O', null, 'O', null, 'O', null, null];
      expect(calculateWinner(board)).toBe('O');
    });

    it('should return null for a partially filled board with no winner', () => {
      const board: Board = ['X', 'O', null, 'X', 'O', null, null, null, null];
      expect(calculateWinner(board)).toBeNull();
    });

    it('should return the first winner found (not check further)', () => {
      const board: Board = ['X', 'X', 'X', 'O', 'O', 'O', null, null, null];
      expect(calculateWinner(board)).toBe('X');
    });
  });

  describe('isBoardFull', () => {
    it('should return false for an empty board', () => {
      const board = createInitialBoard();
      expect(isBoardFull(board)).toBe(false);
    });

    it('should return false for a partially filled board', () => {
      const board: Board = ['X', 'O', 'X', null, 'O', null, null, null, null];
      expect(isBoardFull(board)).toBe(false);
    });

    it('should return true for a completely filled board', () => {
      const board: Board = [
        'X', 'O', 'X',
        'O', 'X', 'O',
        'O', 'X', 'X',
      ];
      expect(isBoardFull(board)).toBe(true);
    });

    it('should return true for a full board with a winner', () => {
      const board: Board = [
        'X', 'X', 'X',
        'O', 'O', 'O',
        'O', 'X', 'X',
      ];
      expect(isBoardFull(board)).toBe(true);
    });
  });

  describe('isValidMove', () => {
    const emptyBoard = createInitialBoard();

    it('should return true for a valid move on an empty square during playing status', () => {
      expect(isValidMove(emptyBoard, 0, null, 'playing')).toBe(true);
    });

    it('should return false for a move on an occupied square', () => {
      const board: Board = ['X', null, null, null, null, null, null, null, null];
      expect(isValidMove(board, 0, null, 'playing')).toBe(false);
    });

    it('should return false for a move when there is a winner', () => {
      const board: Board = ['X', 'X', 'X', null, null, null, null, null, null];
      expect(isValidMove(board, 3, 'X', 'playing')).toBe(false);
    });

    it('should return false for a move when game status is draw', () => {
      expect(isValidMove(emptyBoard, 0, null, 'draw')).toBe(false);
    });

    it('should return false for a move when game status is win', () => {
      expect(isValidMove(emptyBoard, 0, null, 'win')).toBe(false);
    });

    it('should return false for multiple failing conditions', () => {
      const board: Board = ['X', null, null, null, null, null, null, null, null];
      expect(isValidMove(board, 0, 'X', 'win')).toBe(false);
    });

    it('should return true for any valid empty square during playing status', () => {
      const validIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      validIndices.forEach((index) => {
        expect(isValidMove(emptyBoard, index, null, 'playing')).toBe(true);
      });
    });
  });

  describe('makeMove', () => {
    it('should place X on the specified square', () => {
      const board = createInitialBoard();
      const newBoard = makeMove(board, 4, 'X');
      expect(newBoard[4]).toBe('X');
    });

    it('should place O on the specified square', () => {
      const board = createInitialBoard();
      const newBoard = makeMove(board, 0, 'O');
      expect(newBoard[0]).toBe('O');
    });

    it('should not mutate the original board', () => {
      const board = createInitialBoard();
      const newBoard = makeMove(board, 0, 'X');
      expect(board[0]).toBeNull();
      expect(newBoard[0]).toBe('X');
    });

    it('should preserve other squares', () => {
      const board: Board = ['X', null, null, null, 'O', null, null, null, null];
      const newBoard = makeMove(board, 8, 'X');
      expect(newBoard[0]).toBe('X');
      expect(newBoard[4]).toBe('O');
      expect(newBoard[8]).toBe('X');
    });

    it('should work with any valid index', () => {
      const board = createInitialBoard();
      for (let i = 0; i < 9; i++) {
        const newBoard = makeMove(board, i, 'X');
        expect(newBoard[i]).toBe('X');
      }
    });
  });

  describe('determineGameStatus', () => {
    it('should return win when there is a winner', () => {
      const board: Board = ['X', 'X', 'X', null, null, null, null, null, null];
      const status = determineGameStatus(board, 'X');
      expect(status).toBe('win');
    });

    it('should return draw when board is full and no winner', () => {
      const board: Board = [
        'X', 'O', 'X',
        'O', 'X', 'O',
        'O', 'X', 'X',
      ];
      const status = determineGameStatus(board, null);
      expect(status).toBe('draw');
    });

    it('should return playing when board has empty squares and no winner', () => {
      const board: Board = ['X', 'O', null, null, null, null, null, null, null];
      const status = determineGameStatus(board, null);
      expect(status).toBe('playing');
    });

    it('should return playing for an empty board', () => {
      const board = createInitialBoard();
      const status = determineGameStatus(board, null);
      expect(status).toBe('playing');
    });

    it('should prioritize win status over draw status', () => {
      const board: Board = [
        'X', 'X', 'X',
        'O', 'O', 'O',
        'X', 'O', 'X',
      ];
      const status = determineGameStatus(board, 'X');
      expect(status).toBe('win');
    });
  });

  describe('getNextPlayer', () => {
    it('should return X when isXNext is true', () => {
      expect(getNextPlayer(true)).toBe('X');
    });

    it('should return O when isXNext is false', () => {
      expect(getNextPlayer(false)).toBe('O');
    });

    it('should always return a valid player', () => {
      const players = ['X', 'O'];
      expect(players).toContain(getNextPlayer(true));
      expect(players).toContain(getNextPlayer(false));
    });
  });

  describe('Game Flow Integration', () => {
    it('should handle a complete game flow: X wins', () => {
      let board = createInitialBoard();
      let isXNext = true;

      // X plays at 0
      board = makeMove(board, 0, getNextPlayer(isXNext));
      expect(calculateWinner(board)).toBeNull();
      isXNext = !isXNext;

      // O plays at 3
      board = makeMove(board, 3, getNextPlayer(isXNext));
      expect(calculateWinner(board)).toBeNull();
      isXNext = !isXNext;

      // X plays at 1
      board = makeMove(board, 1, getNextPlayer(isXNext));
      expect(calculateWinner(board)).toBeNull();
      isXNext = !isXNext;

      // O plays at 4
      board = makeMove(board, 4, getNextPlayer(isXNext));
      expect(calculateWinner(board)).toBeNull();
      isXNext = !isXNext;

      // X plays at 2 (X wins with top row)
      board = makeMove(board, 2, getNextPlayer(isXNext));
      const winner = calculateWinner(board);
      expect(winner).toBe('X');
      expect(determineGameStatus(board, winner)).toBe('win');
    });

    it('should handle a game that results in a draw', () => {
      const board: Board = [
        'X', 'O', 'X',
        'X', 'O', 'X',
        'O', 'X', 'O',
      ];
      expect(calculateWinner(board)).toBeNull();
      expect(isBoardFull(board)).toBe(true);
      expect(determineGameStatus(board, null)).toBe('draw');
    });
  });
});