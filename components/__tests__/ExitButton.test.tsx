import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExitButton } from '../ExitButton';

describe('ExitButton', () => {
  const mockOnPress = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the exit button', () => {
    const { getByText, getByTestId } = render(<ExitButton onPress={mockOnPress} />);

    expect(getByTestId('exit-button')).toBeTruthy();
    expect(getByText('Exit Game')).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const { getByTestId } = render(<ExitButton onPress={mockOnPress} />);

    fireEvent.press(getByTestId('exit-button'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be pressable', () => {
    const { getByTestId } = render(<ExitButton onPress={mockOnPress} />);

    const button = getByTestId('exit-button');
    expect(button).toBeTruthy();

    // Test multiple presses
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(2);
  });
});
