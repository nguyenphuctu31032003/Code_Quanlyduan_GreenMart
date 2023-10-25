import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import React from 'react';

import {useNavigation} from "@react-navigation/native";

export default function OrderSuccess({ navigation }) {
    const handlePress = () => {
        navigation.navigate('HomeScreen', {
            screen: 'Home',
            params: { selected: true },
        });
    };

    return (
 <View
 style={styles.container}
 >
     <View style={styles.imageview}>
         <Image style={styles.image}
                source={require("../assets/Accepted.png")}
         >

         </Image>
     </View>

     <Text style={styles.boldText}>Your Order has been</Text>
     <Text style={styles.boldText2}>accepted</Text>

     <Text style={styles.norText}>Your item has been placed and is on </Text>
     <Text style={styles.norText}>it's way to being processed </Text>
     <Pressable
         onPress={handlePress}
         style={styles.trackOrder}>

         <Text style={{color:'white',fontSize:18,fontWeight:"700"}}>Back to home</Text>
     </Pressable>
 </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
    },
imageview:{
        marginTop:120,
        width:'100%',
    height:'30%',
    position:'relative',
    left:-20,
    top:'-15%',

},
    image: {
        width:220,
        height:200,
        position:'relative',
        top:'-10%',
        alignSelf:'center',
    }, boldText: {
        marginLeft:20,
        position:'relative',
        top:'-10%',
        width:300,
fontSize:30,
    },
    boldText2: {
        marginLeft:20,
        alignSelf:'center',
position:'relative',
        top:'-10%',
        fontSize:30,
    },
    norText: {
        marginLeft:13,
        color:'#b6b6b6',
        position:'relative',
        top:'-7%',
        fontSize:15,
    },


    trackOrder: {
        position:"relative",
        top:"1%",
        borderRadius:25,
        alignItems:'center',
        width:'94%',
        height:'10%',
        backgroundColor:'#53b175',
        justifyContent:'center',
    },
    Backtohome: {
        position:"relative",
        top:"8%",
        marginTop:5,
        borderRadius:25,
        alignItems:'center',
        width:'94%',
        height:'10%',

    }
});
