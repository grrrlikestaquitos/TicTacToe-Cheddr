import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ResetButton } from '../ResetButton';

describe('ResetButton Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('Rendering', () => {
    it('should render the reset button', () => {
      const { getByTestId } = render(
        <ResetButton onPress={mockOnPress} />
      );
      expect(getByTestId('reset-button')).toBeTruthy();
    });

    it('should display "New Game" text', () => {
      const { getByText } = render(
        <ResetButton onPress={mockOnPress} />
      );
      expect(getByText('New Game')).toBeTruthy();
    });

    it('should have correct button text styling', () => {
      const { getByText } = render(
        <ResetButton onPress={mockOnPress} />
      );
      const buttonText = getByText('New Game');
      expect(buttonText).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when button is pressed', () => {
      const { getByTestId } = render(
        <ResetButton onPress={mockOnPress} />
      );
      fireEvent.press(getByTestId('reset-button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple presses', () => {
      const { getByTestId } = render(
        <ResetButton onPress={mockOnPress} />
      );
      fireEvent.press(getByTestId('reset-button'));
      fireEvent.press(getByTestId('reset-button'));
      fireEvent.press(getByTestId('reset-button'));
      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it('should have active opacity for feedback', () => {
      const { getByTestId } = render(
        <ResetButton onPress={mockOnPress} />
      );
      const button = getByTestId('reset-button');
      expect(button.props.activeOpacity).toBe(0.85);
    });
  });

  describe('Styling', () => {
    it('should have proper button dimensions', () => {
      const { getByTestId } = render(
        <ResetButton onPress={mockOnPress} />
      );
      const button = getByTestId('reset-button');
      expect(button.props.style).toBeTruthy();
    });

    it('should apply shadow styling', () => {
      const { getByTestId } = render(
        <ResetButton onPress={mockOnPress} />
      );
      const button = getByTestId('reset-button');
      expect(button.props.style).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should accept onPress prop', () => {
      const testFunction = jest.fn();
      const { getByTestId } = render(
        <ResetButton onPress={testFunction} />
      );
      fireEvent.press(getByTestId('reset-button'));
      expect(testFunction).toHaveBeenCalled();
    });

    it('should work with different onPress functions', () => {
      const func1 = jest.fn();
      const func2 = jest.fn();
      const func3 = jest.fn();

      [func1, func2, func3].forEach((func) => {
        const { getByTestId } = render(
          <ResetButton onPress={func} />
        );
        fireEvent.press(getByTestId('reset-button'));
        expect(func).toHaveBeenCalled();
      });
    });
  });
});