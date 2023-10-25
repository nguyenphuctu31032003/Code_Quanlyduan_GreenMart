import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import { Button } from 'react-native-paper';
import axios from "axios";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {HeartIcon} from "react-native-heroicons/outline";
export default function ProductDetail({ navigation, route }) {
    const { item } = route.params;
    const [user, setUser] = useState("");
    const IP = '192.168.40.105'
    const [quantity, setQuantity] = useState(1);
    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    useEffect(() => {
        const fetchUserFromToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    console.log(decodedToken.userId)
                    try {
                        const response = await axios.get(`http://${IP}:4848/users/${decodedToken.userId}`);
                        const userData = response.data;
                        setUser(userData);
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
    const addToCart = async () => {
        try {
            const apiUrl = `http://${IP}:4848/cart/addtocart`;
            const requestData = {
                userId: user._id,
                productId: item._id,
                quantity: quantity,
                name:item.name,
                category:item.category,
                description:item.description,
                image:item.image,
                price:item.price,
                publisher:item.publisher,
                rented:item.rented
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log('Sản phẩm đã được thêm vào giỏ hàng.');
                alert("Them vao gio thanh cong")
            } else {
                console.error('Lỗi khi thêm sản phẩm vào giỏ hàng.');
                console.log(Error)
                alert("Them vao gio that bai")
                // Xử lý lỗi hoặc hiển thị thông báo lỗi ở đây
            }
        } catch (error) {
            console.error('Lỗi khi thực hiện cuộc gọi mạng:', error);
            // Xử lý lỗi mạng hoặc hiển thị thông báo lỗi mạng ở đây
        }
    };

    return (
        <View style={styles.container}>
            <View style={{width:'100%',height:'30%',justifyContent:'center', alignItems:'center',borderBottomRightRadius:50,borderBottomLeftRadius:50,backgroundColor: '#F2F3F2'}}>
                <Image style={styles.image} source={{ uri: item.image }} />
            </View>
            <View style={{
                width:'100%',
                height:'100%',
                backgroundColor:'white',
                borderColor:'f6fff1',
                padding:20
            }}>
                <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                    <Text style={styles.name}>{item.name}</Text>
                    <TouchableOpacity style={{marginTop:10}}>
                        <HeartIcon color={'gray'} width={30} height={30}/>
                    </TouchableOpacity>
                </View>
                <Text style={{color:'gray',fontSize:15,marginTop:5}}>{item.category}</Text>
                <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:5 }}>
                        <TouchableOpacity onPress={decreaseQuantity}>
                            <Text style={{
                                fontSize: 40,
                                margin: 15,
                            }}>-</Text>
                        </TouchableOpacity>
                        <View style={{
                            width:40,
                            height:40,
                            borderRadius:10,
                            borderColor:'#e5e5e5',
                            borderWidth:1,
                            justifyContent:'center',
                            alignItems:'center',
                        }}>
                            <Text style={styles.quantity}>{quantity}</Text>
                        </View>
                        <TouchableOpacity onPress={increaseQuantity}>
                            <Text style={{
                                fontSize: 35,
                                margin: 15,
                                color:'#489E67'
                            }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        fontSize: 20,
                        marginTop:5,
                        fontWeight:'bold',
                        alignSelf:'center',
                        color:'red',
                        marginRight:10
                    }}>
                        {item.price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    })}</Text>
                </View>
                <View style={{height:1,width:'100%', backgroundColor:'#e0e0e0',marginBottom:10}}></View>
                <Text style={styles.description}>Nhà sản xuất: {item.publisher}</Text>
                <Text style={styles.description}>Số Kg còn lại: {item.quantity}Kg</Text>
                <Text style={styles.description}>Đã bán: {item.rented}Kg</Text>
                <Text style={{fontSize:20,fontWeight:'bold', marginTop:10}}>Mô tả :</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Button
                        mode="contained"
                        style={styles.addToCartButton}
                        onPress={addToCart}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'white'
    },
    image: {
        width: 270,
        height: 270,
        borderRadius: 10,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop:5,
    },
    price: {
        fontSize: 18,
        color: 'green',
        marginTop: 5,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
    },
    addToCartButton: {
        marginTop: 20,
        width: '100%',
        height:60,
        backgroundColor: '#53B175',
        justifyContent:'center',
        alignItems:'center',

    },

    quantity: {
        fontSize: 20,
    },
});
