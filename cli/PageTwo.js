import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class PageTwo extends Component<Props> {
  render() {
    return (
      <View style={{margin: 128}}>
        <Text onPress={Actions.pageOne}>This is PageTwo!</Text>
      </View>
    )
  }
}