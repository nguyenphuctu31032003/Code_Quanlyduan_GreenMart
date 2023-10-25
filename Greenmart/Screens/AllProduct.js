import {FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import axios from "axios";
import {useEffect, useState} from "react";
import {HeartIcon} from "react-native-heroicons/outline";
import {SearchBar} from "@rneui/base";

import Swiper from 'react-native-swiper/src';

export default function AllProduct(){
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const IP = '192.168.40.105'
    const [searchResults, setSearchResults] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://${IP}:4848/productsjson`);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
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
    const searchProducts = (query) => {
        const results = data.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };
    return (
        <SafeAreaView style={styles.container}>
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

                <View >

                    <View style={styles.products}>
                        <FlatList
                            data={searchResults.length > 0 ? searchResults : data}
                            renderItem={ItemView}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            numColumns={2}
                        />

                    </View>
                </View>

        </SafeAreaView>
    )
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

