import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Alert,
  SectionList,
  AsyncStorage,
  FlatList,
  ImageBackground,
  ScrollView,
  DeviceEventEmitter
} from 'react-native';
import IndoorChart from './indoor_chart'
import Constants from './../constants';
import Dimensions from 'Dimensions';
import Scan from './scan';
const { width, height } = Dimensions.get('window');

export default class HeatUserDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      user_name:"",
      value:props.value,
      info: [],
      heat_user_device_id:this.props.heat_user_device_id
    };
  }
  componentDidMount() {
    this.getInfo();
  }
  getInfo() {
    
    let _this=this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        let uri = Constants.indoorSite+"/v2/community/building/unit/heatUser/"+_this.props.heat_user_id+"?access_token="+result;
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.code == 200) { 
              let info=[];
              info.push({ name: "房间号", value: responseJson.result.user_number });
              info.push({ name: "联系电话", value: responseJson.result.phone });
              info.push({ name: "建筑面积", value: responseJson.result.house_area+"㎡" });
              info.push({ name: "用户环境", value: responseJson.result.water_loop });
              info.push({ name: "是否复式", value: responseJson.result.duplex });
              info.push({ name: "缴费情况", value: responseJson.result.already_cost?"已缴费":"未缴费" });
              _this.setState({user_name:responseJson.result.user_name,info:info})
            }
          })
      }
    })
  }
  Scan(){
    if(!this.state.heat_user_device_id){
      this.props.navigator.push({
          name: 'Scan',
          component: Scan,
          passProps:{
            heat_user_id:this.props.heat_user_id,
            props:this.props.props
          }
      })
    }else{
      Alert.alert('提示','已绑定过设备',[
        {text: '确定'},
        {text: '解除绑定',onPress:()=>{
          let uri = `http://114.215.46.56:17739/v1/device/relieve`;
          console.log(this.props.heat_user_device_id,this.props.heat_user_id )
           fetch(uri,{
               method: 'POST',
               headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                   heat_user_device_id: this.props.heat_user_device_id,
                   heat_user_id: this.props.heat_user_id 
               })
             }).then((response) => response.json())
               .then((responseJson) => {
                 console.log(responseJson)
                 if(responseJson.code===200){
                  Alert.alert(
                    '提示',
                    '成功取消绑定'
                  )
                  DeviceEventEmitter.emit('refresh')
                  this.state.heat_user_device_id=null;
                 }
               })
               .catch((e) => {
                 console.log(e)
                 Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
               });
        }}
      ])
    }
  }
  render() {
   
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Image style={{ width: 25, height: 20, marginLeft: 15, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>{this.props.user_number}</Text>
          <View style={{ width: 40 }} />
          <TouchableOpacity onPress={() =>this.Scan()}>
           <Image style={{ width: 25, height: 20, marginRight: 15, }} resizeMode="contain" source={require('../icons/scan.jpg')} />
          </TouchableOpacity>
        </View>
        <Text style={{ backgroundColor: "#434b59", textAlign: "center", width: width, height: 25, color: "#FFFFFF", fontSize: 12 }}>{this.props.addr}</Text>
        <ScrollView>
          <ImageBackground style={{ width: width, height: width * 0.42, marginTop: 15, flexDirection: "row", alignItems: "center", paddingBottom: 35 }} resizeMode="contain" source={require('../icons/indoor_bg.png')}>
            <Image style={{ width: 51, height: 51, marginLeft: 50 }} resizeMode="contain" source={require('../icons/indoor_portrait.png')} />
            <View style={{ marginLeft: 13, flex: 1 }}>
              <Text style={{ fontSize: 15, color: "#fff" }}>{this.state.user_name}</Text>
              <Text style={{ fontSize: 12, color: "#ffffffdd" }}>户主</Text>
            </View>
            <View style={{ marginRight: 41, alignItems: "center" }}>
              <Text style={{ fontSize: 36, color: "#fff" }}>{this.state.value?this.state.value:"-"}<Text style={{ fontSize: 17 }}>℃</Text></Text>
              <Text style={{ fontSize: 12, color: "#ffffffdd" }}>室内温度</Text>
            </View>
          </ImageBackground>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 13 }}>
            <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12 }} />
            <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>温度变化曲线</Text>
          </View>
          <View style={{ height: 243, width: width, backgroundColor: "#fff", marginBottom: 23 }}>
          <IndoorChart data_id={this.props.data_id} ></IndoorChart>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 13 }}>
            <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12 }} />
            <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>基本信息</Text>
          </View>
          <FlatList
            data={this.state.info}
            renderItem={({ item }) =>
              <View style={{ flexDirection: "row", height: 48, width: width, backgroundColor: "#fff", alignItems: "center", paddingHorizontal: 12 }}>
                <Text style={{ color: "#999999", fontSize: 15, flex: 1 }}>{item.name}</Text>
                <Text style={{ color: "#333333", fontSize: 15 }}>{item.value}</Text>
              </View>}
            ItemSeparatorComponent={() => <View style={{ flex: 1, height: 1, backgroundColor: "#DADFE4", marginLeft: 12 }} />}
          />
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  all: {
    flex: 1,
    backgroundColor: "#E3E5E8",
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
  toolbar: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  toolbarText: {
    color: "#2EDDDB",
    marginHorizontal: 5
  },
});