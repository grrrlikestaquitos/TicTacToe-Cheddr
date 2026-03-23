export type Board = (string | null)[];
export type GameStatus = 'playing' | 'win' | 'draw';
export type Player = 'X' | 'O';

import {
  InvalidBoardError,
  InvalidIndexError,
  InvalidPlayerError,
  InvalidMoveError,
  ErrorMessages,
} from './errors';

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Validates that a board is a valid game board
 * @throws InvalidBoardError if board is invalid
 */
export const validateBoard = (board: unknown): board is Board => {
  if (board === null || board === undefined) {
    throw new InvalidBoardError(ErrorMessages.NULL_BOARD);
  }

  if (!Array.isArray(board)) {
    throw new InvalidBoardError(ErrorMessages.INVALID_BOARD);
  }

  if (board.length !== 9) {
    throw new InvalidBoardError(ErrorMessages.INVALID_BOARD_SIZE);
  }

  if (!board.every((cell) => cell === null || cell === 'X' || cell === 'O')) {
    throw new InvalidBoardError(ErrorMessages.INVALID_BOARD);
  }

  return true;
};

/**
 * Validates that an index is valid for the game board
 * @throws InvalidIndexError if index is invalid
 */
export const validateIndex = (index: number | unknown): index is number => {
  if (index === null || index === undefined) {
    throw new InvalidIndexError(ErrorMessages.NULL_INDEX);
  }

  if (!Number.isInteger(index)) {
    throw new InvalidIndexError(ErrorMessages.INVALID_INDEX);
  }

  if ((index as number) < 0 || (index as number) > 8) {
    throw new InvalidIndexError(ErrorMessages.INVALID_INDEX);
  }

  return true;
};

/**
 * Validates that a player is valid
 * @throws InvalidPlayerError if player is invalid
 */
export const validatePlayer = (player: unknown): player is Player => {
  if (player !== 'X' && player !== 'O') {
    throw new InvalidPlayerError(ErrorMessages.INVALID_PLAYER);
  }
  return true;
};

export const calculateWinner = (board: Board): string | null => {
  validateBoard(board);

  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const isBoardFull = (board: Board): boolean => {
  return board.every((square) => square !== null);
};

export const isValidMove = (
  board: Board,
  index: number,
  winner: string | null,
  status: GameStatus
): boolean => {
  try {
    validateBoard(board);
    validateIndex(index);
  } catch {
    return false;
  }

  return !board[index] && !winner && status === 'playing';
};

export const makeMove = (
  board: Board,
  index: number,
  player: Player
): Board => {
  validateBoard(board);
  validateIndex(index);
  validatePlayer(player);

  if (board[index] !== null) {
    throw new InvalidMoveError(ErrorMessages.SQUARE_OCCUPIED);
  }

  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
};

export const determineGameStatus = (
  board: Board,
  winner: string | null
): GameStatus => {
  if (winner) return 'win';
  if (isBoardFull(board)) return 'draw';
  return 'playing';
};

export const getNextPlayer = (isXNext: boolean): Player => {
  return isXNext ? 'X' : 'O';
};

export const createInitialBoard = (): Board => {
  return Array(9).fill(null);
};