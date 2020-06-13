// 인기 게시물 조회 스크린
import React, { Component } from 'react';
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps';

import axios from 'axios';
import configs from '../common/configs';

import Geocoder from 'react-native-geocoding';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { Actions } from 'react-native-router-flux'; // New code

import { setToken, setAuth, setMemberID } from '../actions/auth';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { NavigationEvents } from "react-navigation";

class LocationSettingScreen extends Component<Props> {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-flame" size={30} color={tintColor}/>
    )
  }
  
  constructor(props) {
    super(props);
    //console.log(this.props);

    this.state = {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      region: this.props.region,
      address:'',
    }

    Geocoder.init("AIzaSyCMLMNMMtCLywW4V0G5uLe9rba7yTeaf-M", {language : "ko"});
  }

  onRegionChange = (region) => {
    this.setState({region});

    //this.props.onRegionChange(region);
  }

  onPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;

    this.setState({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });

    /*
    this.props.onLatLngChange(event.nativeEvent.coordinate)
    this.props.onRegionChange({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: this.state.region.latitudeDelta,
      longitudeDelta: this.state.region.longitudeDelta,
    });
    */
  }

  onPressConfirm = () => {
    const {latitude, longitude} = this.state;

    this.props.onLatLngChange({
      latitude,
      longitude
    })

    this.props.onRegionChange({
      latitude,
      longitude,
      latitudeDelta: this.state.region.latitudeDelta,
      longitudeDelta: this.state.region.longitudeDelta,
    });
    Actions.pop();
  }

  onSubmitEditing = () => {
    //console.log(this.state.address);
    Geocoder.from(this.state.address)
    .then(json => {
      const {lat, lng} = json.results[0].geometry.location;
      //console.log(location)
      //console.log(lat, lng);

      this.setState({
          latitude:lat,
          longitude:lng,
          region: {
            latitude:lat,
            longitude:lng,
            latitudeDelta:0.02,
            longitudeDelta:0.02
          }
      });

      /*
      this.props.onLatLngChange({
        latitude:lat,
        longitude:lng,
      })

      this.props.onRegionChange({
        latitude: lat,
        longitude: lng,
        latitudeDelta:0.02,
        longitudeDelta:0.02
      });
      */
    })
    .catch(error => {
      //console.log(error);
      alert('존재하지 않는 주소입니다!');
    });
  }

  render() {
    const { width } = Dimensions.get('window')
    //const { region } = this.props;
    const { latitude, longitude } = this.state;

    //const { latitude, longitude } = region;
    //console.log(latitude);

    // onPress={ (event) => this.props.onLatLngChange(event.nativeEvent.coordinate) }
    return (
      <View style={styles.container}>
        <View
          style={styles.searchbar}    
        >
          <TextInput
              style={styles.text} 
              onChangeText={(address)=>{this.setState({address})}}
              onSubmitEditing={this.onSubmitEditing}
              value={this.state.address}
              placeholder="주소 검색"
              placeholderTextColor="#888"
          />
          <Text style={styles.textconfirm} onPress={this.onPressConfirm}>확인</Text>
        </View>
        <MapView
          style={{flex: 10}}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          onPress={this.onPress}
          showsUserLocation={true}
        >
          <Marker
            coordinate={{"latitude":latitude, "longitude":longitude}}
          >
          </Marker>
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    paddingLeft:5,
    fontSize: 14,
    width: '85%',
  },
  textconfirm: {
    fontSize: 14,
    width: '10%',
  },
});

//export default HomeScreen;
export default LocationSettingScreen;