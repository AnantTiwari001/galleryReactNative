import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomePage from './Pages/HomePage';
// https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=067a39dcee662aa531cb19657b951e97&per_page=20&page=2&format=json&nojsoncallback=1

const Drawer= createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='Home' >
        <Drawer.Screen  name='Home' component={HomePage} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
