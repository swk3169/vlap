// GET /api/board/post/:member_id 또는 /api/board/me를 통해 얻은 게시물을 출력하는 게시물 조회 화면

import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, FlatList } from 'react-native';
import Dialog from "react-native-dialog";

import { Actions } from 'react-native-router-flux';

//import Icon from 'react-native-vector-icons/Entypo';
//import Icon from 'react-native-vector-icons/Ionicons';

import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

import { Thumbnail } from 'native-base';

import configs from '../../common/configs';
import { connect } from 'react-redux';
import utils from '../../common/utils';

import axios from 'axios';

import { setPostInfo } from '../../actions/board';
import { setMemberInfo } from '../../actions/member';

import Post from '../../components/Post';

class PostListTab extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Entypo name="video" size={30} color={tintColor}/>
        )
    }

    constructor(props) {
        super(props);

        this.state = {
            dialogVisible: false,
            postid: '',
            writerid: '',
            page:2,
        };
    }

    /*
    _onPressPost = () => {
        Actions.selectedpost();
    }
    */
    //_onPressMore = () => {
        //console.log("clicked!");
    //}

    onScrollEndDrag = ({ nativeEvent }) => {
        this.setState({
            page: this.state.page + 1
        });
        
        axios.get(utils.makeurls('/api/board/post/' + this.props.member.memberInfo.id + '?page=' + this.state.page))
        .then( (result) => {
          const { postInfo } = result.data;
          
          var postList = postInfo.postList;
          var tagSet = postInfo.tagSet;

          var newPostList = this.props.board.postInfo.postList;
          var newTagSet = this.props.board.postInfo.tagSet;

          for (var key in tagSet) {
            newTagSet[key] = tagSet[key];
          }

          var newPostList = newPostList.concat(postList);

          this.props.setPostInfo({
            ...this.props.board.postInfo,
            tagSet: newTagSet,
            postList: newPostList,
          });
        })
        .catch((err) => {
          //console.log(err);
        });
    }

    addDeltaToLike = (postID, delta) => {
        let postList = this.props.board.postInfo.postList;

        postList.forEach(function(post, index, theArray) {
          if (post._id === postID)
          {
            theArray[index].numOfLikes += delta;
          }
        });

        this.props.setPostInfo({
            ...this.props.board.postInfo,
            postList
        });
    }

    increaseView = (postID) => {
        let postList = this.props.board.postInfo.postList;

        postList.forEach(function(post, index, theArray) {
          if (post._id === postID)
          {
            theArray[index].numOfViews += 1;
          }
        });

        this.props.setPostInfo({
            ...this.props.board.postInfo,
            postList
        });
    }

    renderPostList (postList) {
        //console.log('In render Cells');
        if (utils.isEmpty(postList))
            return null;

        let curDate = new Date();
        let token = this.props.auth.token;

        //console.log(postList);
        return postList.map((post, index) => {
            //const { uri, title, profile, name, views, like } = cell;
            //console.log(cell);
            const { postImageLink, postContents, postWriterID, numOfViews, numOfLikes, postDate, _id, contentsList, postTitle } = post;

            let writeDate = new Date(postDate);

            let diffhours = utils.diffHours(writeDate.getTime(), curDate.getTime());
            let diffdays = utils.diffDays(writeDate.getTime(), curDate.getTime());
            let prtDate = ''
            //alert(postDate.getTime());
            //alert(diffdays);
            if (diffhours < 1)
                prtDate = "새 동영상";
            else if (diffhours < 24)
                prtDate = diffhours + "시간 전";
            else if (diffdays < 7)
                prtDate = diffdays + "일 전";
            else
                prtDate = postDate.substr(0, 10)
            
            const onPressProfile = () => {
                //Actions.profile({memberID: postWriterID._id});
            }

            const onPressMore = () => {
               this.setState({
                    dialogVisible: true,
                    postid: _id,
                    writerid: postWriterID._id,
               });
            }

            const increaseLike = () => {
                this.addDeltaToLike(_id, 1);
            }

            const decreaseLike = () => {
                this.addDeltaToLike(_id, -1);
            }

            const onPressPost = () => {
                this.increaseView(_id);
                //console.log(Actions.currentScene);

                Actions.detailpost(
                    {
                      postID: _id, 
                      contentsList: contentsList, 
                      contentsType: contentsList[0].contentsType, 
                      memberID: postWriterID._id, 
                      token, 
                      title:postTitle, 
                      text:postContents,
                      increaseLike:increaseLike,
                      decreaseLike:decreaseLike,
                      numOfLikes: numOfLikes,
                      loginMemberID: this.props.auth.memberID,
                    });
            }

            return { 
                key : _id, 
                postImageLink: postImageLink, 
                postWriterID:postWriterID,
                postTitle:postTitle,
                numOfLikes:numOfLikes,
                numOfViews:numOfViews,
                prtDate:prtDate,
                onPressPost:onPressPost,
                onPressProfile:onPressProfile,
                onPressMore:onPressMore
            }
        })
    }
    
    handleCancel = () => {
        this.setState({ dialogVisible: false });
      };
     
    handleDelete = () => {
        this.setState({ dialogVisible: false });
        
        if (this.state.writerid != this.props.auth.memberID) {
            alert('게시물을 삭제할 수 없습니다!');
        }
        else {
            
            let idx;
            let postList = this.props.board.postInfo.postList;

            for (idx = 0; idx < postList.length; idx++)
            {
                if (postList[idx]._id === this.state.postid)
                    break;
            }
    
            this.setState({ 
                dialogVisible: false,
            });
            postList.splice(idx, 1);
            //alert(postList.length);

            this.props.setPostInfo({
                ...this.props.board.postInfo,
                postList
            });

            this.props.setMemberInfo({
                ...this.props.member.memberInfo,
                numOfPosts: this.props.member.memberInfo.numOfPosts - 1,
            });

            
            axios.delete(utils.makeurls('/api/board/post/' + this.state.postid + '?token=' + this.props.auth.token))
            .then( (result) => {
                //alert('게시물을 삭제하였습니다!');
            })
            .catch((err) => {
            
            });
            
        }
    };

    render() {
        const { height } = Dimensions.get('window')
        let postList = this.renderPostList(this.props.board.postInfo.postList)
        //console.log("RERENDER!");

        return (
            <View style={styles.container}>
                <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>게시물 삭제</Dialog.Title>
                <Dialog.Description>
                    게시물을 삭제하시겠습니까?
                </Dialog.Description>
                <Dialog.Button label="취소" onPress={this.handleCancel} />
                <Dialog.Button label="확인" onPress={this.handleDelete} />
                </Dialog.Container>
                <FlatList
                    data={postList}
                    renderItem={({item}) =>
                     <Post
                        key={item.key}
                        postImageLink={item.postImageLink}
                        postWriterID={item.postWriterID}
                        postTitle={item.postTitle}
                        numOfLikes={item.numOfLikes}
                        numOfViews={item.numOfViews}
                        prtDate={item.prtDate}
                        onPressPost={item.onPressPost}
                        onPressProfile={item.onPressProfile}
                        onPressMore={item.onPressMore}
                     />
                    }
                    onEndReached={this.onScrollEndDrag}
                    onEndReachedThreshold={0.5}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
})

const mapStateToProps = state => {
    return {
      board: state.board,
      auth: state.auth,
      member: state.member,
    }
  }
  
const mapDispatchToProps = dispatch => {
  return {
    setPostInfo: (postInfo) => dispatch(setPostInfo(postInfo)),
    setMemberInfo: (memberInfo) => dispatch(setMemberInfo(memberInfo)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostListTab);