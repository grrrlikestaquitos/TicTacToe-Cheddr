import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';

// Valid child component
const ValidComponent: React.FC<{ testID?: string }> = ({ testID = 'valid-component' }) => (
  <View testID={testID}>
    <Text>Valid Component</Text>
  </View>
);

describe('ErrorBoundary Component', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('should render valid children without errors', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <ValidComponent testID="child" />
      </ErrorBoundary>
    );

    expect(getByTestId('child')).toBeDefined();
  });

  it('should render multiple valid children', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <ValidComponent testID="child1" />
        <ValidComponent testID="child2" />
      </ErrorBoundary>
    );

    expect(getByTestId('child1')).toBeDefined();
    expect(getByTestId('child2')).toBeDefined();
  });

  it('should work through multiple render cycles', () => {
    const { getByTestId, rerender } = render(
      <ErrorBoundary>
        <ValidComponent testID="child" />
      </ErrorBoundary>
    );

    expect(getByTestId('child')).toBeDefined();

    rerender(
      <ErrorBoundary>
        <ValidComponent testID="child2" />
      </ErrorBoundary>
    );

    expect(getByTestId('child2')).toBeDefined();
  });

  it('should handle mounting and unmounting', () => {
    const { getByTestId, unmount } = render(
      <ErrorBoundary>
        <ValidComponent testID="child" />
      </ErrorBoundary>
    );

    expect(getByTestId('child')).toBeDefined();
    unmount();
  });

  it('should handle fragment children', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <>
          <ValidComponent testID="child1" />
          <ValidComponent testID="child2" />
        </>
      </ErrorBoundary>
    );

    expect(getByTestId('child1')).toBeDefined();
    expect(getByTestId('child2')).toBeDefined();
  });

  it('should wrap application content safely', () => {
    const App = () => (
      <ErrorBoundary>
        <View testID="app-container">
          <ValidComponent testID="content" />
        </View>
      </ErrorBoundary>
    );

    const { getByTestId } = render(<App />);
    expect(getByTestId('app-container')).toBeDefined();
    expect(getByTestId('content')).toBeDefined();
  });

  it('should be importable as component', () => {
    expect(ErrorBoundary).toBeDefined();
  });

  it('should accept children prop', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <ValidComponent testID="test-child" />
      </ErrorBoundary>
    );

    expect(getByTestId('test-child')).toBeDefined();
  });

  it('should handle class component correctly', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <ValidComponent testID="valid" />
      </ErrorBoundary>
    );

    expect(getByTestId('valid')).toBeDefined();
  });
});
