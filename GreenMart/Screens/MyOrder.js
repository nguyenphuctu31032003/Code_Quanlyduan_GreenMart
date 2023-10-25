import React, { useState, useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { format } from 'date-fns';

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const IP = '192.168.40.105';

    useEffect(() => {
        const fetchUserFromToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    try {
                        const response = await axios.get(`http://${IP}:4848/users/${decodedToken.userId}`);
                        setUser(response.data);
                        console.log(response.data);
                    } catch (error) {
                        console.log('Error:', error);
                    }
                }
                setLoadingUser(false);
            } catch (error) {
                console.log('Error retrieving token from AsyncStorage:', error);
                setLoadingUser(false);
            }
        };

        fetchUserFromToken();
    }, []);

    useEffect(() => {
        if (!loadingUser) {
            fetchOrders();
        }
    }, [loadingUser]);

    const fetchOrders = async () => {
        try {
            if (user) {
                const response = await axios.get(`http://${IP}:4848/order/myorder/${user._id}`);
                const data = response.data;
                setOrders(data);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const toggleOrderExpansion = (item) => {
        setExpandedOrder(expandedOrder === item ? null : item);
    };

    const renderOrderItem = ({ item }) => {
        const createdAtDate = new Date(item.createdAt);
        const formattedDate = format(createdAtDate, 'dd/MM/yyyy HH:mm:ss');
        return (
            <View style={styles.orderContainer}>
                <TouchableOpacity onPress={() => toggleOrderExpansion(item)}>
                    <Text style={styles.orderTitle}>Đơn hàng: {formattedDate}</Text>
                </TouchableOpacity>
                {expandedOrder === item && (
                    <View>
                        <Text>Chi tiết đơn hàng:</Text>
                        {item.products.map((product) => (
                            <View key={product._id} style={styles.productContainer}>
                                <Image
                                    source={{ uri: product.image }}
                                    style={styles.productImage}
                                />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName}>{product.productName}</Text>
                                    <Text>Giá: {product.price}</Text>
                                    <Text>Số lượng: {product.quantity}</Text>
                                    <Text>Nhà xuất bản: {product.publisher}</Text>
                                </View>
                            </View>
                        ))}
                        <Text>Người đặt hàng: {item.userName}</Text>
                        <Text>Địa chỉ: {item.address}</Text>
                        <Text>Số điện thoại: {item.phone}</Text>
                        <Text>Tổng cộng: {item.totalAmount}</Text>
                        <Text>Phương thức thanh toán: {item.paymentMethod}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={renderOrderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    orderContainer: {
        backgroundColor: "white",
        marginVertical: 10,
        borderRadius: 10,
        padding: 10,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 5,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default MyOrder;
