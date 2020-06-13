// 구독자 게시물 조회 스크린
import React, { Component } from 'react';
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps';

import axios from 'axios';

import { connect } from 'react-redux';
import utils from '../common/utils';

import {AsyncStorage} from 'react-native';

import { NavigationEvents } from "react-navigation";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { Actions } from 'react-native-router-flux'; // New code

import { setToken, setAuth } from '../actions/auth';
import { setFollowingMemberList, setFollowingPostList } from '../actions/following';
import { setMemberInfo } from '../actions/member';

import Icon from 'react-native-vector-icons/Ionicons';

class FollowingsScreen extends Component<Props> {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
        <Icon name="logo-youtube" size={25} color={tintColor}/>
    )
}
  
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 42.882004,
        longitude: 74.582748,
        latitudeDelta: 100,
        longitudeDelta: 100
      },

      postList: [],
      followings: [],
      selectMemberID: '',
      load: false,
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

  onWillFocus = (payload) => {
    this.props.setMemberInfo({numOfFollowers: 0, numOfPosts:0, nickname:'', profileLink:''});
    if (!utils.isEmpty(this.props.auth.token)) {
      axios.get(utils.makeurls('/api/member/me?token=' + this.props.auth.token))
      .then((result) => {
        const { memberProfile, numOfFollowers, numOfPosts, isFollowed, me } = result.data;
        this.props.setAuth(true);
      })
      .catch((err) => {
        //console.log(err);
        Actions.reset('login');
      });

      axios.get(utils.makeurls('/api/board/me/followingspost?token=' + this.props.auth.token))
      .then((result) => {
        this.setState(
          {
            followings: result.data.myfollow,
            postList: result.data.post,
            load: true,
          }
        );

        this.props.setFollowingMemberList(result.data.myfollow);
        this.props.setFollowingPostList(result.data.post);
      })
      .catch((err) => {
        //console.log(err);
        //console.log(err);
      });
    }
    else {
      Actions.reset('login');
    }
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

  /*
  updateFollowing = () => {
    //console.log("꺙");
    axios.get(utils.makeurls('/api/board/me/followingspost?token=' + this.props.auth.token))
    .then((result) => {
      this.setState(
        {
          followings: result.data.myfollow,
          postList: result.data.post,
          load: true,
        }
      );
    })
    .catch((err) => {
      //console.log(err);
    });
  }
*/

  componentDidMount() {
    //alert('Token:' + this.props.auth.token);

    /*
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          },
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    */
   
   //console.log("의읭??????");
   //console.log(this.props.test);
  }

  /*
  componentWillReceiveProps(props){
    console.log('component: componentWillReceiveProps');
    console.log(props);
  }
  */

  /*
  postListToMarkerList = (followingPostList) => {
    let postList = [];
    let token = this.props.auth.token;
    
    if (this.state.selectMemberID === '')
    {
      postList = followingPostList;
    }
    else
    {
      postList = followingPostList.filter( post => { 
        if (post.postWriterID === this.state.selectMemberID) {
          return true;
        }
        else {
          return false;
        }
      });
    }

    let goodPostList = [];
    for (var i = 0; i < postList.length; i++)
    {
      if (!utils.isEmpty(postList[i].geo) && !utils.isEmpty(postList[i].postMarkerLink))
      {
          goodPostList.push(postList[i]);
      }
    }

    return goodPostList.map( (post, key) => {

      //console.log(utils.makeurls(post.postMarkerLink));
      const { postImageLink, postMarkerLink, postContents, postWriterID, numOfViews, numOfLikes, postDate, _id, contentsList, postTitle, geo } = post;

      const onPressMarker = () => {
        Actions.detailpost(
          {
            postID: _id, 
            contentsList: contentsList, 
            contentsType: contentsList[0].contentsType, 
            memberID: postWriterID, 
            token, 
            title:postTitle, 
            text:postContents
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
  
  let goodPostList = [];
  for (var i = 0; i < postList.length; i++)
  {
    if (!utils.isEmpty(postList[i].geo) && !utils.isEmpty(postList[i].postMarkerLink))
    {
        goodPostList.push(postList[i]);
    }
  }

  return goodPostList.map( (post, key) => {
    const { postImageLink, postMarkerLink, postContents, postWriterID, numOfViews, numOfLikes, postDate, _id, contentsList, postTitle, geo } = post;

    const onPressMarker = () => {
      Actions.detailpost(
        {
          postID: _id, 
          contentsList: contentsList, 
          contentsType: contentsList[0].contentsType, 
          memberID: postWriterID, 
          token, 
          title:postTitle, 
          text:postContents
        });
    }

    return (<Marker
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
      )
    });
  }

  initSelectMember = () => {
    this.setState({
      selectMemberID: ''
    });
  }

  renderFollowings = (followingList) => {
    //console.log('In render Cells');
    /*
    if (followingList.length <= 0)
    {
      return (
        <TouchableOpacity
            onPress={this.initSelectTag}
            activeOpacity={0.8}>
            <View style={styles.info}>
              <Image style={styles.markerimage} source={require('../../resources/imgs/Vlap.png')}/>
              <Text style={styles.text_title}>{'구독자를 추가해주세요!'}</Text>
            </View>
        </TouchableOpacity>
      );
    }
    */

    //console.log(postList);
    return followingList.map((following, index) => {
        const { profileLink, _id, nickname } = following.followingMemberID;
        //console.log(profileLink, _id, nickname);

        const onPress = () => {
          this.setState({selectMemberID: _id})
        }

        const onPressProfile = () => {
          // Actions.profile({memberID: _id, updateFollowing: this.updateFollowing});
          Actions.profile({memberID: _id});
        }

        return (
            <TouchableOpacity
                key={index}
                onPress={onPressProfile}
                activeOpacity={0.8}>
                <View style={styles.info}>
                  <Image style={styles.markerimage} source={{ uri: utils.makeurls('/' + profileLink) }}/>
                  <Text style={styles.text_title}>{nickname}</Text>
                </View>
            </TouchableOpacity>
        )
    })
  }

  onRegionChange = (region) => {
    this.setState({ region });
  }

  render() {
    //let cells = this.renderFollowings(this.state.followings)

    const { width } = Dimensions.get('window')
    //console.log('구독자 게시물');
    //console.log(this.state);

    if (!this.state.load) {
      //console.log(this.state.load);
      return (
        <View style={styles.container}>
        <NavigationEvents
              onWillFocus={this.onWillFocus}
        />
        </View>
      );
    }
    else if (this.state.followings.length <= 0) {
      return (
        <View style={styles.container_empty}>
          <NavigationEvents
              onWillFocus={this.onWillFocus}
          />
          <View style={styles.container_text_empty}>
              <Text style={styles.text_empty}>{'구독자를 추가해주세요!'}</Text>
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <NavigationEvents
              onWillFocus={this.onWillFocus}
          />
          <View style={{height: 80, marginTop:10, width: width, backgroundColor:'#ffffff'}}>
          <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
              >
                  {this.renderFollowings(this.props.follow.memberList)}
          </ScrollView>
          </View>
          <MapView
            style={{flex: 10}}
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChange}
            zoom={0}
            showsUserLocation={false}>
              {this.postListToMarkerList(this.props.follow.postList)}
          </MapView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container_empty: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems:'center',
  },
  container_text_empty: {
      flex: 1,
      backgroundColor: '#FFF',
      alignItems:'center',
      justifyContent:'center',
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
    alignItems:'center',
  },
  text_title: {
    fontSize: 15,
    color: '#353535'
  },
  text_empty: {
    fontSize: 15,
    color: '#353535'
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    follow: state.follow,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setToken: (token) => dispatch(setToken(token)),
    setAuth: (isAuth) => dispatch(setAuth(isAuth)),
    setFollowingMemberList: (memberList) => dispatch(setFollowingMemberList(memberList)),
    setFollowingPostList: (postList) => dispatch(setFollowingPostList(postList)),
    setMemberInfo: (memberInfo) => dispatch(setMemberInfo(memberInfo)),
  }
}

//export default HomeScreen;
export default connect(mapStateToProps, mapDispatchToProps)(FollowingsScreen);