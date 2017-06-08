import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  AsyncStorage,
  Image,
  TouchableOpacity,
  NavigatorIOS,
  AlertIOS,
} from 'react-native';
import Dimensions from 'Dimensions';
import Communications from 'react-native-communications';

// 求屏幕的宽和高。
var {width, height} = Dimensions.get('window');
import EquipmentParameters from './equipment_parameters';

export default class DeviceInformation extends Component {
  constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
            dataSource:ds.cloneWithRows([{
            }]),
            phoneNumber: '18291981085',
      };
        var _this = this;
        console.log(_this.props.deviceName);
        AsyncStorage.getItem("userKey",function(errs,result){
            console.info(result);
            if (!errs) {
                fetch("http://114.215.154.122/reli/android/androidAction?type=getInfoForDevice&userKey=" + result + "&deviceId=" + _this.props.deviceId)
                .then((response) => response.json())
                .then((responseJson) => {
                  console.log(responseJson.param);
                    _this.setState({
                        dataSource:ds.cloneWithRows(responseJson.data),
                        phoneNumber: responseJson.data[7].info_content,
                    });
                })
                .catch((error) => {
                    console.error(error);
                });

            }
        });
  }

    _pressButton(info_label){
        const navigator = this.props.navigator;//上一个页面传过来的值
        //跳转
        if(info_label==="系统数"){
          this.props.navigator.push({
              title: this.props.deviceName,
              component: EquipmentParameters,
              params: {
                deviceId: this.props.deviceId,
              },
          })
        }
        else if(info_label==="联系电话"){
          if(this.state.phoneNumber === ""){
            console.log("号码为空");
          }else{
            Communications.phonecall(this.state.phoneNumber, true)
          }

        }else{
          console.log("不允许跳转");
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          automaticallyAdjustContentInsets={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
              return(
                <TouchableOpacity onPress={this._pressButton.bind(this,rowData.info_label)}>
                  <View style={styles.listItem}>
                    <View style={styles.topView}>
                      {/* Name */}
                      <View style={styles.listItemTextView1}>
                          <Text style={styles.listItemName}>{rowData.info_label}</Text>
                      </View>

                      {/* 中间的分割线 */}
                      <View style={styles.line2}></View>

                      {/* Value */}
                      <View style={styles.listItemTextView2}>
                          <Text style={styles.listItemValue}>{rowData.info_content}</Text>
                          <Image style={styles.listItemTel} source={rowData.info_label=="联系电话"?require('./../image/tongxunlu_dianhua.png'):null} />
                          <Image style={styles.listItemSys} source={rowData.info_label=="系统数"?require('./../image/tongji_btn_jinru.png'):null} />
                      </View>
                    </View>

                    {/* 分割线 */}
                    <View style={styles.line}></View>

                 </View>
                </TouchableOpacity>
                )
              }}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    marginTop:15,
  },
  line:{
      width:width-30,
      backgroundColor:"#f5f5f5",
      height:1,
  },
  line2:{
      width:1,
      height:36,
      backgroundColor: '#f5f5f5',
  },
  listItem:{
      flexDirection: 'column',
      width:width-30,
      height:40,
      backgroundColor: '#ffffff',
      marginLeft:15,
  },
  listItemTel:{
      width:15,
      height:15,
      marginTop: 0,
      marginRight: 10,
  },
  listItemSys:{
      width:15,
      height:15,
      marginTop: 0,
      marginRight: 10,
  },
  listItemName:{
      fontSize:15,
  },
  listItemValue:{
      fontSize:15,
      flex: 7
  },
  listItemTextView1:{
      width:125,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 5,
  },
  listItemTextView2:{
      flex: 4.5,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 5,
  },
  topView:{
      flex:1,
      flexDirection: 'row',
  },
});
