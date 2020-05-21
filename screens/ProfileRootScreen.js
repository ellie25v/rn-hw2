import React from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {createStackNavigator, TransitionSpecs, HeaderStyleInterpolators} from '@react-navigation/stack'
import {ProfileScreen} from './ProfileScreen'
import {MapScreen} from './MapScreen'
import {PostScreen} from './PostScreen'
import { SettingsScreen } from './SettingsScreen';

const RootProfile = createStackNavigator();

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
            // transform: [
            //   {
            //     translateX: current.progress.interpolate({
            //       inputRange: [0, 1],
            //       outputRange: [layouts.screen.width, 0],
            //     }),
            //   },
            //   {
            //     scale: next
            //       ? next.progress.interpolate({
            //           inputRange: [0, 1],
            //           outputRange: [1, 0.9],
            //         })
            //       : 1,
            //   },
            // ],
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
const ProfileRootScreen = () => {
  const { uid, username } = useSelector((state) => state.user);
    return (
        <RootProfile.Navigator headerMode="float" screenOptions={{
            headerStyleInterpolator: HeaderStyleInterpolators.forFade,
            cardOverlayEnabled: true,
            gestureEnabled: true}}>

            <RootProfile.Screen name="Profile" 
            options={{headerStyle: {borderBottomColor: '#eee', borderBottomWidth: 1, height: Platform.OS =='ios' ? 90: 70}, 
            title: username, headerTitleAlign:'center'}} 
            component={ProfileScreen} />
            
            <RootProfile.Screen 
            options={{...MapTransition, headerBackTitleVisible: false, 
              headerLeftContainerStyle:{paddingLeft: 10},headerTitleAlign:'center'}} 
            name="Map" component={MapScreen} />

            <RootProfile.Screen 
            options={{...MapTransition, headerBackTitleVisible: false, 
              headerLeftContainerStyle:{paddingLeft: 10},headerTitleAlign:'center'}} 
            name="Settings" component={SettingsScreen} />
            
            <RootProfile.Screen 
            options={{...MyTransition, headerBackTitleVisible: false,
            //   headerRight: ({navigation}) => (
            //     <TouchableOpacity>
            //     <Ionicons
            //         name="ios-settings"
            //         size={30}
            //         color='#aaa'
            // /></TouchableOpacity> ),
             headerLeftContainerStyle:{paddingLeft: 10}, headerTitleAlign:'center',
            headerTintColor: '#FFB41E', animationTypeForReplace: "pop", gestureEnabled: true,}} 
            name="Post" component={PostScreen} />
        </RootProfile.Navigator>
    );
}

export default ProfileRootScreen;