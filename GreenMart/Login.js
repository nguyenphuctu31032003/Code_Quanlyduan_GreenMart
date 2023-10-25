import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import {loginUser} from "./api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({navigation}) {
    const [phone, setPhone] = useState('0326045826');
    const [password, setPassword] = useState('09032003');

    const handleLogin = async () => {
        try {
            const response = await loginUser(phone, password);
            const { token } = response.data;
            await AsyncStorage.setItem('token', token);
            console.log("login")
            navigation.navigate('HomeScreen');
            console.log('Token:', token);
        } catch (error) {
            Alert.alert('Error', 'Invalid credentials');
            console.log(error);
        }
    };

    const handleRegister = () => {
        navigation.navigate('Signup');
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={{
                marginTop:-200,
                marginBottom:20
            }}>
                <Image
                    source={require('./assets/code2.png')}
                    style={{ width: 300, height: 300}}
                />
            </View>
            <TextInput
                placeholder="Phone"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>
                Don't have an account?{' '}
                <Text
                    style={styles.registerLink}
                    onPress={handleRegister}
                >
                    Register
                </Text>
            </Text>
            <Text style={styles.headerText}>OR login with</Text>
            <View style={styles.iconContainer}>
                <Image
                    source={{
                        uri: 'https://www.facebook.com/images/fb_icon_325x325.png',
                    }}
                    style={styles.icon}
                />
                <Image
                    source={{
                        uri: 'https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK',
                    }}
                    style={styles.icon}
                />
                <Image
                    source={{
                        uri: 'https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/91/ef/67/91ef67ae-4877-1286-a4d6-fb04f6f37e9e/ProductionAppIcon-2x-4-0-0-85-220.png/1200x630bb.png',
                    }}
                    style={styles.icon}
                />
            </View>

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
    title: {
        color: '#53B175',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 250, // Giảm giá trị này lại để khoảng cách hợp lý
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 20,
        paddingLeft: 20,
        fontSize: 16,
        color: '#ffffff',
        backgroundColor: '#abd588',
    },
    button: {
        width: '80%',
        backgroundColor: '#53B175',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 20,
        color: '#53B175',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 10,
    },
    footerText: {
        fontSize: 18,
        color: '#333',
        marginTop: 20,
    },
    signUpText: {
        color: '#8a57ff',
        textDecorationLine: 'underline',
    },
    registerText: {
        marginTop: 10,
        alignSelf: 'center',
    },
    registerLink: {
        color: '#FF7658',
        textDecorationLine: 'underline',
    },
});
