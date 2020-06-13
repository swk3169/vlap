import React, { Component } from 'react';

import Slideshow from 'react-native-image-slider-show';
import TimedSlideshow from 'react-native-timed-slideshow';

import {AsyncStorage, Dimensions } from 'react-native';
import Video from 'react-native-video'

import utils from '../common/utils';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';

import { Thumbnail } from 'native-base';

import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import { Actions } from 'react-native-router-flux'; // New code
//import Navbar from '../components/Navbar';

import axios from 'axios';

import { setMemberInfo } from '../actions/member';
import { connect } from 'react-redux';

class DetailPostScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      isFollowing: false,
      isLike: false,
      contentsType: -1,
    };
  }

  _onPressProfile = () => {
    //this.props.setMemberInfo({numOfFollowers: 0, numOfPosts:0, nickname:'', profileLink:'member/basic.jpg', id: this.props.memberID});
    Actions.profile({memberID: this.props.memberID});
  }

  _onPressFollowing = () => {
    //alert("following clicked!");

    axios.post(utils.makeurls('/api/member/follow/' + this.props.memberID + '?token=' + this.props.token))
    .then((result) => {
      this.setState({ isFollowing: !this.state.isFollowing });
    })
    .catch((err) => {
      alert('로그인이 필요한 서비스입니다!');
      Actions.login();
      //console.log(err);
    });
  }

  _onPressLike = () => {
    //alert("like clicked!");
    if (this.state.isLike) {
      this.props.decreaseLike();
    }
    else {
      this.props.increaseLike();
    }

    this.setState({ isLike: !this.state.isLike });
    
    axios.post(utils.makeurls('/api/board/post/like/' + this.props.postID + '?token=' + this.props.token))
    .then((result) => {
    })
    .catch((err) => {
      alert('로그인이 필요한 서비스입니다!');
      Actions.login();
      //console.log(err);
    });
  }

  _onPressCommentInput = () => {
    if (!utils.isEmpty(this.props.token))
    {
      //alert(this.props.numOfLikes);
      Actions.comments({postID: this.props.postID, token: this.props.token, numOfLikes: this.props.numOfLikes});
    }
    else
      alert("로그인을 하셔야 합니다!");
  }

  _onPressExpand = () => {
    alert("expand clicked!");
  }

  componentDidMount() {
    //alert('Token:' + this.props.auth.token);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    axios.get(utils.makeurls('/api/board/detail/' + this.props.postID + '?token=' + this.props.token))
    .then((result) => {
      //console.log("DFDAF");
      //console.log(result.data);
      this.setState(
        {
          isLike: result.data.isLiked,
          isFollowing: result.data.isFollowing,
          profileLink: result.data.profileLink,
          nickname: result.data.nickname
        }
      );
    })
    .catch((err) => {
      //console.log(err);
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  getImageURLs = (contentsList) => {
    return contentsList.map( (contents, key) => {
      return {url: utils.makeurls('/' + contents.link)};
    });
  }
  
  getImageURIs = (contentsList) => {
    return contentsList.map( (contents, key) => {
      return {
        uri: utils.makeurls('/' + contents.link),
        title: this.props.title,
        text:this.props.text,
      };
    });
  }

  renderVideo = (contents) => {
    //console.log("뀨뀨꺄야꺙");
    //console.log(contents);

    return (
      <Video
        source={{uri: utils.makeurls('/' + contents.link)}}   // Can be a URL or a local file.
        muted={true}
        repeat={true}
        resizeMode={"cover"}
        volume={1.0}
        rate={1.0}
        ignoreSilentSwitch={"obey"}
        style={{
          aspectRatio: 1,
          width: "100%"
        }}
      />
    );
  }

  renderImages = (contentsList) => {
    const { height } = Dimensions.get('window');

    /*
    return (
      <Slideshow
        dataSource={this.getImageURLs(contentsList)}
        />
    )
    */
   return (
    <TimedSlideshow
      fullWidth={true}
      showProgressBar={false}
      items={this.getImageURIs(contentsList)}
      />
    )
  }

  handleBackPress = () => {
    //alert('hi');
    //console.log(Actions.currentScene);
    if (Actions.currentScene === 'detailpost') {
      Actions.pop();
      return true;
    }
    return false;
    //Actions.pop()
  }

  onBuffer = () => {
    //console.log('onBuffer');
  }

  onEnd = () => {
    //console.log('onEnd');
  }

  render() {
    //console.log(this.props);
    //console.log(this.getImageURLs(this.props.contentsList));
    const {contentsType} = this.props;

    let contents = null;


    switch (contentsType) {
      case 0:
       contents = this.renderImages(this.props.contentsList);
       break;
      case 1:
       contents = this.renderVideo(this.props.contentsList[0])
       break;
    }

    const { isFollowing, isLike } = this.state;
    const followButton = this.props.memberID === this.props.loginMemberID ?
                        null : <Icon color={isFollowing ? '#EA9389' : '#CCC'} name={isFollowing ? 'md-star' : 'md-star-outline'} size={45} onPress={this._onPressFollowing}/>
   return(
    <View style={styles.container}>

      <View style={styles.info_border}>
        <TouchableWithoutFeedback 
          onPress={this._onPressProfile}>
          <Thumbnail style={{width: 40, height: 40, margin:10}}source={{ uri: utils.makeurls('/' + this.state.profileLink) }} scaleX={0.85} scaleY={0.85}/>
        </TouchableWithoutFeedback>
        <Text style={styles.title}>{this.state.nickname}</Text>
        {followButton}
      </View>
      <View style={styles.middle}>
        {contents}
      </View>
      <View style={styles.info_border}>
        <Entypo
          style={{ paddingRight: 6 }}
          color={isLike ? '#EA9389' : '#CCC'}
          name={isLike ? 'heart' : 'heart-outlined'}
          size={42}
          onPress={this._onPressLike}/>
        <TouchableWithoutFeedback
          onPress={this._onPressCommentInput}>
          <View style={styles.comment_border}><Text style={styles.comment}>댓글달기</Text></View>
        </TouchableWithoutFeedback>
        <Icon
          style={{ paddingLeft: 12 }}
          color="#CCC"
          name="md-expand"
          size={30}
          onPress={this._onPressExpand}/>
      </View>
    </View>
  );
  
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  progress: {
    height: 10,
    alignItems: 'stretch',
    backgroundColor: 'red'
  },
  info_border: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 9,
    paddingRight: 15
  },
  middle: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: "center"
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
    color: '#FFF',
    fontSize: 16
  },
  comment_border: {
    flex: 1,
    justifyContent: 'center',
    borderColor: '#AAA',
    borderWidth: 2,
    borderRadius: 25
  },
  comment: {
    color: '#AAA',
    padding: 5,
    fontSize: 18
  }
});


//export default HomeScreen;
//export default DetailPostScreen;

const mapStateToProps = state => {
  return {
    member: state.member,
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setMemberInfo: (memberInfo) => dispatch(setMemberInfo(memberInfo)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailPostScreen);