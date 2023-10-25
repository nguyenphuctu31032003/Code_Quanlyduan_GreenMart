import { StatusBar } from 'expo-status-bar';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";
import React from 'react';
import { CheckBox } from 'react-native-elements';


export default function FilterScreen({navigation}) {
    const [isSelected, setSelection] = useState(false);
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [isChecked3, setIsChecked3] = useState(false);

    const toggleCheckBox1 = () => {
        setIsChecked1(!isChecked1);
    };

    const toggleCheckBox2 = () => {
        setIsChecked2(!isChecked2);
    };

    const toggleCheckBox3 = () => {
        setIsChecked3(!isChecked3);
    };

    const customUncheckedIcon = (
        <View style={[styles.icon, { backgroundColor: '#55b478' }]} />
    );
    return (
        <View style={styles.container}>


 <ScrollView
style={{flex:0.8}}
     showsVerticalScrollIndicator={false} // Hide vertical scrollbar
     showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
 >
     <Text style={{fontSize:25,fontWeight:'bold',marginLeft:20,marginTop:20}}>Categories</Text>


     <CheckBox

         title="Kazi Famas"
         checked={isChecked1}
         onPress={toggleCheckBox1}
        uncheckedColor={'#55b478'}
         checkedColor={'#55b478'}
     />
     <Text style={{fontSize:25,fontWeight:'bold',marginLeft:20,marginTop:20}}>Brand</Text>
     <CheckBox
         title="Kazi Famas"
         value={isSelected}
         onPress={setSelection}
         uncheckedColor={'#55b478'}
         checkedColor={'#55b478'}
     />




 </ScrollView>


            <StatusBar style="auto" />
<View style={{flex:0.15,width:'100%'}}>
    <TouchableOpacity style={{height:50,width:'90%',backgroundColor:'#55b478',justifyContent:'center',borderRadius:20,marginLeft:20}}>
        <Text style={{textAlign:'center',color:'white',fontSize:15}}>Apply Filter</Text>
    </TouchableOpacity>
</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f3f2',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        flex:1,
    },
});