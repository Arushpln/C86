import React from 'react';
import {
  View, 
  Text,
  StyleSheets,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import{RFValue} from 'react-native-responsive-fontsize';

import * as Google from 'expo-google-app-auth';
import Firebase from 'firebase';

import AppLoading from 'expo-app-loading';
import * as Font from "expo-font";
letCustomFonts = {
  "Bubblegum-sans":require("../assets/fonts/BubblegumSans-Regular.ttf")};
  export default class LoginScreen extends component{
    constructor(props){
      super();
      this.state = {
        fontsLoaded:false
      };
    }
    async_loadFontsAsync(){
      await font.loadAsync(customFonts);
      this.setState({fontLoaded:true});
    }
    componentDidMount(){
      this.__loadFontsAsync();
    }
    isUserEqual = (googleUser,firebaseUser)=>{
      if(firebaseUser){
        var providerData = firebaseUser.providerData;
        for(var i = 0; i<providerData.length; i++){
          if(
            providerData[i].providerId === 
            firebase.auth.googleAuthProvider.PROVIDER_ID &&
            providerData[i].uId === googleUser.getBasicProfile().getId()
          ){

            return true;
          }
        }
      }

      return false
    };
    onSignIn = googleUser =>{
      var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser =>{
        unsubscribe();
        if(!this.isUserEqual(googleUser,firebaseUser)){
          var credential = firebase.Auth.googleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          firebase
          .auth()
          .signInWithCredentials(credential)
          .then(function(result){
            if(result.additionalUserInfo.isNewUser){
              firebase
              .database()
              .ref("/Users/"+result.User.uId)
              .set({
                gmail:result.user.email,
                profile_picture:result.additionalUserInfo.profile.picture,
                local:result.additionalUserInfo.profile.local,
                first_name:result.additionalUserInfo.given_name,
                last_name:result.additionalUserInfo.family_name
              })
              .then(function(snapshot){});
            }
          })
          .catch(error =>{
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          })
        }
      })
    }
  }