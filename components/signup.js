import axios from 'axios';
import React, {useState} from 'react';
import {APIS} from '../utils/urls';
import {RSA} from 'react-native-rsa-native';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Pressable,
  ToastAndroid,
} from 'react-native';

const SignupPage = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState();
  const [loader, setLoader] = useState(false);

  const [isEmailError, setIsEmailError] = useState(false);
  const [isNameError, setisNameError] = useState('');

  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);

  const publicKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGN4i80blwzicZ21ABxV4gP4ro\n' +
    'CZ+8LjYO7+K1dgSX9NIHpYPFQlq+dGD/SO7vyfqJd87V2W/IvnuON27Fbpx050Fd\n' +
    'oVWKUvdjO9wtCwl5aFir9oxIJmRJEM4fWaGBFj/1myIjR/58ZvzXUflwab7Qig1W\n' +
    'bVZE8xd20GSSC+ND+QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';

  const doSignUp = () => {
    setLoader(true);
    let isError = true;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (name.length <= 2) {
      isError = true;
      setisNameError(true);
    } else {
      isError = false;
      setisNameError(false);
    }

    if (reg.test(email.trim())) {
      isError = false;
      setIsEmailError(false);
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

    if (password === confirmPassword) {
      isError = false;
      setIsConfirmPasswordError(false);
    } else {
      isError = true;
      setIsConfirmPasswordError(true);
    }

    if (isError) {
      setLoader(false);
    }

    if (!isError) {
      RSA.encrypt(password, publicKey)
        .then(result => {
          axios
            .post(APIS.SIGNUP_URL, {name: name, email: email, password: result})
            .then(response => {
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setLoader(false);
              ToastAndroid.show(
                'Successfully Registered, Please Login!',
                ToastAndroid.LONG,
              );
            })
            .catch(err => {
              if (err.response && err.response.status == 403) {
                ToastAndroid.show(
                  'Email Already Registered!',
                  ToastAndroid.LONG,
                );
                setLoader(false);
              } else {
                ToastAndroid.show(
                  'Please your Internet Connection!',
                  ToastAndroid.LONG,
                );
                console.log(err);
              }
            });
        })
        .catch(err => console.log(err));
    }
  };
  const onNameBlur = () => {
    if (name.length <= 2) {
      setisNameError(true);
    } else {
      setisNameError(false);
    }
  };
  const onEmailBlur = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(email.trim())) {
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

  const onConfirmPasswordBlur = () => {
    if (password === confirmPassword) {
      setIsConfirmPasswordError(false);
    } else {
      setIsConfirmPasswordError(true);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#082032" />

      {!loader ? (
        <>
          <View
            style={{alignItems: 'center', justifyContent: 'center', margin: 5}}>
            <Image
              source={require('../images/user-signup.png')}
              style={styles.img}
            />
          </View>

          <TextInput
            placeholder="Enter Your Name"
            placeholderTextColor="black"
            onChangeText={value => {
              setName(value.toString().trim());
            }}
            onBlur={onNameBlur}
            style={styles.inputField}></TextInput>
          <View style={{width: 260}}>
            <Text style={{color: 'lightgrey'}}>
              {isNameError ? 'Please enter atleast 3 characters' : ''}
            </Text>
          </View>

          <TextInput
            placeholder="Enter Email"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={value => {
              setEmail(value.toString().toLocaleLowerCase().trim());
            }}
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
            autoCapitalize="none"
            secureTextEntry
            onChangeText={value => setPassword(value.toString().trim())}
            onBlur={onPasswordBlur}
            style={styles.inputField}></TextInput>
          <View style={{width: 260}}>
            <Text style={{color: 'lightgrey'}}>
              {isPasswordError
                ? 'Please enter minumum 4 characters and include numbers'
                : ''}
            </Text>
          </View>

          <TextInput
            placeholder="Confirm Password"
            autoCapitalize="none"
            placeholderTextColor="black"
            secureTextEntry
            onChangeText={value => setConfirmPassword(value.toString().trim())}
            onBlur={onConfirmPasswordBlur}
            style={styles.inputField}></TextInput>
          <View style={{width: 260}}>
            <Text style={{color: 'lightgrey'}}>
              {isConfirmPasswordError ? "Password doesn't match" : ''}
            </Text>
          </View>

          <Pressable disable={true} style={styles.button} onPress={doSignUp}>
            <Text style={{color: 'white', fontFamily: 'poppins-medium'}}>
              Sign Up
            </Text>
          </Pressable>

          <View style={{flexDirection: 'row', margin: 15}}>
            <Text style={{color: 'lightgrey'}}>Already have an account? </Text>
            <Text
              onPress={() => navigation.navigate('Login')}
              style={{
                fontFamily: 'poppins-bold',
                color: 'white',
              }}>
              Login Here
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

export default SignupPage;
