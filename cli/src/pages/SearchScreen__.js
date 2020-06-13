// GET /api/board?page={numOfPages} 또는 /api/board?tag={tag명}를 통해 받은 게시물 정보를 출력해주는 화면

import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo'

import { Thumbnail } from 'native-base';

import axios from 'axios';
import configs from '../common/configs';
import utils from '../common/utils';
import { TextInput } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/Ionicons';

export default class SearchScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tag:'',
        };
    }

    _onPressSearch = () => {
        Actions.pop();
        //Actions.selectedpost();
    }

    componentDidMount() {
    }

    onSubmitEditing = () => {
        Actions.searchresult({tag: this.state.tag});
    }

    render() {
        return (
            <View
                style={styles.container}
            >
                <View
                    style={styles.searchbar}    
                >
                    <TouchableNativeFeedback 
                        onPress={this._onPressSearch}
                        background={TouchableNativeFeedback.Ripple("", true)}>
                        <View style={{ marginRight: 15, padding: 5 }}>
                            <Icon color="#888" name="md-arrow-round-back" size={25}/>
                        </View></TouchableNativeFeedback>

                    <TextInput
                        style={styles.text} 
                        onChangeText={(tag)=>{this.setState({tag})}}
                        onSubmitEditing={this.onSubmitEditing}
                        value={this.state.tag}
                        placeholder="검색"
                        placeholderTextColor="#888"
                    />

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
    },
    searchbar: {
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
    text: {
        fontSize: 14,
        width: '80%',
    },
    progress: {
        height: 3,
        alignItems: 'stretch',
        backgroundColor: '#888'
    }
})