// Mock React Native with proper implementations
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
  StyleSheet: {
    create: (obj) => obj,
    flatten: jest.fn((style) => style),
  },
  ScrollView: 'ScrollView',
  ActivityIndicator: 'ActivityIndicator',
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((options) => options.ios),
  },
  Animated: {
    Value: jest.fn(function (initialValue) {
      this._value = initialValue;
      this.setValue = jest.fn();
      this.getValue = jest.fn(() => this._value);
      this.interpolate = jest.fn((config) => this._value);
    }),
    spring: jest.fn(() => ({
      start: jest.fn((callback) => {
        if (callback) callback();
      }),
    })),
    timing: jest.fn(() => ({
      start: jest.fn((callback) => {
        if (callback) callback();
      }),
    })),
    parallel: jest.fn((animations) => ({
      start: jest.fn((callback) => {
        if (callback) callback();
      }),
    })),
    sequence: jest.fn((animations) => ({
      start: jest.fn((callback) => {
        if (callback) callback();
      }),
    })),
    Text: 'Text',
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Add testing library matchers
require('@testing-library/jest-native/extend-expect');