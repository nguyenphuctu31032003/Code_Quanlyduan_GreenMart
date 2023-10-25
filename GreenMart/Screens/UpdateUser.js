import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default function UpdateUser({ navigation, route }) {
    // const { item } = route.params;
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [address, setAddress] = useState(null);
    // const [isDataLoaded, setIsDataLoaded] = useState(false);
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
                        setName(response.data.name)
                        setPassword(response.data.password)
                        setAddress(response.data.address)

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

    const handleUpdate = () => {
        // Thực hiện gửi yêu cầu cập nhật thông tin người dùng lên máy chủ ở đây

        // Quay lại màn hình trước đó
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <Text style={styles.label}>Address:</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={(text) => setAddress(text)}
            />

            <Button title="Update" onPress={handleUpdate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        marginBottom: 15,
        padding: 10,
        fontSize: 16,
    },
});
