import {
  GameError,
  InvalidBoardError,
  InvalidIndexError,
  InvalidPlayerError,
  InvalidMoveError,
  ErrorMessages,
} from '../errors';

describe('GameError - Base Error Class', () => {
  it('should create error with message and code', () => {
    const error = new GameError('Test message', 'TEST_CODE');
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.name).toBe('GameError');
  });

  it('should extend Error class', () => {
    const error = new GameError('Test', 'CODE');
    expect(error instanceof Error).toBe(true);
  });

  it('should have stack trace', () => {
    const error = new GameError('Test message', 'CODE');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('GameError');
  });

  it('should be catchable as Error', () => {
    const error = new GameError('Test', 'CODE');
    expect(() => {
      throw error;
    }).toThrow(Error);
  });

  it('should be catchable as GameError', () => {
    const error = new GameError('Test', 'CODE');
    expect(() => {
      throw error;
    }).toThrow(GameError);
  });
});

describe('InvalidBoardError', () => {
  it('should create InvalidBoardError with message', () => {
    const error = new InvalidBoardError('Board is invalid');
    expect(error.message).toBe('Board is invalid');
    expect(error.code).toBe('INVALID_BOARD');
    expect(error.name).toBe('InvalidBoardError');
    expect(error instanceof GameError).toBe(true);
  });

  it('should have null board error message', () => {
    const error = new InvalidBoardError(ErrorMessages.NULL_BOARD);
    expect(error.message).toBe(ErrorMessages.NULL_BOARD);
  });

  it('should have invalid board size error message', () => {
    const error = new InvalidBoardError(ErrorMessages.INVALID_BOARD_SIZE);
    expect(error.message).toBe(ErrorMessages.INVALID_BOARD_SIZE);
  });

  it('should have invalid board structure error message', () => {
    const error = new InvalidBoardError(ErrorMessages.INVALID_BOARD);
    expect(error.message).toBe(ErrorMessages.INVALID_BOARD);
  });

  it('should be catchable as GameError', () => {
    const error = new InvalidBoardError('Test');
    expect(error instanceof GameError).toBe(true);
  });

  it('should preserve original error type when thrown', () => {
    expect(() => {
      throw new InvalidBoardError('Test');
    }).toThrow(InvalidBoardError);
  });
});

describe('InvalidIndexError', () => {
  it('should create InvalidIndexError with message', () => {
    const error = new InvalidIndexError('Index is invalid');
    expect(error.message).toBe('Index is invalid');
    expect(error.code).toBe('INVALID_INDEX');
    expect(error.name).toBe('InvalidIndexError');
    expect(error instanceof GameError).toBe(true);
  });

  it('should have null index error message', () => {
    const error = new InvalidIndexError(ErrorMessages.NULL_INDEX);
    expect(error.message).toBe(ErrorMessages.NULL_INDEX);
  });

  it('should have invalid index error message', () => {
    const error = new InvalidIndexError(ErrorMessages.INVALID_INDEX);
    expect(error.message).toBe(ErrorMessages.INVALID_INDEX);
  });

  it('should be catchable as specific error type', () => {
    expect(() => {
      throw new InvalidIndexError('Test');
    }).toThrow(InvalidIndexError);
  });
});

describe('InvalidPlayerError', () => {
  it('should create InvalidPlayerError with message', () => {
    const error = new InvalidPlayerError('Player is invalid');
    expect(error.message).toBe('Player is invalid');
    expect(error.code).toBe('INVALID_PLAYER');
    expect(error.name).toBe('InvalidPlayerError');
    expect(error instanceof GameError).toBe(true);
  });

  it('should have invalid player error message', () => {
    const error = new InvalidPlayerError(ErrorMessages.INVALID_PLAYER);
    expect(error.message).toBe(ErrorMessages.INVALID_PLAYER);
  });

  it('should be catchable as specific error type', () => {
    expect(() => {
      throw new InvalidPlayerError('Test');
    }).toThrow(InvalidPlayerError);
  });
});

describe('InvalidMoveError', () => {
  it('should create InvalidMoveError with message', () => {
    const error = new InvalidMoveError('Move is invalid');
    expect(error.message).toBe('Move is invalid');
    expect(error.code).toBe('INVALID_MOVE');
    expect(error.name).toBe('InvalidMoveError');
    expect(error instanceof GameError).toBe(true);
  });

  it('should have square occupied error message', () => {
    const error = new InvalidMoveError(ErrorMessages.SQUARE_OCCUPIED);
    expect(error.message).toBe(ErrorMessages.SQUARE_OCCUPIED);
  });

  it('should have game already won error message', () => {
    const error = new InvalidMoveError(ErrorMessages.GAME_ALREADY_WON);
    expect(error.message).toBe(ErrorMessages.GAME_ALREADY_WON);
  });

  it('should be catchable as specific error type', () => {
    expect(() => {
      throw new InvalidMoveError('Test');
    }).toThrow(InvalidMoveError);
  });
});

describe('Error Type Discrimination', () => {
  it('should distinguish between different error types', () => {
    const errors = [
      new InvalidBoardError('msg'),
      new InvalidIndexError('msg'),
      new InvalidPlayerError('msg'),
      new InvalidMoveError('msg'),
    ];

    errors.forEach((error) => {
      // Should be instance of GameError
      expect(error instanceof GameError).toBe(true);

      // Should be instance of Error
      expect(error instanceof Error).toBe(true);
    });
  });

  it('should catch specific error by type', () => {
    const throwBoardError = () => {
      throw new InvalidBoardError('Test');
    };

    try {
      throwBoardError();
    } catch (error) {
      expect(error instanceof InvalidBoardError).toBe(true);
      expect(error instanceof InvalidIndexError).toBe(false);
      expect(error instanceof InvalidPlayerError).toBe(false);
      expect(error instanceof InvalidMoveError).toBe(false);
    }
  });

  it('should catch any GameError type with GameError catch', () => {
    const errors = [
      new InvalidBoardError('msg'),
      new InvalidIndexError('msg'),
      new InvalidPlayerError('msg'),
      new InvalidMoveError('msg'),
    ];

    errors.forEach((error) => {
      try {
        throw error;
      } catch (caught) {
        expect(caught instanceof GameError).toBe(true);
      }
    });
  });
});

describe('Error Messages Constant', () => {
  it('should have all required error message keys', () => {
    expect(ErrorMessages.NULL_BOARD).toBeDefined();
    expect(ErrorMessages.INVALID_BOARD).toBeDefined();
    expect(ErrorMessages.INVALID_BOARD_SIZE).toBeDefined();
    expect(ErrorMessages.NULL_INDEX).toBeDefined();
    expect(ErrorMessages.INVALID_INDEX).toBeDefined();
    expect(ErrorMessages.INVALID_PLAYER).toBeDefined();
    expect(ErrorMessages.SQUARE_OCCUPIED).toBeDefined();
    expect(ErrorMessages.GAME_ALREADY_WON).toBeDefined();
  });

  it('should have string values for all error messages', () => {
    Object.values(ErrorMessages).forEach((message) => {
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });

  it('should have unique error messages', () => {
    const messages = Object.values(ErrorMessages);
    const uniqueMessages = new Set(messages);
    expect(uniqueMessages.size).toBe(messages.length);
  });

  it('should have readable error messages', () => {
    Object.values(ErrorMessages).forEach((message) => {
      // Check that messages are not empty and contain readable content
      expect(message).toMatch(/[a-zA-Z]/);
      expect(message.length).toBeGreaterThan(5);
    });
  });
});

describe('Error Code Consistency', () => {
  it('should have unique error codes across all error types', () => {
    const errors = [
      new GameError('msg', 'BASE'),
      new InvalidBoardError('msg'),
      new InvalidIndexError('msg'),
      new InvalidPlayerError('msg'),
      new InvalidMoveError('msg'),
    ];

    const codes = errors.map((e) => e.code);
    const uniqueCodes = new Set(codes);
    
    // Should have 5 unique codes
    expect(uniqueCodes.size).toBe(5);
  });

  it('should have meaningful error codes', () => {
    expect(new GameError('msg', 'TEST').code).toBe('TEST');
    expect(new InvalidBoardError('msg').code).toBe('INVALID_BOARD');
    expect(new InvalidIndexError('msg').code).toBe('INVALID_INDEX');
    expect(new InvalidPlayerError('msg').code).toBe('INVALID_PLAYER');
    expect(new InvalidMoveError('msg').code).toBe('INVALID_MOVE');
  });
});

describe('Error Serialization', () => {
  it('should have readable string representation', () => {
    const error = new InvalidMoveError('Square is occupied');
    const str = error.toString();
    expect(str).toContain('InvalidMoveError');
    expect(str).toContain('Square is occupied');
  });

  it('should preserve error properties when caught', () => {
    try {
      throw new InvalidBoardError(ErrorMessages.NULL_BOARD);
    } catch (error: any) {
      expect(error.code).toBe('INVALID_BOARD');
      expect(error.message).toBe(ErrorMessages.NULL_BOARD);
      expect(error.name).toBe('InvalidBoardError');
    }
  });

  it('should include code in error information', () => {
    const error = new InvalidPlayerError('Test');
    expect(error.code).toBeDefined();
    expect(error.code).toMatch(/^[A-Z_]+$/);
  });
});
