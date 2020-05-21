import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Platform, TouchableOpacity, Image, Modal, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import moment from 'moment'
import { firestore, storage } from "../firebase/config";


 const CreateScreen = ({navigation}) => {
    const { uid, username } = useSelector((state) => state.user);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [takePhoto, setTakePhoto] = useState("");
    const [photo, setPhoto] = useState(null);
    const [modal, openModal] = useState(false);
    const [value, setValue] = useState("");
    // const [selectedImage, setSelectedImage] = useState(null);

    let openImagePickerAsync = async () => {
      let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
  
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }
  
      let pickerResult = await ImagePicker.launchImageLibraryAsync();
  
      if (pickerResult.cancelled === true) {
        return;
      } 
      
      setPhoto( pickerResult.uri );
      console.log('photo ->', photo)
    };
    
    useEffect(() => {
      if(photo != null){
        openModal(true)
        // console.log('photo ->', photo)
      }
    }, [photo])


    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        console.log("status", status);

      })();
    }, []);

    const snap = async () => {
          let file = await takePhoto.takePictureAsync();
          setPhoto(file.uri);
      };

      const createPost = async (img) => {
        let location = await Location.getCurrentPositionAsync({});
        const date = moment().format('YYYY-MM-DD hh:mm:ss a');
        //   setLocation(location);}
        await firestore.collection("posts").add({
          image: img,
          like: 0,
          comments: [],
          content: value ? value : '',
          uid,
          date,
          likedBy: [],
          username,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
        // setPhoto(null)
      };
    
      const uploadStorage = async () => {
        const response = await fetch(photo);
        const file = await response.blob();
        const uniqueID = Date.now().toString();

        await storage.ref(`image/${uniqueID}`).put(file);

        const url = await storage.ref("image").child(uniqueID).getDownloadURL();
    
        console.log("url", url);
        createPost(url)
    }
    
  

        return (
          <View style={styles.container}>
      
            <Camera
              ref={(ref) => setTakePhoto(ref)}
              style={{ alignSelf: "stretch", aspectRatio: 1, }}
              type={type}
            >
                <Ionicons onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  )}}
                  style={{alignSelf: 'flex-end', margin: 3}}
                  name="md-reverse-camera"
                    size={36}
                    color='#fff'/>
                
            </Camera>
                    
            <Ionicons title="Snap" onPress={snap}
                style={{alignSelf: 'center', paddingBottom: 70}}
                name="ios-radio-button-on"
                size={60}
                color='#fff'/> 
            
            <TouchableOpacity
              onPress={openImagePickerAsync}
              style={styles.galleryBtn}>
                <Text style={styles.galleryBtnText}>Choose from gallery</Text>
              </TouchableOpacity>
            
             <Modal
              animationType="slide"
              transparent={false}
              visible={modal}
          //     onRequestClose={() => {
          // Alert.alert("Modal has been closed.");}}
            >
              <View style={styles.modalWrapper}>
                <View style={styles.header}>
                  <TouchableOpacity style={styles.sendBtn}
                  onPress={() => {openModal(false)
                  
                  }}>
                    <Text style={styles.galleryBtnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity
              onPress={() => {
                navigation.navigate('Feed')
                openModal(false)
                uploadStorage()}}
              style={styles.sendBtn}>
                <Text style={styles.galleryBtnText}>Send  </Text>
                {/* <Ionicons 
                name="ios-send"
                size={30}
                color='#fff'/>  */}
              </TouchableOpacity>
            </View>
          <View style={styles.modalView}>
            <Image source={{uri: photo}} 
            style={styles.image}/> 
            <TextInput
            style={styles.input}
            multiline={true}
            textAlignVertical={'top'}
            autoCapitalize={'none'}
            maxLength={5000}
            placeholder={'Add caption...'}
            placeholderTextColor={'#aaa'}
            value={value}
            onChangeText={(value) => setValue(value)}/>
          </View>
        </View>
      </Modal>
          </View>
        );
      };
      
//   return (
//     <View style={styles.container}>
//       <Text>CreateScreen</Text>
//       <Button title="Add post" onPress={addPosts} />
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS =='ios' ? 36 : 23,
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "space-between",
  },
  galleryBtn: {
    alignSelf: 'stretch',
    height: 50,
  },
  galleryBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: '#eee', 
  },
  header: {
    paddingTop: Platform.OS =='ios' ? 28 : 0,
    backgroundColor: '#f5af19', 
    height:Platform.OS =='ios' ? 80: 60, 
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: 'stretch',
    paddingHorizontal: 10
  },
  sendBtn: {
    flexDirection: "row",
    alignItems: 'center',
  },
  image: {
    alignSelf: 'stretch',
    height: 300,
  },
  input: {
        color: "#787472",
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity:  0.4,
        shadowRadius: 3,
        elevation: 5,
        padding: 10, 
        minHeight: 65, 
        borderBottomColor: '#ddd', 
        borderBottomWidth: 1, 
        backgroundColor: '#fff'
  }
});


export default CreateScreen;