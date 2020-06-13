import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Image, Switch, TouchableOpacity, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Actions } from 'react-native-router-flux' 
import ImagePicker from 'react-native-image-picker'
import Video from 'react-native-video'

import { connect } from 'react-redux';

import Loader from '../components/Loader'

import utils from '../common/utils';
import axios from 'axios';

import Geocoder from 'react-native-geocoding';

class UploadScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            explain: '',
            fbSwitchValue: false,
            igSwitchValue: false,
            select: 0,
            photo: null,
            video: null,
            loading: false,
            latitude: 0,
            longitude: 0,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 30,
                longitudeDelta: 30,
              },
            address: '위치를 설정하세요!'
        };

        Geocoder.init("AIzaSyCMLMNMMtCLywW4V0G5uLe9rba7yTeaf-M", {language : "ko"});
    }

    componentDidMount() {
        //console.log("뀨뀨꺄꺄");
        navigator.geolocation.getCurrentPosition(
            (position) => {
              //console.log(position);
              const {latitude, longitude} = position.coords;

              this.setState({
                latitude,
                longitude,
                region: {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta,
                },
                error: null,
              });

              Geocoder.from({
                latitude:latitude,
                longitude:longitude,
              })
              .then(json => {
                var addressComponent = json.results[0].formatted_address;
                this.setState({
                    address:addressComponent
                });
              })
              .catch(error => {
                  this.setState({
                    address:"표시되지 않는 주소입니다."
                  });
                  //console.warn(error)
                }
              );
            },
            (error) => {
                //console.log(error);
                this.setState({ error: error.message })
            },
            { enableHighAccuracy: true, timeout: 20000 },
          );
    }
    /*
    fbSwitchPress = () => this.setState(state => ({
        fbSwitchValue: !this.state.fbSwitchValue
    }));
    igSwitchPress = () => this.setState(state => ({
        igSwitchValue: !this.state.igSwitchValue
    }));
    */
    backPress = () => { Actions.pop() }

    handleChoosePhoto = () => {
        const options = {
          noData: true,
          rotation: 360,
          mediaType:'image'
        }
        ImagePicker.launchImageLibrary(options, response => {
          if (response.uri) {
            //console.log(response);
            this.setState({ photo: response, select: 1})
            //alert(response.originalRotation);
            //alert(response.isVertical);
            //alert(response.type);
          }
        })
      }

    handleChooseVideo = () => {
        const options = {
          noData: true,
          rotation: 360,
          mediaType:'video'
        }
        ImagePicker.launchImageLibrary(options, response => {
          if (response.uri) {
            //console.log(response);
            this.setState({ video: response, select: 2 })
            //alert(response.originalRotation);
            //alert(response.isVertical);
            //alert(response.type);
          }
        })
      }

    handleConfirm = () => {
        //alert("확인!");
        //alert(this.props.auth.token);
        if (utils.isEmpty(this.props.auth.token)) {
            alert("로그인 후 사용할 수 있는 서비스 입니다!");
            Actions.login();
            return;
        }
        const data = new FormData();
        
        const {title, explain, photo, video, select, latitude, longitude} = this.state;

        //console.log(latitude, longitude);

        if (select == 0)
        {
            alert('컨텐츠를 선택해주세요!');
            return;
        }    
        else if (title.length > 20 || title.length == 0)
        {
            alert('제목은 20자 내로 작성해주세요!');
            return;
        }
        else if (explain.length > 50 || explain.length == 0)
        {
            alert('글 내용은 50자 내로 작성해주세요!');
            return;
        }
        else if (utils.isEmpty(latitude) || utils.isEmpty(longitude))
        {
            alert('위치를 설정해 주세요!');
            return;
        }

        var tagList = utils.extractTag(explain);
        var token = this.props.auth.token;
        
        this.setState({loading: true});
        
        //console.log(video);
        if (select == 1) {
            data.append("contents[]", {
                name: photo.fileName,
                type: photo.type,
                uri:
                Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", ""),
            });
        }
        else if (select == 2) {
            data.append("contents[]", {
                name: 'file.mp4',
                fileName:'video.mp4',
                type:'video/mp4',
                uri:
                Platform.OS === "android" ? video.uri : video.uri.replace("file://", ""),
            }); 
        }
    
        data.append("title", title); 
        data.append("postContents", explain); 
        data.append("tagList", tagList); 
        
        //console.log(data);

        axios.post(utils.makeurls('/api/board/post?lat=' + latitude + '&lng=' + longitude + '&token=' + token), data)
        .then(res => {
            //alert('done!');
            this.setState({loading: false});
            Actions.pop(); //alert("가입 성공!"); 
        })
        .catch((err) => {
            this.setState({loading: false});
            //console.log(err);
            alert('게시물 작성에 실패하였습니다.');
        });
      }

    onRegionChange = (region) => {
        this.setState({ region });
    }

    onLatLngChange = (latlng) => {
        //console.log(latlng);
        //alert('hi');
        this.setState({
            latitude:latlng.latitude,
            longitude:latlng.longitude,
        });

        Geocoder.from({
            latitude:latlng.latitude,
            longitude:latlng.longitude,
        })
		.then(json => {
            var addressComponent = json.results[0].formatted_address;
            this.setState({
                address:addressComponent
            });
		})
        .catch(error => {
            this.setState({
              address:"표시되지 않는 주소입니다."
            });
            //console.warn(error)
          }
        );
    }

    onPressLocationSetting = () => {
        Actions.locset({
            region:this.state.region, 
            latitude:this.state.latitude,
            longitude:this.state.longitude,
            onLatLngChange:this.onLatLngChange,
            onRegionChange: this.onRegionChange,
        });
    }

    render() {
        //var imageView = this.state.select === 0 ? <Text style={styles.select_text}></Text> : <Image source={{ uri: this.state.photo.uri }} style={styles.selectimage}></Image> 
        const {address} = this.state;
        const dot = address.length > 35 ? ' ...' : '';

        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <View style={styles.navBar}>
                    <Text style={styles.backText} onPress={this.backPress}>&lt;</Text>
                    <Text style={styles.nameText}>새 브이랩</Text>
                    <Text style={styles.uploadText} onPress={this.handleConfirm}>업로드</Text>
                </View>
                <View style={styles.uploadArea}>
                    <View style={styles.imageAndTitle}>
                        <View style={styles.preview}>
                        {this.state.select === 1 && (
                            <Image
                                source={{ uri: this.state.photo.uri }}
                                style={styles.selectimage} 
                            />
                        )}
                        {this.state.select === 2 && (
                            <Image
                                source={{ uri: this.state.video.uri }}
                                style={styles.selectimage} 
                            />
                        )}
                        </View>
                        <View style={styles.selectview}>
                            <TouchableOpacity onPress={this.handleChoosePhoto} style={styles.selecttouch}>      
                                <Text style={styles.selecttool}>이미지 선택</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.handleChooseVideo} style={styles.selecttouch}>      
                                <Text style={styles.selecttool}>동영상 선택</Text>
                            </TouchableOpacity>
                        <TextInput
                            style={styles.title}
                            placeholder="제목"
                            placeholderTextColor="#9F9F9F"
                            onChangeText={(title) => this.setState({ title })}
                        />
                        </View>
                    </View>
                    <View style={styles.explainView}>
                        <TextInput
                            style={styles.explain}
                            placeholder="설명"
                            placeholderTextColor="#9F9F9F"
                            onChangeText={(explain) => this.setState({ explain })}
                        />
                    </View>
                    <View style={styles.location}>
                        <Entypo name="location-pin" style={styles.pinIcon} size={20}/>
                        <Text style={styles.locationText}>위치
                                
                        </Text>
                        <Text onPress={this.onPressLocationSetting}>{address.slice(0, 35) + dot}</Text>
                        <Text style={styles.rightClamp} onPress={this.onPressLocationSetting}>&gt;</Text>
                    </View>
                    <View style={styles.sns}>
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'white',
    },
    selectimage: {
        height: 120,
        width: 120,
      },
    navBar: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        alignItems: 'center'
    },
    backText: {
        flex: 1,
        position: 'relative',
        left: 10,
        fontSize: 15,
        fontWeight: '200',
    },
    nameText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    uploadText: {
        flex: 1,
        position: 'relative',
        right: 10,
        textAlign: 'right',
    },
    uploadArea: {
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
    },
    imageAndTitle: {
        flexDirection: 'row',
        width: '100%',      
        height: 125,
        alignItems: 'stretch',
        // justifyContent:'center',
    },
    preview: {
        width: 120,
        height: 120,
        borderRadius: 5,
        borderStyle: 'dotted',
        borderColor:'black',
        borderWidth: 2,
        backgroundColor: 'white',
        justifyContent:'center',
        alignItems:'center',
    },
    selecttouch: {
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    title: {
        marginLeft: 10,
        width: Dimensions.get("window").width - 150,
        textAlignVertical: 'bottom',
        marginBottom: 5,
        borderBottomColor: '#b2b2b2',
        borderBottomWidth: 2,
    },
    selectview: {
        justifyContent:'space-between',
    },
    selecttool: {
        marginLeft: 10,
        width: Dimensions.get("window").width - 150,
        textAlignVertical: 'center',
    },
    explainView: {
        borderBottomColor: '#b2b2b2',
        borderBottomWidth: 2,
        height: 60,
    },
    explain: {
        marginTop: 10,
        textAlignVertical: 'bottom',
    },
    location: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomColor: '#b2b2b2',
        borderBottomWidth: 2,
        height: 100,
        justifyContent: 'center',
    },
    rightClamp: {
        flex: 1,
        textAlign: 'right',
    },
    locationText: {
        flex: 1,
    },
    sns: {
        marginTop: 10,
    },
    fbTxt: {
    },
    switch: {
        position: 'relative',
        marginTop: -22,
    },
    select_text: {
        fontSize: 14,
        textAlign:'center',
        width: '80%',
    },
})

const mapStateToProps = state => {
    return {
      auth: state.auth
    }
  }
  
  //export default HomeScreen;
export default connect(mapStateToProps)(UploadScreen);