import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StatusBar, View, Text } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { HumanDesignScreen } from './src/screens/HumanDesignScreen';
import { DestinyMatrixScreen } from './src/screens/DestinyMatrixScreen';
import { AscendantScreen } from './src/screens/AscendantScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#050505' }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#050505' }
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="HumanDesign" component={HumanDesignScreen} />
          <Stack.Screen name="DestinyMatrix" component={DestinyMatrixScreen} />
          <Stack.Screen name="Ascendant" component={AscendantScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

