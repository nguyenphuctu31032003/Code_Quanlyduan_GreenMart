import React from 'react';
import {View, Modal, Text, Image, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from "@react-navigation/native";

const FailDialog = (props) => {
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
                    <Image style={styles.img}
                    source={require('../assets/Oops.png')}
                    ></Image>
                    <Text style={styles.message}>Oops</Text>

                    <Text style={styles.bottomTerm}>Something went wrong</Text>
                    <Pressable
                        //chuyen man khi an
                        onPress={handlePress}
                        style={styles.customButton}>

                        <Text style={styles.buttonText}>Please Try Again</Text>

                    </Pressable>
                    <Pressable
                        //chuyen man khi an
                        onPress={handlePress}
                        style={styles.customButton2}>

                        <Text style={styles.buttonText2}>Back to home</Text>

                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,

        justifyContent: 'center', // Thay đổi thành 'flex-end'
        alignItems: 'center', // Giữ nguyên
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialog: {
        width:'90%',
        height:'80%',
        backgroundColor: 'white',
borderRadius:25,
    },
    message: {

        fontSize: 25,
        alignSelf:'center',
        fontWeight:'600',
        paddingTop:20,

    },
    img: {
  width:200,
        height:200,
        marginTop:40,
        alignSelf:'center',

    },
    customButton: {
        backgroundColor:'#53b175',
        height:'13  %',
        borderRadius:25,
        position:"relative",
        bottom:-60,

        alignSelf:'center',
        width:'90%'
    },
    customButton2: {
        height:'13  %',
        borderRadius:25,
        position:"relative",
        bottom:-65,

        alignSelf:'center',
        width:'90%'
    }
    , buttonText: {

        paddingTop:25,
        fontWeight:'700',
        color:'white',
        fontSize:16,
        alignSelf:'center'
    },
     buttonText2: {

    paddingTop:25,
        fontWeight:'700',
        color:'black',
        fontSize:16,
        alignSelf:'center'
},
    bottomTerm: {
        marginTop:20,
        fontWeight:'300',
        color:'#9a9a9a',
        fontSize:14,


        alignSelf:'center',

    },


});

export default FailDialog;
