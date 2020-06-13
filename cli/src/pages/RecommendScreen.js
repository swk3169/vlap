// 추천 게시물 조회 스크린

const FBSDK = require('react-native-fbsdk');
const CryptoJS = require("crypto-js");

import React, { Component } from 'react';
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps';

import axios from 'axios';
import configs from '../common/configs';
import { connect } from 'react-redux';
import utils from '../common/utils';

import {AsyncStorage} from 'react-native';

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

import { setToken, setAuth } from '../actions/auth';

import Icon from 'react-native-vector-icons/Ionicons';

import { NavigationEvents } from "react-navigation";

const {LoginButton, ShareDialog, AccessToken, GraphRequest, GraphRequestManager} = FBSDK;

class RecommendScreen extends Component<Props> {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-thumbs-up" size={30} color={tintColor}/>
    )
  }
  
  constructor(props) {
    super(props);

    this.state = {
      latitude: 42.882004,
      longitude: 74.582748,
      showing: false,
      postList: [],
      selectTag: '',
      tracksViewChanges: true,
    };

   this.retrieveData();
  }

  stopRendering = () =>
  {
      //this.setState({ tracksViewChanges: false });
      //if (!this.state.tracksViewChanges)
        setTimeout( () => {this.setState({ tracksViewChanges: false })}, 3000);
  }

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('Token');
      if (value !== null) { // 토큰이 존재할 경우 토큰을 props에 등록
        this.props.setToken(value);
        //console.log(value);
        return value;
      }
    } catch (error) {
      return null;
    }
  };

  onWillFocus = (payload) => {
    if (!utils.isEmpty(this.props.auth.token)) {
      axios.get(utils.makeurls('/api/member/me?token=' + this.props.auth.token))
      .then((result) => {
        const { memberProfile, numOfFollowers, numOfPosts, isFollowed, me } = result.data;
        
        this.props.setAuth(true);
      })
      .catch((err) => {
        Actions.reset('login');
      });
    }
    else {
      Actions.reset('login');
    }
  }

  addDeltaToLike = (postID, delta) => { // like수를 변동시킬 필요가 없으므로 비워둠
  }

  componentDidMount() {
    //alert('Token:' + this.props.auth.token);

    /*
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    */

    /*
    axios.get(utils.makeurls('/api/board/recommendedPost?token=' + this.props.auth.token))
    .then((result) => {
      //console.log('in /board/hot');
      //console.log(result);
      //console.log(result.data);
      this.setState({postList: result.data});
    })
    .catch((err) => {
      //console.log(err);
    });
    */
   axios.get(utils.makeurls('/api/board/recommendedPostHardNew?token=' + this.props.auth.token))
   .then((result) => {
     //console.log('in /board/hot');
     //console.log(result);
     //console.log(result.data);
     this.setState({postList: result.data.newRecommendPost});
   })
   .catch((err) => {
     //console.log(err);
   });
  }

  /*
  postListToMarkerList = (hotPost) => {
    let postList = [];
    //console.log("의으잉ㄻㅇ???");
    //console.log(hotPost);
    if (this.state.selectTag === '')
    {
      for (var tag in hotPost) {
        //console.log(tag);
        //console.log(hotPost[tag])
        postList = postList.concat(hotPost[tag]);
      }
      //console.log("Total:");
      //console.log(postList);
    }
    else
    {
      postList = hotPost[this.state.selectTag];
    }

    let token = this.props.auth.token;

    //console.log("의으잉ㄻㅇ???");
    //console.log(postList);
    return postList.map( (post, key) => {

      const { postImageLink, postMarkerLink, postContents, postWriterID, numOfViews, numOfLikes, postDate, _id, contentsList, postTitle, geo } = post;
      //console.log(utils.makeurls(post.postMarkerLink));
      
      //console.log(utils.makeurls(post.postMarkerLink));
      
      const increaseLike = () => {
        this.addDeltaToLike(_id, 1);
      }

      const decreaseLike = () => {
          this.addDeltaToLike(_id, -1);
      }

      const onPressMarker = () => {
        Actions.detailpost(
          {
            postID: _id, 
            contentsList: contentsList, 
            contentsType: contentsList[0].contentsType, 
            memberID: postWriterID, 
            token, 
            title:postTitle, 
            text:postContents,
            increaseLike:increaseLike,
            decreaseLike:decreaseLike,
            numOfLikes: numOfLikes,
            loginMemberID: this.props.auth.memberID,
          });
      }

      //console.log("읭읭??");
      //console.log(post);

      return <Marker
        key={key}
        coordinate={{"latitude":geo[0], "longitude":geo[1]}}
        onPress={onPressMarker}
        zIndex={key}
      >
        <View style={{width:42,height:42,borderWidth:0,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA7A7', borderRadius:20}}>
          <Image
            style={styles.markerimage} 
            source={{uri: utils.makeurls('/' + postMarkerLink)}}
          />
        </View>
      </Marker>
    });
  }
*/

postListToMarkerList = (postList) => {
  let token = this.props.auth.token;

  return postList.map( (post, key) => {
    const { postImageLink, postMarkerLink, postContents, postWriterID, numOfViews, numOfLikes, postDate, _id, contentsList, postTitle, geo } = post;

    const increaseLike = () => {
      this.addDeltaToLike(_id, 1);
    }

    const decreaseLike = () => {
        this.addDeltaToLike(_id, -1);
    }

    const onPressMarker = () => {
      Actions.detailpost(
        {
          postID: _id, 
          contentsList: contentsList, 
          contentsType: contentsList[0].contentsType, 
          memberID: postWriterID, 
          token, 
          title:postTitle, 
          text:postContents,
          increaseLike:increaseLike,
          decreaseLike:decreaseLike,
          numOfLikes: numOfLikes,
          loginMemberID: this.props.auth.memberID,
        });
    }

    return <Marker
      key={key}
      coordinate={{"latitude":geo[0], "longitude":geo[1]}}
      onPress={onPressMarker}
      zIndex={key}
      tracksViewChanges={this.state.tracksViewChanges}
    >
      <View style={{width:42,height:42,borderWidth:0,alignItems:'center',justifyContent:'center',backgroundColor:'#FFA7A7', borderRadius:20}}>
        <Image
          style={styles.markerimage} 
          source={{uri: utils.makeurls('/' + postMarkerLink)}}
          onLoad={this.stopRendering}
        />
      </View>
    </Marker>
  });
}

  render() {
    const { width } = Dimensions.get('window')

    return (
      <View style={styles.container}>
        <NavigationEvents
            onWillFocus={this.onWillFocus}
        />
        <MapView
          style={{flex: 10}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 100,
            longitudeDelta: 100
          }}
          zoom={0}
          showsUserLocation={this.state.showing}>
            {this.postListToMarkerList(this.state.postList)}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
  markerImgContainer: {
    marginLeft: 8,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  markerimage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  info: {
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text_title: {
    fontSize: 15,
    color: '#353535'
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setToken: (token) => dispatch(setToken(token)),
    setAuth: (isAuth) => dispatch(setAuth(isAuth)),
  }
}

//export default HomeScreen;
export default connect(mapStateToProps, mapDispatchToProps)(RecommendScreen);