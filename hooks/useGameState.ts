import { useState } from 'react';
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

  const winner = calculateWinner(board);
  const currentPlayer = getNextPlayer(isXNext);

  const handleSquarePress = (index: number) => {
    if (!isValidMove(board, index, winner, status)) {
      return;
    }

    const newBoard = makeMove(board, index, currentPlayer);
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard);
    const newStatus = determineGameStatus(newBoard, newWinner);
    setStatus(newStatus);

    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setIsXNext(true);
    setStatus('playing');
  };

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