import { Board, Player } from './gameLogic';

export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Evaluates the board state from the AI's perspective after a game ends
 * @param board - The final board state
 * @param humanPlayer - The human player ('X' or 'O')
 * @returns 10 if AI wins, -10 if human wins, 0 if draw
 */
const evaluateBoard = (board: Board, humanPlayer: Player): number => {
  // Find winner by checking winning combinations
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

  const aiPlayer: Player = humanPlayer === 'X' ? 'O' : 'X';

  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] === board[b] && board[b] === board[c]) {
      if (board[a] === aiPlayer) return 10;
      if (board[a] === humanPlayer) return -10;
    }
  }

  return 0; // Draw
};

/**
 * Get all available moves on the board
 * @param board - The current board state
 * @returns Array of available move indices
 */
const getAvailableMoves = (board: Board): number[] => {
  return board.reduce((moves: number[], cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
};

/**
 * Check if the game is terminal (no more moves available)
 * @param board - The current board state
 * @returns True if board is full
 */
const isBoardFull = (board: Board): boolean => {
  return board.every((cell) => cell !== null);
};

/**
 * Minimax algorithm with recursive game tree evaluation
 * Finds the optimal move by evaluating all possible game outcomes
 *
 * @param board - Current board state
 * @param depth - Current recursion depth (used for future alpha-beta pruning)
 * @param isMaximizing - True if evaluating AI's turn, false for human's turn
 * @param humanPlayer - The human player ('X' or 'O')
 * @returns Score: 10 (AI wins), 0 (draw), -10 (human wins)
 */
export const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  humanPlayer: Player
): number => {
  const score = evaluateBoard(board, humanPlayer);

  // Terminal states: game over
  if (score === 10) return score - depth; // Prefer faster wins
  if (score === -10) return score + depth; // Prefer slower losses
  if (isBoardFull(board)) return 0; // Draw

  const availableMoves = getAvailableMoves(board);

  // AI is maximizing (trying to win)
  if (isMaximizing) {
    let maxScore = -Infinity;
    const aiPlayer: Player = humanPlayer === 'X' ? 'O' : 'X';

    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = aiPlayer;
      const moveScore = minimax(newBoard, depth + 1, false, humanPlayer);
      maxScore = Math.max(maxScore, moveScore);
    }

    return maxScore;
  }

  // Human is minimizing (trying to prevent AI from winning)
  let minScore = Infinity;

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = humanPlayer;
    const moveScore = minimax(newBoard, depth + 1, true, humanPlayer);
    minScore = Math.min(minScore, moveScore);
  }

  return minScore;
};

/**
 * Get all optimal moves for the AI (moves with highest score)
 * Used for difficulty levels that need multiple "best" moves to randomize
 *
 * @param board - Current board state
 * @param humanPlayer - The human player ('X' or 'O')
 * @returns Array of move indices that are equally optimal
 */
const getOptimalMoves = (board: Board, humanPlayer: Player): number[] => {
  const aiPlayer: Player = humanPlayer === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);

  let bestScore = -Infinity;
  let bestMoves: number[] = [];

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = aiPlayer;
    const moveScore = minimax(newBoard, 0, false, humanPlayer);

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMoves = [move];
    } else if (moveScore === bestScore) {
      bestMoves.push(move);
    }
  }

  return bestMoves;
};

/**
 * Easy difficulty: Choose a random valid move
 * @param board - Current board state
 * @returns Random available move index
 */
const getEasyMove = (board: Board): number => {
  const availableMoves = getAvailableMoves(board);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

/**
 * Medium difficulty: 70% optimal play + 30% random move
 * Plays well but not perfectly, making games winnable for skilled players
 *
 * @param board - Current board state
 * @param humanPlayer - The human player ('X' or 'O')
 * @returns Optimal move 70% of the time, random move 30% of the time
 */
const getMediumMove = (board: Board, humanPlayer: Player): number => {
  // 30% chance of random move
  if (Math.random() < 0.3) {
    return getEasyMove(board);
  }

  // 70% chance of optimal move
  const optimalMoves = getOptimalMoves(board, humanPlayer);
  return optimalMoves[Math.floor(Math.random() * optimalMoves.length)];
};

/**
 * Hard difficulty: Always play optimal move using Minimax
 * Nearly impossible to beat (will always draw at minimum with optimal human play)
 *
 * @param board - Current board state
 * @param humanPlayer - The human player ('X' or 'O')
 * @returns Best possible move
 */
const getHardMove = (board: Board, humanPlayer: Player): number => {
  const optimalMoves = getOptimalMoves(board, humanPlayer);
  return optimalMoves[Math.floor(Math.random() * optimalMoves.length)];
};

/**
 * Get the next computer move based on difficulty level
 * Main entry point for AI move selection
 *
 * @param board - Current board state
 * @param difficulty - AI difficulty level ('easy' | 'medium' | 'hard')
 * @param humanPlayer - The human player ('X' or 'O')
 * @returns Index (0-8) where computer should place its piece
 * @throws Error if no valid moves available
 */
export const getComputerMove = (
  board: Board,
  difficulty: Difficulty,
  humanPlayer: Player
): number => {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) {
    throw new Error('No valid moves available');
  }

  switch (difficulty) {
    case 'easy':
      return getEasyMove(board);
    case 'medium':
      return getMediumMove(board, humanPlayer);
    case 'hard':
      return getHardMove(board, humanPlayer);
    default:
      const exhaustive: never = difficulty;
      throw new Error(`Unknown difficulty: ${exhaustive}`);
  }
};

/**
 * Evaluate how good a specific move is (for testing/validation)
 * Returns the game outcome score if this move is played
 *
 * @param board - Current board state
 * @param move - Move index (0-8)
 * @param humanPlayer - The human player ('X' or 'O')
 * @returns Score of the move (higher is better for AI)
 */
export const evaluateMove = (
  board: Board,
  move: number,
  humanPlayer: Player
): number => {
  if (board[move] !== null) {
    throw new Error(`Move at index ${move} is not valid`);
  }

  const aiPlayer: Player = humanPlayer === 'X' ? 'O' : 'X';
  const newBoard = [...board];
  newBoard[move] = aiPlayer;

  return minimax(newBoard, 0, false, humanPlayer);
};

/**
 * Get all moves ranked by quality (for debugging/analysis)
 * @param board - Current board state
 * @param humanPlayer - The human player ('X' or 'O')
 * @returns Array of {move, score} sorted by score descending
 */
export const getRankedMoves = (
  board: Board,
  humanPlayer: Player
): Array<{ move: number; score: number }> => {
  const aiPlayer: Player = humanPlayer === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);

  const rankedMoves = availableMoves.map((move) => {
    const newBoard = [...board];
    newBoard[move] = aiPlayer;
    const score = minimax(newBoard, 0, false, humanPlayer);
    return { move, score };
  });

  return rankedMoves.sort((a, b) => b.score - a.score);
};
