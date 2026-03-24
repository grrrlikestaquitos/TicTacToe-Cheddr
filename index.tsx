import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';

import App from './App';

// Wrap app with SafeAreaProvider for notch support
const RootApp = () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => RootApp);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(RootApp);
