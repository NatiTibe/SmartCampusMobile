import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screen Imports
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ForgotPasswordScreen from './src/screens/ForgotPassword'; // <-- Added Import
import HomeScreen from './src/screens/HomeScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OrganizerDashboard from './src/screens/OrganizerDashboard';
import AdminDashboardScreen from './src/screens/AdminDashboard';
import BrowseEventsScreen from './src/screens/BrowseEventsScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import AIPicksScreen from './src/screens/AIPicksScreen';
import SubscribedEventsScreen from './src/screens/SubscribedEventsScreen';
import PopularExploreScreen from './src/screens/PopularExploreScreen';

const Stack = createStackNavigator();

export default function App() {
  // State to track current user role
  const [userRole, setUserRole] = useState('Student'); // 'Student' or 'Organizer'

  // Determine initial route based on user role (Login first, then role determines dashboard)
  const getInitialRoute = () => {
    // Always start at Login, user will navigate to dashboard after login
    return 'Login';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={getInitialRoute()}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
          initialParams={{ setUserRole }}
        />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} initialParams={{ setUserRole }} />
        
        {/* <-- Added ForgotPassword Screen --> */}
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
          initialParams={{ setUserRole, userRole }}
        />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ headerShown: false }} />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: false }}
          initialParams={{ setUserRole, userRole }}
        />
        <Stack.Screen 
          name="OrganizerDashboard" 
          component={OrganizerDashboard} 
          options={{ headerShown: false }}
          initialParams={{ setUserRole, userRole }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen} 
          options={{ headerShown: false }}
          initialParams={{ setUserRole, userRole }}
        />
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