import React, {useState , useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { TextInput, StyleSheet, TouchableOpacity, View, Text, Platform, Alert, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {auth} from '../../firebase/config'

const initialState = {
    email: "",
    password: "",
    username: "",
    photoURL: "https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png"
  };

const SignUpScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState(initialState);
    const [message, setmessage] = useState(null);

      useEffect(() => {
        currentUser();
      }, []);

      const currentUser = async () => {
        const currentUser = await auth.currentUser;
        console.log("currentUser", currentUser);
        dispatch({
            type: "CURRENT_USER",
            payload: {
              username: currentUser.displayName,
              uid: currentUser.uid,
              photoURL: currentUser.photoURL
            },
          });
      };

    const registerUser = async () => {
        const { email, password, username } = state;
        try {
            const user = await auth.createUserWithEmailAndPassword(email, password);
            console.log("user", user);
            await user.user.updateProfile({
                displayName: username,
        });
    } catch (error) {
      console.log(error);
      setmessage(error.message);
    }
    currentUser()
      };

    return (
        
        <LinearGradient
        colors={['#12c2e9', '#c471ed', '#f64f59']}
        // start={ [0, 0.5 ]}
        // end={[1, 0.5 ]}
        style={styles.bg}>
        <View style={styles.inputWrapper}>
            <Text style={styles.text}>Sign Up</Text>
        {/* <Ionicons
              name="ios-contact"
              size={focused ? 35 : size}
              color={color}
            /> */}
            <TextInput
            autoCapitalize={'none'}
            style={styles.input}
            maxLength={20}
            placeholder={'Username...'}
            placeholderTextColor={'#fff'}
            value={state.username}
            onChangeText={(value) => setState({ ...state, username: value })}
        />
        <TextInput
            autoCapitalize={'none'}
            style={styles.input}
            placeholder={'Email...'}
            placeholderTextColor={'#fff'}
            value={state.email}
            onChangeText={(value) => setState({ ...state, email: value })}
        />
        <TextInput
            autoCapitalize={'none'}
            style={styles.input}
            secureTextEntry={true}
            placeholder={'Password...'}
            placeholderTextColor={'#fff'}
            onChangeText={(value) => setState({ ...state, password: value })}
            value={state.password}
        />

        <TouchableOpacity style={styles.btn} onPress={registerUser}>
          <Text style={styles.btnTitle}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.btnToArea}
            onPress={() => navigation.navigate('Login')}>
             <Text style={styles.btnTo}>Already have an account?</Text>
        </TouchableOpacity>

        </View>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    bg:{
        flex: 1,
    },
    inputWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        color: "#fff",
        marginTop: 20,
        height: 37,
        fontSize: 16,
        padding: 5,
        paddingLeft: 16,
        borderColor: "#fff",
        borderWidth: 2,
        borderRadius: 24,
        width: 220,
        ...Platform.select({
            ios: {
                fontWeight: "500",
            },
            android: {
                fontWeight: "400",
            },
    })},
    text: {
        color: "#fff",
        fontSize: 24,
    },
    btnTo: {
        backgroundColor: 'transparent',
        color: "#fff",
        fontSize: 13,
        textDecorationLine: "underline"
    },
    btnToArea: {
        marginTop: 15,
    },
    btn: {
        backgroundColor: '#fff',
        width: 220,
        borderRadius: 24,
        height: 30,
        marginTop: 16,
        justifyContent: "center",
        alignItems: 'center'
    },
    btnTitle: {
        color: "#C171C8",
        fontSize: 16,
        fontWeight: '500',
    }
  });
  
export default SignUpScreen;