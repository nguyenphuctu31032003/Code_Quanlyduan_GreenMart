import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    return (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>

                <Text style={{marginBottom:0, fontSize:20, fontWeight:"bold"}}>{item.name}</Text>
                <Text style={{marginBottom:40,}}>  1kg, Price</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => onUpdateQuantity(item.id, 'decrease')} >
                        <Text style={styles.buttontext}>-</Text>
                    </TouchableOpacity>
                    <Text style={{fontWeight:"bold"}}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => onUpdateQuantity(item.id, 'increase')}>
                        <Text style={styles.buttoncong}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.priceedit}>${(item.price * item.quantity).toFixed(2)}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
                <Text>X</Text>
            </TouchableOpacity>
        </View>
    );
};

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Cà Chua',
            image: 'https://haycafe.vn/wp-content/uploads/2022/02/Anh-gai-xinh-Viet-Nam-682x600.jpg',
            quantity: 2,
            price: 10.99,
        },
        {
            id: 2,
            name: 'Táo',
            image: 'https://haycafe.vn/wp-content/uploads/2022/02/Anh-gai-xinh-Viet-Nam-682x600.jpg',
            quantity: 3,
            price: 15.99,
        },
        {
            id: 3,
            name: 'Đào',
            image: 'https://haycafe.vn/wp-content/uploads/2022/02/Anh-gai-xinh-Viet-Nam-682x600.jpg',
            quantity: 3,
            price: 5.99,
        },
        {
            id: 4,
            name: 'Nho',
            image: 'https://haycafe.vn/wp-content/uploads/2022/02/Anh-gai-xinh-Viet-Nam-682x600.jpg',
            quantity: 3,
            price: 23,
        },
        {
            id: 5,
            name: 'Nho',
            image: 'https://haycafe.vn/wp-content/uploads/2022/02/Anh-gai-xinh-Viet-Nam-682x600.jpg',
            quantity: 3,
            price: 17.3,
        },
        // Add more items as needed
    ]);

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const removeFromCart = (itemId) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
    };

    const updateQuantity = (itemId, action) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.id === itemId) {
                if (action === 'increase') {
                    item.quantity += 1;
                } else if (action === 'decrease') {
                    item.quantity -= 1;
                }
            }
            return item;
        });
        setCartItems(updatedCartItems);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.cartTitle}>My Cart</Text>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <CartItem item={item} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />
                )}
            />

            <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.btnCheckOut}>Go to Checkout </Text>
                <TouchableOpacity style={styles.tongTien}>
                    <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    buttontext:{
        fontWeight: 'bold',
        fontSize: 20,
    },
    buttoncong:{
        fontWeight: 'bold',
        color: "#53B175",
        fontSize: 20,
    },
    cartTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop:50,
        marginBottom: 40,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },

    priceedit: {
        marginTop:80,
        fontWeight: "bold"
    },
    productImage: {
        width: 120,
        height: 120,
        marginRight: 16,
    },
    productInfo: {
        flex: 1,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 90,

    },
    removeButton: {
        marginLeft: 8,
        marginBottom: 80,
        fontSize: 25,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 12,
        fontWeight: 'bold',
        padding: 5,
        color: '#fff',
    },
    quantityButton: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
    },
    btnCheckOut:{
        color:'#fff',
        fontWeight:'bold',
        marginLeft:60,
        flex: 1, // Sử dụng flex để text chiếm hết không gian còn lại
        textAlign: 'center',
    },
    checkoutButton: {
        backgroundColor: '#53B175',
        padding: 20,
        flexDirection:'row',
        alignItems: 'center',
        borderRadius: 18,
        marginTop: 16,
    },
    tongTien: {
        backgroundColor: '#489E67',
        alignItems: 'center',
        borderRadius: 8,

    },
});

export default CartScreen;
