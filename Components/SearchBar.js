import { useState } from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SearchBar=({text, setFunc, submitFunc})=>{
    // const [text0, setText0]= useState('')
    return(
        <View style={styles.container} >
            <TextInput onSubmitEditing={()=> text !='' && submitFunc()} value={text} onChangeText={(newValue)=>setFunc(newValue)} style={{marginRight:11, borderWidth:1, width:100, borderRadius:10, paddingHorizontal:7}} />
            <TouchableOpacity style={{backgroundColor:'gray', paddingVertical:3, paddingHorizontal:7, justifyContent:'center', alignItems:'center', borderRadius:10}} onPress={()=> text !='' && submitFunc()} >
                <Text style={{color:'white'}}>Search</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles= StyleSheet.create({
    container:{
        backgroundColor:'white',
        paddingVertical:10,
        marginVertical:7,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
    }
})

export default SearchBar;