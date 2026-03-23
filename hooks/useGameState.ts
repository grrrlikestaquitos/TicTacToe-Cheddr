import { useState, useCallback, useMemo } from 'react';
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

export const useGameState = () => {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState<GameStatus>('playing');

  // Memoize computed values to avoid recalculation on every render
  const winner = useMemo(() => calculateWinner(board), [board]);
  const currentPlayer = useMemo(() => getNextPlayer(isXNext), [isXNext]);

  // Use useCallback to prevent creating new function on every render
  // This prevents child components from re-rendering unnecessarily
  const handleSquarePress = useCallback((index: number) => {
    setBoard((prevBoard) => {
      if (!isValidMove(prevBoard, index, calculateWinner(prevBoard), status)) {
        return prevBoard;
      }

      const playerToMove = getNextPlayer(isXNext);
      const newBoard = makeMove(prevBoard, index, playerToMove);
      const newWinner = calculateWinner(newBoard);
      const newStatus = determineGameStatus(newBoard, newWinner);
      setStatus(newStatus);
      setIsXNext((prev) => !prev);
      return newBoard;
    });
  }, [isXNext, status]);

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setIsXNext(true);
    setStatus('playing');
  }, []);

  return {
    board,
    isXNext,
    status,
    winner,
    currentPlayer,
    handleSquarePress,
    resetGame,
  };
};