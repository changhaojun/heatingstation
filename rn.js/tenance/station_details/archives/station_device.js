/**
 * 换热站设备列表
 */
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';
import Constants from './../../../constants';
import Details from './station_device_details';
var { width, height } = Dimensions.get('window');
var deviceIcon = {
  1: require('../../../icons/device_type1.png'),
  2: require('../../../icons/device_type1.png'),
  3: require('../../../icons/device_type3.png'),
  4: require('../../../icons/device_type4.png'),
  5: require('../../../icons/device_type5.png'),
  6: require('../../../icons/device_type6.png'),
  7: require('../../../icons/device_type7.png'),
  8: require('../../../icons/device_type8.png'),
  9: require('../../../icons/device_type9.png'),
}
export default class StationDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      systemData: [],
      deviceData: []
    };
    // 获取系统列表
    let _this = this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        let url = Constants.serverSite2 + '/v2/station/' + _this.props.station_id + '/stationSystem?access_token=' + result + '&oldId=true'
        console.log(url)
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.code == 200 && responseJson.result.length > 0) {
              responseJson.result[ 0 ].show = true;
              _this.setState({ systemData: responseJson.result });
              _this.getDevice(responseJson.result[ 0 ].station_system_id);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    )
  }
  // 获取设备列表
  getDevice(systemId) {
    let _this = this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        let url = Constants.serverSite2 + '/v2/station/system/' + systemId + '/device?access_token=' + result;
        console.log(url)
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            let deviceList = [];
            if (responseJson.code == 200 && responseJson.result.length > 0) {
              // 循环设备类型 (参照rap)
              for (let i = 0; i < responseJson.result.length; i++) {
                let paramName = {};
                // 将设备类型的参数以object形式保存，便于取出
                for (let k = 0; k < responseJson.result[ i ].other_param.length; k++) {
                  paramName[ responseJson.result[ i ].other_param[ k ].station_device_type_column_id ] = responseJson.result[ i ].other_param[ k ];
                }
                // 循环设备列表 构造列表所需参数
                for (let j = 0; j < responseJson.result[ i ].devices.length; j++) {
                  let listUseData = {
                    station_device_type_id: responseJson.result[ i ].station_device_type_id,
                    station_device_id: responseJson.result[ i ].devices[ j ].station_device_id,
                    station_device_name: responseJson.result[ i ].devices[ j ].fixed.station_device_name,
                    showData: []
                  }
                  //控制长度 构造要显示的前三个数据
                  let l = responseJson.result[ i ].devices[ j ].other_param_value.length > 3 ? 3 : responseJson.result[ i ].devices[ j ].other_param_value.length;
                  for (let paramI = 0; paramI < l; paramI++) {
                    listUseData.showData.push({
                      value: responseJson.result[ i ].devices[ j ].other_param_value[ paramI ].value,
                      name: paramName[ responseJson.result[ i ].devices[ j ].other_param_value[ paramI ].station_device_type_column_id ].column_name,
                      unit: paramName[ responseJson.result[ i ].devices[ j ].other_param_value[ paramI ].station_device_type_column_id ].unit,
                    })
                  }
                  deviceList.push(listUseData);
                }
              }
              _this.setState({ deviceData: deviceList })
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    )
  }

  toParam(id) {
    this.props.navigator.push({
      name: "Details",
      component: Details,
      passProps: {
        device_id: id
      }
    })
  }
  // 系统点击事件
  clickSystem(index) {
    let systemData = [].concat(this.state.systemData);
    for (let i = 0; i < systemData.length; i++) {
      systemData[ i ].show = false;
    }
    systemData[ index ].show = true;
    this.setState({ systemData: systemData });
  }

  render() {
    return (
      <View style={styles.all}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Image style={styles.topSides} resizeMode="contain" source={require('../../../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          {/* 系统列表 */}
          <FlatList
            horizontal={true}
            data={this.state.systemData}
            renderItem={({ item, index }) => <Text style={[ styles.systemText, {
              color: item.show ? '#009ad7' : '#b0b5be',
              borderBottomColor: item.show ? '#009ad7' : '#ffffff00',
            } ]} onPress={() => { this.clickSystem(index); this.getDevice(item.station_system_id); }}>{item.station_system_name}</Text>}
          />
        </View>
        {/* 设备列表 */}
        {this.state.deviceData.length > 0 ? <FlatList
          data={this.state.deviceData}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.itemView} onPress={() => this.toParam(item.station_device_id)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                <Image style={styles.deviceIcon} resizeMode="contain" source={deviceIcon[ item.station_device_type_id ]} />
                <Text style={styles.deviceName} >{item.station_device_name}</Text>
                <View style={{ flex: 1 }} />
                <Image style={styles.into} resizeMode="contain" source={require('../../../icons/device_item_right.png')} />
              </View>
              <FlatList
                style={{ borderTopWidth: 1, borderTopColor: "#e5e6e7" }}
                horizontal={true}
                data={item.showData}
                renderItem={({ item }) =>
                  <View style={styles.showDataView}>
                    <Text style={styles.showDataValue} >{item.value}</Text>
                    <Text style={styles.showDataName} >{item.name}{item.unit ? <Text style={styles.showDataUnit}>({item.unit})</Text> : null}</Text>
                  </View>
                }
              />
            </TouchableOpacity>
          }
        /> : <Text style={{ alignSelf: "center", marginTop: 40 }}>暂无设备信息</Text>}
      </View>
    )
  }
}

// 样式
const styles = StyleSheet.create({
  all: {
    flex: 1,
    backgroundColor: "#f4f5f6"
  },
  topRow: {
    width: width,
    height: 50,
    backgroundColor: '#000000',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6
  },
  systemText: {
    //height: 50,
    fontSize: 17,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    textAlignVertical: 'center'
  },
  showDataView: {
    width: (width - 24) / 3,
    height: 80,
    alignItems: 'flex-start',
    paddingLeft: 30,
    paddingVertical: 20,
    paddingTop: 12
  },
  showDataName: {
    fontSize: 15,
    color: '#666768'
  },
  showDataValue: {
    fontSize: 20,
    color: '#009ad7'
  },
  showDataUnit: {
    fontSize: 11,
    color: '#969798'
  },
  itemView: {
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  deviceIcon: {
    height: 25,
    width: 25,
    marginLeft: 12,
  },
  deviceName: {
    color: "#353637",
    fontSize: 17,
    paddingVertical: 10,
    marginLeft: 8,
  },
  into: {
    width: 10,
    height: 30,
    marginRight: 15,
  },
  topSides: {
    width: 18,
    height: 18,
    marginLeft: 10,
    marginRight: 10,

  },
});