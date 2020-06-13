import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

import { connect } from 'react-redux';

import { setToken, setAuth } from '../../actions/auth';
import { setPostInfo, setTag } from '../../actions/board';

import {AsyncStorage} from 'react-native';

import { Actions } from 'react-native-router-flux'; // New code

class LogoutScreen extends React.Component {
  componentDidMount() {
    this.props.setToken('');
    this.props.setAuth(false);
    this.removeTokenData();
    Actions.reset('main');
  }

  removeTokenData = async () => {
    try {
      //alert(token);
      await AsyncStorage.setItem('Token', '');
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Screen 1</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const mapStateToProps = state => {
  return {
    auth: state.auth,
    board: state.board
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setToken: (token) => dispatch(setToken(token)),
    setAuth: (isAuth) => dispatch(setAuth(isAuth)),
  }
}

//export default HomeScreen;
export default connect(mapStateToProps, mapDispatchToProps)(LogoutScreen);