import axios from 'axios';
import React, {useState} from 'react';
import {RSA} from 'react-native-rsa-native';
import {APIS} from '../utils/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';

const LoginPage = ({navigation}) => {
  const [loader, setLoader] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const publicKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGN4i80blwzicZ21ABxV4gP4ro\n' +
    'CZ+8LjYO7+K1dgSX9NIHpYPFQlq+dGD/SO7vyfqJd87V2W/IvnuON27Fbpx050Fd\n' +
    'oVWKUvdjO9wtCwl5aFir9oxIJmRJEM4fWaGBFj/1myIjR/58ZvzXUflwab7Qig1W\n' +
    'bVZE8xd20GSSC+ND+QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';

  const doLogin = () => {
    setLoader(true);
    let isError = true;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(email)) {
      setIsEmailError(false);
      isError = false;
    } else {
      isError = true;
      setIsEmailError(true);
    }

    if (!password.length >= 4) {
      isError = true;
      setIsPasswordError(true);
    } else {
      isError = false;
      setIsPasswordError(false);
    }

    if (/\d/.test(password)) {
      isError = false;
      setIsPasswordError(false);
    } else {
      isError = true;
      setIsPasswordError(true);
    }

    if (isError) {
      setLoader(false);
    }

    if (!isError) {
      RSA.encrypt(password, publicKey)
        .then(result => {
          axios
            .post(APIS.LOGIN_URL, {email: email, password: result})
            .then(response => {
              setEmail('');
              setPassword('');
              AsyncStorage.setItem(
                'userData',
                JSON.stringify({
                  name: response.data.name,
                  isAuthenticated: true,
                }),
              )
                .then(() => {
                  setLoader(false);
                  navigation.replace('Home');
                })
                .catch(err => console.log(err));
            })
            .catch(err => {
              if (err.response && err.response.status === 401) {
                ToastAndroid.show(
                  'Invalid emailId or password!',
                  ToastAndroid.LONG,
                );
                setLoader(false);
              } else {
                setLoader(false);
                ToastAndroid.show(
                  'Please your Internet Connection!',
                  ToastAndroid.LONG,
                );
              }
            });
        })
        .catch(err => console.log(err));
    }
  };

  const onEmailBlur = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(email)) {
      setIsEmailError(false);
    } else {
      setIsEmailError(true);
    }
  };

  const onPasswordBlur = () => {
    if (!password.length >= 4) {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }

    if (/\d/.test(password)) {
      setIsPasswordError(false);
    } else {
      setIsPasswordError(true);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#082032" />
      {!loader ? (
        <>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 10,
            }}>
            <Image source={require('../images/key.png')} style={styles.img} />
            <Text
              style={{
                fontFamily: 'poppins-bold',
                fontSize: 30,
                color: 'white',
              }}>
              Login Please!
            </Text>
          </View>
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={value => setEmail(value.toString().trim())}
            onBlur={onEmailBlur}
            style={styles.inputField}></TextInput>
          <View style={{width: 260}}>
            <Text style={{color: 'lightgrey'}}>
              {isEmailError ? 'Please Enter Valid Email' : ''}
            </Text>
          </View>
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor="black"
            secureTextEntry
            autoCapitalize="none"
            onBlur={onPasswordBlur}
            onChangeText={value => setPassword(value.toString().trim())}
            style={styles.inputField}></TextInput>
          <View style={{width: 260}}>
            <Text style={{color: 'lightgrey'}}>
              {isPasswordError
                ? 'Please enter minumum 4 characters and include numbers'
                : ''}
            </Text>
          </View>
          <Pressable style={styles.button} onPress={doLogin}>
            <Text style={{color: 'white', fontFamily: 'poppins-medium'}}>
              Login
            </Text>
          </Pressable>
          <View style={{flexDirection: 'row', margin: 15}}>
            <Text style={{color: 'lightgrey'}}>Don't have an account? </Text>
            <Text
              onPress={() => navigation.navigate('SignUp')}
              style={{
                fontFamily: 'poppins-bold',
                color: 'white',
              }}>
              Signup Here
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text style={{color: 'lightgrey'}}>Please Wait ...</Text>
          <ActivityIndicator size="large" color="lightblue" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C394B',
  },
  inputField: {
    margin: 5,
    width: 300,
    borderRadius: 50,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    fontFamily: 'poppins-medium',
    color: 'black',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#082032',
    margin: 10,
    color: 'white',
  },
  img: {
    width: 100,
    height: 100,
  },
});

export default LoginPage;
