import React, {useState, useEffect} from 'react'
import { useSelector } from "react-redux";
import { StyleSheet, Text, View, Image, Modal, FlatList, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import {firestore, storage} from '../../firebase/config'

const Card = ({item, nav}) => {
    const { uid, username } = useSelector((state) => state.user)
    const [comment, openComment] = useState(false)
    const [profilePic, setProfilePic] = useState(false)
    const [moreContent, openContent] = useState(false)
    const [modalVisible, openModal] = useState(false)
    const [newComment, setnewComment] = useState("")

    const getProfilePic =  async () => {
        const defaultPic = await storage.ref('avatars').child('defaultAvatar.png').getDownloadURL()
        // console.log('defaultPic', defaultPic)
        await storage.ref('avatars').child(item.uid).getDownloadURL().then(onResolve, onReject);
        function onResolve (foundURL) {
            setProfilePic(foundURL)
        } 
        function onReject(error) {
            setProfilePic(defaultPic)
        }
    }
    useEffect(() => {
        let mounted = true;
        if(mounted){
            getProfilePic()
            return () => mounted = false;
        }
    }, [])
    

    const likePost = async (id) => {
        const data = await firestore.collection("posts").doc(id).get();
        console.log("data.data()", data);
        if (item.likedBy.includes(uid)) {
        await firestore
          .collection("posts")
          .doc(id)
          .update({
              like: Number(data.data().like) - 1,
            likedBy: data.data().likedBy.filter(id => id !== uid)
          });} else {
            await firestore
            .collection("posts")
            .doc(id)
            .update({
            like: Number(data.data().like) + 1,
            likedBy: [...data.data().likedBy, uid]
            });
          }
      };
      const leaveComment = async (id) => {
        const data = await firestore.collection("posts").doc(id).get();
        // console.log("data.data(", data);
        if (newComment != '') {
        await firestore
          .collection("posts")
          .doc(id)
          .update({
              comments: [ {username, comment: newComment}, ...data.data().comments]
           
          });
        setnewComment('')} 
      };
      
    //   const maap = 'Open Map'
    //   const
    return (
        <>
        <TouchableOpacity activeOpacity={1} onPress={() => nav.navigate('Post', 
        {item: item, nav, profilePic, color: '#a8e6cf'})}>
        <View 
            shadowColor={"#000000"}
            shadowOpacity={0.27}
            shadowRadius={3.25}
            shadowOffset={{
              height: 4,
              width: 2}}
            elevation={5}
            style={styles.card}>
                   
                <View style={styles.userInfo}>
                    <Image style={styles.profPic}
                    source={{uri: profilePic}}/>
                    <Text style={styles.username}>{item.username}</Text>
                    <TouchableOpacity onPress={() => openModal(true)} style={{width: 22, alignItems: 'center'}}>
                        <Ionicons
                        name="md-more"
                        size={30}
                        color='#bbb'
                        />
                    </TouchableOpacity>
                </View>
            <View style={{height: 200, marginBottom: 10,}}>
                <Image
                    style={styles.image}
                    source={{ uri: item.image }}
              
                /></View>
            {moreContent ? <Text style={styles.content}>{item.content}</Text> 
                : <View> 
                     {item.content ? <View>
                        {item.content.length < 70 ?
                            <Text style={styles.content}>{item.content}</Text> 
                            : <>
                                <Text style={styles.content}>{item.content.substr(0, 70)}{moreContent ? <></> : 
                                    <Text onPress={() => openContent(true)}>...</Text>
                                }</Text> 
                                
                            </>
                        }
                        </View> : <></>}
                </View>}
            <View style={styles.icons}>
                
                <View style={styles.iconWrapper}>
                <Ionicons
                    onPress={() => likePost(item.id) }
                    style={styles.icon}
                    name={item.likedBy.includes(uid) ? "md-heart" : "md-heart-empty"}
                    size={30}
                    color={item.likedBy.includes(uid) ? "#FF915E" : '#aaa'}
                />
                <Ionicons
                    style={styles.icon}
                    onPress={() => 
                        openComment(!comment)}
                    name="ios-chatboxes"
                    size={30}
                    color={comment ? "#a8e6cf" : '#aaa'}
                />
                </View>
                

            </View>
            {comment ? <View>{item.comments[0] ? 
                <>
                    <Text style={styles.commentSection}>Comments:</Text> 
                    <FlatList 
                        nestedScrollEnabled={true}
                        data={item.comments}
                        keyExtractor={(comment, indx) => indx.toString()}
                        renderItem={(comment ) => {
                        console.log("comment", comment);
                        return (
                            <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5, maxWidth: 300}}>
                            <Text style={styles.comment}>{comment.item.username}: </Text>
                            <Text>{comment.item.comment}</Text>
                            </View>
                        )}}
                    />
                    
                </> : <Text style={{ marginLeft: 10 ,marginTop: 5, marginBottom: 7,}}>No comments</Text>}
                <View style={{flexDirection: "row", justifyContent: 'space-around', alignItems: 'center'}}>
                <TextInput 
                    style={styles.input}
                    multiline={true}
                    maxLength={130}
                    placeholder={'Leave a comment...'}
                    placeholderTextColor={'#ccc'}
                    value={newComment}
                    onChangeText={(value) => setnewComment(value)}></TextInput>
                    <Ionicons
                    style={{marginRight: 15}}
                    onPress={() => 
                        leaveComment(item.id)}
                    name="ios-send"
                    size={34}
                    color="#a8e6cf"/>
                    </View>
                </View> : <></>}
            
            </View>
            </TouchableOpacity>
            <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {openModal(false)
            }}
            >
            {/* <View> */}
                <TouchableOpacity 
                    style={styles.modal} 
                    activeOpacity={1} 
                    onPressOut={() => {openModal(false)}}
                >
                    
                        <TouchableWithoutFeedback>
                            <View style={{alignSelf: 'stretch',  marginHorizontal: 10,marginBottom: 28,}}>
                            <View style={styles.modalContainer}>
                                {item.location ?
                                <TouchableOpacity activeOpacity={0.68} style={styles.modalOption} 
                                onPress={() => {return nav.navigate('Map', {item}), openModal(false)}}>
                                    <Text style={styles.optionText}>Open Map</Text>
                                </TouchableOpacity> : <TouchableOpacity activeOpacity={0.68} 
                                style={styles.modalOption}>
                                    <Text style={styles.optionText}>mmmmm whutcha say</Text>
                                </TouchableOpacity>}
                                <TouchableOpacity activeOpacity={0.68} style={styles.modalOption}>
                                    <Text style={styles.optionText}>{uid === item.uid ? "Delete Post" : "Smth..."}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.68} style={styles.modalOption}>
                                    <Text style={styles.optionText}>Other...</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.68} style={styles.modalOptionLast}>
                                    <Text style={styles.optionText}>Butt</Text>
                                </TouchableOpacity> 
                            </View>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity activeOpacity={0.68} onPress={() => openModal(false)}
                                 style={styles.modalOptionLast}><Text style={styles.optionText}>Cancel</Text></TouchableOpacity>
                            </View>
                            </View>
                        </TouchableWithoutFeedback>
                </TouchableOpacity>   
          
            {/* </View> */}
            </Modal>
            </>
          );
}
const styles = StyleSheet.create({
    card:{
        backgroundColor: "#fff",
        width: 350,
        alignSelf: 'stretch',
        borderRadius: 10,
        marginTop: 7,
        marginBottom: 7,
        marginHorizontal: 10,
    },
    userInfo: {
        marginTop: 4,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    },
    profPic: {
        width: 46, 
        height: 46, 
        borderRadius: 46, 
        marginVertical: 4, 
        borderColor: '#fff',
        borderWidth: 2,
        
    },
    image: {
        width: 350,
        height: 200,

    },
      username: {
          width: 200,
          textAlign: "left",
          paddingBottom: 5,
          fontSize: 20,
      },
      comment: {
          fontWeight: '500',
          marginLeft: 14,
      },
      commentSection: {
        marginHorizontal: 10
      },
      input: {
          borderWidth: 1,
          borderColor: '#a8e6cf',
          width: 270,
          marginLeft: 10,
          marginVertical: 10,
          borderRadius: 16,
          minHeight: 20,
        fontSize: 14,
        color: '#aaa',
        padding: 3,
        paddingHorizontal: 9,
      },
      content: {
          fontSize: 16, 
          marginHorizontal: 10, 
          marginBottom: 10
        },
      icons: {
          height: 40,
          marginHorizontal: 9,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
      },
      iconWrapper:{
        flexDirection: 'row',
      },
      icon: {
          marginHorizontal: 6,
      },
      modal: {
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: 'rgba(115, 123, 123, 0.4)'
      },
      modalContainer: {
        alignSelf: "stretch",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      modalOption: {
          paddingVertical: 20,
          borderColor: '#B2BFBF',
          borderBottomWidth: 1,
          alignSelf: 'stretch',
      },
      modalOptionLast: {
        paddingVertical: 20,
        alignSelf: 'stretch',
      },
      optionText: {
          textAlign: 'center',
          fontWeight: '500', 
          fontSize: 16
      }
  });


export default Card;