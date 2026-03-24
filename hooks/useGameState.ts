import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Board,
  GameStatus,
  Player,
  calculateWinner,
  determineGameStatus,
  getNextPlayer,
  isValidMove,
  makeMove,
  createInitialBoard,
} from '../utils/gameLogic';
import { getComputerMove, Difficulty } from '../utils/aiEngine';

export type GameMode = 'pvp' | 'computer';
export type ComputerDifficulty = Difficulty;

export interface GameState {
  // Board state
  board: Board;
  isXNext: boolean;
  status: GameStatus;
  winner: string | null;
  currentPlayer: Player;

  // Game mode state
  gameMode: GameMode | null; // null until mode is selected
  humanPlayer: Player | null; // X or O, null if not set
  difficulty: ComputerDifficulty | null; // easy, medium, hard, null if not set
  isComputerThinking: boolean;

  // Callbacks
  handleSquarePress: (index: number) => void;
  resetGame: () => void;
  startGame: (mode: GameMode, humanPlayer?: Player, difficulty?: ComputerDifficulty) => void;
}

export const useGameState = (): GameState => {
  // Core game state
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState<GameStatus>('playing');

  // Game mode state
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [humanPlayer, setHumanPlayer] = useState<Player | null>(null);
  const [difficulty, setDifficulty] = useState<ComputerDifficulty | null>(null);
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  // Ref to track if we're processing a computer move (prevent race conditions)
  const processingComputerMoveRef = useRef(false);

  // Memoize computed values to avoid recalculation on every render
  const winner = useMemo(() => calculateWinner(board), [board]);
  const currentPlayer = useMemo(() => getNextPlayer(isXNext), [isXNext]);

  /**
   * Determine if it's the computer's turn
   * Computer's turn when: game mode is 'computer' AND current player is not human
   */
  const isComputerTurn = useMemo(() => {
    if (gameMode !== 'computer' || !humanPlayer) return false;
    return currentPlayer !== humanPlayer;
  }, [gameMode, humanPlayer, currentPlayer]);

  /**
   * Apply a move to the board and update game state
   * Used by both human player and computer AI
   */
  const applyMove = useCallback(
    (index: number, playerToMove: Player) => {
      setBoard((prevBoard) => {
        if (!isValidMove(prevBoard, index, calculateWinner(prevBoard), status)) {
          return prevBoard;
        }

        const newBoard = makeMove(prevBoard, index, playerToMove);
        const newWinner = calculateWinner(newBoard);
        const newStatus = determineGameStatus(newBoard, newWinner);
        setStatus(newStatus);
        setIsXNext((prev) => !prev);
        return newBoard;
      });
    },
    [status]
  );

  /**
   * Handle human player square press
   * Only allow if game is in progress and it's the human's turn
   */
  const handleSquarePress = useCallback(
    (index: number) => {
      // Prevent moves during computer thinking or if game not started
      if (
        gameMode === null ||
        isComputerThinking ||
        status !== 'playing' ||
        (gameMode === 'computer' && currentPlayer !== humanPlayer)
      ) {
        return;
      }

      applyMove(index, currentPlayer);
    },
    [gameMode, isComputerThinking, status, currentPlayer, humanPlayer, applyMove]
  );

  /**
   * Auto-play computer move when it's the computer's turn
   * Uses useEffect with 500ms delay to feel natural
   */
  useEffect(() => {
    // Only process if conditions are met
    if (
      !isComputerTurn ||
      status !== 'playing' ||
      isComputerThinking ||
      !difficulty ||
      processingComputerMoveRef.current
    ) {
      return;
    }

    // Mark that we're processing to prevent race conditions
    processingComputerMoveRef.current = true;

    // Set thinking state (shows UI feedback)
    setIsComputerThinking(true);

    // Delay to make gameplay feel natural and not instant
    const timeoutId = setTimeout(() => {
      // Double-check conditions in case state changed during delay
      setBoard((currentBoard) => {
        if (status !== 'playing') {
          setIsComputerThinking(false);
          processingComputerMoveRef.current = false;
          return currentBoard;
        }

        try {
          // Get computer's move
          const aiPlayer = humanPlayer === 'X' ? 'O' : 'X';
          const computerMoveIndex = getComputerMove(
            currentBoard,
            difficulty,
            humanPlayer!
          );

          // Apply the move
          const newBoard = makeMove(currentBoard, computerMoveIndex, aiPlayer);
          const newWinner = calculateWinner(newBoard);
          const newStatus = determineGameStatus(newBoard, newWinner);

          // Update game state
          setStatus(newStatus);
          setIsXNext((prev) => !prev);

          return newBoard;
        } catch (error) {
          console.error('Error getting computer move:', error);
          return currentBoard;
        } finally {
          setIsComputerThinking(false);
          processingComputerMoveRef.current = false;
        }
      });
    }, 500); // 500ms delay for natural gameplay

    return () => {
      clearTimeout(timeoutId);
      processingComputerMoveRef.current = false;
    };
  }, [isComputerTurn, status, difficulty, humanPlayer]);

  /**
   * Start a new game with specified mode and options
   * Must be called before gameplay begins
   */
  const startGame = useCallback(
    (mode: GameMode, playerAssignment: Player = 'X', difficultyLevel: ComputerDifficulty = 'hard') => {
      // Reset board and game state
      setBoard(createInitialBoard());
      setIsXNext(true);
      setStatus('playing');

      // Set game mode configuration
      if (mode === 'pvp') {
        // Player vs Player: no AI
        setGameMode('pvp');
        setHumanPlayer(null);
        setDifficulty(null);
      } else {
        // Player vs Computer: set up AI
        setGameMode('computer');
        setHumanPlayer(playerAssignment);
        setDifficulty(difficultyLevel);
      }

      setIsComputerThinking(false);
      processingComputerMoveRef.current = false;
    },
    []
  );

  /**
   * Reset game keeping the current mode/difficulty settings
   * Allows quick replay without mode selection
   */
  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setIsXNext(true);
    setStatus('playing');
    setIsComputerThinking(false);
    processingComputerMoveRef.current = false;
  }, []);

  return {
    // Board state
    board,
    isXNext,
    status,
    winner,
    currentPlayer,

    // Game mode state
    gameMode,
    humanPlayer,
    difficulty,
    isComputerThinking,

    // Callbacks
    handleSquarePress,
    resetGame,
    startGame,
  };
};