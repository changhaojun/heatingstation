/**
 * 换热站设备详情
 */
import React from 'react';
import { View, Text, Image, StyleSheet,Platform,Alert, FlatList, ScrollView, Modal, TouchableOpacity, AsyncStorage, DeviceEventEmitter } from 'react-native';
import Dimensions from 'Dimensions';
import Constants from './../../../constants';
import QRCode from 'react-native-qrcode';
import PrintQr from 'rn-roc-printqr';
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
var deviceParamList = [
  { key: 'station_device_name', name: '设备编号' },
  { key: 'device_number', name: '设备编号' },
  { key: 'buy_time', name: '购置时间' },
  { key: 'use_time', name: '投用时间' },
  { key: 'manufacturer', name: '生产厂家' },
  { key: 'supplier', name: '供应商' },
]
export default class StationDeviceDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      deviceParamList: [],
      qrModalVisible: false,
      scanningModalVisible: false,
      okModalVisible: false,
      failModalVisible: false
    };
    // 获取设备数据
    let _this = this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        fetch(Constants.serverSite2 + '/v2/station/device/' + _this.props.device_id + '?access_token=' + result)
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.code == 200) {
              for (let i = 0; i < deviceParamList.length; i++) {
                deviceParamList[ i ].value = responseJson.result[ deviceParamList[ i ].key ];
              }
              _this.setState({ data: responseJson.result, deviceParamList: deviceParamList });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    )
  }
  // 打印
  print() {
    if(Platform.OS==="ios"){
      Alert.alert("提示","iOS系统暂不支持打印二维码");
      return;
    }
    this.setState({
      qrModalVisible: false,
      scanningModalVisible: true
    })
    PrintQr.print(
      this.state.data.station_device_name,
      this.state.data.device_number,
      "SD#" + this.props.device_id + "#" + this.state.data.device_number,
      (msg) => {
        if (msg) {
          // 打印成功
          this.setState({
            okModalVisible: true,
            scanningModalVisible: false
          });
          setTimeout(() => {
            this.setState({
              okModalVisible: false
            })
          }, 2000);
        } else {
          // 打印失败
          this.setState({
            failModalVisible: true,
            scanningModalVisible: false
          });
          setTimeout(() => {
            this.setState({
              failModalVisible: false
            })
          }, 2000);
        }
      });
  }

  render() {
    return (
      <View style={styles.all}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}><Image style={styles.topSides} resizeMode="contain" source={require('../../../icons/nav_back_icon.png')} /></TouchableOpacity>
          <Text style={[ styles.topText, styles.all ]}>设备信息</Text>
          <TouchableOpacity onPress={() => this.setState({ qrModalVisible: true })} disabled={Platform.OS==="ios"} ><Image style={styles.topSides} resizeMode="contain" source={Platform.OS==="ios"?require('../../../icons/none.png'):require('../../../icons/icon_qr.png')} /></TouchableOpacity>
        </View>
        <ScrollView>
          <Image style={styles.deviceIcon} resizeMode="contain" source={deviceIcon[ this.state.data.station_device_type_id ]} />
          <Text style={styles.deviceName}>{this.state.data.station_device_type_name}</Text>
          {/* 设备其他参数 */}
          <FlatList
            style={{ marginHorizontal: 12 }}
            numColumns={3}
            data={this.state.data.params}
            renderItem={({ item }) =>
              <View style={styles.showDataView}>
                <Text style={styles.showDataValue} >{item.value}</Text>
                <Text style={styles.showDataName} >{item.column_name}{item.unit ? <Text style={styles.showDataUnit}>({item.unit})</Text> : null}</Text>
              </View>
            }
          />
          {/* 设备基础参数 */}
          <FlatList
            style={{ marginLeft: 15, }}
            data={this.state.deviceParamList}
            renderItem={({ item }) =>
              <View style={styles.paramView}>
                <Text style={styles.paramName} >{item.name}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.paramValue} >{item.value}</Text>
              </View>
            }
            ItemSeparatorComponent={() => <View style={styles.paramLine} />}
          />
        </ScrollView>
        {/* 二维码弹窗 */}
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.qrModalVisible}
          onRequestClose={() => { this.setState({ qrModalVisible: false }) }}
        >
          <View style={styles.modalAll}>
            <View style={styles.QRModalAll}>
              <View style={styles.modalDevice}>
                <Image style={styles.modalDeviceIcon} resizeMode="contain" source={deviceIcon[ this.state.data.station_device_type_id ]} />
                <Text style={styles.modalDeviceName}>{this.state.data.station_device_type_name}</Text>
              </View>
              <View style={styles.qrView}>
                <QRCode
                  value={"SD#" + this.props.device_id + "#" + this.state.data.device_number}
                  size={200}
                  bgColor='#000'
                  fgColor='white' />
              </View>
            </View>
            <View style={{ flexDirection: "row", width: width - 60, marginTop: 20 }}>
              <TouchableOpacity onPress={() => this.print()} style={styles.modalBut}>
                <Text style={{ color: "#fff", fontSize: 16 }}>打印</Text>
              </TouchableOpacity>
              <View style={{ width: 20 }} />
              <TouchableOpacity onPress={() => this.setState({ qrModalVisible: false })} style={[styles.modalBut,{backgroundColor:"#424b59"}]}>
                <Text style={{ color: "#fff", fontSize: 16 }}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.scanningModalVisible}
          onRequestClose={() => { }}
        >
          <View style={styles.modalAll}>
            <View style={styles.okModalAll}>
              <Image style={styles.okIcon} resizeMode="contain" source={require('../../../icons/printing.png')} />
              <Text style={{ color: "#0097dd", fontSize: 17 }}>打印中…</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.okModalVisible}
          onRequestClose={() => { this.setState({ okModalVisible: false }) }}
        >
          <View style={styles.modalAll}>
            <View style={styles.okModalAll}>
              <Image style={styles.okIcon} resizeMode="contain" source={require('../../../icons/device_ok.png')} />
              <Text style={{ color: "#000", fontSize: 17 }}>打印成功</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.failModalVisible}
          onRequestClose={() => { this.setState({ failModalVisible: false }) }}
        >
          <View style={styles.modalAll}>
            <View style={styles.okModalAll}>
              <Image style={styles.okIcon} resizeMode="contain" source={require('../../../icons/device_fail.png')} />
              <Text style={{ color: "#000", fontSize: 17 }}>打印失败</Text>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

// 样式
const styles = StyleSheet.create({
  all: {
    flex: 1,
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
  deviceIcon: {
    height: 60,
    width: 60,
    marginTop: 22,
    alignSelf: 'center'
  },
  deviceName: {
    color: "#353637",
    fontSize: 18,
    paddingVertical: 10,
    alignSelf: 'center'
  },
  paramView: {
    width: width - 15,
    height: 45,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  paramName: {
    fontSize: 15,
    color: '#323334'
  },
  paramValue: {
    fontSize: 15,
    color: '#9c9d9e'
  },
  paramLine: {
    width: width - 15,
    height: 1,
    backgroundColor: '#d7d8d966'
  },
  modalAll: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000066"
  },
  QRModalAll: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    borderRadius: 5,
    width: width - 60,
    alignItems: "center"
  },
  modalDevice: {
    alignItems: "center",
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: width - 60
  },
  modalDeviceIcon: {
    width: 35,
    height: 35,
    marginLeft: 15,
  },
  modalDeviceName: {
    color: "#000",
    marginLeft: 10, fontSize: 16
  },
  qrView: {
    margin: 20,
    marginBottom: 60
  },
  modalBut: {
    flex: 1,
    height: 40,
    backgroundColor: "#0097de",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  okModalAll: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: 180,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  okIcon: {
    width: 55,
    height: 55,
    marginBottom: 10
  },

  topSides: {
    width: 18,
    height: 18,
    marginLeft: 10,
    marginRight: 10,

  },
  topText: {
    color: "#ffffff",
    justifyContent: 'flex-end',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 4,
  },
  topRow: {
    width: width,
    height: 50,
    backgroundColor: '#000000',
    alignItems: 'center',
    flexDirection: 'row',
  }
});