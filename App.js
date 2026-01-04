import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Add these new imports at the top of your App.js
import RegisterScreen from './src/components/RegisterScreen';
import LoginScreen from './src/components/LoginScreen';
import HomeScreen from './src/components/HomeScreen';
import EditProfileScreen from './src/components/EditProfileScreen';
import ProfileScreen from './src/components/ProfileScreen';
import ForgotPasswordScreen from './src/components/ForgotPasswordScreen';
import LeaderboardScreen from './src/components/LeaderboardScreen';
import ChattingScreen from './src/components/ChattingScreen';
import SDG13Screen from './src/components/SDG13Screen';
import EventScreen from './src/components/EventScreen';
import EventDetailScreen from './src/components/EventDetailScreen';
import ChallengeScreen from './src/components/ChallengeScreen';
import ChallengeDetailScreen from './src/components/ChallengeDetailScreen';
import NewsScreen from './src/components/NewsScreen';
import SavedNewsScreen from './src/components/SavedNewsScreen';
import TipsScreen from './src/components/TipsScreen';
import NewsDetailScreen from './src/components/NewsDetailScreen';
import SharingScreen from './src/components/SharingScreen';
import CreateSessionScreen from './src/components/CreateSessionScreen';
import SessionDetailScreen from './src/components/SessionDetailScreen';
import CreatePostScreen from './src/components/CreatePostScreen';



import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';


const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

// You'll need to create this component in a separate file


const SplashScreen = ({ navigation }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { duration: 500 }),
      withSpring(1, { duration: 300 })
    );
    opacity.value = withSpring(1, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePress = () => {
    navigation.navigate('Register');
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Image
            source={require('./assets/logomix.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Chatting" component={ChattingScreen} />
        <Stack.Screen name="Sharing" component={SharingScreen} />
        
        <Stack.Screen 
          name="CreateSession" 
          component={CreateSessionScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="SessionDetail" 
          component={SessionDetailScreen}
          options={{
            headerShown: false
          }}
        />
        
        <Stack.Screen 
          name="SDG13Screen" 
          component={SDG13Screen}
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />

        <Stack.Screen 
          name="EventScreen" 
          component={EventScreen}
          options={{
            headerShown: false
          }}
        />      

        <Stack.Screen 
          name="EventDetailScreen" 
          component={EventDetailScreen}
          options={{
            headerShown: false
          }}
        />  
        
        <Stack.Screen 
          name="ChallengeScreen" 
          component={ChallengeScreen}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen 
          name="ChallengeDetailScreen" 
          component={ChallengeDetailScreen}
          options={{
            headerShown: false
          }}
        />  

        <Stack.Screen 
          name="NewsScreen" 
          component={NewsScreen}
          options={{
            headerShown: false
          }}
        />  

        <Stack.Screen 
          name="SavedNewsScreen" 
          component={SavedNewsScreen}
          options={{
            headerShown: false
          }}
          /> 

          <Stack.Screen 
          name="Tips" 
          component={TipsScreen}
          options={{
            headerShown: false
          }}
        />  

        <Stack.Screen 
          name="NewsDetail" 
          component={NewsDetailScreen}
          options={{
            headerShown: false
          }}
        />  

        <Stack.Screen 
          name="CreatePost" 
          component={CreatePostScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32', // Primary green color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.4,
    height: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logo: {
    width: '80%',
    height: '80%',
  },
});