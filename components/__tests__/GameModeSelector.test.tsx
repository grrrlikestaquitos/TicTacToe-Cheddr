import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameModeSelector } from '../GameModeSelector';

describe('GameModeSelector', () => {
  const mockOnStartGame = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render mode selection buttons initially', () => {
      const { getByText } = render(
        <GameModeSelector onStartGame={mockOnStartGame} />
      );

      expect(getByText(/Player vs Player/)).toBeTruthy();
      expect(getByText(/vs Computer/)).toBeTruthy();
    });

    it('should show title', () => {
      const { getByText } = render(
        <GameModeSelector onStartGame={mockOnStartGame} />
      );

      expect(getByText('Tic-Tac-Toe')).toBeTruthy();
    });

    it('should show subtitle', () => {
      const { getByText } = render(
        <GameModeSelector onStartGame={mockOnStartGame} />
      );

      expect(getByText(/Choose Game Mode/)).toBeTruthy();
    });
  });

  describe('PvP Mode', () => {
    it('should call onStartGame with pvp mode', () => {
      const { getByText } = render(
        <GameModeSelector onStartGame={mockOnStartGame} />
      );

      fireEvent.press(getByText(/Player vs Player/));

      expect(mockOnStartGame).toHaveBeenCalledWith('pvp');
    });

    it('should call immediately without additional options', () => {
      const { getByText } = render(
        <GameModeSelector onStartGame={mockOnStartGame} />
      );

      fireEvent.press(getByText(/Player vs Player/));

      expect(mockOnStartGame).toHaveBeenCalledTimes(1);
    });
  });

  describe('Computer Mode', () => {
    it('should show difficulty selector when computer mode and player selected', () => {
      const { getByText, getAllByText } = render(
        <GameModeSelector onStartGame={mockOnStartGame} />
      );

      fireEvent.press(getByText(/vs Computer/));

      // First select player symbol
      const xButtons = getAllByText(/^X$/);
      if (xButtons.length > 0) {
        fireEvent.press(xButtons[0]);
      }

      // Now difficulty should be shown
      // Look for difficulty button text with pattern
      const easyButtons = getAllByText(/Easy/);
      expect(easyButtons.length).toBeGreaterThan(0);
    });

    it('should show all difficulty options after player selection', () => {
      const { getByText, getAllByText } = render(
        <GameModeSelector onStartGame={mockOnStartGame} />
      );

      fireEvent.press(getByText(/vs Computer/));

      // Select player symbol first
      const oButtons = getAllByText(/^O$/);
      if (oButtons.length > 0) {
        fireEvent.press(oButtons[0]);
      }

      // Check for difficulty options
      const easyButtons = getAllByText(/Easy/);
      const mediumButtons = getAllByText(/Medium/);
      const hardButtons = getAllByText(/Hard/);

      expect(easyButtons.length).toBeGreaterThan(0);
      expect(mediumButtons.length).toBeGreaterThan(0);
      expect(hardButtons.length).toBeGreaterThan(0);
    });

    it('should show player symbol selector first', () => {
      const { getByText, getAllByText } = render(
        <GameModeSelector onStartGame={mockOnStartGame} />
      );

      fireEvent.press(getByText(/vs Computer/));

      // Player symbol buttons should be available
      const xButtons = getAllByText(/^X$/);
      const oButtons = getAllByText(/^O$/);

      expect(xButtons.length).toBeGreaterThan(0);
      expect(oButtons.length).toBeGreaterThan(0);
    });
  });
});

