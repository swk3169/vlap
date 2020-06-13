// app/index.js

import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

//import ScarletScreen from './components/ScarletScreen';
//import GrayScreen from './components/GrayScreen';
import LoginScreen from './src/pages/LoginScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import EmailLoginScreen from './src/pages/EmailLoginScreen';
import DetailPostScreen from './src/pages/DetailPostScreen';
import LibraryScreen from './src/pages/LibraryScreen';
import MainScreen from './src/pages/MainScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import SearchResultScreen from './src/pages/SearchResultScreen';
import SearchScreen from './src/pages/SearchScreen';
import ProfileModificationScreen from './src/pages/ProfileModificationScreen';
import CommentScreen from './src/pages/CommentScreen';
import UploadScreen from './src/pages/UploadScreen';
import LocationSettingScreen from './src/pages/LocationSettingScreen';

import {
  StyleSheet,
} from 'react-native';

const HIDE_NAVBAR = false;

const App = () => {
  return (
    <Router>
      <Scene key="root">
        <Scene key="login"
          component={LoginScreen}
          title="Vlap"
          hideNavBar={HIDE_NAVBAR}
        />
        <Scene key="main"
          component={MainScreen}
          title="Vlap"
          hideNavBar={HIDE_NAVBAR}
          initial
        />
        <Scene
          key="register"
          component={RegisterScreen}
          hideNavBar={HIDE_NAVBAR}
          title="Vlap"
        />
        <Scene
          key="emaillogin"
          component={EmailLoginScreen}
          hideNavBar={HIDE_NAVBAR}
          title="Vlap"
        />
        <Scene
          key="detailpost"
          component={DetailPostScreen}
          hideNavBar={true}
          title="Vlap"
        />
        <Scene
          key="library"
          component={LibraryScreen}
          hideNavBar={true}
          title="Vlap"
        />
        <Scene
          key="profile"
          component={ProfileScreen}
          hideNavBar={false}
          title="Vlap"
        />
        <Scene
          key="searchresult"
          component={SearchResultScreen}
          hideNavBar={true}
          title="Vlap"
        />
        <Scene
          key="search"
          component={SearchScreen}
          hideNavBar={true}
          title="Vlap"
        />
        <Scene
          key="profilemodification"
          component={ProfileModificationScreen}
          hideNavBar={true}
          title="Vlap"
        />
        <Scene
          key="comments"
          component={CommentScreen}
          hideNavBar={true}
          title="Vlap"
        />
        <Scene
          key="upload"
          component={UploadScreen}
          hideNavBar={true}
        />
        <Scene
          key="locset"
          component={LocationSettingScreen}
          hideNavBar={true}
        />
      </Scene>
      
    </Router>
  );
  /*
  return (
    <Router>
      <Scene key="root">
        <Scene key="scarlet"
          component={ScarletScreen}
          title="Scarlet"
          initial
        />
        <Scene
          key="gray"
          component={GrayScreen}
          title="Gray"
        />
      </Scene>
    </Router>
  );
  */
}

const styles = StyleSheet.create({
  backimage: {
    resizeMode: 'cover',
    width: 45,
    height: 45,
    margin: 10
  },
});

export default App;