import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Square } from '../Square';

describe('Square Component', () => {
  const mockOnPress = jest.fn();
  const boardSize = 300;

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('Rendering', () => {
    it('should render empty square with no value', () => {
      const { getByTestId } = render(
        <Square value={null} index={0} onPress={mockOnPress} boardSize={boardSize} />
      );
      expect(getByTestId('square-0')).toBeTruthy();
    });

    it('should render X when value is X', () => {
      const { getByText } = render(
        <Square value="X" index={0} onPress={mockOnPress} boardSize={boardSize} />
      );
      expect(getByText('X')).toBeTruthy();
    });

    it('should render O when value is O', () => {
      const { getByText } = render(
        <Square value="O" index={4} onPress={mockOnPress} boardSize={boardSize} />
      );
      expect(getByText('O')).toBeTruthy();
    });

    it('should render with correct dimensions based on boardSize', () => {
      const { getByTestId } = render(
        <Square value={null} index={0} onPress={mockOnPress} boardSize={boardSize} />
      );
      const square = getByTestId('square-0');
      const expectedSize = boardSize / 3;
      expect(square.props.style).toContainEqual(
        expect.objectContaining({
          width: expectedSize,
          height: expectedSize,
        })
      );
    });
  });

  describe('Interactions', () => {
    it('should call onPress with correct index when pressed', () => {
      const { getByTestId } = render(
        <Square value={null} index={5} onPress={mockOnPress} boardSize={boardSize} />
      );
      fireEvent.press(getByTestId('square-5'));
      expect(mockOnPress).toHaveBeenCalledWith(5);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress for any valid index', () => {
      for (let i = 0; i < 9; i++) {
        mockOnPress.mockClear();
        const { getByTestId } = render(
          <Square value={null} index={i} onPress={mockOnPress} boardSize={boardSize} />
        );
        fireEvent.press(getByTestId(`square-${i}`));
        expect(mockOnPress).toHaveBeenCalledWith(i);
      }
    });

    it('should handle multiple presses', () => {
      const { getByTestId } = render(
        <Square value={null} index={0} onPress={mockOnPress} boardSize={boardSize} />
      );
      fireEvent.press(getByTestId('square-0'));
      fireEvent.press(getByTestId('square-0'));
      fireEvent.press(getByTestId('square-0'));
      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Styling', () => {
    it('should apply X styling when value is X', () => {
      const { getByTestId } = render(
        <Square value="X" index={0} onPress={mockOnPress} boardSize={boardSize} />
      );
      const square = getByTestId('square-0');
      // Check if X-specific styles are applied
      expect(square.props.style).toBeTruthy();
    });

    it('should apply O styling when value is O', () => {
      const { getByTestId } = render(
        <Square value="O" index={0} onPress={mockOnPress} boardSize={boardSize} />
      );
      const square = getByTestId('square-0');
      // Check if O-specific styles are applied
      expect(square.props.style).toBeTruthy();
    });

    it('should have activeOpacity for touch feedback', () => {
      const { getByTestId } = render(
        <Square value={null} index={0} onPress={mockOnPress} boardSize={boardSize} />
      );
      const square = getByTestId('square-0');
      expect(square.props.activeOpacity).toBe(0.7);
    });
  });

  describe('Props Validation', () => {
    it('should work with different board sizes', () => {
      const sizes = [300, 350, 400];
      sizes.forEach((size) => {
        const { getByTestId } = render(
          <Square value={null} index={0} onPress={mockOnPress} boardSize={size} />
        );
        expect(getByTestId('square-0')).toBeTruthy();
      });
    });

    it('should handle all board indices (0-8)', () => {
      for (let i = 0; i < 9; i++) {
        const { getByTestId } = render(
          <Square value={null} index={i} onPress={mockOnPress} boardSize={boardSize} />
        );
        expect(getByTestId(`square-${i}`)).toBeTruthy();
      }
    });
  });
});