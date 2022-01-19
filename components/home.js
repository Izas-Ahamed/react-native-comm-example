import React, {useEffect, useReducer, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIS} from '../utils/urls';

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';

const HomePage = ({navigation}) => {
  const [quoteLoader, setQuoteLoader] = useState(true);
  const [memeLoader, setMemeLoader] = useState(true);
  const [quote, setQuote] = useState('Loading ...');
  const [userData, setUserData] = useState({});
  const [initialLoader, setInitialLoader] = useState(true);
  const [memeUrl, setMemeUrl] = useState('');
  const [internetError, setInternetError] = useState(false);
  const checker = () => {
    let data;
    AsyncStorage.getItem('userData')
      .then(result => {
        data = JSON.parse(result);
        if (!data?.isAuthenticated) {
          return navigation.replace('Login');
        }
        if (data.name.split(' ').length > 2) {
          data.name = data.name.split(' ')[0] + ' ' + data.name.split(' ')[1];
        }
        setInitialLoader(false);
        setUserData(data);
        getQuote();
        getMeme();
      })
      .catch(err => console.log(err));
    return data;
  };

  const getMeme = () => {
    setMemeLoader(true);
    setInternetError(false);
    setMemeUrl('');
    axios
      .get(APIS.MEME_URL)
      .then(response => {
        setMemeUrl(response.data.url);
        setMemeLoader(false);
      })
      .catch(err => {
        setMemeLoader(false);
        setInternetError(true);
      });
  };

  const getQuote = () => {
    setQuote('Loading ...');
    setQuoteLoader(true);
    axios
      .get(APIS.QUOTE_URL)
      .then(({data}) => {
        setQuote(data.content);
        setQuoteLoader(false);
      })
      .catch(err => {
        setQuoteLoader(false);
        setQuote('Please Check Your Internet !');
      });
  };
  const logout = () => {
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({name: userData.name, isAuthenticate: false}),
    )
      .then(() => {
        navigation.replace('Login');
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    checker();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#082032" />

      {!initialLoader ? (
        <>
          <View
            style={{
              width: Dimensions.get('window').width,
              alignItems: 'flex-end',
            }}>
            <Pressable style={styles.button1} onPress={logout}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'poppins-medium',
                }}>
                Logout
              </Text>
            </Pressable>
          </View>
          <View style={{paddingHorizontal: 10}}>
            <View>
              <Text style={{fontSize: 23, color: 'lightgrey'}}>
                Welcome{' '}
                <Text
                  style={{
                    fontSize: 30,
                    color: 'white',
                    fontFamily: 'poppins-medium',
                  }}>
                  {userData?.name}!
                </Text>
              </Text>
            </View>
          </View>
          <Text
            style={{paddingHorizontal: 10, color: 'white', marginBottom: 8}}>
            Meme for you 😁 :
          </Text>

          <View
            style={{
              width: Dimensions.get('window').width,
              height: 285,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {memeLoader ? (
              <>
                <Text
                  style={{
                    fontFamily: 'poppins-medium',
                    color: 'white',
                    fontSize: 16,
                  }}>
                  Loading...
                </Text>
                <ActivityIndicator size="large" color="lightblue" />
              </>
            ) : (
              <>
                {memeUrl.length > 0 && (
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                    source={{uri: memeUrl}}></Image>
                )}
              </>
            )}
            {internetError && (
              <Text
                style={{
                  fontFamily: 'poppins-medium',
                  color: 'white',
                  fontSize: 16,
                }}>
                Please Check Your Internet !
              </Text>
            )}
          </View>
          <View>
            <Text
              style={{paddingHorizontal: 10, color: 'white', marginTop: 15}}>
              Quote for you :
            </Text>
          </View>

          <View style={{margin: 10, alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'poppins-medium',
                color: 'white',
                fontSize: 16,
              }}>
              {quote}
            </Text>
            {quoteLoader && (
              <View>
                <ActivityIndicator size="large" color="lightblue" />
              </View>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Pressable disable={true} style={styles.button2} onPress={getQuote}>
              <Text style={{color: 'black', fontFamily: 'poppins-medium'}}>
                Get Quote
              </Text>
            </Pressable>
            <Pressable disable={true} style={styles.button2} onPress={getMeme}>
              <Text style={{color: 'black', fontFamily: 'poppins-medium'}}>
                Get Meme
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View
          style={{
            height: Dimensions.get('window').height,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="lightblue" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#2C394B',
  },
  inputField: {
    margin: 10,
    width: 300,
    borderRadius: 50,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    fontFamily: 'poppins-medium',
    color: 'black',
  },
  button1: {
    alignItems: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#082032',
    margin: 10,
    color: 'white',
  },
  button2: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    margin: 10,
    color: 'black',
  },
  contentContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomePage;
