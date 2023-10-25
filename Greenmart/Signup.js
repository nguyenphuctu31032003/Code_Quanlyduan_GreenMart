import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView} from 'react-native';
import {registerUser} from "./api/api";

export default function Signup({navigation}) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');

    const handleRegister = async () => {
        if (/^\d{10}$/.test(phone)) {
            try {
                await registerUser(phone, password, identifier, address, 0, name);
                Alert.alert('Success', 'Đăng kí thành công', [{
                    text: 'OK', onPress: () => {
                        navigation.navigate("Login")
                    }
                }]);
            } catch (error) {
                Alert.alert('Error', 'Số điện thoại đã đăng kí ');
            }
        }else{
            alert('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.');
        }
    };
    const handleLogin = () => {
        navigation.navigate('Login');
    };
    const handleSignUp = () => {
        if (/^\d{10}$/.test(phone)) {
            navigation.navigate('Mobile number verification');
        } else {
            alert('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <View style={{
                marginTop:-200,
                marginBottom:20
            }}>
                <Image
                    source={require('./assets/code2.png')}
                    style={{ width: 250, height: 250}}
                />
            </View>
            <TextInput
                placeholderTextColor={'white'}
                placeholder="Name"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
            />
            <TextInput
                placeholderTextColor={'white'}
                placeholder="Phone"
                value={phone}
                onChangeText={text => setPhone(text)}
                style={styles.input}
            />
            <TextInput
                placeholderTextColor={'white'}
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                placeholderTextColor={'white'}
                placeholder="Identifier"
                value={identifier}
                onChangeText={text => setIdentifier(text)}
                style={styles.input}
            />
            <TextInput
                placeholderTextColor={'white'}
                placeholder="Address"
                value={address}
                onChangeText={text => setAddress(text)}
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>
                Already have an account?{' '}
                <Text
                    style={styles.registerLink}
                    onPress={handleLogin}
                >
                    Login
                </Text>
            </Text>
        </SafeAreaView>
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
        fontSize:15,
        marginTop:15
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
