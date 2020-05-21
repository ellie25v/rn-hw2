import React from 'react'
import { View, Platform } from 'react-native'
import {createStackNavigator, TransitionSpecs, HeaderStyleInterpolators} from '@react-navigation/stack'
import {FeedScreen} from './FeedScreen'
import {MapScreen} from './MapScreen'
import {PostScreen} from './PostScreen'

const RootMain = createStackNavigator();

// const HEADER_MAX_HEIGHT = 250;
// const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 40 : 53;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const MapTransition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    cardStyleInterpolator: ({ current, next, index, layouts }) => {
      return {
        cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
              {
                scale: next
                  ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.9],
                    })
                  : 1,
              },
            ],
          },
        overlayStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        },
      };
    },
  };
const MyTransition = {
    // gestureDirection: 'horizontal',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    cardStyleInterpolator: ({ current, next, index, layouts }) => {
      return {
        cardStyle: {
            opacity: current.progress.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0, 1, 1]
              }),
              transform: [
                  {scale:current.progress.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [0, 1, 1]
                    })
                  }
              ]
        },
        overlayStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        },
      };
    },
  };

const HomeScreen = () => {
    return (
        <RootMain.Navigator headerMode="float" screenOptions={{
            headerStyleInterpolator: HeaderStyleInterpolators.forFade,
            cardOverlayEnabled: true,
            gestureEnabled: true}}>
            <RootMain.Screen name="Feed" options={{headerStyle: {borderBottomColor: '#eee', borderBottomWidth: 1}, headerTitleAlign:'center'}} component={FeedScreen} />
            <RootMain.Screen options={{...MapTransition, headerBackTitleVisible: false, headerLeftContainerStyle:{paddingLeft: 10}, headerTitleAlign:'center'}} name="Map" component={MapScreen} />
            <RootMain.Screen options={{...MyTransition, headerBackTitleVisible: false,
             headerLeftContainerStyle:{paddingLeft: 10}, 
            headerTintColor: '#4DBFAC', animationTypeForReplace: "pop", gestureEnabled: true, headerTitleAlign:'center'}} name="Post" component={PostScreen} />
        </RootMain.Navigator>
    );
}

export default HomeScreen;