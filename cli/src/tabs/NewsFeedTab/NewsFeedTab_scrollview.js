// GET /api/board?page={numOfPages} 또는 /api/board?tag={tag명}를 통해 받은 게시물 정보를 출력해주는 화면

import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo'

import { Thumbnail } from 'native-base';

import axios from 'axios';
import configs from '../../common/configs';
import utils from '../../common/utils';

import Post from '../../components/Post';

import Dialog from "react-native-dialog";

import { connect } from 'react-redux';

class NewsFeedTab extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name="ios-list" size={30} color={tintColor}/>
        )
    }

    constructor(props) {
        super(props);

        this.state = {
            postList: [],
            page:1,
            dialogVisible: false,
            postid: '',
        };
    }

    onScrollEndDrag = ({ nativeEvent }) => {
        this.setState({
            page: this.state.page + 1
        });
        
        axios.get(utils.makeurls('/api/board?page=' + this.state.page))
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
        });
    }

    componentDidMount() {
        axios.get(utils.makeurls('/api/board?page=' + this.state.page))
        .then( (result) => {
          const postList = result.data.post;

          this.setState({
            postList: this.state.postList.concat(postList),
            page: this.state.page + 1
          });
        })
        .catch((err) => {
        });
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

    renderCells (postList) {
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
            if (diffhours < 24)
                prtDate = diffhours + "시간 전";
            else if (diffdays < 7)
                prtDate = diffdays + "일 전";
            else
                prtDate = postDate.substr(0, 10)
            
            const onPressProfile = () => {
                Actions.profile({memberID: postWriterID._id});
            }

            const onPressMore = () => {
               this.setState({
                    dialogVisible: true,
                    postid: _id,
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
            
            return (
              <Post
                key={_id}
                postImageLink={postImageLink}
                postWriterID={postWriterID}
                postTitle={postTitle}
                numOfLikes={numOfLikes}
                numOfViews={numOfViews}
                prtDate={prtDate}
                onPressPost={onPressPost}
                onPressProfile={onPressProfile}
                onPressMore={onPressMore}
              />  
            );
              /*
            return (
                <TouchableOpacity
                    key={index}
                    onPress={this._onPressPost}
                    activeOpacity={0.8}>
                    <Image style={styles.thumbnail} source={{ uri: utils.makeurls('/' + postImageLink) }}/>
                    <View style={styles.info}>

                        <TouchableOpacity 
                            onPress={onPressProfile}
                            activeOpacity={0.5}>
                            <View style={{ marginRight: 7, marginBottom: 20 }}>
                                <Thumbnail source={{ uri: utils.makeurls('/' + postWriterID.profileLink) }} scaleX={0.85} scaleY={0.85}/>
                            </View>
                        </TouchableOpacity>

                        <View style={{ width: '75%' }}>
                            <Text style={styles.text_title}>{postContents}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.text_info}>{postWriterID.nickname} · </Text>
                                <Ionicons color="#F8E0E6" name="md-heart" size={20}/>
                                <Text style={styles.text_info}> {numOfLikes} · 조회수 {numOfViews}회</Text>
                            </View>
                            <Text style={styles.text_info}>{prtDate}</Text>
                        </View>

                        <TouchableNativeFeedback 
                            onPress={onPressMore}
                            background={TouchableNativeFeedback.Ripple("", true)}>
                            <View style={{ paddingLeft: 7, paddingRight: 10, justifyContent: 'center', marginBottom: 35 }}>
                                <Ionicons color="#888" name="md-more" size={25}/>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </TouchableOpacity>
            )
            */
        })
    }

    /*
    showDialog = () => {
        this.setState({ dialogVisible: true });
    };
    */

    handleCancel = () => {
        this.setState({ dialogVisible: false });
      };
     
    handleDelete = () => {
        this.setState({ dialogVisible: false });

        axios.delete(utils.makeurls('/api/board/post/' + this.state.postid + '?token=' + this.props.auth.token))
        .then( (result) => {
          alert('게시물을 삭제하였습니다!');
        })
        .catch((err) => {
          alert('게시물을 삭제하는데 실패하였습니다!');
        });
    };

    render() {
        const { height } = Dimensions.get('window')
        let cells = this.renderCells(this.state.postList)

        return (
            <View style={styles.container}>
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>게시물 삭제</Dialog.Title>
                    <Dialog.Description>
                        게시물을 삭제하시겠습니까?
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Delete" onPress={this.handleDelete} />
                </Dialog.Container>
                <ScrollView
                    style={[{ height: height }]}
                    onScrollEndDrag={this.onScrollEndDrag}
                >
                    {cells}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    thumbnail: {
        height: Dimensions.get("window").width*(9/16),
        resizeMode: 'contain',
        backgroundColor: 'black'
    },
    info: {
        marginTop: 10,
        marginLeft: 20,
        marginBottom: 15,
        flexDirection: 'row'
    },
    text_title: {
        fontSize: 15,
        color: '#353535'
    },
    text_info: {
        fontSize: 13,
        color: '#A2A2A2'
    }
})

const mapStateToProps = state => {
    return {
      auth: state.auth,
    }
  }
  
export default connect(mapStateToProps)(NewsFeedTab);