import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
import ExperienceScreen from '../screens/ExperienceScreen';

export type RootStackParamList = {
  Landing: undefined;
  Experience: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Landing" component={LandingScreen} options={{ title: 'Landing' }} />
      <Stack.Screen name="Experience" component={ExperienceScreen} options={{ title: 'Experience' }} />
    </Stack.Navigator>
  );
}
