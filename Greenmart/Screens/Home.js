import {
    Alert,
    Button,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Icon, SearchBar} from '@rneui/base';
import {useEffect, useState} from "react";
import jwtDecode from 'jwt-decode';

import Swiper from 'react-native-swiper/src';

import Ionic from "react-native-vector-icons/Ionicons";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {HeartIcon} from "react-native-heroicons/outline";
export default function Home({navigation}) {
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const IP = '192.168.40.105'
    const [searchResults, setSearchResults] = useState([]);
    const checkIfProductExistsInFavorite = async (userId, productId) => {
        try {
            const response = await axios.get(`http://${IP}:4848/favourite/checkfavourite/${userId}/${productId}`);
            return response.data.exists;
        } catch (error) {
            console.error('Lỗi khi kiểm tra sản phẩm trong mục yêu thích:', error);
            return false;
        }
    };
    const searchProducts = (query) => {
        const results = data.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    useEffect(() => {
        const fetchUserFromToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    try {
                        const response = await axios.get(`http://${IP}:4848/users/${decodedToken.userId}`);
                        setUser(response.data)
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
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://${IP}:4848/productsjson`);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    const addToFavorites = async (userId, productId,productName,category,publisher,price,image) => {
        const productExistsInFavorite = await checkIfProductExistsInFavorite(userId, productId);

        if (productExistsInFavorite) {
            Alert.alert('Sản phẩm đã có trong mục yêu thích', 'Sản phẩm này đã được thêm vào mục yêu thích của bạn.');
        } else {
            try {
                const response = await axios.post(`http://${IP}:4848/favourite/${user._id}`, {
                    productId: productId,
                    userId: userId,
                    productName: productName,
                    category: category,
                    publisher: publisher,
                    price: price,
                    image: image,
                });
                    Alert.alert('Thông Báo', 'Thêm vào yêu thích thành công.');
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm vào danh sách yêu thích:', error);
            }
        }
    };

    const showDetail = (item) => {
        navigation.navigate('ProductDetail', { item });
    };
    const seeAllProduct = () => {
        navigation.navigate('AllProduct');
    }

    const ItemView = ({item}) => {
        return (
            <TouchableOpacity onPress={() => showDetail(item)}>
                <View style={styles.item}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                        <Image style={{ width: 125, height: 95,marginLeft:20,marginTop:10  }} source={{uri:item.image}} />
                        <TouchableOpacity
                            onPress={() => {
                                addToFavorites(user._id, item._id,item.name,item.category,item.publisher,item.price,item.image);
                            }}
                            style={{
                                marginVertical:10,
                                marginRight:20
                            }}
                        >
                            <HeartIcon width={30} height={30} color={'green'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDescription}>{item.publisher}</Text>
                        <View>
                            <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}
                            </Text>

                        </View>


                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.header1}>
                <Image style={{width:100,height:100,position:"relative",left:-0,}} source={require('../assets/Logo_GreenMart.png')}/>

                    <Image style={{position:"relative",top:15,left:-10}} source={require('../assets/ViTri.png')}/>
                    <Text style={{marginLeft:10}}>Hà Nội, Việt Nam</Text>

            </View>
            <View >
                <SearchBar
                    platform="ios"
                    containerStyle={{}}
                    inputContainerStyle={{}}
                    inputStyle={{}}
                    leftIconContainerStyle={{}}
                    rightIconContainerStyle={{}}
                    loadingProps={{}}
                    onChangeText={(newVal) => {
                        setSearchQuery(newVal); // Cập nhật giá trị searchQuery khi bạn gõ chữ
                        searchProducts(newVal); // Thực hiện tìm kiếm
                    }}
                    value={searchQuery} // Kết nối giá trị tìm kiếm với state searchQuery
                    placeholder="Search products"
                    placeholderTextColor="#888"
                    round
                    cancelButtonTitle="Cancel"
                    cancelButtonProps={{}}
                    onCancel={() => {
                        setSearchQuery(''); // Xóa giá trị tìm kiếm khi người dùng bấm Hủy
                        setSearchResults([]); // Xóa kết quả tìm kiếm
                    }}
                />

            </View>

            <ScrollView style={styles.scrollview}
                        showsVerticalScrollIndicator={false} // Hide vertical scrollbar
                        showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
            >
                <View style={styles.Banner}>
                    <Swiper style={styles.wrapper} autoplay={true}>
                        <View style={styles.slide}>
                            <Image
                                source={require('../assets/Banner1.png') }
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.slide}>
                            <Image
                                source={require('../assets/Banner2.png')}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.slide}>
                            <Image
                                source={require('../assets/Banner3.jpg')}
                                style={styles.image}
                            />
                        </View>
                    </Swiper>

                </View>
                <View >
                    <View style={styles.tieude1}>
                        <Text style={{marginLeft:10,fontSize:25,fontWeight:"bold",textAlign:'left'}}>Exclusive Offer</Text>
                        <TouchableOpacity onPress={seeAllProduct}>
                            <Text style={{marginLeft:150,marginTop:5,color:"green",marginRight:10,textAlign:'right'}}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.products}>
                        <FlatList
                            data={searchResults.length > 0 ? searchResults : data}
                            renderItem={ItemView}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={true}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />

                    </View>
                </View>
                <View >
                    <View style={styles.tieude2}>
                        <Text style={{marginLeft:10,fontSize:25,fontWeight:"bold",textAlign:'left'}}>Best Selling</Text>
                    </View>
                    <View style={styles.products}>
                        <FlatList data={data}
                                  renderItem={ItemView}
                                  keyExtractor={(item, index) => index.toString()}
                                  horizontal={true}
                                  showsVerticalScrollIndicator={false} // Hide vertical scrollbar
                                  showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
                        />
                    </View>
                </View>

            </ScrollView>


        </SafeAreaView>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems:'center'
    },
    searchs:{
        width:'95%',
        height:'10%',
        color:'white',
        alignItems:'center'
    },
    ViTri: {
        flexDirection:"row",
    },
    Banner: {
        position:'relative',
        width:'90%',
        height:170,
        alignSelf:'center'
    },
    wrapper: {},slide:{
        height:150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        // Đặt giá trị này để bo góc
        overflow: 'hidden', },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tieude1: {
        marginTop:0,
        flexDirection:"row",

    },
    scrollview: {
        position:'relative',
        width:'100%',


    },
    header1:{
        marginTop:5,
        alignItems:"flex-start",
        height:140,
    }, products: {},
    item: {
        width:180,
        height:200,
        margin:18,
        borderWidth:1,
        borderRadius:15,
        borderColor:'#eeeeee'



    },
    itemDetails: {
        flexDirection: 'column',
        marginTop:5
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf:'center',
    },
    itemDescription: {
        fontSize: 14,
        color: 'grey',
        alignSelf:'center',

    },
    itemPrice: {
        fontSize: 16,
        marginTop:15,
        fontWeight:'bold',
        alignSelf:'center',
        color:'red'

    },
    tieude2: {
        marginTop:10,
        flexDirection:"row",
    },



});
