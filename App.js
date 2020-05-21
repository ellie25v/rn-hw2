import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from 'react-redux'
import * as Font from 'expo-font';
import {decode, encode} from 'base-64'
import { Ionicons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import CreateScreen from './screens/CreateScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import ProfileRootScreen from './screens/ProfileRootScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import {store} from './redux/store'
import {auth} from './firebase/config'

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const MainTab = createMaterialBottomTabNavigator();
const AuthStack = createStackNavigator();


export default function App() {
  const [isAuth, setIsAuth] = useState(null);

  function useFonts(fontMap) {
    let [fontsLoaded, setFontsLoaded] = useState(false);
    (async () => {
      await Font.loadAsync(fontMap);
      setFontsLoaded(true);
    })();
    return [fontsLoaded];
  }


  let [fontsLoaded] = useFonts({
    'Bold': require('./assets/fonts/OpenSansCondensed-Bold.ttf'),
    'Light': require('./assets/fonts/OpenSansCondensed-Light.ttf'),
    'Italic': require('./assets/fonts/OpenSansCondensed-LightItalic.ttf'),
  });
  // console.log('isAuth', isAuth)

  const AuthStateChanged = async () => {
    await auth.onAuthStateChanged((user) => {
      console.log(" --- user onAuthStateChanged ---", isAuth);
      setIsAuth(user);
    });
  };

  useEffect(() => {
    AuthStateChanged();
  }, [isAuth]);

  if (!fontsLoaded) {
    return <Image style={{alignSelf: 'stretch', height: 300, marginTop: 200}}
     source={{uri : 'https://i.pinimg.com/originals/78/e8/26/78e826ca1b9351214dfdd5e47f7e2024.gif'}}/>;
  } else {
    
  return (
  <Provider store={store}>
  <NavigationContainer>
    {isAuth ? 
    <MainTab.Navigator labeled={false}
    initialRouteName="Home"
    inactiveColor="rgba(255, 255, 255, 0.7)"
    // barStyle={{ justifyContent: "center"}}
    shifting={true}
    >
    <MainTab.Screen
    options={{
      // style: {alignItems: 'center'},
      tabBarColor: '#40E0D0',
      tabBarIcon:({focused, color}) => (
        <Ionicons
        name="ios-home" 
        size={focused ? 30 : 25}
        color={color}
        />
      )
    }}
    name="Home" component={HomeScreen} />
    <MainTab.Screen
    options={{
      tabBarVisible: false,
      // style: {alignItems: 'center', margin: 0},
      tabBarColor: '#363C3D',
      
      tabBarIcon: ({ focused, color }) => (
        <Ionicons
          name="md-add"
          size={focused ? 30 : 26}
          color={color}
        />
      ),
    }} 
    name="Create" component={CreateScreen} />
    <MainTab.Screen 
    options={{
      // style: {alignItems: 'center', padding: 0},
      tabBarColor: '#FFB41E',
      tabBarIcon: ({ focused,  color }) => (
        <Ionicons
          name="ios-contact"
          size={focused ? 27 : 22}
          color={color}
        />
      ),
    }}
    name="ProfileRoot" component={ProfileRootScreen} />
  </MainTab.Navigator> :
    <AuthStack.Navigator>
    <AuthStack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
    <AuthStack.Screen options={{ headerShown: false }} name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>}
  </NavigationContainer>
  </Provider>
  )}
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
});
