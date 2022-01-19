# React Native App Example
Just demonstrating how to protect passwords while communicating with server in react native
#
**Here we using asymmetric encryption**

***RSA Keys (public and private keys) are generated with OpenSSL library***

 Note: We could generate keys on the fly with server on each account creation and login requests for password protection, 
       but for demonstrating purpose here i've used already generated keys with openSSL(1024 bit) which is static.

- password is encrpyted with public key before sending to server
- server has the private key to decrypt the password and save it in hashed form (used bcrypt)

I thought what should to do after Login and Signup, so instead of getting boring welcome page, here I have used
**Meme API  and Quote API** to make homepage more fun 😁

**To generate APK :**
 - open terminal to this project root directory do as below follows:
   - copy paste this command in your terminal and hit enter :
   
      > keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
       
   - it will ask for password, type your desired password and press enter
   - it will generate this file **my-upload-key.keystore** in your project root directory 
   - cut the my-upload-key.keystore file and paste into android/app in this project directory
   - go to android/gradle.properties file in project directory and change this below ***** value to you passwords
   
     > MYAPP_UPLOAD_STORE_PASSWORD=*****
     
     > MYAPP_UPLOAD_KEY_PASSWORD=*****
     
   - then type 
   
     > cd android press
     
     and press enter
   - then type  
   
     > ./gradlew bundleRelease
     
     and press enter
   - it will generate apk into /android/app/build/outputs/apk/release
   
   **That's it! you successfully generated apk.**
   
  For More Information for generating signed apk, go through the below offical docs link:
    
   > https://reactnative.dev/docs/signed-apk-android
    
## Backend node-server repo :

https://github.com/Izas-Ahamed/node-decrypt-api-example
