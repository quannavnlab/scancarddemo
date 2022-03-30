/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  NativeModules,
  Image
} from 'react-native';

import {CardIOModule} from 'react-native-awesome-card-io';
import MlkitOcr from 'react-native-mlkit-ocr';
import ImagePicker from 'react-native-image-crop-picker';
import IImageConverter from 'react-native-image-converter'

const App: () => Node = () => {
  const scanConfigs = {
    scanExpiry: true,
    requireCardholderName: false,
    usePaypalActionbarIcon: false,
    suppressManualEntry: true,
    suppressConfirmation: true,
    hideCardIOLogo: true,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [cardImage,setCardImage] = useState(null)
  const [text, setText] = useState([])

  const scanCard = async () => {
    try {
      const card = await CardIOModule.scanCard(scanConfigs);
      alert(card.cardNumber);
    } catch (err) {
      console.log(err);
    }
  };

  const readCard = async () => {
    try {
      const data = await ImagePicker.openPicker({
        width: 856,
        height: 539,
        cropping: true,
        compressImageQuality:1
      });
      console.log(data);
      setIsLoading(true);
      const param = {
        path: data.path,
        grayscale: true, // or true
        base64: false, // or true
        resizeRatio: 0.8, // 1.0 is origin value
        imageQuality: 1, // 1.0 is max quality value
      };

      // const {imageURI} = await IImageConverter.convert(param);
      // console.log(imageURI)
      setCardImage(data.path)
      const resultFromUri = await MlkitOcr.detectFromUri(data.path);
      const result = []
      resultFromUri.map(item => {
        const convert = item.text
          .replace(/(\s)|(\-)|(\.)/g, '')
          .replace('S', '5')
          .replace('b', '6')
          .replace('D', '0')
          .replace('O', '0')
          .replace('B', '8')
          .replace('L', '1');
        result.push(convert)
        console.log(item.text)
      });
      setText(result)
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
console.log('text', text);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {isLoading ? (
        <ActivityIndicator color={'black'} size="large" />
      ) : (
        <>
          <Button title="Scan Card" onPress={scanCard} />
          <Button title="Read Card MLkit" onPress={readCard} />
        </>
      )}
      <Image source={{uri: cardImage}} style={{width:400, height:280, resizeMode:'contain'}} />
      {text.map(i => <Text key={i}>{i}</Text>)}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
