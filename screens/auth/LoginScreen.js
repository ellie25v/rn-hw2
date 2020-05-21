import React, {useState} from 'react'
import { TextInput, StyleSheet, TouchableOpacity, View, Text, Platform, Alert, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../firebase/config'

const initialState = {
    email: "",
    password: "",
  };

const LoginScreen = ({ navigation }) => {
    const [state, setState] = useState(initialState);

    const loginUser = async () => {
        const { email, password } = state;
        console.log("email", email);
        console.log("password", password);
        try {
          await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
          console.log(error);
        }
      };
    

    return (
        <LinearGradient
        colors={['#22c1c3', '#fdbb2d']}
        // start={ [0, 0.5 ]}
        // end={[1, 0.5 ]}
        style={styles.bg}>
        <View style={styles.inputWrapper}>
        <Text style={styles.text}>Login</Text>
        {/* <Ionicons
              name="ios-contact"
              size={focused ? 35 : size}
              color={color}
            /> */}
        <TextInput
            autoCapitalize={'none'}
            style={styles.input}
            placeholder={'Mail...'}
            placeholderTextColor={'#fff'}
            value={state.email}
            onChangeText={(value) => setState({ ...state, email: value })}
        />
        <TextInput
            autoCapitalize={'none'}
            style={styles.input}
            placeholder={'Password...'}
            secureTextEntry={true}
            placeholderTextColor={'#fff'}
            onChangeText={(value) => setState({ ...state, password: value })}
            value={state.password}
        />

        <TouchableOpacity style={styles.btn} onPress={loginUser}>
          <Text style={styles.btnTitle}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.btnToArea}
        onPress={() => navigation.navigate('SignUp')}>
             <Text style={styles.btnTo}>New here? Create account</Text>
        </TouchableOpacity>
      
        </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    text: {
        color: "#fff",
        fontSize: 24,
        
    },
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
        marginTop: 20,
        color: "#fff",
        fontSize: 16,
        height: 40,
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
    btnTo: {
        backgroundColor: 'transparent',
        color: "#fff",
        fontSize: 13,
        textDecorationLine: "underline"
    },
    btnToArea: {
        marginTop: 20,
    },
    btn: {
        backgroundColor: '#fff',
        width: 220,
        borderRadius: 24,
        height: 35,
        marginTop: 15,
        justifyContent: "center",
        alignItems: 'center'
    },
    btnTitle: {
        color: "#ABBC73",
        fontSize: 17,
        fontWeight: '500',
    }
  });
  

export default LoginScreen;