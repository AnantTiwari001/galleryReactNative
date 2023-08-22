import { View, StyleSheet, Text, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import PhotoItem from "../Components/PhotoItem";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomePage = () => {
    const [images, setImages]= useState([]);
    const urlArray = useRef([])
    const recentPhoto = 'https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=067a39dcee662aa531cb19657b951e97&per_page=20&page=2&format=json&nojsoncallback=1'
    useEffect(() => {
        const result = getdata();
    }, [])

    const getdata = async () => {
        const result = await fetch(recentPhoto)
        const data = await result.text();
        const images = (await JSON.parse(data)).photos.photo//[0].id
        for (let i = 0; i < images.length; i++) {
            const id = images[i].id;
            const sizesUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=067a39dcee662aa531cb19657b951e97&photo_id=${id}&format=json&nojsoncallback=1`;
            const result = await fetch(sizesUrl);
            const urls = (JSON.parse(await result.text())).sizes.size;
            const url = urls[urls.length - 1].source
            urlArray.current.push(url)
        }
        const tempUrlArray=urlArray.current
        const imageJson= JSON.stringify(tempUrlArray);
        const cachedJson=  await AsyncStorage.getItem('url');
        console.log(cachedJson)
        if(cachedJson===imageJson){
            console.log('no change!')
            // return 0;
            // setImages([imageJson]);
        }else{
            console.log('change!', imageJson)
            // console.log('ram', imageJson);
            await AsyncStorage.setItem('url', imageJson);
            const passArray= await JSON.parse(await AsyncStorage.getItem('url'));
            console.log('state: ', Array);
            setImages(passArray);
        }
    }
    return (
        <LinearGradient
            colors={['#b668f3', '#d2e8f5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ScrollView style={{ }} contentContainerStyle={{justifyContent:'space-evenly', flexDirection:'row', flexWrap:'wrap'}} >
                { images && images.map((item, index)=>(
                    <PhotoItem uri={item} key={index} />
                ))}
            </ScrollView>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default HomePage;