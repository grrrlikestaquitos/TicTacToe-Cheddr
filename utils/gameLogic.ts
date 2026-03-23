export type Board = (string | null)[];
export type GameStatus = 'playing' | 'win' | 'draw';
export type Player = 'X' | 'O';

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

export const calculateWinner = (board: Board): string | null => {
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
  return !board[index] && !winner && status === 'playing';
};

export const makeMove = (
  board: Board,
  index: number,
  player: Player
): Board => {
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