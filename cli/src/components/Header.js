// app/ScarletScreen.js

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code

import { connect } from 'react-redux';
import { setToken } from '../actions/auth';
import utils from '../common/utils';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() { 
    return (
      <View style={styles.container}>

        <View style={styles.item}>
        <TouchableHighlight
          underlayColor='transparent'
          style={styles.button}
          onPress={() => Actions.reset('main')}
        >
        <Image
            style={styles.navimage}
            source={require('../../resources/imgs/Vlap.png')}
        />
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    alignItems: 'center'
  },
  navimage: {
    resizeMode: 'stretch',
    width: 45,
    height: 45,
  },
  item : {
    flex:1,
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
  }
});

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setToken: (token) => dispatch(setToken(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);