import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView} from 'react-native';

export default function Code({navigation}) {
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flex:60,
                justifyContent:'center',
                alignItems:'center',

            }}>
                <Image
                    source={require('./assets/code2.png')}
                    style={{ width: 300, height: 300, justifyContent:'center',alignItems:"center"}}
                />
            </View>

            <View style={{
                flex:5,
                marginTop:-20,
                justifyContent:'center',
                alignItems:'center'
            }}>
                <Text style={{
                    fontSize:20,
                    marginBottom:10
                }}>Enter the 5 digit number sent to</Text>
                <Text style={{
                    fontSize:20,
                }}>this phone number: <Text style={{fontWeight:'bold'}}>0326045826</Text></Text>
            </View>
            <View style={{
                flex:15,
                justifyContent:'center',
                alignItems:'center',
            }}>
                <View style={{
                    width:'75%',
                    height:60,
                    backgroundColor:'#74ee89',
                    borderRadius:50,
                    justifyContent:'center',
                    flexDirection:'row',
                    paddingTop:15,
                    marginTop:40

                }}>
                    <View style={{
                        width:30,
                        height:2,
                        backgroundColor:'white',
                        marginTop:20
                    }}></View>
                    <View style={{
                        width:30,
                        height:2,
                        backgroundColor:'white',
                        marginStart:25,
                        marginTop:20
                    }}></View>
                    <View style={{
                        width:30,
                        height:2,
                        backgroundColor:'white',
                        marginStart:25,
                        marginTop:20
                    }}></View>
                    <View style={{
                        width:30,
                        height:2,
                        backgroundColor:'white',
                        marginStart:25,
                        marginTop:20
                    }}></View>
                    <View style={{
                        width:30,
                        height:2,
                        backgroundColor:'white',
                        marginStart:25,
                        marginTop:20
                    }}></View>

                </View>
            </View>
            <View style={{
                flex:10,
                justifyContent:'center',
                alignItems:'center'
            }}>
                <Text>Resend Code ?</Text>
            </View>
            <View style={{
                flex:10,
                justifyContent:'center',
                alignItems:'center'
            }}>
                <TouchableOpacity style={{
                    backgroundColor:'#53B175',
                    width:'80%',
                    height:60,
                    justifyContent:'center',
                    alignItems:'center',
                    borderRadius:60
                }}>
                    <Text style={{
                        color:'white',
                        fontSize:20,
                    }}>Verify</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        flex:1
    }
});
