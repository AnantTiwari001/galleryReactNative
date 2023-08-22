import { View, StyleSheet, Text, Image } from 'react-native';

const PhotoItem=({uri})=>{
    return(
        <View style={styles.container} >
            <Image source={{uri:uri}} style={styles.img} />
        </View>
    )
}
const styles= StyleSheet.create({
    container:{
        // flex:1,
        width:'45%',
        backgroundColor:'red',
        padding:10,
        marginVertical:10,
        height:275
    },
    img:{
        width:'100%',
        height:'100%'
    }
})

export default PhotoItem;