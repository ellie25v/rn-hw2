import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, ScrollView, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { auth, firestore, storage } from "../firebase/config";


export const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const { uid, userPosts, username } = useSelector((state) => state.user);
  const [allPosts, setAllPosts] = useState([]);
  const [avatar, setAvatar] = useState('https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png');
  // const [post, openContent] = useState(false)
  // const [settingsVisible, openSettings] = useState(false)

  useEffect(() => {
    currentUser();
    getProfilePic()
  }, []);

  const getProfilePic =  async () => {
    const defaultPic = await storage.ref('avatars').child('defaultAvatar.png').getDownloadURL()
    console.log('defaultPic', defaultPic)
    await storage.ref('avatars').child(uid).getDownloadURL().then(onResolve, onReject);
    function onResolve (foundURL) {
      setAvatar(foundURL)
    } 
    function onReject(error) {
        console.log('error', error)
        setAvatar(defaultPic)
    }
  }
 

  const takePhoto = async () => {
    getPermissionAsync()
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });
    console.log("result", result.uri);
    setNewAvatar(result.uri)
   }

  const setNewAvatar = async (img) =>{
    const response = await fetch(img);
    const file = await response.blob();
    await storage.ref(`avatars/${uid}`).put(file);
    const photo = await storage.ref('avatars').child(uid).getDownloadURL();
    
    console.log("photo", photo);
    setAvatar(photo);
  };
  

  const getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };


  const currentUser = async () => {
    const currentUser = await auth.currentUser;
    dispatch({
        type: "CURRENT_USER",
        payload: {
          username: currentUser.displayName,
          uid: currentUser.uid,
          photoURL: currentUser.photoURL
        },
      });
      await firestore.collection("posts").where("uid", "==", currentUser.uid).onSnapshot((data) => {
        setAllPosts(
          data.docs.map((doc) => {
            console.log("doc.id", doc.id);
            return { ...doc.data(), id: doc.id };
          })
        );
      });
  };




  const signOut = async () => {
    await auth.signOut();
    dispatch({ type: "USER_SIGNOUT" });
  };


    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
            <TouchableOpacity onPress={takePhoto}>
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                borderWidth: 1,
                borderColor: '#aaa'
              }}
              source={{uri: avatar}}
            />
            </TouchableOpacity>
            <Ionicons
                    onPress={signOut}
                    style={{marginTop: 12}}
                    name="ios-log-in"
                    size={30}
                    color='#aaa'
            />
            </View>
            <View style={styles.grid}>
            <FlatList
                numColumns={3}
                horizontal={false}
                data={allPosts}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => {
                console.log("post from profile", item)
                return (
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('Post', {item, nav: navigation, profilePic: avatar, color: '#FFB41E'})}>
                        <Image
                          style={{
                            width: 110,
                            height: 110,
                            marginBottom: 10,
                            marginHorizontal: 5,
                            borderRadius: 10,
                          }}
                          source={{ uri: item.image }}
                        />
                    </TouchableOpacity>
                )
                }}
              />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
      flex: 1, 
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
      height: 90,
      marginTop: 108, 
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      alignContent: 'center',
      alignSelf: 'stretch',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
  },
  username: {
      // width: 70,
      marginTop: 10,
      fontSize: 30,
      color: '#000'
  },
  grid: {
      paddingTop: 15,
  }
});