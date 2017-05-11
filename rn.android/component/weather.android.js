/**
 * Created by Vector on 17/4/18.
 */
// 设置页面
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet,
    NativeModules, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';

import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

// 导入自定义原生模块
var Orientation = NativeModules.Orientation;
import WeatherChart from './weather_chart.android';
export default class Weather extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            todayTemp:"-30℃～50℃",
            realTimeTemp: "25℃",
            weatherTypes: "晴",
        };

        var _this = this;

        fetch("http://rapapi.org/mockjs/16979/v1_0_0/weather")
            .then((response) => response.json())
            .then((responseJson) => {
                _this.setState({
                    todayTemp: responseJson.today_temp,
                    realTimeTemp: responseJson.real_time_temp,
                    weatherTypes: responseJson.weather_types,
                });
            })
            .catch((error) => {
                console.error(error);
                // ToastAndroid.show("网络或服务器异常", ToastAndroid.SHORT);
            });
    }


    gotoWeatherChart(){
        const navigator = this.props.navigator;
        Orientation.transverse();
        this.props.navigator.push({
            component:WeatherChart,
        })
    }



    render() {
        return (
            <View style={styles.all}>
                <View style={styles.weatherBackground}>
                    <TouchableOpacity activeOpacity={0.5} onPress={this.gotoWeatherChart.bind(this)}>
                    <View style={styles.weather}>
                        <View style={styles.weatherTop}>
                            <Text style={{marginLeft:10, color:"#212121"}}>C | F</Text>
                            <Text style={{marginLeft:25, textAlign:'left', color:"#212121"}}>今日温度:{this.state.todayTemp}</Text>
                        </View>
                        <View style={styles.weatherLine}>
                        </View>
                        <View style={styles.weatherMiddle}>
                            <Text style={{fontSize: 18, color: '#5e5e5e'}}>实时温度</Text>
                            <Text style={{fontSize: 40, color: '#212121'}}>{this.state.realTimeTemp}</Text>
                            <Text style={{fontSize: 25, color: '#5e5e5e'}}>{this.state.weatherTypes}</Text>
                        </View>
                        <View style={styles.weatherBottom}>
                            <Image source={require('../images/wea.png')} style={{width:width*(3/5)-10, height:80}}></Image>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all:{
        // marginTop:64,
        width: width,
        height: height*(5/13),
        backgroundColor: '#f2d6b8',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherBackground:{
        width: width-80,
        height: height*(5/14),
        backgroundColor:'#fdfaf6',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weather:{
        width: width*(3/5),
        height: width*(3/5),
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        shadowColor:'#c2c2c2',
        shadowOffset:{h:5},
        shadowRadius:3,
        shadowOpacity:0.5,
    },
    weatherTop:{
        width: width*(3/5),
        height: width*(3/5)*(1/5),
        // backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherLine:{
        width: width*(3/5) - 16,
        height: 1,
        backgroundColor: '#e6e6e6',
        marginLeft: 8,
    },
    weatherMiddle:{
        width: width*(3/5),
        height: width*(3/5)*(1/5),
        marginTop:30,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-around',
        // backgroundColor: 'green',
    },
    weatherBottom:{
        marginTop:20,
        width: width*(3/5),
        height: width*(3/5)*(2/5),
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
    },

});
