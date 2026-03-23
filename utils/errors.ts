/**
 * Custom error types for the Tic-Tac-Toe game
 */

export class GameError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'GameError';
  }
}

export class InvalidMoveError extends GameError {
  constructor(message: string = 'Invalid move') {
    super(message, 'INVALID_MOVE');
    this.name = 'InvalidMoveError';
  }
}

export class InvalidBoardError extends GameError {
  constructor(message: string = 'Invalid board state') {
    super(message, 'INVALID_BOARD');
    this.name = 'InvalidBoardError';
  }
}

export class InvalidIndexError extends GameError {
  constructor(message: string = 'Invalid board index') {
    super(message, 'INVALID_INDEX');
    this.name = 'InvalidIndexError';
  }
}

export class InvalidPlayerError extends GameError {
  constructor(message: string = 'Invalid player') {
    super(message, 'INVALID_PLAYER');
    this.name = 'InvalidPlayerError';
  }
}

export const ErrorMessages = {
  INVALID_BOARD: 'Board must be an array of 9 elements',
  INVALID_INDEX: 'Index must be between 0 and 8',
  INVALID_PLAYER: "Player must be 'X' or 'O'",
  SQUARE_OCCUPIED: 'Square is already occupied',
  GAME_ALREADY_WON: 'Cannot make moves after game is won',
  INVALID_BOARD_SIZE: 'Board must contain exactly 9 squares',
  NULL_BOARD: 'Board cannot be null or undefined',
  NULL_INDEX: 'Index cannot be null or undefined',
} as const;
