import { StatusBar } from 'expo-status-bar';
import {Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import axios from "axios";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import {ChevronRightIcon} from "react-native-heroicons/solid";
import {useFocusEffect} from "@react-navigation/native";

export default function FavouriteScreen({ navigation }) {
    const IP = '192.168.40.105';
    const [user, setUser] = useState(null);
    const [favourite,setFavourite] = useState([])

    const getFavorites = async (userId) => {

            try {
                const response = await axios.get(`http://${IP}:4848/favourite/list/${userId}`);
                setFavourite(response.data)
                return response.data;
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    Alert.alert('Sản phẩm đã có trong mục yêu thích', 'Sản phẩm này đã được thêm vào mục yêu thích của bạn.');
                } else {
                    console.error('Lỗi khi gọi API:', error);
                }
                throw error;

        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    try {
                        const response = await axios.get(`http://${IP}:4848/users/${decodedToken.userId}`);
                        const userData = response.data;
                        setUser(userData);
                        await getFavorites(response.data._id);
                    } catch (error) {
                        console.log('Error:', error);
                    }
                }
            } catch (error) {
                console.log('Error retrieving token from AsyncStorage:', error);
            }
        };

        fetchData();
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const token = await AsyncStorage.getItem('token');
                    if (token) {
                        const decodedToken = jwtDecode(token);
                        try {
                            const response = await axios.get(`http://${IP}:4848/users/${decodedToken.userId}`);
                            const userData = response.data;
                            setUser(userData);
                            // Gọi hàm getFavorites sau khi đã lấy thông tin người dùng
                            await getFavorites(response.data._id);
                        } catch (error) {
                            console.log('Error:', error);
                        }
                    }
                } catch (error) {
                    console.log('Error retrieving token from AsyncStorage:', error);
                }
            };

            fetchData();
        }, [user])
    );
    const showDetail = (item) => {
        navigation.navigate('ProductDetail', { item });
    };
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => showDetail(item)} style={styles.favoriteItem}>
                <Image source={{ uri: item.image }} style={styles.favoriteImage} />
                <View style={styles.favoriteDetails}>
                    <View>
                        <Text style={styles.favoriteName}>{item.productName}</Text>
                        <Text style={styles.favoritePublisher}>{item.publisher}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.favoritePrice}>
                            {item.price.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </Text>
                        <ChevronRightIcon size={20} color={'#000000'}/>

                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontSize:24,fontWeight:'bold',textAlign:'center',margin:10}}>Favourites</Text>
            <View style={{height:1,backgroundColor:'#d9d9d9',marginVertical:10}}>

            </View>
            <FlatList
                data={favourite}
                renderItem={renderItem}
                keyExtractor={(item) => item.productId}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    favoriteItem: {
        flexDirection: 'row',
        marginHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#eee',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10


    },
    favoriteImage: {
        width: 125,
        height: 95,
        marginBottom:5
    },
    favoriteDetails: {
        flex: 1,
        margin:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'

    },
    favoriteName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom:5
    },
    favoritePublisher: {
        fontSize: 14,
        color: 'grey',
        marginBottom:5


    },
    favoritePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        marginBottom:5,
        marginRight:10
    },
});
