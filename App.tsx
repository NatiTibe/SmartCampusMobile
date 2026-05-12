import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screen Imports
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OrganizerDashboard from './src/screens/OrganizerDashboard';
import AdminApprovalScreen from './src/screens/AdminApprovalScreen';
import BrowseEventsScreen from './src/screens/BrowseEventsScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import AIPicksScreen from './src/screens/AIPicksScreen';
import SubscribedEventsScreen from './src/screens/SubscribedEventsScreen';
import PopularExploreScreen from './src/screens/PopularExploreScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrganizerDashboard" component={OrganizerDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="AdminApproval" component={AdminApprovalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AIPicks" component={AIPicksScreen} options={{ headerShown: false }} />
        <Stack.Screen 
          name="BrowseEvents" 
          component={BrowseEventsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
        name="SubscribedEvents" 
        component={SubscribedEventsScreen} 
        options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="PopularExplore" 
        component={PopularExploreScreen}
        options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}