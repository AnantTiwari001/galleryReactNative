import { View, StyleSheet, Text, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import PhotoItem from "../Components/PhotoItem";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from "../Components/SearchBar";


const HomePage = () => {
    const [images, setImages] = useState([]);
    const [scrollVisible, setScrollVisible]= useState(false);
    const [searchText, setSearchText]= useState('')
    const [currentPage, setCurrentPage]= useState(1);
    const urlArray = useRef([])
    const recentPhoto = 'https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=067a39dcee662aa531cb19657b951e97&per_page=10&page=2&format=json&nojsoncallback=1'
    useEffect(() => {
        getCache();
        getdata();
    }, [])

    useEffect(()=>{
        if(scrollVisible){
            console.log('shall load next Page!');
            setCurrentPage(currentPage+1);
            getCache(currentPage);
            getdata(currentPage);
            setScrollVisible(false)
        }
    },[scrollVisible])

    const getCache = async (pageNo=1) => {
        const passArray = await JSON.parse(await AsyncStorage.getItem(`url${[pageNo]}`));
        setImages(passArray);
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    const getdata = async (pageNo=1) => {
        const result = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=067a39dcee662aa531cb19657b951e97&per_page=10&page=${pageNo}&format=json&nojsoncallback=1`)
        const data = await result.text();
        const images = (await JSON.parse(data)).photos.photo//[0].id
        for (let i = 0; i < images.length; i++) {
            const id = images[i].id;
            const sizesUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=067a39dcee662aa531cb19657b951e97&photo_id=${id}&format=json&nojsoncallback=1`;
            const result = await fetch(sizesUrl);
            const urls = (JSON.parse(await result.text())).sizes.size;
            const url = urls[4].source
            urlArray.current.push(url)
        }
        const tempUrlArray = urlArray.current
        const imageJson = JSON.stringify(tempUrlArray);
        const cachedJson = await AsyncStorage.getItem(`url${pageNo}`);
        if (cachedJson === imageJson) {
            console.log('no change!')
            return 0;
        } else {
            console.log('change!', imageJson)
            await AsyncStorage.setItem(`url${pageNo}`, imageJson);
            const passArray = await JSON.parse(await AsyncStorage.getItem(`url${pageNo}`));
            setImages(passArray);
        }
    }

    const searchFunc= async()=>{
        const result= await fetch('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=067a39dcee662aa531cb19657b951e97&text=ram&format=json&nojsoncallback=1')
        const data= await result.text();
        const images = (await JSON.parse(data)).photos.photo;
        console.log('search: ', images);
        const tempArray=[];
        for (let i = 0; i < images.length; i++) {
            const id = images[i].id;
            const sizesUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=067a39dcee662aa531cb19657b951e97&photo_id=${id}&format=json&nojsoncallback=1`;
            const result = await fetch(sizesUrl);
            const urls = (JSON.parse(await result.text())).sizes.size;
            const url = urls[4].source
            tempArray.push(url);
        }
        setImages(tempArray);
    }

    return (
        <LinearGradient
            colors={['#b668f3', '#d2e8f5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <SearchBar text={searchText} setFunc={setSearchText} submitFunc={searchFunc} />
            <ScrollView onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                    console.log('close to end!');
                    setScrollVisible(true)
                }
            }} style={{}} contentContainerStyle={{ justifyContent: 'space-evenly', flexDirection: 'row', flexWrap: 'wrap' }} >
                {images && images.map((item, index) => (
                    <PhotoItem uri={item} key={index} />
                ))}
                {scrollVisible && (
                    <View>
                        <Text>End of Page</Text>
                    </View>
                )}
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