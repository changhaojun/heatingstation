/**
 * Created by Vector on 17/4/17.
 *
 * 告警页面
 *
 * 2017/11/5修改 by Vector.
 *      1、规范代码格式
 *      2、删除无用的模块导入
 *      3、给获取数据为空时加入弱提示
 *      4、隐藏手机状态栏
 */
import React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Slider,
  Modal,
  ScrollView,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  StatusBar,
  Platform
} from 'react-native';
import Orientation from 'react-native-orientation';
import Constants from '../constants';
import HeatStationChart from './../tenance/station_details/heat_station_chart';
import Video from 'react-native-video';
let { width, height } = Dimensions.get('window');
import moment from 'moment';
const rateOption = [ 0.5, 0.75, 1, 2, 4 ];
let timeOut;
export default class WarnDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onshow: 0,
      data: { first: [], second: [], other: [] },

      chartModal: false,
      tag_id: -1,
      tag_name: "",
      play: false,
      showPaused: false,
      currentTime: 0.0, //当前时长
      duration: 0.0,   // 视频总时长
      playFull: false,
      showPausedFull: false,
      currentTimeFull: 0.0, //当前时长
      rateI: 2,
      isFull: false  //是否全屏
    };

  }
  componentDidMount() {
    this.getData();
    const _this = this;
    // 当页面宽高发生改变时需要强制重新渲染 强制重新渲染影响的样式需要写成内联样式
    Dimensions.addEventListener("change", (data) => {
      width = data.window.width;
      height = data.window.height;
      _this.forceUpdate(); //强制重新渲染
    })
  }
  getData() {
    const _this = this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        var uri = Constants.cameraSite + "/v2/alarmCarame/" + _this.props.data.alarm_camera_id + "?access_token=" + result;
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            _this.setState({ data: responseJson.result })
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    )
  }
  _switch(position, noScroll) {
    if (!(noScroll)) this.scrollView.scrollTo({ x: position * width, y: 0, animated: true });
    this.setState({ onshow: position })
  }

  onScroll(x) {
    console.log(x)
    if (!x % width || (x + 10) % width < 30) {
      this._switch(parseInt((x + 10) / width), true);
    }
  }
  showChart(tag_id, tag_name) {
    this.setState({ play: false, playFull: false, })
    this.setState({
      tag_id: tag_id,
      tag_name: tag_name,
      chartModal: true
    })
  }
  clickVideo() {
    if (this.state.isFull) {
      clearTimeout(timeOut);
      this.setState({ showPausedFull: true });
      timeOut = setTimeout(() => this.setState({ showPausedFull: false }), 5000)
    } else {
      clearTimeout(timeOut);
      this.setState({ showPaused: true });
      timeOut = setTimeout(() => this.setState({ showPaused: false }), 5000)
    }
    console.log(width, height)
  }
  changeRate() {
    this.clickVideo();
    let rateI = 2;
    if (this.state.rateI == rateOption.length - 1) {
      rateI = 0;
    } else {
      rateI = this.state.rateI + 1;
    }
    this.setState({ rateI: rateI })
  }
  full() {
    if (this.state.isFull) {
      this.player.dismissFullscreenPlayer();
      StatusBar.setHidden(false);
      Orientation.lockToPortrait();
      this.setState({ isFull: false, play: this.state.playFull, showPaused: false });
    } else {
      this.player.presentFullscreenPlayer();
      if (Platform.OS !== 'ios') {
        Orientation.lockToLandscape();
        StatusBar.setHidden(true);
        this.setState({ isFull: true, playFull: this.state.play, showPausedFull: false });
      }
    }
    console.log(width, height)
  }
  render() {
    let imgUrl = Constants.cameraSite + "/public/alarm_image/" + this.props.data.img_url;
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>{this.props.data.station_name}</Text>
          <Image style={{ width: 25, height: 25, marginRight: 10, }} source={require('../icons/nav_flag.png')} />
        </View>
        <View style={{ height: 20, backgroundColor: "#434b59", }}><Text style={styles.topText}>{this.props.data.alarm_time}  {this.props.data.camera_name}</Text></View>
        {/* 以下写在布局中的样式不能写在StyleSheet中 */}
        <View style={{ height: width * 9 / 16, width: width }}>
          <Video source={{ uri: "http://121.42.253.149:8099/59dc9da9f25ae817946efb359-2018082811.mp4" }}   // Can be a URL or a local file.
            ref={(ref) => { this.player = ref }}
            onFullscreenPlayerWillPresent={() => { console.log("WillPresent"); }}
            onFullscreenPlayerWillDismiss={() => { console.log("WillDismiss"); }}
            paused={!this.state.play}
            onProgress={(data) => this.setState({ currentTime: data.currentTime })}
            onLoad={(data) => this.setState({ duration: data.duration })}
            rate={rateOption[ this.state.rateI ]}
            style={{ flex: 1 }} />
          <ImageBackground style={{ flex: 1, marginTop: -width * 9 / 16 }} source={!this.state.play ? { uri: imgUrl } : require('../icons/nav_flag.png')} >
            <TouchableWithoutFeedback onPress={() => this.clickVideo()}>
              <View style={{ flex: 1 }} >
                {this.state.showPaused || !this.state.play ? <View style={{ flex: 1 }} >
                  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => this.setState({ play: !this.state.play })}>
                      <Image style={{ width: 60, height: 60 }} resizeMode="contain"
                        source={this.state.play ? require('../icons/video_paused.png') : require('../icons/video_play.png')} />
                    </TouchableOpacity>
                  </View>
                  <ImageBackground style={{ height: 40, width: width, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, }} source={require('../icons/video_control.png')}>
                    <Text style={{ fontSize: 11, color: "#f0f1f1" }}>{moment(this.state.currentTime * 1000).format("mm:ss")}/{moment(this.state.duration * 1000).format("mm:ss")}</Text>
                    <Slider style={{ flex: 1, height: 10 }}
                      maximumValue={this.state.duration}
                      //thumbImage={require('../icons/video_slider.png')}
                      onValueChange={(value) => { this.player.seek(value); this.clickVideo(); }}
                      thumbTintColor="#2b9ecf"
                      maximumTrackTintColor="#d1d1d1"
                      minimumTrackTintColor="#2b9ecf"
                      value={this.state.currentTime} />
                    <Text style={{ fontSize: 16, color: "#f0f1f1" }} onPress={() => this.changeRate()}>{rateOption[ this.state.rateI ]}X</Text>
                    <TouchableOpacity onPress={() => this.full()}>
                      <Image style={{ width: 16, height: 16, marginLeft: 15 }} resizeMode="contain" source={require('../icons/open_all_win.png')} />
                    </TouchableOpacity>
                  </ImageBackground>
                </View> : null}
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
        </View>
        {/* 以上写在布局中的样式不能写在StyleSheet中 */}
        <View style={styles.topView}>
          <TouchableOpacity style={{ flex: 1 }} onPress={this._switch.bind(this, 0, false)}>
            <View style={styles.topViewItem}>
              <Text style={this.state.onshow == 0 ? styles.topTextSelection : styles.topTextNormal}>一网数据</Text>
            </View>
            <View style={this.state.onshow == 0 ? styles.topViewSelection : styles.topViewNormal}></View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={this._switch.bind(this, 1, false)}>
            <View style={styles.topViewItem}>
              <Text style={this.state.onshow == 1 ? styles.topTextSelection : styles.topTextNormal}>二网数据</Text>
            </View>
            <View style={this.state.onshow == 1 ? styles.topViewSelection : styles.topViewNormal}></View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={this._switch.bind(this, 2, false)}>
            <View style={styles.topViewItem}>
              <Text style={this.state.onshow == 2 ? styles.topTextSelection : styles.topTextNormal}>其他数据</Text>
            </View>
            <View style={this.state.onshow == 2 ? styles.topViewSelection : styles.topViewNormal}></View>
          </TouchableOpacity>
        </View>
        <ScrollView ref={scrollView => this.scrollView = scrollView} horizontal={true} pagingEnabled={true} onScroll={(data) => { this.onScroll(data.nativeEvent.contentOffset.x); }}>
          <View style={styles.itemStyle}>
            <FlatList
              data={this.state.data.first}
              numColumns={3}
              renderItem={({ item, i }) =>
                <TouchableOpacity onPress={() => this.showChart(item.tag_id, item.tag_name)}
                  style={[ styles.boxValue, { marginRight: i % 3 == 2 ? 0 : 2, marginLeft: i % 3 == 0 ? 0 : 2 } ]}>
                  {item.possible_alarm ? <Image style={styles.alarmIcon} source={require('../icons/video_alarm.png')} /> : null}
                  <Text style={styles.name}>{item.tag_name}</Text>
                  <Text style={item.possible_alarm ? styles.alarmValue : styles.value}>{item.data_value}{item.tag_unit}</Text>
                </TouchableOpacity>
              }
            />
          </View>
          <View style={styles.itemStyle}>
            <FlatList
              numColumns={3}
              data={this.state.data.second}
              renderItem={({ item, i }) =>
                <TouchableOpacity onPress={() => this.showChart(item.tag_id, item.tag_name)}
                  style={[ styles.boxValue, { marginRight: i % 3 == 2 ? 0 : 2, marginLeft: i % 3 == 0 ? 0 : 2 } ]}>
                  {item.possible_alarm ? <Image style={styles.alarmIcon} source={require('../icons/video_alarm.png')} /> : null}
                  <Text style={styles.name}>{item.tag_name}</Text>
                  <Text style={item.possible_alarm ? styles.alarmValue : styles.value}>{item.data_value}{item.tag_unit}</Text>
                </TouchableOpacity>
              }
            />
          </View>
          <View style={styles.itemStyle}>
            <FlatList
              numColumns={3}
              data={this.state.data.other}
              renderItem={({ item, i }) =>
                <TouchableOpacity onPress={() => this.showChart(item.tag_id, item.tag_name)}
                  style={[ styles.boxValue, { marginRight: i % 3 == 2 ? 0 : 2, marginLeft: i % 3 == 0 ? 0 : 2 } ]}>
                  {item.possible_alarm ? <Image style={styles.alarmIcon} source={require('../icons/video_alarm.png')} /> : null}
                  <Text style={styles.name}>{item.tag_name}</Text>
                  <Text style={item.possible_alarm ? styles.alarmValue : styles.value}>{item.data_value}{item.tag_unit}</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </ScrollView>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.chartModal}
          onRequestClose={() => { }}>
          <View style={{ backgroundColor: "#00000088", flex: 1, justifyContent: "flex-end", alignItems: 'center', }} >
            <View style={{ width: width, height: 45, flexDirection: "row", alignItems: "center", backgroundColor: "#00b5fc", paddingLeft: 30 }}>
              <Text style={{ color: "#fff", textAlign: "center", flex: 1, fontSize: 17 }}>{this.state.tag_name}</Text>
              <Text style={{ color: "#fff", fontSize: 25, marginRight: 10 }} onPress={() => this.setState({ chartModal: false })}>ㄨ</Text></View>
            <HeatStationChart station_id={this.props.data._id} tag_id={this.state.tag_id} tag_name={this.state.tag_name}></HeatStationChart>
          </View>
        </Modal>
        <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.isFull}
          onRequestClose={() => { this.full() }}>
          <View style={{ flex: 1, backgroundColor: "#000" }}>
            <Video source={{ uri: "http://121.42.253.149:8099/59dc9da9f25ae817946efb359-2018082811.mp4" }}   // Can be a URL or a local file.
              ref={(ref) => { this.playerFull = ref }}
              paused={!this.state.playFull}
              onProgress={(data) => this.setState({ currentTimeFull: data.currentTime })}
              onLoad={(data) => { this.playerFull.seek(this.state.currentTime); }}
              rate={rateOption[ this.state.rateI ]}
              //onBuffer={this.onBuffer}                // Callback when remote video is buffering
              //onError={this.videoError}               // Callback when video cannot be loaded
              style={{ flex: 1 }} />
            <ImageBackground style={{ flex: 1, marginTop: -height }} source={!this.state.playFull ? { uri: imgUrl } : require('../icons/nav_flag.png')} >
              <TouchableWithoutFeedback onPress={() => this.clickVideo()}>
                <View style={{ flex: 1 }}>
                  {this.state.showPausedFull || !this.state.playFull ? <View style={{ flex: 1 }} >
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <TouchableOpacity onPress={() => this.setState({ playFull: !this.state.playFull })}>
                        <Image style={{ width: 60, height: 60 }} resizeMode="contain"
                          source={this.state.playFull ? require('../icons/video_paused.png') : require('../icons/video_play.png')} />
                      </TouchableOpacity>
                    </View>
                    <ImageBackground style={{ height: 40, width: width, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, }} source={require('../icons/video_control.png')}>
                      <Text style={{ fontSize: 11, color: "#f0f1f1" }}>{moment(this.state.currentTimeFull * 1000).format("mm:ss")}/{moment(this.state.duration * 1000).format("mm:ss")}</Text>
                      <Slider style={{ flex: 1 }}
                        maximumValue={this.state.duration}
                        thumbImage={require('../icons/video_slider.png')}
                        onValueChange={(value) => { this.playerFull.seek(value); this.player.seek(value); this.clickVideo(); }}
                        thumbTintColor="#2b9ecf"
                        maximumTrackTintColor="#d1d1d1"
                        minimumTrackTintColor="#2b9ecf"
                        value={this.state.currentTimeFull} />
                      <Text style={{ fontSize: 16, color: "#f0f1f1" }} onPress={() => this.changeRate()}>{rateOption[ this.state.rateI ]}X</Text>
                      <TouchableOpacity onPress={() => this.full()}>
                        <Image style={{ width: 16, height: 16, marginLeft: 15 }} resizeMode="contain" source={require('../icons/open_all_win.png')} />
                      </TouchableOpacity>
                    </ImageBackground>
                  </View> : null}
                </View>
              </TouchableWithoutFeedback>
            </ImageBackground>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  all: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  video: {
    height: width * 9 / 16,
    width: width
  },
  videoTopView: { flex: 1, marginTop: -width * 9 / 16 },
  navView: {
    flexDirection: 'row',
    //width: width,
    height: 45,
    backgroundColor: '#434b59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNameText: {
    flex: 1,
    textAlign: 'center',
    color: "#ffffff",
    fontSize: 19,
  },
  topText: {
    textAlign: 'center',
    color: "#ffffff",
    fontSize: 15,
    marginTop: -5,
  },

  // 以下是tab的样式
  topView: {
    width: width,
    height: 45,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    paddingHorizontal: 50,
    backgroundColor: "#fff"
  },
  topViewItem: {
    flex: 1,
    justifyContent: 'center',
  },
  topTextNormal: {
    height: 20,
    color: "#7f8081",
    textAlign: 'center',
    fontSize: 17,
  },
  topTextSelection: {
    height: 20,
    color: "#35aeff",
    textAlign: 'center',
    fontSize: 17,
  },
  topViewNormal: {
    width: (width - 100) / 3,
    height: 1,
    backgroundColor: "#fff",
  },
  topViewSelection: {
    width: (width - 100) / 3,
    height: 1,
    backgroundColor: "#35aeff",
  },
  itemStyle: {
    flex: 1,
    width: width,
    paddingTop: 2,
  },
  name: {
    fontSize: 12,
    color: "#757f9b"
  },
  value: {
    fontSize: 20,
    color: "#414a59"
  },
  alarmValue: {
    fontSize: 24,
    color: "#f54e56"
  },
  boxValue: {
    width: (width - 8) / 3,
    height: 75,
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 2,
    justifyContent: "center"
  },
  alarmIcon: {
    width: 10,
    height: 10,
    alignSelf: "flex-end",
    marginRight: 10,
    marginTop: -3,
    marginBottom: -3
  }
});
