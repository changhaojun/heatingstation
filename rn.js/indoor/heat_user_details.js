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
  Button,
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
import ValvesHitory from './valves_history';
const { width, height } = Dimensions.get('window');

export default class HeatUserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      user_name:"",
      value:props.value,
      info: [],
      heat_user_device_temp_id:this.props.heat_user_device_temp_id,
      heat_user_device_valves_id: this.props.heat_user_device_valves_id,
      valves_device_object_id: this.props.valves_device_object_id,

      showList: false,
      valves_opening: null,
      valves_voltage: null,
      voltage_describe: '',
      showAlert: false,
      alertText: '',
      deviceType: '',
      relieveAlert: false,
      succText: ''
    };
    console.log('this.props::::', this.props)
  }
  componentDidMount() {
    this.getInfo();
  }
  componentWillMount() {
    if(this.props.heat_user_device_valves_id) {
      const data = this.props.valves_datas;
      console.log(this.props.valves_datas);
      data.forEach(data => {
        if(data.tag_name === '电动阀开度') {
          this.setState({valves_opening: data.data_value});
        }
        if(data.tag_name === '电动阀电压') {
          this.setState({valves_voltage: data.data_value});
          if(data.data_value === 0) {
            this.setState({voltage_describe: ''});
          }else if(data.data_value>0 && data.data_value<=30) {
            this.setState({voltage_describe: '低电量'});
          }else {
            this.setState({voltage_describe: ''});
          }
        }
      })
    }
  }

  getInfo() {
    let _this=this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        let uri = Constants.serverSite3+"/v2/community/building/unit/heatUser/"+_this.props.heat_user_id+"?access_token="+result;
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
  // showList() {
  //   this.setState({showList: !this.state.showList});
  // }
  hideList() {
    if(this.state.showList) {
      this.setState({showList: false});
    }
  }
  bindDevice(deviceType){
    this.setState({showList: false});
    if(deviceType === 'temp') {
      console.log('temp_id:::', this.state.heat_user_device_temp_id)
      if(!this.state.heat_user_device_temp_id){
        this.props.navigator.push({
            name: 'Scan',
            component: Scan,
            passProps:{
              heat_user_id:this.props.heat_user_id,
              props:this.props.props,
              device_type: deviceType
            }
        })
      }else{
        this.setState({
          showAlert: true,
          alertText: '确定解除温度计绑定么？',
          deviceType: deviceType
        })
      }
    }else {
      if(!this.state.heat_user_device_valves_id) {
        this.props.navigator.push({
          name: 'Scan',
          component: Scan,
          passProps:{
            heat_user_id:this.props.heat_user_id,
            props:this.props.props,
            device_type: deviceType
          }
        })
      }else {
        this.setState({
          showAlert: true,
          alertText: '确定解除户内阀绑定么？',
          deviceType: deviceType
        })
      }
    }
  }
  // 解除绑定
  relieveDevice() {
    this.showAlert();
    let uri = `${Constants.serverSite1}/v1/device/relieve`;
    let heat_user_device_id = null;
    if(this.state.deviceType === 'temp') {
      heat_user_device_id = this.props.heat_user_device_temp_id;
    }
    if(this.state.deviceType === 'valves') {
      heat_user_device_id = this.props.heat_user_device_valves_id;
    }
    console.log(heat_user_device_id,this.props.heat_user_id, this.state.deviceType);
    fetch(uri,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          heat_user_device_id: heat_user_device_id,
          heat_user_id: this.props.heat_user_id 
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if(responseJson.code===200){
          DeviceEventEmitter.emit('refresh');
          this.setState({
            relieveAlert: true,
            succText: '解除绑定'
          });
          setTimeout(() => {
            this.setState({relieveAlert: false});
          }, 5000);
          if(this.state.deviceType === 'temp') {
            this.setState({heat_user_device_temp_id: null});
          }else {
            this.setState({heat_user_device_valves_id: null});
          }
        }
      })
      .catch((e) => {
        console.log(e)
        Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
      });
  }
  
  showAlert() {
    this.setState({showAlert: false})
  }
  // 户内阀开度下发
  async gateway(value) {
    AsyncStorage.getItem("access_token", (errs, result) => {
      if(!errs) {
        console.log(this.state.valves_device_object_id, value, result);
        let uri = `${Constants.serverSite3}/v2/gateway`;
        fetch(uri, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_object_id: this.state.valves_device_object_id,
            tap_open: value,
            access_token: result
          })
        }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if(responseJson.code === 200) {
            this.setState({
              relieveAlert: true,
              succText: '下发成功'
            });
            setTimeout(() => {
              this.setState({relieveAlert: false, valves_opening: value});
            }, 5000);
          }
        })
        .catch((e) => {
          console.log(e)
          Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
        });
      }
    })
  }
  valvesHistory() {
    this.props.navigator.push({
      name: 'ValvesHitory',
      component: ValvesHitory,
      passProps: {
        addr: this.props.addr,
        heat_user_id: this.props.heat_user_id
      }
    })
  }

  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Image style={{ width: 25, height: 20, marginLeft: 15, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>{this.props.user_number}</Text>
          <View style={{ width: 30 }} />
          <TouchableOpacity onPress={() =>this.setState({showList: !this.state.showList})}>
            {
              this.state.heat_user_device_temp_id && this.state.heat_user_device_valves_id ?
                <Image style={{ width: 25, height: 20, marginRight: 25, marginTop: 5 }} resizeMode="contain" source={require('../icons/all_bd.png')} /> :
                <Image style={{ width: 25, height: 20, marginRight: 25, marginTop: 5 }} resizeMode="contain" source={require('../icons/bangding.png')} />
            }
          </TouchableOpacity>
        </View>
        <Text style={{ backgroundColor: "#434b59", textAlign: "center", width: width, height: 25, color: "#FFFFFF", fontSize: 12 }}>{this.props.addr}</Text>
        {
          this.state.showList ? 
            <View style={styles.showList}>
              <View style={{width:0, height: 0, borderWidth: 5, borderStyle: 'solid', borderLeftColor: 'transparent',borderTopColor: 'transparent', borderRightColor: 'transparent', borderBottomColor:'#ffffff', position: 'absolute', top: -10, right: 20}}></View>
              <View>
                <TouchableOpacity style={[styles.showItem, {borderBottomColor: '#eee', borderBottomWidth: 1}]} onPress={() =>this.bindDevice('temp')}>
                {
                    !this.state.heat_user_device_temp_id ? 
                      <View style={styles.showItem}>
                        <Image style={{ width: 13, height: 13, marginRight: 6}} resizeMode="contain" source={require('../icons/icon_wendu.png')} />
                        <Text style={{fontSize: 12}}>绑定温度计</Text>
                      </View> : 
                      <View style={styles.showItem}>
                        <Image style={{ width: 13, height: 13, marginRight: 6}} resizeMode="contain" source={require('../icons/icon_wendu.png')} />
                        <Text style={{fontSize: 12}}>解绑温度计</Text>
                        <Image style={{ width: 10, height: 10, marginLeft: 10, marginTop: 5}} resizeMode="contain" source={require('../icons/bd_succ.png')} />
                      </View>
                }
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.showItem} onPress={() =>this.bindDevice('valves')}>
                {
                    !this.state.heat_user_device_valves_id ? 
                      <View style={styles.showItem}>
                        <Image style={{ width: 13, height: 13, marginRight: 6}} resizeMode="contain" source={require('../icons/icon_fa.png')} />
                        <Text style={{fontSize: 12}}>绑定户内阀</Text>
                      </View> : 
                      <View style={styles.showItem}>
                        <Image style={{ width: 13, height: 13, marginRight: 6}} resizeMode="contain" source={require('../icons/icon_fa.png')} />
                        <Text style={{fontSize: 12}}>解绑户内阀</Text>
                        <Image style={{ width: 10, height: 10, marginLeft: 10, marginTop: 5}} resizeMode="contain" source={require('../icons/bd_succ.png')} />
                      </View>
                }
                </TouchableOpacity>
              </View>
            </View> : <View></View>
        }
        
        <ScrollView onTouchEnd={() => this.hideList()}>
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

          <View style={{ flexDirection: "row",flex: 1, justifyContent: 'space-between', alignItems:"center", marginBottom: 13 }}>
            <View style={{flexDirection: "row", alignItems:"center"}}>
              <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12 }} />
              <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>户内阀开度</Text>
            </View>
            {
              this.props.heat_user_device_valves_id ? 
                <View style={{flexDirection: "row", alignItems:"center"}}>
                  {
                    this.state.valves_voltage === 0 ? 
                      <Image style={{ width: 22, height: 15 }} resizeMode="contain" source={require('../icons/wudian.png')} /> :
                      this.state.valves_voltage>0 && this.state.valves_voltage<=30 ?
                        <Image style={{ width: 22, height: 15 }} resizeMode="contain" source={require('../icons/didian.png')} /> : 
                        <Image style={{ width: 22, height: 15 }} resizeMode="contain" source={require('../icons/mandian.png')} />
                  }
                  <Text style={{fontSize: 12, color: '#999'}}> {this.state.voltage_describe}</Text>
                </View> : <View></View>
            }
            
            <View style={{marginRight: 15, alignItems:"center"}}>
              <TouchableOpacity style={{flexDirection: 'row', alignItems:"center"}} onPress={() => this.valvesHistory()}>
                <Text style={{color: '#2A9ADC'}}>调控记录 </Text>
                <Image style={{ width: 12, height: 12 }} resizeMode="contain" source={require('../icons/valves_history.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{backgroundColor: "#fff", justifyContent: 'center', height: 80, paddingLeft: 25, paddingRight: 25}}>
            {
              !this.props.heat_user_device_valves_id ?
                <View style={{flexDirection: "row", height: 30}}>
                  <View style={styles.valvesView}><Text style={styles.valvesTextColor}>关闭</Text></View>
                  <View style={styles.valvesView}><Text style={styles.valvesTextColor}>25%</Text></View>
                  <View style={styles.valvesView}><Text style={styles.valvesTextColor}>50%</Text></View>
                  <View style={styles.valvesView}><Text style={styles.valvesTextColor}>75%</Text></View>
                  <View style={[styles.valvesView, {borderRightWidth: 1}]}><Text style={styles.valvesTextColor}>100%</Text></View>
                </View> : 
                <View style={{flexDirection: "row", height: 30}}>
                  <View style={[styles.valvesView, this.state.valves_opening==0 ? styles.styleView: {}]}>
                    <TouchableOpacity onPress={() => this.gateway(0)}><Text style={this.state.valves_opening==0 ? {color: '#2A9ADC'}:{}}>关闭</Text></TouchableOpacity>
                  </View>
                  <View style={[styles.valvesView, (this.state.valves_opening>0 && this.state.valves_opening<=25) ? styles.styleView: {}]}>
                    <TouchableOpacity onPress={() => this.gateway(25)}><Text style={(this.state.valves_opening>0 && this.state.valves_opening<=25) ? {color: '#2A9ADC'} : {}}>25%</Text></TouchableOpacity>
                  </View>
                  <View style={[styles.valvesView, (this.state.valves_opening>25 && this.state.valves_opening<=50) ? styles.styleView: {}]}>
                    <TouchableOpacity onPress={() => this.gateway(50)}><Text style={(this.state.valves_opening>25 && this.state.valves_opening<=50) ? {color: '#2A9ADC'} : {}}>50%</Text></TouchableOpacity>
                  </View>
                  <View style={[styles.valvesView, (this.state.valves_opening>50 && this.state.valves_opening<=75) ? styles.styleView: {}]}>
                    <TouchableOpacity onPress={() => this.gateway(75)}><Text style={(this.state.valves_opening>50 && this.state.valves_opening<=75) ? {color: '#2A9ADC'} : {}}>75%</Text></TouchableOpacity>
                  </View>
                  <View style={[styles.valvesView, {borderRightWidth: 1}, (this.state.valves_opening>75 && this.state.valves_opening<=100) ? styles.styleView: {}]}>
                    <TouchableOpacity onPress={() => this.gateway(100)}><Text style={(this.state.valves_opening>75 && this.state.valves_opening<=100) ? {color: '#2A9ADC'} : {}}>100%</Text></TouchableOpacity>
                  </View>
              </View>
            }
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 13, marginTop: 20}}>
            <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12}} />
            <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>温度变化曲线</Text>
          </View>
          <View style={{ height: 243, width: width, backgroundColor: "#fff", marginBottom: 23}}>
            <IndoorChart data_id={this.props.temp_data_id} ></IndoorChart>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 13, marginTop: 0}}>
            <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12}} />
            <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>户内阀开度变化曲线</Text>
          </View>
          <View style={{ height: 243, width: width, backgroundColor: "#fff", marginBottom: 23}}>
            <IndoorChart data_id={this.props.valves_data_id} ></IndoorChart>
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
        {
          this.state.showAlert ? 
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', width: width, height: height, position: 'absolute'}}>
              <View style={{width: width-60, backgroundColor: '#fff', flexDirection: 'column', alignSelf: 'center', paddingTop: 15, paddingBottom: 20, marginTop: height/2-90}}>
                <TouchableOpacity onPress={() =>this.showAlert()}>
                  <Image style={{ width: 18, height: 18, alignSelf: 'flex-end', marginRight: 15}} resizeMode="contain" source={require('../icons/quit.png')}/>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 10}}>
                  <Image style={{ width: 18, height: 18 }} resizeMode="contain" source={require('../icons/remove.png')} />
                  <Text> {this.state.alertText}</Text>
                </View>
                <View style={{flexDirection: 'row', paddingLeft: 40, paddingRight: 40, justifyContent: 'space-between', marginTop: 30}}>
                  <View style={{backgroundColor: '#2A9ADC'}}>
                    <TouchableOpacity style={{paddingLeft: 35, paddingRight: 35, paddingTop: 8, paddingBottom: 8}} onPress={() =>this.relieveDevice()}>
                      <Text style={{color: '#fff'}}>确定</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{borderColor: '#eee', borderWidth: 1}}>
                    <TouchableOpacity style={{paddingLeft: 35, paddingRight: 35, paddingTop: 8, paddingBottom: 8}} onPress={() =>this.showAlert()}>
                      <Text style={{color: '#999'}}>取消</Text>
                    </TouchableOpacity>  
                  </View>
                </View>
              </View>
            </View> : <View></View>
        }
        {
          this.state.relieveAlert ?
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', width: width, height: height, position: 'absolute'}}>
              <View style={{backgroundColor: '#fff', borderRadius: 4, height: 100, width: 120, flexDirection: 'column', alignSelf: 'center', justifyContent: 'space-evenly', alignItems: 'center', marginTop: height/2-50}}>
                <Image style={{ width: 30, height: 30 }} resizeMode="contain" source={require('../icons/device_ok.png')} />
                <Text>{this.state.succText}</Text>
              </View>
            </View> : <View></View>
        }
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

  showList: {
    backgroundColor: '#ffffff', 
    borderRadius: 4, 
    paddingLeft: 10, 
    width: 120, 
    position: 'absolute', 
    top: 50, 
    right: 12, 
    zIndex: 999
  },
  showItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    height: 38
  },
  valvesView: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems:"center", 
    borderWidth: 1, 
    borderColor: '#ccc',
    borderRightWidth: 0
  },
  valvesTextColor: {
    color: '#ccc'
  },
  styleView: {
    borderColor: '#2A9ADC',
    borderWidth: 1,
    borderRightWidth: 1
  }
});