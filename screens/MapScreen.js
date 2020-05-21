import React, {useState} from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';


export const MapScreen = ({route}) => {
    // const [bigImage, enlargeImage] = useState(false)
    const { item } = route.params;
    const region = {
           latitude: item.location.latitude,
           longitude: item.location.longitude,
           latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
       
    }
    console.log('bigImage', bigImage)
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <MapView style={{alignSelf: 'stretch', flex: 1}} region={region} provider={PROVIDER_GOOGLE}
             minZoomLevel={2} maxZoomLevel={20} zoomControlEnabled={true}>
                 <Marker coordinate={{longitude: item.location.longitude, latitude: item.location.latitude}}>
                 
                    <Image
                    style={styles.image}
                    source={{ uri: item.image }}
                    />

                 </Marker>

            </MapView>
        </View>
    );
}
const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
    }
    
})