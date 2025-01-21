import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimerList from './src/screens/TimerList';
import AddTimer from './src/screens/AddTimer';
import { TimerProvider } from './src/context/TimerContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TimerProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Timers" component={TimerList}  />
          <Stack.Screen name="Add Timer" component={AddTimer} />
        </Stack.Navigator>
      </NavigationContainer>
    </TimerProvider>
  );
}