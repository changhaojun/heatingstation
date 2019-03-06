/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View ,Animated ,Alert,Dimensions,Image,TouchableOpacity} from 'react-native';
import { RNCamera } from 'react-native-camera';
// import AddDevices from '../page/devices/addDevices';
// import Main from '../main';
import DevicesBinding from './devicesBinding';
var { width, height } = Dimensions.get('window');
 export default class Scan extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          show:true,
          moveAnim: new Animated.Value(0),

          alertText: ''
      };
  }

  componentDidMount() {
      this.startAnimation();
  }
  startAnimation = () => {
    if(this.state.show){
      this.state.moveAnim.setValue(0);
      Animated.timing(
          this.state.moveAnim,
          {
              toValue: -200,
              duration: 1500,
          }
      ).start(() => {
        this.startAnimation();   
      });
    }
  };
  componentWillMount() {
    if(this.props.device_type === 'temp') {
        this.setState({alertText: '扫描失败,请扫描 绑定温度计设备 的二维码'});
    }else {
        this.setState({alertText: '扫描失败,请扫描 绑定户内阀设备 的二维码'})
    }
  }
    //  识别二维码
    onBarCodeRead = (result) => {
        if(this.state.show){
            this.state.show =false;
            const {data} = result; 
            console.log('-sdagafdhran----------------:', data);
            console.log(this.props.device_type)
            
            if(data.includes("type")&&data.includes("deviceId")){
                const datas = JSON.parse(data);
                console.log('-----------------:', datas);
                if(this.props.device_type === 'temp') {
                    if((datas.deviceType && datas.deviceType===1) || !datas.deviceType) {
                        this.props.navigator.replace({
                            name: 'DevicesBinding',
                            component: DevicesBinding,
                            passProps:{
                                data:datas,
                                heat_user_id:this.props.heat_user_id,
                                props:this.props.props,
                                device_type: this.props.device_type
                            }
                        })
                    }else {
                        Alert.alert('提示', this.state.alertText, [{text: '确定', onPress: () => {
                            this.props.navigator.popN(1)
                        }}])
                    }
                }
                if(this.props.device_type === 'valves') {
                    if(datas.deviceType ===2) {
                        this.props.navigator.replace({
                            name: 'DevicesBinding',
                            component: DevicesBinding,
                            passProps:{
                                data:datas,
                                heat_user_id:this.props.heat_user_id,
                                props:this.props.props,
                                device_type: this.props.device_type
                            }
                        })
                    }else {
                        Alert.alert('提示', this.state.alertText, [{text: '确定', onPress: () => {
                            this.props.navigator.popN(1)
                        }}])
                    }
                }
                // if(datas.device_type && (datas.device_type !== 1 || datas.device_type !== 2)) {
                //     Alert.alert('提示', this.state.alertText, [{text: '确定', onPress: () => {
                //         this.props.navigator.popN(1)
                //     }}])
                // }else {
                    // this.props.navigator.replace({
                    //     name: 'DevicesBinding',
                    //     component: DevicesBinding,
                    //     passProps:{
                    //         data:datas,
                    //         heat_user_id:this.props.heat_user_id,
                    //         props:this.props.props,
                    //         device_type: this.props.device_type
                    //     }
                    // })
                // }
            }else {
                Alert.alert('提示', this.state.alertText, [{text: '确定', onPress: () => {
                    this.props.navigator.popN(1)
                }}])
            } 
        }       
    };
  render() {
      return (
          <View style={styles.container}>
              <RNCamera
                  ref={ref => {
                      this.camera = ref;
                  }}
                  style={styles.preview}
                  type={RNCamera.Constants.Type.back}
                  flashMode={RNCamera.Constants.FlashMode.on}
                  onBarCodeRead={this.onBarCodeRead}
              >
               <View  style={{width:width,marginLeft:20,height:30,marginTop:10}}>
                <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                    <Image style={{ width: 25, height: 20}} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                </TouchableOpacity>
                </View>
                  <View style={styles.rectangleContainer}>
                       
                      <View style={styles.rectangle}/>
                      <Animated.View style={[
                          styles.border,
                          {transform: [{translateY: this.state.moveAnim}]}]}/>
                      <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                  </View>
                  </RNCamera>
          </View>
      );
  }
}

// export default ScanScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'row',
  },
  preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
  },
  rectangleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
  },
  rectangle: {
      height: 200,
      width: 200,
      borderWidth: 1,
      borderColor: '#00FF00',
      backgroundColor: 'transparent'
  },
  rectangleText: {
      flex: 0,
      color: '#fff',
      marginTop: 10
  },
  border: {
      flex: 0,
      width: 200,
      height: 2,
      backgroundColor: '#00FF00',
  }
});
