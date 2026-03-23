import {
  validateBoard,
  validateIndex,
  validatePlayer,
  createInitialBoard,
  makeMove,
  isValidMove,
  calculateWinner,
  Board,
} from '../gameLogic';
import {
  InvalidBoardError,
  InvalidIndexError,
  InvalidPlayerError,
  InvalidMoveError,
  ErrorMessages,
} from '../errors';

describe('Input Validation', () => {
  describe('validateBoard', () => {
    it('should accept valid empty board', () => {
      const board = createInitialBoard();
      expect(() => validateBoard(board)).not.toThrow();
    });

    it('should accept valid board with X and O', () => {
      const board: Board = ['X', 'O', 'X', null, null, null, null, null, null];
      expect(() => validateBoard(board)).not.toThrow();
    });

    it('should throw error for null board', () => {
      expect(() => validateBoard(null)).toThrow(InvalidBoardError);
      expect(() => validateBoard(null)).toThrow(ErrorMessages.NULL_BOARD);
    });

    it('should throw error for undefined board', () => {
      expect(() => validateBoard(undefined)).toThrow(InvalidBoardError);
      expect(() => validateBoard(undefined)).toThrow(ErrorMessages.NULL_BOARD);
    });

    it('should throw error for non-array board', () => {
      expect(() => validateBoard('not an array')).toThrow(InvalidBoardError);
      expect(() => validateBoard({})).toThrow(InvalidBoardError);
      expect(() => validateBoard(123)).toThrow(InvalidBoardError);
    });

    it('should throw error for board with wrong length', () => {
      expect(() => validateBoard([])).toThrow(InvalidBoardError);
      expect(() => validateBoard(Array(8).fill(null))).toThrow(InvalidBoardError);
      expect(() => validateBoard(Array(10).fill(null))).toThrow(InvalidBoardError);
    });

    it('should throw error for board with invalid values', () => {
      const invalidBoard = [
        'X', 'O', 'X',
        'Z', null, null,
        null, null, null,
      ];
      expect(() => validateBoard(invalidBoard)).toThrow(InvalidBoardError);
    });

    it('should throw error for board with numbers', () => {
      const invalidBoard: any = [
        0, 1, 2, 3, 4, 5, 6, 7, 8,
      ];
      expect(() => validateBoard(invalidBoard)).toThrow(InvalidBoardError);
    });
  });

  describe('validateIndex', () => {
    it('should accept valid indices 0-8', () => {
      for (let i = 0; i < 9; i++) {
        expect(() => validateIndex(i)).not.toThrow();
      }
    });

    it('should throw error for null index', () => {
      expect(() => validateIndex(null)).toThrow(InvalidIndexError);
      expect(() => validateIndex(null)).toThrow(ErrorMessages.NULL_INDEX);
    });

    it('should throw error for undefined index', () => {
      expect(() => validateIndex(undefined)).toThrow(InvalidIndexError);
      expect(() => validateIndex(undefined)).toThrow(ErrorMessages.NULL_INDEX);
    });

    it('should throw error for negative index', () => {
      expect(() => validateIndex(-1)).toThrow(InvalidIndexError);
      expect(() => validateIndex(-5)).toThrow(InvalidIndexError);
      expect(() => validateIndex(-100)).toThrow(InvalidIndexError);
    });

    it('should throw error for index >= 9', () => {
      expect(() => validateIndex(9)).toThrow(InvalidIndexError);
      expect(() => validateIndex(10)).toThrow(InvalidIndexError);
      expect(() => validateIndex(100)).toThrow(InvalidIndexError);
    });

    it('should throw error for non-integer index', () => {
      expect(() => validateIndex(1.5)).toThrow(InvalidIndexError);
      expect(() => validateIndex(3.14)).toThrow(InvalidIndexError);
      expect(() => validateIndex('5')).toThrow(InvalidIndexError);
      expect(() => validateIndex(NaN)).toThrow(InvalidIndexError);
    });

    it('should throw error for fractional values', () => {
      expect(() => validateIndex(0.1)).toThrow(InvalidIndexError);
      expect(() => validateIndex(8.9)).toThrow(InvalidIndexError);
    });
  });

  describe('validatePlayer', () => {
    it('should accept X player', () => {
      expect(() => validatePlayer('X')).not.toThrow();
    });

    it('should accept O player', () => {
      expect(() => validatePlayer('O')).not.toThrow();
    });

    it('should throw error for invalid player', () => {
      expect(() => validatePlayer('x')).toThrow(InvalidPlayerError);
      expect(() => validatePlayer('o')).toThrow(InvalidPlayerError);
      expect(() => validatePlayer('Z')).toThrow(InvalidPlayerError);
      expect(() => validatePlayer('')).toThrow(InvalidPlayerError);
      expect(() => validatePlayer(null)).toThrow(InvalidPlayerError);
      expect(() => validatePlayer(undefined)).toThrow(InvalidPlayerError);
      expect(() => validatePlayer(123)).toThrow(InvalidPlayerError);
    });
  });
});

describe('makeMove - Error Handling', () => {
  it('should throw error when square is occupied', () => {
    const board: Board = ['X', null, null, null, null, null, null, null, null];
    expect(() => makeMove(board, 0, 'O')).toThrow(InvalidMoveError);
    expect(() => makeMove(board, 0, 'O')).toThrow(ErrorMessages.SQUARE_OCCUPIED);
  });

  it('should throw error with invalid board', () => {
    expect(() => makeMove(null as any, 0, 'X')).toThrow(InvalidBoardError);
    expect(() => makeMove([] as any, 0, 'X')).toThrow(InvalidBoardError);
  });

  it('should throw error with invalid index', () => {
    const board = createInitialBoard();
    expect(() => makeMove(board, -1, 'X')).toThrow(InvalidIndexError);
    expect(() => makeMove(board, 9, 'X')).toThrow(InvalidIndexError);
    expect(() => makeMove(board, 1.5, 'X')).toThrow(InvalidIndexError);
  });

  it('should throw error with invalid player', () => {
    const board = createInitialBoard();
    expect(() => makeMove(board, 0, 'Z' as any)).toThrow(InvalidPlayerError);
    expect(() => makeMove(board, 0, null as any)).toThrow(InvalidPlayerError);
  });

  it('should throw error with invalid board values', () => {
    const invalidBoard = ['X', 'O', 'Z', null, null, null, null, null, null] as any;
    expect(() => makeMove(invalidBoard, 3, 'X')).toThrow(InvalidBoardError);
  });

  it('should work correctly with valid inputs', () => {
    const board = createInitialBoard();
    const newBoard = makeMove(board, 4, 'X');
    expect(newBoard[4]).toBe('X');
    expect(board[4]).toBeNull(); // Original board unchanged
  });
});

describe('isValidMove - Edge Cases', () => {
  it('should return false for invalid board', () => {
    const result = isValidMove(null as any, 0, null, 'playing');
    expect(result).toBe(false);
  });

  it('should return false for invalid index', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, -1, null, 'playing')).toBe(false);
    expect(isValidMove(board, 9, null, 'playing')).toBe(false);
    expect(isValidMove(board, 1.5, null, 'playing')).toBe(false);
  });

  it('should return false for occupied square', () => {
    const board: Board = ['X', null, null, null, null, null, null, null, null];
    expect(isValidMove(board, 0, null, 'playing')).toBe(false);
  });

  it('should return false when game is won', () => {
    const board: Board = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(isValidMove(board, 3, 'X', 'playing')).toBe(false);
  });

  it('should return false when game is drawn', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 0, null, 'draw')).toBe(false);
  });

  it('should return true for valid move in playing game', () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 0, null, 'playing')).toBe(true);
  });

  it('should handle edge case with full board but no winner', () => {
    const board: Board = [
      'X', 'O', 'X',
      'O', 'X', 'O',
      'O', 'X', 'O',
    ];
    expect(isValidMove(board, 8, null, 'playing')).toBe(false);
  });
});

describe('calculateWinner - Edge Cases', () => {
  it('should throw error for invalid board', () => {
    expect(() => calculateWinner(null as any)).toThrow(InvalidBoardError);
    expect(() => calculateWinner([] as any)).toThrow(InvalidBoardError);
  });

  it('should handle empty board', () => {
    const board = createInitialBoard();
    expect(calculateWinner(board)).toBeNull();
  });

  it('should handle board with only one move', () => {
    const board: Board = ['X', null, null, null, null, null, null, null, null];
    expect(calculateWinner(board)).toBeNull();
  });

  it('should handle board with two rows partially filled', () => {
    const board: Board = ['X', 'O', null, 'X', 'O', null, null, null, null];
    expect(calculateWinner(board)).toBeNull();
  });

  it('should return null when all squares filled but no winner', () => {
    const board: Board = [
      'X', 'O', 'X',
      'O', 'X', 'O',
      'O', 'X', 'O',
    ];
    expect(calculateWinner(board)).toBeNull();
  });

  it('should correctly identify winner in complete game', () => {
    const board: Board = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];
    expect(calculateWinner(board)).toBe('X');
  });
});

describe('Game Flow - Error Scenarios', () => {
  it('should handle rapid invalid moves gracefully', () => {
    const board = createInitialBoard();
    
    // First move valid
    const board1 = makeMove(board, 0, 'X');
    expect(board1[0]).toBe('X');

    // Attempt to move on same square should fail
    expect(() => makeMove(board1, 0, 'O')).toThrow(InvalidMoveError);
  });

  it('should handle moves after game ends', () => {
    const board: Board = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];

    expect(isValidMove(board, 5, 'X', 'win')).toBe(false);
  });

  it('should track game state after valid sequence', () => {
    let board = createInitialBoard();
    
    board = makeMove(board, 0, 'X'); // X at 0
    board = makeMove(board, 1, 'O'); // O at 1
    board = makeMove(board, 3, 'X'); // X at 3
    board = makeMove(board, 4, 'O'); // O at 4
    board = makeMove(board, 6, 'X'); // X at 6 - wins
    
    expect(calculateWinner(board)).toBe('X');
  });

  it('should handle moves with all edge indices', () => {
    const board = createInitialBoard();
    
    const edgeIndices = [0, 2, 6, 8]; // Corners
    let currentBoard = board;
    
    for (let i = 0; i < edgeIndices.length; i++) {
      const player = i % 2 === 0 ? 'X' : 'O';
      currentBoard = makeMove(currentBoard, edgeIndices[i], player);
    }
    
    // Verify alternating placement: X, O, X, O
    expect(currentBoard[0]).toBe('X'); // i=0: X
    expect(currentBoard[2]).toBe('O'); // i=1: O
    expect(currentBoard[6]).toBe('X'); // i=2: X
    expect(currentBoard[8]).toBe('O'); // i=3: O
  });
});

describe('Boundary Conditions', () => {
  it('should handle maximum valid board size', () => {
    const board: Board = Array(9).fill(null);
    expect(() => validateBoard(board)).not.toThrow();
  });

  it('should handle minimum valid board size', () => {
    const board: Board = Array(9).fill(null);
    expect(() => validateBoard(board)).not.toThrow();
  });

  it('should handle alternating X and O fills', () => {
    let board = createInitialBoard();
    
    for (let i = 0; i < 9; i++) {
      const player = i % 2 === 0 ? 'X' : 'O';
      board = makeMove(board, i, player);
    }
    
    // Verify alternation
    expect(board[0]).toBe('X');
    expect(board[1]).toBe('O');
    expect(board[2]).toBe('X');
  });

  it('should preserve immutability on errors', () => {
    const board = createInitialBoard();
    const boardCopy = [...board];
    
    try {
      makeMove(board, 0, 'X' as any);
      makeMove(board, 0, 'O'); // Should throw on occupied square
    } catch {
      // Expected
    }
    
    expect(board).toEqual(boardCopy);
  });
});
