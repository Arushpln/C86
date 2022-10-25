import React, { Component } from "react";
import { StyleSheet, Text, View,SafeAreaView,Image,Switch } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled:false,
      light_theme:true,
      profile_image:"",
      name:""
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

async fetchUser(){
  let theme,name,image;
  await firebase
  .database()
  .ref("/users/"+ firebase.auth().currentUser.uid)
  .on("value",function (snapshot){
    theme=snapshot.val().current_theme
    name='${snapshot.val().first_name} ${snapshot.val().last_name}'
    image= snapshot.val().profile_picture
  })
  this.setState({
    light_theme:theme==="light"?true :false,
    isEnabled:theme==="light"?false :true,
    name:name,
    profile_image:image
  })
}
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />
    } else {
      return (
        <View style={styles.container}>
         <SafeAreaView style={styles.droidSafeArea}/>
         <View style={styles.appTitle}>
         <View style={styles.appIcon}>
         <Image 
         source={require("../assets/logo.png")}
         style={styles.iconImage}
         ></Image>
         </View>
         <View style={styles.appTitleTextContainer}>
         <Text style={styles.appTitleText}>Story Telling App</Text>
         </View>
         </View>
         <View style={styles.screenContainer}>
         <View style={styles.profileImageContainer}>
         <Image
         source={{uri:this.state.profile_image}}
         style={styles.profileImage}>
         </Image>
         <Text style={styles.nameText}>{this.state.name}</Text>
         </View>
         <View style={styles.themeContainer}>
         <Text style={styles.themeText}>Dark Theme</Text>
         <Switch
         style={{transform:[{scaleX:1.3},{scaleY:1.3}]}}
         trackColor={{false:"#767577",true:"white"}}
         thumbColor={this.state.isEnabled? "#ee8249" :"#f4f3f4"}
         ios_backgroundColor="#3e3e3e"
         onValueChange={ () => this.toggleSwitch()}
         value={this.state.isEnabled}/>
         </View>
         <View style={{flex:0.3}}/>
         </View>
         <View style={{flex:0.08}}/>


        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});