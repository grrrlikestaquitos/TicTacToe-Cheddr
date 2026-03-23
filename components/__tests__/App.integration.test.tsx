import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';

describe('App Integration Tests', () => {
  describe('Complete Game Flow', () => {
    it('should handle a complete game where X wins', () => {
      const { getByTestId, getByText } = render(<App />);

      // X plays at position 0 (top-left)
      fireEvent.press(getByTestId('square-0'));
      expect(getByText(/Current player: O/)).toBeTruthy();

      // O plays at position 3
      fireEvent.press(getByTestId('square-3'));
      expect(getByText(/Current player: X/)).toBeTruthy();

      // X plays at position 1 (top-center)
      fireEvent.press(getByTestId('square-1'));
      expect(getByText(/Current player: O/)).toBeTruthy();

      // O plays at position 4
      fireEvent.press(getByTestId('square-4'));
      expect(getByText(/Current player: X/)).toBeTruthy();

      // X plays at position 2 (top-right) - X wins!
      fireEvent.press(getByTestId('square-2'));
      expect(getByText(/Player X wins/)).toBeTruthy();
    });

    it('should prevent moves after game is won', () => {
      const { getByTestId, getByText, queryByText } = render(<App />);

      // X wins on top row
      fireEvent.press(getByTestId('square-0'));
      fireEvent.press(getByTestId('square-3'));
      fireEvent.press(getByTestId('square-1'));
      fireEvent.press(getByTestId('square-4'));
      fireEvent.press(getByTestId('square-2'));

      expect(getByText(/Player X wins/)).toBeTruthy();

      // Try to make another move after game is won
      fireEvent.press(getByTestId('square-5'));

      // Status should still show X wins, not O's turn
      expect(getByText(/Player X wins/)).toBeTruthy();
    });

    it('should prevent moves on occupied squares', () => {
      const { getByTestId, getByText } = render(<App />);

      fireEvent.press(getByTestId('square-0'));
      expect(getByText(/Current player: O/)).toBeTruthy();

      // Try to place O on same square as X
      fireEvent.press(getByTestId('square-0'));

      // Status should remain O's turn (move was blocked)
      expect(getByText(/Current player: O/)).toBeTruthy();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset game to initial state', () => {
      const { getByTestId, getByText } = render(<App />);

      // Play some moves
      fireEvent.press(getByTestId('square-0'));
      fireEvent.press(getByTestId('square-4'));
      fireEvent.press(getByTestId('square-8'));

      expect(getByText(/Current player/)).toBeTruthy();

      // Reset game
      fireEvent.press(getByTestId('reset-button'));

      // Should be back to X's turn
      expect(getByText(/Current player: X/)).toBeTruthy();

      // Board should be playable again
      fireEvent.press(getByTestId('square-0'));
      expect(getByText(/Current player: O/)).toBeTruthy();
    });

    it('should reset after a win', () => {
      const { getByTestId, getByText } = render(<App />);

      // X wins
      fireEvent.press(getByTestId('square-0'));
      fireEvent.press(getByTestId('square-3'));
      fireEvent.press(getByTestId('square-1'));
      fireEvent.press(getByTestId('square-4'));
      fireEvent.press(getByTestId('square-2'));

      expect(getByText(/Player X wins/)).toBeTruthy();

      // Reset
      fireEvent.press(getByTestId('reset-button'));

      // Should show X's turn again
      expect(getByText(/Current player: X/)).toBeTruthy();
    });
  });

  describe('UI Consistency', () => {
    it('should display title', () => {
      const { getByText } = render(<App />);
      expect(getByText('Tic-Tac-Toe')).toBeTruthy();
    });

    it('should always display status', () => {
      const { getByTestId } = render(<App />);
      expect(getByTestId('game-status')).toBeTruthy();
    });

    it('should always display board', () => {
      const { getByTestId } = render(<App />);
      expect(getByTestId('game-board')).toBeTruthy();
    });

    it('should always display reset button', () => {
      const { getByTestId } = render(<App />);
      expect(getByTestId('reset-button')).toBeTruthy();
    });
  });

  describe('Alternating Turns', () => {
    it('should correctly alternate between X and O', () => {
      const { getByTestId, getByText } = render(<App />);

      expect(getByText(/Current player: X/)).toBeTruthy();

      fireEvent.press(getByTestId('square-0'));
      expect(getByText(/Current player: O/)).toBeTruthy();

      fireEvent.press(getByTestId('square-1'));
      expect(getByText(/Current player: X/)).toBeTruthy();

      fireEvent.press(getByTestId('square-2'));
      expect(getByText(/Current player: O/)).toBeTruthy();
    });
  });
});