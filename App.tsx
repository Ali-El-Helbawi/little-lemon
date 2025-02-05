/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import OnBoarding from './src/screens/OnBoarding';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Profile from './src/screens/Profile';
import {useUserStore} from './zustand/user';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  return (
    <View>
      <Text style={[{}]}>{title}</Text>
      <Text style={[{}]}>{children}</Text>
    </View>
  );
}
const OnBoardingNavigator = createStackNavigator();
function OnBoardingStack() {
  const user = useUserStore(state => state.user);
  const isLoggedIn = useUserStore(state => state.isLoggedIn);
  const isOnboardingCompleted = useUserStore(
    state => state.isOnboardingCompleted,
  );
  const logIn = useUserStore(state => state.logIn);
  const resetOnboarding = useUserStore(state => state.resetOnboarding);
  useEffect(() => {
    //resetOnboarding();
  }, []);
  return (
    <OnBoardingNavigator.Navigator>
      {isOnboardingCompleted ? (
        <>
          <OnBoardingNavigator.Screen
            name="Profile"
            component={Profile}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <OnBoardingNavigator.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{
            headerShown: false,
            animationTypeForReplace: isLoggedIn ? 'push' : 'pop',
          }}
        />
      )}
    </OnBoardingNavigator.Navigator>
  );
}
const RootApp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        barStyle={'default'}
        showHideTransition={'fade'}
        hidden={false}
        translucent={true}
      />
      <OnBoardingStack />
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <RootApp />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
});

export default App;
