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
  TextInput,
  DeviceEventEmitter
} from 'react-native';
import IndoorChart from './indoor_chart'
import Constants from './../constants';
import Dimensions from 'Dimensions';
import Scan from './scan';
import ValvesHitory from './valves_history';
import moment from 'moment';
import UnitDetails from './unit_details';
const { width, height } = Dimensions.get('window');

export default class HeatUserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      user_name:"",
      info: [],
      heat_user_device_temp_id:this.props.heat_user_device_temp_id,
      heat_user_device_valve_id: this.props.heat_user_device_valve_id,
      valve_device_object_id: this.props.valve_device_object_id,

      showList: false,
      temp_value: this.props.temp_value,
      temp_voltage: this.props.temp_voltage,
      valve_value: this.props.valve_value,
      valve_voltage: this.props.valve_voltage,
      valve_voltage_describe: '',
      showAlert: false,
      alertText: '',
      deviceType: null,
      relieveAlert: false,
      succText: '',
      bindType: null,
      valveShow: false,
      tap_open: null,

      xArrTemp: [],
      yArrTemp: [],
      xArrValve: [],
      yArrValve: [],
      promptTemp: '加载中……',
      promptValve: '加载中……',
      end_time:"",
      start_time:""
    };
    console.log('this.props:', this.props.props.unitId)
    console.log('this.valve_value:', typeof this.props.valve_value)
  }
  componentDidMount() {
    this.getInfo();
    this.getDate();
    this.getDatas();
  }
  componentWillMount() {
    this.setTitle = DeviceEventEmitter.addListener('refresh_', (value)=>{
      if(value) {
        this.getDevice(value.bindType);
        this.setState({
          relieveAlert: true,
          succText: '绑定成功'
        });
        setTimeout(() => {
          this.setState({relieveAlert: false});
        }, 3000);
      }
    })

    if(this.state.valve_voltage !== null && this.state.valve_voltage < 0.2) {
      this.setState({valve_voltage_describe: '低电量'});
    }else if(this.state.valve_voltage >= 0.2 && this.state.valve_voltage < 0.8) {
      this.setState({valve_voltage_describe: '电量正常'});
    }else if(this.state.valve_voltage >= 0.8) {
      this.setState({valve_voltage_describe: '电量充足'});
    }
  }
  componentWillUnmount(){
    this.setTitle.remove();
  }

  getInfo() {
    let _this=this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        let uri = Constants.serverSite3+"/v2/community/building/unit/heatUser/"+_this.props.heat_user_id+"?access_token="+result;
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
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
  hideList() {
    if(this.state.showList) {
      this.setState({showList: false});
    }
  }
  bindDevice(deviceType){
    this.setState({showList: false});
    if(deviceType === 1) {
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
      if(!this.state.heat_user_device_valve_id) {
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
    if(this.state.deviceType === 1) {
      heat_user_device_id = this.state.heat_user_device_temp_id;
    }
    if(this.state.deviceType === 2) {
      heat_user_device_id = this.state.heat_user_device_valve_id;
    }
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
        if(responseJson.code===200){
          DeviceEventEmitter.emit('refresh');
          this.setState({
            relieveAlert: true,
            succText: '解除绑定'
          });
          setTimeout(() => {
            this.setState({relieveAlert: false});
          }, 3000);
          if(this.state.deviceType === 1) {
            this.setState({
              heat_user_device_temp_id: null,
              temp_value: null
            });
            
          }
          if(this.state.deviceType === 2)  {
            this.setState({
              heat_user_device_valve_id: null,
              valve_value: null,
              valve_voltage: null,
              valve_voltage_describe: ''
            });
          }
        }
      })
      .catch((e) => {
        // console.log(e)
        Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
      });
  }
  
  showAlert() {
    this.setState({showAlert: false})
  }
  // 户内阀开度下发
  alertGateway(value) {
    console.log(value)
    this.setState({
      showAlert: true,
      alertText: '确定下发户内阀开度么？',
      valveShow: true,
      tap_open: value
    })
  }
  gateway() {
    this.setState({
      showAlert: false,
      valveShow: false
    })
    AsyncStorage.getItem("access_token", (errs, result) => {
      if(!errs) {
        const bodyData ={
          device_object_id: this.state.valve_device_object_id,
          tap_open: this.state.tap_open
        }
        // console.log(bodyData);
        let uri = `${Constants.serverSite3}/v2/gateway?access_token=${result}`;
        fetch(uri, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData)
        }).then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson);
          if(responseJson.code === 200) {
            this.setState({
              relieveAlert: true,
              succText: '调控记录查看下发结果'
            });
            setTimeout(() => {
              this.setState({relieveAlert: false, valve_value: this.state.tap_open});
            }, 3000);
            DeviceEventEmitter.emit('refresh');
          }
        })
        .catch((e) => {
          // console.log(e)
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
  // 获取设备历史数据
  getDate(){
    let d = new Date();
    this.state.end_time = moment(d).format("YYYY-MM-DD HH:mm:ss");
    let current_time_stamp = d.getTime();
    let statrt_time_stamp = new Date(current_time_stamp - 24 * 3600 * 1000);
    this.state.start_time = moment(statrt_time_stamp).format("YYYY-MM-DD HH:mm:ss");
  }
  getDatas() {
    let uri = `${Constants.serverSite1}/v1/datas/groupHistory?heat_user_id=${this.props.heat_user_id}&valve=1&temp=1&start_time=${this.state.start_time}&end_time=${this.state.end_time}`;
    fetch(uri)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        if(responseJson.code === 200) {
          if(responseJson.result.temp && responseJson.result.temp.times.length > 0) {
            this.setState({
              xArrTemp: responseJson.result.temp.times,
              yArrTemp: responseJson.result.temp.datas
            });
          }else {
            this.setState({ promptTemp: "暂无历史数据" });
          }
          if(responseJson.result.valve && responseJson.result.valve.times.length > 0) {
            this.setState({
              xArrValve: responseJson.result.valve.times,
              yArrValve: responseJson.result.valve.datas
            });
          }else {
            this.setState({ promptValve: "暂无历史数据" });
          }
        } 
      })
      .catch((error) => {
        // console.error(error);
        Alert.alert(
          '提示',
          '网络连接错误，获取设备历史数据失败',
        );
      })
  }
  // 获取用户设备
  getDevice(type) {
    const uri = `${Constants.serverSite1}/v1/device?heat_user_id=${this.props.heat_user_id}&device_type=${type}`;
    fetch(uri)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.code === 200) {
          if(type === 1) {
            this.setState({heat_user_device_temp_id: responseJson.result.rows[0].heat_user_device_id});
          }
          if(type === 2) {
            this.setState({
              heat_user_device_valve_id: responseJson.result.rows[0].heat_user_device_id,
              valve_device_object_id: responseJson.result.rows[0].device_object_id
            });
          }
        } 
      })
      .catch((error) => {
        Alert.alert(
          '提示',
          '网络连接错误，获取设备历史数据失败',
        );
      })
  }
  skip() {
    this.props.navigator.pop();
    DeviceEventEmitter.emit('refresh');
  }

  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => this.skip()}>
            <Image style={{ width: 25, height: 20, marginLeft: 15, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>{this.props.user_number}</Text>
          <View style={{ width: 30 }} />
          <TouchableOpacity onPress={() =>this.setState({showList: !this.state.showList})}>
            {
              this.state.heat_user_device_temp_id || this.state.heat_user_device_valve_id ?
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
                <TouchableOpacity style={[styles.showItem, {borderBottomColor: '#eee', borderBottomWidth: 1}]} onPress={() =>this.bindDevice(1)}>
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
                <TouchableOpacity style={styles.showItem} onPress={() =>this.bindDevice(2)}>
                {
                    !this.state.heat_user_device_valve_id ? 
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
          <ImageBackground style={{ width: width, height: width * 0.42, marginTop: 15, paddingBottom: 35, flexDirection: "row", alignItems: "center"}} resizeMode="contain" source={require('../icons/indoor_bg.png')}>
            <Image style={{ width: 51, height: 51, marginLeft: 50, marginTop: 5 }} resizeMode="contain" source={require('../icons/indoor_portrait.png')} />
            <View style={{ marginLeft: 13, flex: 1, marginTop: 5}}>
              <Text style={{ fontSize: 15, color: "#fff" }}>{this.state.user_name}</Text>
              <Text style={{ fontSize: 12, color: "#ffffffdd" }}>户主</Text>
            </View>
            <View style={{flexDirection: "column", justifyContent: 'flex-start', height: '100%', marginTop: 15, marginRight: 30}}>
              {
                this.state.temp_voltage !== null ?
                  <View style={{flexDirection: "row", alignItems: 'center', marginBottom: 10}}>
                    <Text style={{fontSize: 12, color: '#ffffffdd', marginRight: 5}}>温度计电量</Text>
                    <Image style={{ width: 20, height: 13, marginTop: 2 }} resizeMode="contain" 
                      source={this.state.temp_voltage < '65%' ? require('../icons/wudian.png') : this.props.temp_voltage >= '65%' && this.props.temp_voltage < '95%' ? require('../icons/didian_2.png') : this.props.temp_voltage >= '95%' ? require('../icons/mandian.png') : require('../icons/nav_flag.png')} />
                  </View> : <Text></Text>
              }
              
              <View>
                <Text style={{ fontSize: 36, color: "#fff" }}>{this.state.temp_value ? this.state.temp_value : "-"}<Text style={{ fontSize: 17 }}>℃</Text></Text>
                <Text style={{ fontSize: 12, color: "#ffffffdd", marginLeft: 5, marginTop: -5}}>室内温度</Text>
              </View>
            </View>
          </ImageBackground>

          <View style={{ flexDirection: "row",flex: 1, justifyContent: 'space-between', alignItems:"center", marginBottom: 13 }}>
            <View style={{flexDirection: "row", alignItems:"center"}}>
              <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12 }} />
              <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>户内阀开度</Text>
              {
                this.state.heat_user_device_valve_id === null ?
                <Text style={{fontSize: 10, color: '#999'}}> (未绑定)</Text> : <Text></Text>
              }
            </View>
            <View style={{flexDirection: "row", alignItems:"center", justifyContent: 'center'}}>
              {
                this.state.valve_voltage !== null && this.props.valve_voltage < 0.2 ?
                  <Image style={{ width: 20, height: 13, marginTop: 2 }} resizeMode="contain" source={require('../icons/wudian.png')} /> :
                  this.state.valve_voltage !== null && this.props.valve_voltage >= 0.2 && this.props.valve_voltage < 0.8 ?
                    <Image style={{ width: 20, height: 13, marginTop: 2 }} resizeMode="contain" source={require('../icons/didian.png')} /> :
                    this.state.valve_voltage !== null && this.props.valve_voltage >= 0.8 ?
                      <Image style={{ width: 20, height: 13, marginTop: 2 }} resizeMode="contain" source={require('../icons/mandian.png')} /> :
                      <Text></Text>
              }
              <Text style={this.state.valve_voltage !== null && this.state.valve_voltage < 0.2 ? {color: '#FA2C3A', fontSize: 12} : {color: '#666', fontSize: 12}}> {this.state.valve_voltage_describe}</Text>
            </View>
            <View style={{marginRight: 15, alignItems:"center"}}>
              <TouchableOpacity style={{flexDirection: 'row', alignItems:"center"}} onPress={() => this.valvesHistory()}>
                <Text style={{color: '#2A9ADC'}}>调控记录 </Text>
                <Image style={{ width: 12, height: 12 }} resizeMode="contain" source={require('../icons/valves_history.png')} />
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={{backgroundColor: "#fff", justifyContent: 'center', height: 80, paddingLeft: 25, paddingRight: 25, borderColor: '#000', borderWidth: 2}}>
            {
              this.state.heat_user_device_valve_id === null ?
                <View style={{flexDirection: "row", height: 30}}>
                  <View style={styles.valvesView}><Text style={styles.valvesTextColor}>关闭</Text></View>
                  <View style={styles.valvesView}><Text style={styles.valvesTextColor}>25%</Text></View>
                  <View style={styles.valvesView}><Text style={styles.valvesTextColor}>50%</Text></View>
                  <View style={styles.valvesView}><Text style={styles.valvesTextColor}>75%</Text></View>
                  <View style={[styles.valvesView, {borderRightWidth: 1}]}><Text style={styles.valvesTextColor}>100%</Text></View>
              </View> :
              <View style={{flexDirection: "row", height: 30}}>
                <View style={[styles.valvesView, this.state.valve_value===0 ? styles.styleView: {}]}>
                  <TouchableOpacity onPress={() => this.alertGateway(0)}><Text style={this.state.valve_value===0 ? {color: '#2A9ADC'}:{}}>关闭</Text></TouchableOpacity>
                </View>
                <View style={[styles.valvesView, (this.state.valve_value>0 && this.state.valve_value<=25) ? styles.styleView: {}]}>
                  <TouchableOpacity onPress={() => this.alertGateway(25)}><Text style={(this.state.valve_value>0 && this.state.valve_value<=25) ? {color: '#2A9ADC'} : {}}>25%</Text></TouchableOpacity>
                </View>
                <View style={[styles.valvesView, (this.state.valve_value>25 && this.state.valve_value<=50) ? styles.styleView: {}]}>
                  <TouchableOpacity onPress={() => this.alertGateway(50)}><Text style={(this.state.valve_value>25 && this.state.valve_value<=50) ? {color: '#2A9ADC'} : {}}>50%</Text></TouchableOpacity>
                </View>
                <View style={[styles.valvesView, (this.state.valve_value>50 && this.state.valve_value<=75) ? styles.styleView: {}]}>
                  <TouchableOpacity onPress={() => this.alertGateway(75)}><Text style={(this.state.valve_value>50 && this.state.valve_value<=75) ? {color: '#2A9ADC'} : {}}>75%</Text></TouchableOpacity>
                </View>
                <View style={[styles.valvesView, {borderRightWidth: 1}, (this.state.valve_value>75 && this.state.valve_value<=100) ? styles.styleView: {}]}>
                  <TouchableOpacity onPress={() => this.alertGateway(100)}><Text style={(this.state.valve_value>75 && this.state.valve_value<=100) ? {color: '#2A9ADC'} : {}}>100%</Text></TouchableOpacity>
                </View>
              </View>
            }
          </View> */}
          {
            <View style={{backgroundColor: "#fff", paddingLeft: 25, paddingRight: 25, paddingBottom: 20, paddingTop: 20, flexDirection: "row", justifyContent: 'space-between', alignItems:"center"}}>
              <View style={{flexDirection: "row"}}><Text>供水温度</Text><Text> 50</Text></View>
              <View style={{flexDirection: "row"}}><Text>回水温度</Text><Text> 20</Text></View>
            </View>
          }
          {
            <View style={{backgroundColor: "#fff", paddingLeft: 25, paddingRight: 25, paddingBottom: 20, paddingTop: 20, flexDirection: "row", alignItems:"center"}}>
              <TextInput
                style={[this.state.valve_value || this.state.valve_value == '0' ? {color: '#2A9ADC'} : {color: '#666'},{height: 30, borderColor: '#ccc', borderWidth: 1, padding: 0, paddingLeft: 10, paddingRight: 10, width: '80%'}]}
                onChangeText={(valve_value) => this.setState({valve_value})}
                keyboardType='numeric'
                editable={this.state.heat_user_device_valve_id == null ? false : true}
                value={this.state.heat_user_device_valve_id !== null ? this.state.valve_value.toString(): ''}
              />
              <Text style={[this.state.valve_value || this.state.valve_value == '0' ? {color: '#2A9ADC'} : {color: '#cccccc'}, {marginRight: 20}]}> %</Text>
              {
                this.state.valve_value || this.state.valve_value == '0' ?
                  <TouchableOpacity onPress={() => this.alertGateway(this.state.valve_value)}><Text>下发</Text></TouchableOpacity>: 
                  <Text style={{color: '#cccccc'}}>下发</Text>
              }
            </View>
          }
          

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 13, marginTop: 20}}>
            <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12}} />
            <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>温度变化曲线</Text>
          </View>
          <View style={{ height: 243, width: width, backgroundColor: "#fff", marginBottom: 23}}>
            <IndoorChart xArr={this.state.xArrTemp} yArr={this.state.yArrTemp} prompt={this.state.promptTemp}></IndoorChart>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 13, marginTop: 0}}>
            <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12}} />
            <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>户内阀开度变化曲线</Text>
          </View>
          <View style={{ height: 243, width: width, backgroundColor: "#fff", marginBottom: 23}}>
            <IndoorChart xArr={this.state.xArrValve} yArr={this.state.yArrValve} prompt={this.state.promptValve}></IndoorChart>
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
                    {
                      this.state.valveShow ?
                        <TouchableOpacity style={{paddingLeft: 35, paddingRight: 35, paddingTop: 8, paddingBottom: 8}} onPress={() =>this.gateway()}>
                          <Text style={{color: '#fff'}}>确定</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity style={{paddingLeft: 35, paddingRight: 35, paddingTop: 8, paddingBottom: 8}} onPress={() =>this.relieveDevice()}>
                          <Text style={{color: '#fff'}}>确定</Text>
                        </TouchableOpacity>
                    }
                    
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
              <View style={{backgroundColor: '#fff', borderRadius: 4, height: 100, width: 160, flexDirection: 'column', alignSelf: 'center', justifyContent: 'space-evenly', alignItems: 'center', marginTop: height/2-50}}>
                <Image style={{ width: 30, height: 30 }} resizeMode="contain" source={this.state.bindType ? require('../icons/su.png') : require('../icons/device_ok.png')} />
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