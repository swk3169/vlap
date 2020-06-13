// GET /api/board?page={numOfPages} 또는 /api/board?tag={tag명}를 통해 받은 게시물 정보를 출력해주는 화면

import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity, TouchableNativeFeedback, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo'

import { Thumbnail } from 'native-base';

import axios from 'axios';
import configs from '../common/configs';
import utils from '../common/utils';
import { TextInput } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/Ionicons';

import Dialog from "react-native-dialog";

import { connect } from 'react-redux';

import Post from '../components/Post';

class SearchScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tag:'',
            loading: false,
            page: 1,
            postList: [],
            postid: '',
            writerid: '',
            dialogVisible: false,
        };
    }

    _onPressSearch = () => {
        Actions.pop();
        //Actions.selectedpost();
    }

    componentDidMount() {
    }

    onScrollEndDrag = ({ nativeEvent }) => {
        const {page, tag} = this.state;

        this.setState({
            page: this.state.page + 1
        });
        
        axios.get(utils.makeurls('/api/board?page=' + page + '&tag=' + tag))
        .then( (result) => {
          const postList = result.data.post;
          //console.log(postList);
          if (postList.length > 0) {
            this.setState({
                postList: this.state.postList.concat(postList),
            });
          }
        })
        .catch((err) => {
          //console.log(err);
          //Actions.reset('login');
        });
    }

    onSubmitEditing = () => {
        const {tag} = this.state;

        axios.get(utils.makeurls('/api/board?page=1' + '&tag=' + tag))
        .then( (result) => {
          const postList = result.data.post;

          this.setState({
            page:2,
            postList,
            loading:true,
          });

        })
        .catch((err) => {
          //console.log(err);
          //Actions.reset('login');
        });

        //Actions.searchresult({tag: this.state.tag});
    }

    addDeltaToLike = (postID, delta) => {
        let postList = this.state.postList;

        postList.forEach(function(post, index, theArray) {
          if (post._id === postID)
          {
            theArray[index].numOfLikes += delta;
          }
        });

        this.setState({
            postList
        });
    }

    increaseView = (postID) => {
        let postList = this.state.postList;

        postList.forEach(function(post, index, theArray) {
          if (post._id === postID)
          {
            theArray[index].numOfViews += 1;
          }
        });

        this.setState({
            postList
        });
    }

    renderPostList = (postList) => {
        //console.log('In render Cells');
        if (utils.isEmpty(postList))
            return null;

        let curDate = new Date();
        let token = this.props.auth.token;
        
        return postList.map((post, index) => {
            const { postImageLink, postContents, postWriterID, numOfViews, numOfLikes, postDate, _id, contentsList, postTitle } = post;

            let writeDate = new Date(postDate);
            
            let diffhours = utils.diffHours(writeDate.getTime(), curDate.getTime());
            let diffdays = utils.diffDays(writeDate.getTime(), curDate.getTime());
            let prtDate = ''

            if (diffhours < 1)
                prtDate = "새 동영상";
            else if (diffhours < 24)
                prtDate = diffhours + "시간 전";
            else if (diffdays < 7)
                prtDate = diffdays + "일 전";
            else
                prtDate = postDate.substr(0, 10)
            
            const onPressProfile = () => {
                //this.props.setMemberInfo({numOfFollowers: 0, numOfPosts:0, nickname:'', profileLink:'member/basic.jpg', id: this.props.memberID});
                Actions.profile({memberID: postWriterID._id});
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
        });
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
        //this.setState({ dialogVisible: false });
            let postList = this.state.postList;

            for (idx = 0; idx < postList.length; idx++)
            {
                if (postList[idx]._id === this.state.postid)
                    break;
            }
            postList.splice(idx, 1);

            this.setState({
                postList
            });
            
            axios.delete(utils.makeurls('/api/board/post/' + this.state.postid + '?token=' + this.props.auth.token))
            .then( (result) => {
                alert('게시물을 삭제하였습니다!');
             })
            .catch((err) => {
                alert('게시물을 삭제하는데 실패하였습니다!');
            });
        }
    };

    render() {
        const {loading, postList} = this.state;
        var contents = null;

        if (loading && postList.length > 0) {
            const itemList = loading ? this.renderPostList(postList) : null;
            contents = (
                <FlatList
                    data={itemList}
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
            );
        }
        else if (loading) {
            contents = (
                <View style={styles.container_text_empty}>
                    <Text style={styles.text_empty}>{'검색 결과가 없습니다.'}</Text>
                </View>
            )
        }

        return (
            <View
                style={styles.container}
            >
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>게시물 삭제</Dialog.Title>
                    <Dialog.Description>
                        게시물을 삭제하시겠습니까?
                    </Dialog.Description>
                    <Dialog.Button label="취소" onPress={this.handleCancel} />
                    <Dialog.Button label="확인" onPress={this.handleDelete} />
                </Dialog.Container>
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
                    {contents}
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
    },
    container_text_empty: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems:'center',
        justifyContent:'center',
    },
})

const mapStateToProps = state => {
    return {
      auth: state.auth,
    }
  }

export default connect(mapStateToProps)(SearchScreen);