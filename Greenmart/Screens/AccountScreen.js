import { StatusBar } from 'expo-status-bar';
import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default function AccountScreen({navigation}) {
    const [user,setUser] = useState(null)
    const IP = '192.168.40.105'
    useEffect(() => {
        const fetchUserFromToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    try {
                        const response = await axios.get(`http://${IP}:4848/users/${decodedToken.userId}`);
                        setUser(response.data)
                        console.log(response.data)
                    } catch (error) {
                        console.log('Error:', error);
                    }

                }
            } catch (error) {
                console.log('Error retrieving token from AsyncStorage:', error);
            }
        };

        fetchUserFromToken();

    }, []);
    const updateUser = () => {
        navigation.navigate('UpdateUser', {user})
    }
    const logout = () => {
        navigation.navigate('Login')
    }
    const myorder = () => {
        navigation.navigate('MyOrder')
    }
    return (
        <View style={styles.container}>
            <View style={styles.userview}>
                <Image style={styles.accImg}
                       source={require("../assets/user.png")}
                >

                </Image>
                <View style={{marginLeft:20,marginTop:7}}>
                    <Text style={{fontSize:20}}>{user ? user.name : 'Loading...'}</Text>
                    <Text>{user ? user.phone : 'Loading...'}</Text>
                </View>
                <TouchableOpacity style={{marginLeft:10}} onPress={updateUser}>
                    <Image style={{width:15,height:15,marginTop:10}}
                           source={require("../assets/pen.png")}
                    >
                    </Image>
                </TouchableOpacity>



            </View>
            <TouchableOpacity style={styles.selectedRow} onPress={myorder}>
      <Image
          style={{width:25,height:25,marginLeft:20}}
      source={require("../assets/bag.png")}
      >
      </Image>
                <Text style={{color:'black',fontWeight:'700',position:'relative',right:-20}}>Orders</Text>
                <Image source={require('../assets/backarrow.png')} style={{position:"absolute",right:20}}></Image>
            </TouchableOpacity>

            <Pressable style={styles.selectedRow}>
                <Image
                    style={{width:25,height:25,marginLeft:20}}
                    source={require("../assets/details.png")}
                >

                </Image>
                <Text style={{color:'black',fontWeight:'700',position:'relative',right:-20}}>My Details</Text>
                <Image source={require('../assets/backarrow.png')} style={{position:"absolute",right:20}}></Image>
            </Pressable>

            <Pressable style={styles.selectedRow}>
                <Image
                    style={{width:40,height:40,marginLeft:10}}
                    source={require("../assets/map.png")}
                >

                </Image>
                <Text style={{color:'black',fontWeight:'700',position:'relative',right:-20}}>Delivery Address</Text>
                <Image source={require('../assets/backarrow.png')} style={{position:"absolute",right:20}}></Image>
            </Pressable>

            <Pressable style={styles.selectedRow}>
                <Image
                    style={{width:25,height:25,marginLeft:20}}
                    source={require("../assets/payment.png")}
                >

                </Image>
                <Text style={{color:'black',fontWeight:'700',position:'relative',right:-20}}>Payment Methods</Text>
                <Image source={require('../assets/backarrow.png')} style={{position:"absolute",right:20}}></Image>
            </Pressable>

            <Pressable style={styles.selectedRow}>
                <Image
                    style={{width:25,height:25,marginLeft:20}}
                    source={require("../assets/notifications.png")}
                >

                </Image>
                <Text style={{color:'black',fontWeight:'700',position:'relative',right:-20}}>Notifications</Text>
                <Image source={require('../assets/backarrow.png')} style={{position:"absolute",right:20}}></Image>
            </Pressable>

            <Pressable style={styles.selectedRow}>
                <Image
                    style={{width:25,height:25,marginLeft:20}}
                    source={require("../assets/help.png")}
                >

                </Image>
                <Text style={{color:'black',fontWeight:'700',position:'relative',right:-20}}>Help</Text>
                <Image source={require('../assets/backarrow.png')} style={{position:"absolute",right:20}}></Image>
            </Pressable>


            <StatusBar style="auto" />
            <Pressable onPress={logout}
                style={styles.customButton}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }, accImg: {
        width:60,
        height:60,
    },
    userview: {
        marginLeft:20,
        alignSelf:'flex-start',
        position:"relative",
        top:'-15%',
        flexDirection:'row',
    },
    customButton: {
        backgroundColor:'#53B175',
        height:'10%',
        borderRadius:25,
      position:"absolute",
        bottom:'5%',
        alignSelf:'center',
        width:'90%',
        justifyContent:'center',
        alignItems:'center'
    }
    , buttonText: {
        fontWeight:'700',
        color:'white',
        fontSize:16,
        alignSelf:'center'
},

    selectedRow: {
        position:"relative",
        top:'-5%',
        flexDirection:'row',
        height:'10%',
        alignItems:'center',
        width:"100%",
        borderBottomColor:'white',
        borderTopColor:'#f2f3f2',
        borderWidth:0.5,
        customButton: {
            backgroundColor:'#53b175',
            height:'15%',
            borderRadius:25,
            marginTop:20,

            alignSelf:'center',
            width:'90%'
        }
    }


});
