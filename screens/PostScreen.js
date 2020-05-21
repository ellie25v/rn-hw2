import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { StyleSheet, Text, View, Image, Modal,
    ScrollView, FlatList, TouchableOpacity, TouchableWithoutFeedback, TextInput, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import {firestore, storage } from '../firebase/config'


export const PostScreen = ({route}) => {
    const { item, nav, profilePic, color } = route.params;
    const { uid, username } = useSelector((state) => state.user)
    const initialState = {
            image: item.image,
              like: item.like,
              comments: item.comments,
              content: item.content ? item.content : '',
              uid: item.uid,
              date: item.date,
              likedBy: item.likedBy,
              username: item.username,
    }
    const [comment, openComment] = useState(false)
    const [modalVisible, openModal] = useState(false)
    const [dataa, setData] = useState(initialState)
    const [newComment, setnewComment] = useState("")
    // const [likey, meLikey] = useState(false)


    useEffect(() => {
        // let mounted = true;
        // if(mounted){
            getData(item.id)
            console.log('likedBy >>>', dataa)
        //     return () => mounted = false;
        // }
    }, [dataa.like])

    const getData = async (id) =>{
        // await firestore.collection("posts").onSnapshot((data) => {
        //     console.log('data', data.data())
        //     setData(
        //       data.docs
        //     //   .map((doc) => {
        //     //     // console.log("doc.id", doc.id);
        //     //     return { ...doc.data(), id: doc.id};
        //     //   })
        //     );
        //   });
        let daa
        await firestore
        .collection("posts")
        .doc(id)
        .onSnapshot((data) =>  setData(data.data()))
        // setData(data.data()));

        // const dataaa = await firestore.collection("posts").doc(id).get()
        // // console.log('dataa ->>', dataaa)
        // const da = await dataaa.data()
        // // console.log('da', da)
        // setData(da)
        // console.log('dataa', dataa)
    }
    
    const likePost = async (id) => {
        const data = await firestore.collection("posts").doc(id).get();
        // console.log("dataa", dataa);
        // console.log('tueee', dataa.likedBy.includes(uid))
        if (!dataa.likedBy.includes(uid)) {
            await firestore
            .collection("posts")
            .doc(id)
            .update({
            like: Number(data.data().like) + 1,
            likedBy: [...data.data().likedBy, uid]
            });
          } else {await firestore
            .collection("posts")
            .doc(id)
            .update({
                like: Number(data.data().like) - 1,
              likedBy: data.data().likedBy.filter(id => id !== uid)
            });}
      };
      const leaveComment = async (id) => {
        const data = await firestore.collection("posts").doc(id).get();
        if (newComment != '') {
        await firestore
          .collection("posts")
          .doc(id)
          .update({
              comments: [ {username, comment: newComment}, ...data.data().comments]
           
          });
        setnewComment('')} 
      };
    

    return (
        <>
        {/* <ScrollView> */}
        <View 
            style={styles.card}>
                   
                <View style={styles.userInfo}>
                <Image style={{width: 66, height: 66, borderRadius: 66, marginVertical: 4}}
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
            <View style={{marginBottom: 10}}>
                <Image
                    style={styles.image}
                    source={{ uri: item.image }}
              
                /></View>
            {item.content ? 
                     <Text style={styles.content}>{item.content}</Text> 
                      : <></>}
            <View style={styles.icons}>
                
                <View style={styles.iconWrapper}>
                    <TouchableOpacity style={styles.iconWrapper}
                    onPress={() => { 
                        return likePost(item.id) } }>
                    <Text style={styles.likesAndCom}>{dataa.like}</Text>
                <Ionicons
                    style={styles.icon}
                    name={dataa.likedBy.includes(uid) ? "md-heart" : "md-heart-empty"}
                    size={30}
                    color={dataa.likedBy.includes(uid) ? "#FF915E" : '#aaa'}
                />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconWrapper}
                 onPress={() => openComment(!comment)}>
                <Text style={styles.likesAndCom}> {dataa.comments ? dataa.comments.length : 0}</Text>
                
                <Ionicons
                    style={styles.icon}
                    name="ios-chatboxes"
                    size={30}
                    color={comment ? color : '#aaa'}
                /></TouchableOpacity>
                </View>
                

            </View>
            </View>
            <View style={styles.card}>
            {comment ? <View style={{flexDirection: "row", justifyContent: 'space-around', alignItems: 'center'}}>
                <TextInput 
                    style={{...styles.input, borderColor: color}}
                    multiline={true}
                    maxLength={130}
                    placeholder={'Leave a comment...'}
                    placeholderTextColor={'#ccc'}
                    value={newComment}
                    textAlignVertical={'center'}
                    onChangeText={(value) => setnewComment(value)}></TextInput>
                    <Ionicons
                    style={{marginRight: 15}}
                    onPress={() => 
                        leaveComment(item.id)}
                    name="ios-send"
                    size={34}
                    color={color}/>
                    </View> : <></>}
                    {dataa.comments[0] ? 
                <>
                    <Text style={styles.commentSection}>Comments:</Text> 
                    <FlatList 
                        nestedScrollEnabled={true}
                        data={dataa.comments}
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
            </View>
            
            
            <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {openModal(false)
            }}
            >
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
          
            </Modal>
            {/* </ScrollView> */}
            </>
    );
    }
    const styles = StyleSheet.create({
        card:{
            backgroundColor: "#fff",
            alignSelf: 'stretch',
            marginBottom: 7,
            paddingBottom: Platform.OS ==='ios' ? 5 : 2
        },
        userInfo: {
            marginTop: 4,
            justifyContent: 'space-between',
            marginLeft: 17,
            marginRight: 6,
            alignItems: 'center',
            flexDirection: 'row',
        },
        image: {
            alignSelf: 'stretch',
            height: 250,
        },
          username: {
              width: 200,
              textAlign: "left",
              paddingBottom: 5,
              fontSize: 20,
          },
          comment: {
              fontWeight: '500',
              marginLeft: 28,
          },
          commentSection: {
            marginHorizontal: 17,
            paddingTop: 5
          },
          likesAndCom: {
              fontWeight:'600', 
              color: '#7B8383', 
              fontSize: 17
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
            alignItems: 'center'
          },
          icon: {
              marginHorizontal: 6,
          },
          input: {
            borderWidth: 1,
            width: 320,
            marginLeft: 10,
            marginVertical: 10,
            borderRadius: 16,
            minHeight: 20,
            fontSize: 14,
            color: '#aaa',
            padding: Platform.OS === 'ios' ? 7 : 3,
            paddingHorizontal: 9,
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