// app/LibraryScreen.js

// 멤버 프로필 화면 (멤버의 지도, 게시물, 태그 확인 가능)

import React, { Component } from 'react';
import { Marker } from 'react-native-maps';

import axios from 'axios';
import configs from '../common/configs';
import { connect } from 'react-redux';
import utils from '../common/utils';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  BackHandler,
} from 'react-native';

import { Actions } from 'react-native-router-flux'; // New code

import Profile from '../components/Profile';
import MemberPostScreen from './MemberPostScreen';

import { setPostInfo, setTag } from '../actions/board';
import { setMemberInfo } from '../actions/member';

import Icon from 'react-native-vector-icons/Ionicons';

class ProfileScreen extends Component<Props> {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-list" size={30} color={tintColor}/>
    )
  }

  constructor(props) {
    super(props);

    this.state = {
      latitude: 42.882004,
      longitude: 74.582748,
      postList: [],
      // profileInfo : {numOfFollowers: 0, numOfPosts:0, nickname:'', profileLink:'member/basic.jpg'},
    };
  }

  /*
  onChangeInfo = (isFollowed) => {
    let delta = isFollowed ? -1 : 1;

    this.setState({
      profileInfo: {
        ...this.state.profileInfo,
        numOfFollowers: this.state.profileInfo.numOfFollowers + delta,
        isFollowed: !isFollowed
      }
    });
  }
  */

  /*
  handleBackPress = () => {
    //alert('hi');
    if (Actions.currentScene === 'profile') {
      if (!utils.isEmpty(this.props.updateFollowing))
      {
        this.props.updateFollowing();
      }
      Actions.pop();
      return true;
    }
    return false;
    //Actions.pop()
  }
*/
  handleBackPress = () => {
    //alert('hi');
    //console.log(Actions.currentScene);
    if (Actions.currentScene === 'profile') {
      Actions.pop();
      this.props.setMemberInfo({numOfFollowers: 0, numOfPosts:0, nickname:'', profileLink:''});
      return true;
    }
    return false;
    //Actions.pop()
  }

  componentDidMount()
  {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      this.props.setTag('');
      //BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      //console.log("MEMBER PROFILE LOAD!");
      //console.log(this.props.memberID);
      axios.get(utils.makeurls('/api/member/list/' + this.props.memberID + '?token=' + this.props.auth.token))
      .then((result) => {
        const { memberProfile, numOfFollowers, numOfPosts, isFollowed, me } = result.data;

        //sconsole.log(result.data);

        this.props.setMemberInfo({
          profileLink: memberProfile.profileLink, 
          nickname: memberProfile.nickname,
          numOfFollowers,
          numOfPosts,
          isFollowed,
          me,
          id: memberProfile._id
        });

        /*
        this.setState({
          profileInfo: {
            profileLink: memberProfile.profileLink, 
            nickname: memberProfile.nickname,
            numOfFollowers,
            numOfPosts,
            isFollowed,
            me,
            id: memberProfile._id
          }
        });
        */
      })
      .catch((err) => {
      });


      axios.get(utils.makeurls('/api/board/post/' + this.props.memberID))
      .then( (result) => {
        const { postInfo } = result.data;
        //console.log("읭읭???");
        //console.log(postInfo);
        this.props.setPostInfo(postInfo);
      })
      .catch((err) => {
        //console.log(err);
      });
  }
  
  /*
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
*/
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    return (
      <View style={styles.container}>
        <Profile/>
        <MemberPostScreen/>
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
  }
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    board: state.board
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPostInfo: (postInfo) => dispatch(setPostInfo(postInfo)),
    setMemberInfo: (memberInfo) => dispatch(setMemberInfo(memberInfo)),
    setTag: (tag) => dispatch(setTag(tag)),
  }
}

//export default HomeScreen;
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);