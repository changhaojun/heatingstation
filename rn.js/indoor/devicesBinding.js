/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Image ,Dimensions,AsyncStorage,ToastAndroid,Alert,Button,DeviceEventEmitter } from 'react-native';
const { width, height } = Dimensions.get('window');
import Constants from './../constants';
let Hstimer;
export default class DevicesBinding extends React.Component {
  constructor(props){
    super(props);
    this.state={
      number:0,
      fail:true,
      access_token:null,
      client:null
    }
    AsyncStorage.getItem("access_token", (errs, result)=> {
      this.state.access_token=result
         this.waitResponse();
    })
    this.getPer();
   
  }
  async waitResponse(){
    let uri = `http://114.215.46.56:17739/v1/device/add`;
   console.log(this.props.data.deviceId,this.props.heat_user_id,this.props.data.type)
    fetch(uri,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            collector_id: this.props.data.deviceId,
            heat_user_id: this.props.heat_user_id,
            deviceType:this.props.data.type
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if(responseJson.code===200){
            clearInterval(Hstimer);
            Alert.alert('提示', "绑定成功",[
              {text: '确定', onPress: () => {
                this.props.navigator.popN(2)
                DeviceEventEmitter.emit('refresh')
              }}
            ])
          }
        })
        .catch((e) => {
          console.log(e)
          Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
        });
  }
  getPer(){
    let time = 0;
    Hstimer = setInterval(() => {     
        this.setState({
          number:time,
        })
        time ++;
        if(time > 100) {
            clearInterval(Hstimer);
            this.setState({
              fail:false,
              number:0
            })
        }
    }, 3000)
  }
 againAdd(){
  clearInterval(Hstimer);
  this.props.navigator.popN(1)
 }
 againLink(){
  this.setState({
    fail:true
  })
  this.getPer()
  if(this.props.data.type==='HSH01'){
      this.waitResponse();
  }
 }
  render() {
    return (
      <View style={styles.container}>
      {
        this.state.fail ?
        <View>
            <View style={{width:width,height:300}}>
              <Image source={require('../images/facility_img_loading.png')} style={{resizeMode:"center",width:width,height:height/1.5}}/>
              <View style={styles.count}>
                <Text style={{color:"#fff",fontSize:46}}>
                    {this.state.number}
                </Text>
                <Text style={{color:"#fff",fontSize:18}}>%</Text>
              </View> 
            </View>
            <Text style={{textAlign:"center",color:"#fff"}}>绑定设备中...</Text>
            <Text style={{textAlign:"center",color:"#aaa",fontSize:12}}>请勿断电或者关闭APP,并保持网络畅通</Text>
            <Text style={{textAlign:"center",color:"#aaa",fontSize:12}}>(绑定需3-5分钟，请耐心等待)</Text>
        </View>  :
        <View>
            <View style={{width:width,height:230}}>
              <Image source={require('../images/facility_ico_failure.png')} style={{resizeMode:"center",width:width,height:height/2}}/>
            </View>
            <Text style={{textAlign:"center",color:"#fff"}}>设备连接失败</Text>
            <Text style={{textAlign:"center",color:"#aaa",fontSize:12}}>请确认您的网络是否良好</Text>
            <View style={{flexDirection:"row",justifyContent:"center",marginTop:20}}>
              <Button raised primary text="再次尝试" style={{container:{borderRadius:20,height:40,backgroundColor:"#3994ea",width:width/2-40,marginRight:20}}} onPress={()=>this.againLink()}/> 
                <Button raised  text="重新添加" style={{container:{borderRadius:20,height:40,backgroundColor:"#fff",width:width/2-40},text:{color:"#3994ea"}}} onPress={()=>this.againAdd()}/> 
                
            </View>
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    opacity:0.85,
  },
  count:{
    position:"absolute",
    flexDirection: 'row',
    justifyContent: 'center',
    width:width,
    top:height/3.5
    // backgroundColor: "#eee",
  }
});
