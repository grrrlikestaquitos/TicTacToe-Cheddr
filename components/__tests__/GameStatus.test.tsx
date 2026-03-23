import React from 'react';
import { render } from '@testing-library/react-native';
import { GameStatusDisplay } from '../GameStatus';
import { GameStatus } from '../../utils/gameLogic';

describe('GameStatusDisplay Component', () => {
  describe('Playing Status', () => {
    it('should display current player message when status is playing', () => {
      const { getByText } = render(
        <GameStatusDisplay status="playing" winner={null} currentPlayer="X" />
      );
      expect(getByText('Current player: X')).toBeTruthy();
    });

    it('should show X as current player', () => {
      const { getByText } = render(
        <GameStatusDisplay status="playing" winner={null} currentPlayer="X" />
      );
      expect(getByText(/Current player: X/)).toBeTruthy();
    });

    it('should show O as current player', () => {
      const { getByText } = render(
        <GameStatusDisplay status="playing" winner={null} currentPlayer="O" />
      );
      expect(getByText(/Current player: O/)).toBeTruthy();
    });
  });

  describe('Win Status', () => {
    it('should display X wins message when X is winner', () => {
      const { getByText } = render(
        <GameStatusDisplay status="win" winner="X" currentPlayer="O" />
      );
      expect(getByText(/Player X wins/)).toBeTruthy();
    });

    it('should display O wins message when O is winner', () => {
      const { getByText } = render(
        <GameStatusDisplay status="win" winner="O" currentPlayer="X" />
      );
      expect(getByText(/Player O wins/)).toBeTruthy();
    });

    it('should include celebration emoji for win', () => {
      const { getByText } = render(
        <GameStatusDisplay status="win" winner="X" currentPlayer="O" />
      );
      expect(getByText(/🎉/)).toBeTruthy();
    });

    it('should display winner even if status says win', () => {
      const { getByText } = render(
        <GameStatusDisplay status="win" winner="X" currentPlayer="X" />
      );
      expect(getByText(/Player X wins/)).toBeTruthy();
    });
  });

  describe('Draw Status', () => {
    it('should display draw message when status is draw', () => {
      const { getByText } = render(
        <GameStatusDisplay status="draw" winner={null} currentPlayer="X" />
      );
      expect(getByText(/It's a draw/)).toBeTruthy();
    });

    it('should include handshake emoji for draw', () => {
      const { getByText } = render(
        <GameStatusDisplay status="draw" winner={null} currentPlayer="X" />
      );
      expect(getByText(/🤝/)).toBeTruthy();
    });

    it('should not show current player on draw', () => {
      const { queryByText } = render(
        <GameStatusDisplay status="draw" winner={null} currentPlayer="X" />
      );
      expect(queryByText(/Current player/)).toBeFalsy();
    });
  });

  describe('Props Validation', () => {
    it('should render with all valid status values', () => {
      const statuses: GameStatus[] = ['playing', 'win', 'draw'];
      
      statuses.forEach((status) => {
        const { getByTestId } = render(
          <GameStatusDisplay status={status} winner={null} currentPlayer="X" />
        );
        expect(getByTestId('game-status')).toBeTruthy();
      });
    });

    it('should handle null winner in playing state', () => {
      const { getByText } = render(
        <GameStatusDisplay status="playing" winner={null} currentPlayer="X" />
      );
      expect(getByText(/Current player: X/)).toBeTruthy();
    });

    it('should handle both X and O players', () => {
      const players = ['X', 'O'];
      
      players.forEach((player) => {
        const { getByText } = render(
          <GameStatusDisplay status="playing" winner={null} currentPlayer={player} />
        );
        expect(getByText(new RegExp(`Current player: ${player}`))).toBeTruthy();
      });
    });
  });

  describe('Rendering', () => {
    it('should render status container', () => {
      const { getByTestId } = render(
        <GameStatusDisplay status="playing" winner={null} currentPlayer="X" />
      );
      expect(getByTestId('game-status')).toBeTruthy();
    });

    it('should render text inside container', () => {
      const { getByText } = render(
        <GameStatusDisplay status="playing" winner={null} currentPlayer="X" />
      );
      const statusText = getByText(/Current player/);
      expect(statusText).toBeTruthy();
    });
  });
});