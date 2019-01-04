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
  TextInput,
  Modal,
  AsyncStorage,
  StyleSheet,
  TouchableHighlight,
  StatusBar,
  TouchableOpacity,
  ListView,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import Constants from '../constants';
import WarnDetails from './warn_details'
const { width, height } = Dimensions.get('window');

var load = 0;
var page = 1;
export default class Warn extends React.Component {
  constructor(props) {
    super(props);
    load = 0;
    page = 1;
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var start = new Date();
    start.setTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    this.state = {
      startTime: start.getFullYear() + "$" + (start.getMonth() + 1) + "$" + start.getDate() + "$" + start.getHours() + ":" + start.getMinutes() + ":" + start.getSeconds(),
      endTime: new Date().getFullYear() + "$" + (new Date().getMonth() + 1) + "$" + new Date().getDate() + "$" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
      dataSource: ds.cloneWithRows([]),
      data: [],
      dataAlarm: [],
      videoAlarm: [],
      showContent: "",
      modalVisible: false,
      edit: false,
      itemId: 0,
      fullname: "",
      company_code: "000005"
    };
    const _this = this;
    AsyncStorage.getItem("fullname", function (errs, result) {
      _this.setState({ fullname: result });
      AsyncStorage.getItem("company_code", function (errs, result) {
        _this.setState({ company_code: result });
        _this.getData();

      });
    });

  }

  getData() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const _this = this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        var uri = Constants.serverSite + "/v1_0_0/alarmHistory?pageNumber=" + load + "&pageSize=15&access_token=" + result + "&start_time=" + _this.state.startTime + "&end_time=" + _this.state.endTime + "&company_code=" + _this.state.company_code;
        if (_this.props.station_id) { uri = uri + "&station_id=" + _this.props.station_id }
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);

            if (responseJson.rows.length > 0) {
              responseJson.rows.forEach(element => {
                element.alarmType = 1;
              });

              var data = _this.state.dataAlarm.concat(responseJson.rows);
              data.sort((item1, item2) => {
                if (item1.start_time > item2.start_time) {
                  return -1;
                } else if (item1.start_time < item2.start_time) {
                  return 1;
                } else {
                  return 0
                }
              });
              _this.setState({ dataAlarm: data })
            }
            if (!_this.props.station_id) { _this.getCameraData(); }
            // _this.setState({ data: data, dataSource: ds.cloneWithRows(data) })
          })
          .catch((error) => {
            console.error(error);
          });
        load += 15;
      }
    }
    )
  }

  getCameraData() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const _this = this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        var uri = Constants.cameraSite+"/v2/alarmCarame?access_token="+result+"&pageSize=15&pageNumber=" + page;
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            if (responseJson.result.row.length > 0) {
              responseJson.result.row.forEach(element => {
                element.alarmType = 0;
              });
              var videoAlarm = _this.state.videoAlarm.concat(responseJson.result.row);
              videoAlarm.sort((item1, item2) => {
                if (item1.alarm_time > item2.alarm_time) {
                  return -1;
                } else if (item1.alarm_time < item2.alarm_time) {
                  return 1;
                } else {
                  return 0
                }
              });
              const dataAlarm = _this.state.dataAlarm;
              const data = _this.state.data;
              while (dataAlarm.length > 0 && videoAlarm.length > 0) {
                if (dataAlarm[ 0 ].start_time > videoAlarm[ 0 ].alarm_time) {
                  data.push(dataAlarm.shift());
                } else {
                  data.push(videoAlarm.shift());
                }
              }
              _this.setState({ videoAlarm: videoAlarm, dataAlarm: dataAlarm, data: data, dataSource: ds.cloneWithRows(data) })
            }else{
              const data = _this.state.dataAlarm;
              _this.setState({  data: data, dataSource: ds.cloneWithRows(data) })
            }
          })
          .catch((error) => {
            console.error(error);
          });
        page++;
      }
    }
    )

  }

  dealWith() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var _this = this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        var uri = Constants.serverSite + "/v1_0_0/alarmHistory?data=" + _this.state.showContent + "&fullname=" + _this.state.fullname + "&access_token=" + result + "&alarm_history_id=" + _this.state.data[ _this.state.itemId ].log_id
        console.log(uri)
        fetch(uri, { method: 'PUT' })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            var data = _this.state.data;
            data[ _this.state.itemId ].full_name = _this.state.fullname;
            data[ _this.state.itemId ].handle_result = _this.state.showContent;
            _this.setState({ dataSource: ds.cloneWithRows(data), data: data, modalVisible: false })
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    )

  }

  toVideo(rowData, i) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.props.navigator.push({ component: WarnDetails, passProps: { data: rowData } });
    var data = this.state.data;
    data[ i ].have_read = 1;
    this.setState({ dataSource: ds.cloneWithRows(data), data: data })
  }

  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>告警</Text>
          <Image style={{ width: 25, height: 25, marginRight: 10, }} source={require('../icons/nav_flag.png')} />
        </View>
        {this.state.data.length > 0 ? <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          contentContainerStyle={styles.listView}
          onEndReached={() => this.getData()}
          onEndReachedThreshold={500}
          enableEmptySections={true}
          renderRow={(rowData, i, j) => {
            return (<View>
              {rowData.alarmType ?
                <View style={styles.listItem}>
                  <View style={styles.listItemRow}>
                    <View style={styles.valueView}>
                      <Text style={styles.value}>{rowData.data_value}</Text>
                    </View>
                    <View>
                      <Text style={styles.station}>{rowData.station_name}</Text>
                      <Text style={styles.status}>状态：{rowData.handle_result ? "已处理" : rowData.end_time ? "已解除" : "告警中"}{rowData.full_name ? "处理人：" + rowData.full_name : ""}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <Image style={styles.img} source={rowData.handle_result ? require('../icons/yichuli.png') : rowData.end_time ? require('../icons/yijiechu.png') : require('../icons/gaojingzhong.png')} />
                  </View>
                  <View style={{ width: width - 20, marginLeft: 10, height: 0.5, backgroundColor: "#dbdbdb", marginBottom: 5 }} />
                  <View style={styles.listItemRow}>
                    <View style={{ marginLeft: 15 }}>
                      <View style={styles.listItemRow}>
                        <Text style={styles.name}>告警指标：</Text>
                        <Text style={styles.content}>{rowData.alarm_name}</Text>
                      </View>
                      <View style={styles.listItemRow}>
                        <Text style={styles.name}>发生时间：</Text>
                        <Text style={styles.content}>{rowData.start_time}</Text>
                      </View>
                      <View style={styles.listItemRow}>
                        <Text style={styles.name}>结束时间：</Text>
                        <Text style={styles.content}>{rowData.end_time}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.but} onPress={() => this.setState({ showContent: rowData.handle_result, modalVisible: true, edit: rowData.handle_result ? false : true, itemId: j })}>{rowData.handle_result ? "查看处理" : "处理"}</Text>
                  </View>
                </View>
                : <TouchableOpacity
                  onPress={() => this.toVideo(rowData, j)}
                  style={{ width: width, backgroundColor: "#fff", marginTop: 10, paddingLeft: 15, paddingVertical: 15 }}>
                  <Text style={{ color: "#313233", fontSize: 19, }}>{rowData.station_name}</Text>
                  <Text style={{ color: rowData.have_read ? "#7f8081" : "#f57f7f", fontSize: 17, marginVertical: 5 }} selectable={true}>{rowData.alarm_content.replace("\b", "")}</Text>
                  <Text style={{ color: "#909192", fontSize: 15 }}>{rowData.alarm_time}   {rowData.camera_name}</Text>
                </TouchableOpacity>}
            </View>
            )
          }}
        /> :
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <ActivityIndicator
            style={{ marginTop: 20 }}
            animating={true}
            size="large"
          />
          </View>
        }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { }}
        >
          <TouchableOpacity style={{ flex: 1, backgroundColor: "#00000033", alignItems: "center", justifyContent: 'center', }} onPress={() => this.setState({ modalVisible: false })}>
            <TouchableHighlight>
              <View style={{ width: width - 60, height: 200, backgroundColor: "#fff" }}>
                <Text style={{ width: width - 60, height: 40, backgroundColor: "#343439", color: "#fff", textAlign: "center", fontSize: 17, textAlignVertical: "center" }}>处理信息</Text>
                <TextInput
                  style={{ flex: 1, backgroundColor: "#d2d2d266", margin: 10, fontSize: 16, textAlignVertical: "top", color: "#000" }}
                  multiline={true}
                  editable={this.state.edit}
                  underlineColorAndroid="transparent"
                  onChangeText={(showContent) => this.setState({ showContent })}
                  value={this.state.showContent}
                />
                {this.state.edit ?
                  <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <Text style={[ styles.modalBut ]} onPress={() => this.setState({ modalVisible: false })}>取消</Text>
                    <Text style={[ styles.modalBut, { color: "#00abef" } ]} onPress={() => this.dealWith()}>确认</Text>
                  </View> :
                  <Text style={[ styles.modalBut, { color: "#00abef", alignSelf: "flex-end" } ]} onPress={() => this.setState({ modalVisible: false })}>关闭</Text>}
              </View>
            </TouchableHighlight>
          </TouchableOpacity>
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
  navView: {
    flexDirection: 'row',
    width: width,
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
  listItem: {
    paddingBottom: 15,
    width: width,
    backgroundColor: '#ffffff',
    borderColor: '#0099FF',
    marginTop: 10,
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  station: {
    color: "#333333",
    fontSize: 16,
  },
  valueView: {
    width: 50,
    height: 50,
    backgroundColor: "#f64d51",
    borderRadius: 25,
    marginHorizontal: 15,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  value: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  status: {
    fontSize: 13,
    color: "#999999",
  },
  content: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 28,
  },
  name: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 28,
  },
  but: {
    borderColor: "#d4d4d4",
    borderWidth: 1,
    color: "#00abef",
    borderRadius: 2,
    paddingVertical: 3,
    marginRight: 20,
    textAlign: "center",
    width: 80,
  },
  img: {
    width: 55,
    height: 55,
    alignSelf: "flex-start",
    marginLeft: width - 55,
    position: "absolute",
  },
  modalBut: {
    fontSize: 15,
    marginHorizontal: 20,
    marginBottom: 8,
    color: "#a2a2a2"
  }
});
