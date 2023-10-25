import { StatusBar } from 'expo-status-bar';
import {FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useState} from "react";
import FilterScreen from "./FilterScreen";

export default function BeveragesScreens({navigation,route}) {
    const [isDialogVisible, setDialogVisible] = useState(false);

    const openDialog = () => {
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };
    const receivedData = route.params?.data;
    const Data1=[{
        image:'https://www.soulnvinegar.com/wp-content/uploads/2022/01/Screen-Shot-2022-01-12-at-12.00.57-AM.png',
        name:'Diet Coke',
        description:'355ml,Price',
        price:'$1.99',

    },{
        image:'https://m.media-amazon.com/images/I/61slsTqQruL.jpg',
        name:'Sprite Can',
        description:'325ml,Price',
        price:'$1.50'},
        {  image:'https://tomitamart.vn/public/media//00387.jpg',
            name:'Twister Can',
            description:'325ml,Price',
            price:'$4.99',

        },{
            image:'https://media.istockphoto.com/id/458464735/photo/coke.jpg?s=612x612&w=0&k=20&c=YbmiazMmY0DkWh_W8T0pBkOgai2k62hGF1TJn9EC5W0=',
            name:'Coca Cola Can',
            description:'325ml,Price',
            price:'$4.99'},
        {
            image:'https://t4.ftcdn.net/jpg/03/03/98/01/360_F_303980198_G2TzNSk73Av3YIQ0W7EmoILxOaKDSrXZ.jpg',
            name:'Pepsi Can       ',
            description:'325ml,Price',
            price:'$4.99'}  ];
    const [listBeverages,setlistBeverages] = useState(Data1);
    const backbutton = () => {
        navigation.navigate("ExploreScreen")
    }
    const filterbutton = () => {
        navigation.navigate("Filter")
    }
    const BeveragesView =({ item }) => {
        return (

            <View style={styles.item}>
                <Image style={{ width: 120,height:120,alignSelf:'center',top:10 }} source={{uri:item.image}} />

                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                        <Text style={styles.itemPrice}>{item.price}</Text>


                    <Pressable>
                        <Image style={{width:50,height:50,borderRadius:15,bottom:-80,right:-100}
                        } source={require('../assets/button.jpg')}
                        >
                        </Image>
                    </Pressable>

            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.Header}>
                <Pressable
                    onPress={backbutton}
                    style={{position:'absolute',top:"40%",left:20,width:40,height:30}}
                >
                    <Image
                        source={require("../assets/backbutton.png")}></Image>
                </Pressable>

                <Text style={styles.ItemTitle}>{receivedData}</Text>
                <Pressable
onPress={filterbutton}
                    style={{position:'absolute',top:"40%",right:10,width:40,height:30}}
                >
                    <Image
                        source={require("../assets/FilterIcon.png")}></Image>
                </Pressable>
            </View>
<View style={{flex:0.9}}>
    <FlatList
        showsVerticalScrollIndicator={false} // Hide vertical scrollbar
        showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
        data={listBeverages}
        renderItem={BeveragesView}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
    />

</View>




            <StatusBar style="auto" />


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    item: {
        width:160,
        height:260,

        margin:10,// Căn chỉnh các phần tử theo chiều ngang
        borderWidth:1,
        borderRadius:15,
        borderColor:'#eeeeee',


    },

    itemName: {
position:'absolute',
        top:'51%',
        marginLeft:10,
        fontSize: 16,
        fontWeight: 'bold',




    },
    itemDescription: {
        fontSize: 14,
        color: 'grey',
        position:'absolute',
        top:'60%',
        left:10,
        textAlign:'center'


    },
    itemPrice: {
     position:'absolute',
        left:10,
        bottom:20,
        fontSize: 16,
        fontWeight:'bold'

    },

    Header:{
        width:'100%',


        justifyContent: 'center',
        alignItems:'center',
        flexDirection:'row',
        flex:0.15
    },

    ItemTitle: {

        fontSize:20,
        fontWeight:'700',

    }
});