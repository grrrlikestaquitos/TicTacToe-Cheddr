import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameBoard } from '../GameBoard';
import { Board } from '../../utils/gameLogic';

describe('GameBoard Component', () => {
  const mockOnSquarePress = jest.fn();
  const boardSize = 300;

  beforeEach(() => {
    mockOnSquarePress.mockClear();
  });

  describe('Rendering', () => {
    it('should render 9 squares for empty board', () => {
      const emptyBoard: Board = Array(9).fill(null);
      const { getAllByTestId } = render(
        <GameBoard board={emptyBoard} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      const squares = getAllByTestId(/square-\d/);
      expect(squares).toHaveLength(9);
    });

    it('should render board with correct structure', () => {
      const emptyBoard: Board = Array(9).fill(null);
      const { getByTestId } = render(
        <GameBoard board={emptyBoard} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      expect(getByTestId('game-board')).toBeTruthy();
    });

    it('should display X values on board', () => {
      const board: Board = ['X', null, 'X', null, 'X', null, null, null, null];
      const { getAllByText } = render(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      const xPieces = getAllByText('X');
      expect(xPieces).toHaveLength(3);
    });

    it('should display O values on board', () => {
      const board: Board = ['O', null, 'O', null, 'O', null, null, null, null];
      const { getAllByText } = render(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      const oPieces = getAllByText('O');
      expect(oPieces).toHaveLength(3);
    });

    it('should display mixed X and O values', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', null, null, null];
      const { getAllByText } = render(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      expect(getAllByText('X')).toHaveLength(3);
      expect(getAllByText('O')).toHaveLength(3);
    });

    it('should render full board with all squares filled', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      const { getAllByTestId } = render(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      const squares = getAllByTestId(/square-\d/);
      expect(squares).toHaveLength(9);
    });
  });

  describe('Interactions', () => {
    it('should pass correct index when square is pressed', () => {
      const emptyBoard: Board = Array(9).fill(null);
      const { getByTestId } = render(
        <GameBoard board={emptyBoard} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      
      fireEvent.press(getByTestId('square-4'));
      expect(mockOnSquarePress).toHaveBeenCalledWith(4);
    });

    it('should handle all 9 square presses', () => {
      const emptyBoard: Board = Array(9).fill(null);
      const { getByTestId } = render(
        <GameBoard board={emptyBoard} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      
      for (let i = 0; i < 9; i++) {
        mockOnSquarePress.mockClear();
        fireEvent.press(getByTestId(`square-${i}`));
        expect(mockOnSquarePress).toHaveBeenCalledWith(i);
      }
    });

    it('should call onSquarePress for each click', () => {
      const emptyBoard: Board = Array(9).fill(null);
      const { getByTestId } = render(
        <GameBoard board={emptyBoard} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      
      fireEvent.press(getByTestId('square-0'));
      fireEvent.press(getByTestId('square-4'));
      fireEvent.press(getByTestId('square-8'));
      
      expect(mockOnSquarePress).toHaveBeenCalledTimes(3);
      expect(mockOnSquarePress).toHaveBeenNthCalledWith(1, 0);
      expect(mockOnSquarePress).toHaveBeenNthCalledWith(2, 4);
      expect(mockOnSquarePress).toHaveBeenNthCalledWith(3, 8);
    });
  });

  describe('Board State Updates', () => {
    it('should reflect board changes on re-render', () => {
      let board: Board = Array(9).fill(null);
      const { rerender, queryByText } = render(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      
      // Initially no X or O on board
      expect(queryByText('X')).toBeFalsy();
      expect(queryByText('O')).toBeFalsy();
      
      board = ['X', null, null, null, null, null, null, null, null];
      rerender(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      
      expect(queryByText('X')).toBeTruthy();
    });

    it('should update board from empty to full', () => {
      let board: Board = Array(9).fill(null);
      const { rerender, getAllByTestId } = render(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      
      board = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      rerender(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      
      const squares = getAllByTestId(/square-\d/);
      expect(squares).toHaveLength(9);
    });
  });

  describe('Props', () => {
    it('should accept different board sizes', () => {
      const emptyBoard: Board = Array(9).fill(null);
      const sizes = [250, 300, 350, 400];
      
      sizes.forEach((size) => {
        const { getByTestId } = render(
          <GameBoard board={emptyBoard} boardSize={size} onSquarePress={mockOnSquarePress} />
        );
        expect(getByTestId('game-board')).toBeTruthy();
      });
    });

    it('should accept valid board prop', () => {
      const board: Board = ['X', 'O', null, null, null, null, null, null, null];
      const { getByTestId } = render(
        <GameBoard board={board} boardSize={boardSize} onSquarePress={mockOnSquarePress} />
      );
      expect(getByTestId('game-board')).toBeTruthy();
    });
  });
});