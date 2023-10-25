import React from 'react';
import {View, Modal, Text, Image, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from "@react-navigation/native";

const CustomDialog = (props) => {
    const navigation = useNavigation(); // Lấy đối tượng navigation

    const handlePress = () => {
        // Điều hướng đến màn hình khác khi Pressable được nhấn
        navigation.navigate('OrderSuccess'); // Thay 'OtherScreen' bằng tên màn hình bạn muốn chuyển đến
    };
    return (
        <Modal
            visible={props.visible}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalContainer}>
                <View style={styles.dialog}>
                    <Text style={styles.message}>{props.message}</Text>
                    <Pressable style={styles.selectedRow}>
                        <Text style={{color:'#9d9d9d',marginLeft:20}}>Payment</Text>
                        <Text style={{paddingBottom:'30',color:'black',fontWeight:'700',position:'relative',right:-130}}>Selected Method</Text>
                        <Image source={require('../assets/backarrow.png')} style={{position:'relative',right:-160}}></Image>
                    </Pressable>
                    <Pressable style={styles.selectedRow}>
                        <Text style={{color:'#9d9d9d',marginLeft:20}}>Promo code</Text>
                        <Text style={{paddingBottom:'30',color:'black',fontWeight:'700',position:'relative',right:-110}}>Pick Discount</Text>
                        <Image source={require('../assets/backarrow.png')} style={{position:'relative',right:-160}}></Image>
                    </Pressable>
                    <Pressable style={styles.selectedRow}>
                        <Text style={{color:'#9d9d9d',marginLeft:20}}>Total Cost</Text>
                        <Text style={{paddingBottom:'30',color:'black',fontWeight:'700',position:'relative',right:-130}}>13.99$</Text>
                        <Image source={require('../assets/backarrow.png')} style={{position:'relative',left:210}}></Image>
                    </Pressable>
                    <Text style={styles.bottomTerm}>By placing an order you agree to our Term And Condition</Text>
            <Pressable
                //chuyen man khi an
             onPress={handlePress}
                style={styles.customButton}>

                <Text style={styles.buttonText}>Place Order</Text>

            </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,

        justifyContent: 'flex-end', // Thay đổi thành 'flex-end'
        alignItems: 'center', // Giữ nguyên
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialog: {
        width:'100%',
        height:'60%',
        backgroundColor: 'white',
borderTopRightRadius:25,
        borderTopLeftRadius:25,
           position:'relative',

        bottom:0,
    },
    message: {
        fontSize: 25,
paddingLeft:20,
        fontWeight:'600',
        paddingTop:20,


    },
    customButton: {
        backgroundColor:'#53b175',
        height:'15%',
        borderRadius:25,
marginTop:20,

        alignSelf:'center',
        width:'90%'
    }, buttonText: {

        paddingTop:20,
        fontWeight:'700',
        color:'white',
        fontSize:16,
        alignSelf:'center'
    },
    bottomTerm: {
marginTop:20,
        fontWeight:'700',
        color:'#404045',
        fontSize:14,
        marginLeft:20,
        width:300,
        alignSelf:'flex-start',

    },
    selectedRow: {
        flexDirection:'row',
        height:'15%',
alignItems:'center',
        width:"100%",
        borderBottomColor:'white',
        borderTopColor:'#f2f3f2',
        borderWidth:0.5,
    }

});

export default CustomDialog;
