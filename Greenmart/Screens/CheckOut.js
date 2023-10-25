import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal
} from "react-native";import { TextInput, Button, RadioButton } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import axios from "axios";
import paypalAPI from "../api/paypalAPI";
import queryString from 'query-string';
import WebView from "react-native-webview";

const CheckOut = ({navigation,route}) => {
    const total = route.params.totalPrice;
    let totalPrice = total/24000;
    const [cartItems, setCartItems] = useState([]);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [user, setUser] = useState('');
    const IP = '192.168.40.105';
    const [isLoading,setIsLoading] = useState(false)
    const [payPalUrl, setPayPalUrl] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('cash'); // Phương thức thanh toán mặc định
    useEffect(() => {
        const fetchUserToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    console.log(decodedToken.userId);
                    try {
                        const response = await axios.get(`http://${IP}:4848/users/${decodedToken.userId}`);
                        const userData = response.data;
                        setUser(userData);
                        setFullName(userData.name)
                        setAddress(userData.address)
                        setPhoneNumber(userData.phone)
                    } catch (error) {
                        console.log('Error:', error);
                    }
                }
            } catch (error) {
                console.log('Error retrieving token from AsyncStorage:', error);
            }
        };
        fetchUserToken();
    }, []);


    let orderDetails = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "items": [
                    {
                        "name": "ten don hang",
                        // "publisher": `${item.publisher}`,
                        "quantity": "1",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": `${(total/24000).toFixed(2)}`,
                        }
                    }
                ],
                "amount": {
                    "currency_code": "USD",
                    "value": `${(total/24000).toFixed(2)}`,
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": `${(total/24000).toFixed(2)}`
                        }
                    }
                }
            }
        ],
        "application_context": {
            "return_url": "https://example.com/return",
            "cancel_url": "https://example.com/cancel"
        }
    }



    const handlePayment = async () => {
        if (paymentMethod === 'cash') {
            // Xử lý thanh toán tiền mặt

        } else if (paymentMethod === 'bankTransfer') {
            if (!payPalUrl) {
                setIsLoading(true);
                try {
                    const token = await paypalAPI.generateToken();
                    const res = await paypalAPI.createOrder(token, orderDetails);
                    setAccessToken(token);
                    console.log("res+++" + JSON.stringify(res, null, 2));
                    setIsLoading(false);
                    if (!!res?.links) {
                        const findUrl = res.links.find(data => data?.rel === "approve");
                        console.log("findUrl", findUrl);
                        setPayPalUrl(findUrl.href);
                    }
                } catch (error) {
                    console.log("error: ", error);
                }
            }
        }
    };
    const onUrlChange = (webViewState) => {
        if(webViewState.url.includes('https://example.com/cancel')){
            clearPaypalState()
            alert("close Webview")
            return
        }
        if(webViewState.url.includes('https://example.com/return')){
            const urlValues = queryString.parseUrl(webViewState.url)
            console.log("my urls value", urlValues)
            const {token} = urlValues.query
            if(!!token){
                paymentSuccess(token)
            }
        }
    }
    const clearPaypalState = () => {
        setPayPalUrl(null)
        setAccessToken(null)
    }
    const clearCart = async () => {
        try {
            const response = await axios.delete(`http://${IP}:4848/cart/clear/${user._id}`);
            if (response.status === 204) {
                console.log("Giỏ hàng đã được xóa.");
            } else {
                console.log("Xóa giỏ hàng không thành công.");
            }
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error);
        }
    }

    const paymentSuccess = async (id) => {
        try {
                const res = await paypalAPI.capturePayment(id, accessToken);
                console.log("CapturePayment res+++++", res)
                const formDataArray = [];

                for (const item of cartItems) {
                    const productData = {
                        productId: item.productId,
                        productName: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image:item.image,
                        publisher: item.publisher
                    };

                    formDataArray.push(productData);
                }

                const formData = {
                    userId: user._id,
                    userName:user.name,
                    address:user.address,
                    phone:user.phone,
                    products: formDataArray,
                    totalAmount: `${(total/24000).toFixed(2)}`,
                    paymentMethod: 'PayPal',
                };

                // Gửi dữ liệu thanh toán cho từng sản phẩm
                const response = await fetch(`http://${IP}:4848/order/create-order/postOrder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            const data = await response.json();

            await clearCart();


            // Đưa ra thông báo cho người dùng khi đã thanh toán xong toàn bộ giỏ hàng
            navigation.navigate('OrderSuccess')


            clearPaypalState();
        } catch (error) {
            console.error('Error adding rental:', error);
        }
    };



    useEffect(() => {
        axios.get(`http://${IP}:4848/cart/showcart/${user._id}`)
            .then((response) => {
                setCartItems(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu giỏ hàng', error);
            });
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={{flex:35}}>
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem}>
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
                    )}
                />
            </View>
            <View style={{flex:65}}>
                <TextInput
                    style={styles.input}
                    label="Họ và tên"
                    value={fullName}
                    onChangeText={text => setFullName(text)}
                />
                <TextInput
                    style={styles.input}
                    label="Số điện thoại"
                    value={phoneNumber}
                    onChangeText={text => setPhoneNumber(text)}
                />
                <TextInput
                    style={styles.input}
                    label="Địa chỉ"
                    value={address}
                    onChangeText={text => setAddress(text)}
                />
                <Text style={styles.paymentMethodLabel}>Chọn phương thức thanh toán:</Text>
                {/*<Text style={styles.paymentMethodLabel}>Total Payment: {totalPrice}</Text>*/}
                <RadioButton.Group onValueChange={newValue => setPaymentMethod(newValue)} value={paymentMethod}>
                    <View style={styles.radioGroup}>
                        <RadioButton.Item label="Tiền Mặt" value="cash" color={"#3440ff"} />
                        <RadioButton.Item label="PayPal" value="bankTransfer" color={"#3440ff"} />
                    </View>
                </RadioButton.Group>
                <Button mode="contained" onPress={handlePayment} style={styles.paymentButton}>
                    Thanh toán
                </Button>
                <Modal
                    visible={!!payPalUrl}
                >

                    <SafeAreaView style={{flex:1}}>
                        <TouchableOpacity style={{
                            marginLeft:20
                        }} onPress={clearPaypalState}
                        >
                            <Text>Close</Text>
                        </TouchableOpacity>
                        <WebView
                            source={{uri:payPalUrl}}
                            onNavigationStateChange={onUrlChange}
                        />
                    </SafeAreaView>

                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    paymentMethodLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    paymentButton: {
        marginTop: 16,
        backgroundColor: '#3440ff',
        padding:7
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,

    },
    image: {
        width: 100,
        height: 100,
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

export default CheckOut;
