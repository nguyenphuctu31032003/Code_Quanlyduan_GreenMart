import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView, Button} from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import Modal from 'react-native-modal';
import {useFocusEffect} from "@react-navigation/native";

const CartScreen = ({navigation}) => {
    const [cartItems, setCartItems] = useState([]);
    const IP = '192.168.40.105';
    const [user, setUser] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    useEffect(() => {
        const newTotalPrice = cartItems.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);
        setTotalPrice(newTotalPrice);
    }, [cartItems]);


    useEffect(() => {
        const fetchUserFromToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    console.log(decodedToken.userId);
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

    const loadCartData = () => {
        axios.get(`http://${IP}:4848/cart/showcart/${user._id}`)
            .then((response) => {
                setCartItems(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu giỏ hàng', error);
            });
    };
    useEffect(() => {
        loadCartData()
    }, [user]);
    useFocusEffect(
        React.useCallback(() => {
            loadCartData();
        }, [user])
    );
    const increaseQuantity = (item) => {
        // Gọi API để tăng số lượng trên máy chủ
        axios.put(`http://${IP}:4848/cart/increase/${item.productId}`)
            .then((response) => {
                // Cập nhật số lượng trên máy chủ thành công, cập nhật lại ứng dụng React Native
                const updatedItems = cartItems.map((cartItem) => {
                    if (cartItem._id === item._id) {
                        // Tăng số lượng sản phẩm
                        cartItem.quantity += 1;
                    }
                    return cartItem;
                });
                setCartItems(updatedItems);
            })
            .catch((error) => {
                console.error('Lỗi khi tăng số lượng', error);
            });
    };

    const decreaseQuantity = (item) => {
        if (item.quantity <= 1) {
            return;
        }
        // Gọi API để giảm số lượng trên máy chủ
        axios.put(`http://${IP}:4848/cart/decrease/${item.productId}`)
            .then((response) => {
                // Cập nhật số lượng trên máy chủ thành công, cập nhật lại ứng dụng React Native
                const updatedItems = cartItems.map((cartItem) => {
                    if (cartItem._id === item._id) {
                        // Giảm số lượng sản phẩm, nhưng không được nhỏ hơn 1
                        cartItem.quantity = Math.max(1, cartItem.quantity - 1);
                    }
                    return cartItem;
                });
                setCartItems(updatedItems);
            })
            .catch((error) => {
                console.error('Lỗi khi giảm số lượng', error);
            });
    };


    const showConfirmationDialog = (item) => {
        setItemToRemove(item);
        setIsConfirmationVisible(true);
    };

    const cancelRemoval = () => {
        setIsConfirmationVisible(false);
    };

    const confirmRemoval = () => {
        if (itemToRemove) {
            axios.delete(`http://${IP}:4848/cart/remove/${itemToRemove.productId}`)
                .then((response) => {
                    const updatedItems = cartItems.filter((cartItem) => cartItem._id !== itemToRemove._id);
                    setCartItems(updatedItems);
                })
                .catch((error) => {
                    console.error('Lỗi khi xoá sản phẩm', error);
                });

            setIsConfirmationVisible(false);
        }
    };
    const gotocheckout = () => {
        navigation.navigate('CheckOut', {totalPrice})
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Giỏ Hàng</Text>
            <View style={{height:1,width:'100%',backgroundColor:'#e0e0e0'}}></View>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.itemDetails}>
                                <View style={styles.itemNameContainer}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => showConfirmationDialog(item)}>
                                        <Text style={styles.buttonText}>X</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.itemPrice}>Giá: {item.price} VND</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={() => decreaseQuantity(item)}>
                                        <Text style={styles.buttonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.itemQuantity}>{item.quantity}</Text>
                                    <TouchableOpacity style={styles.button} onPress={() => increaseQuantity(item)}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                            <View style={{height:1,width:'90%',backgroundColor:'#eaeaea', marginTop:10}}></View>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity style={{
                bottom:0,
                backgroundColor:'#53B175',
                height:75,
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                margin:10,
                borderRadius:30,
            }} onPress={gotocheckout}>
                    <Text style={{fontSize:16,color:'white'}}>Go To Checkout</Text>
                    <View style={{right:-60,backgroundColor:'#489E67',padding:10,borderRadius:10}}>
                        <Text style={{color:'white'}}>{totalPrice.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}</Text>
                    </View>
            </TouchableOpacity>
            <Modal
                isVisible={isConfirmationVisible}
                backdropOpacity={0.5}
                animationIn="slideInUp"
                animationOut="slideOutDown"
            >
                <View style={styles.modalContent}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 20,}}>Bạn chắc chắn muốn xoá ?</Text>
                    <TouchableOpacity onPress={confirmRemoval} ><Text style={{fontSize:17}}>Xác Nhận</Text></TouchableOpacity>
                    <View style={{height:1,width:'100%',backgroundColor:'gray',margin:15}}></View>
                    <TouchableOpacity onPress={cancelRemoval} ><Text style={{fontSize:17}}>Huỷ</Text></TouchableOpacity>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:'white'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom:18
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    image: {
        width: 130,
        height: 130,
        borderRadius: 10,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16,
    },
    itemNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 16,
        color: 'green',
    },
    itemQuantity: {
        fontSize: 16,
        fontWeight:'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        padding: 5,
        margin: 10,
        borderRadius: 13,
        borderWidth:1,
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center'
    },
    deleteButton: {
        padding: 5,
        borderRadius: 5,

    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color:'gray'
    },
});

export default CartScreen;
