import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector} from 'react-redux'
import { auth, firestore } from "../firebase/config";
import Card from '../components/card/Card';


export const FeedScreen = ({navigation}) => {
    const dispatch = useDispatch();

    const [allPosts, setAllPosts] = useState([])

    useEffect(() => {
        let mounted = true;
        if(mounted){
        currentUser();
        console.log('currentUser()', currentUser())
        getCollection()
             return () => mounted = false;
        }
    }, []);

    // useEffect(() => {
    // }, [])

    const getCollection = async () => {
        await firestore.collection("posts").onSnapshot((data) => {
            setAllPosts(
              data.docs.map((doc) => {
                // console.log("doc.id", doc.id);
                return { ...doc.data(), id: doc.id };
              })
            );
          });
    }

    const currentUser = async () => {
        const currentUser = await auth.currentUser;
        // console.log("currentUser home screen", currentUser.displayName);
        dispatch({
            type: "CURRENT_USER",
            payload:{username: currentUser.displayName, uid: currentUser.uid}})
      };

    //   console.log("allPosts from home", allPosts);

    return (
        <View style={styles.wrapper}>
            <FlatList 
            showsVerticalScrollIndicator={false}
                data={allPosts}
                keyExtractor={(item, indx) => indx.toString()}
                renderItem={({ item }) => {
                // console.log("post", item.comments);
                return (
                      <Card item={item} nav={navigation}/>
                )}}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1, 
        backgroundColor: '#F3F3F3',
        alignItems: "center", 
        justifyContent: "center",
        },

  });
