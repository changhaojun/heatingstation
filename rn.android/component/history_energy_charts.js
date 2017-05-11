/**
 * Created by Vector on 17/4/24.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    AlertIOS,
    TouchableOpacity,
    Navigator,
    Animated,
    ListView,
    Image,
    NativeModules,
} from 'react-native';

import Dimensions from 'Dimensions';
import ECharts from 'native-echarts';

// 导入自定义原生模块
var Orientation = NativeModules.Orientation;
var {width, height} = Dimensions.get('window');

//  图表模块
export default class HistoryEnergyCharts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // 默认属性及数量
            xAxisData:[],
            data:[],
        };

       // Orientation.transverse();

        var _this = this;
        //AsyncStorage.getItem("userKey",function(errs,result){
                //console.info(result);
                //if (!errs) {
                    fetch("http://rapapi.org/mockjsdata/16979/v1_0_0/chart/history_enrgy_charts")
                        .then((response) => response.json())
                        .then((responseJson) => {
                            _this.setState({
                                xAxisData: responseJson.coordinate[0].xAxisData,
                                data: responseJson.coordinate[0].data,
                            });

                            console.log(_this.state.xAxisData);
                            console.log(_this.state.data);
                        })
                        .catch((error) => {
                            console.error(error);
                            AlertIOS.alert(
                                '提示',
                                '网络连接失败',
                            );
                        });
               // }
           // }
        //);
    }


    back(){
        Orientation.vertical();
        this.props.navigator.pop();
    }

    render() {
        // var unit=this.props.unit;
        var option = {
            title: {
                show: false
            },
            legend: {
                show: false
            },
            grid:{
                top:50,
                bottom:80,
            },
            xAxis: {
                data: this.state.xAxisData,
                name: "日期",
                axisLabel:{
                    show:true,
                    textStyle:{
                        color: 'rgb(248,201,78)',
                    },
                    rotate: 0,
                },
            },
            yAxis: {
                type: 'value',
                scale:true,
                name: "能耗",
                axisLabel:{
                    inside: false,
                    show:true,
                    textStyle:{
                        color: 'rgb(200,119,17)',
                    },
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                }
            ],
            color: ["#c93737"],
            series: [{
                name: '能耗曲线',
                type: 'line',
                clipOverflow: false,
                smooth: true,
                areaStyle: { normal: { color: "#e9baba" } },//曲线下方的面积的颜色
                data: this.state.data,
                label: {
                    normal: {
                        show: true,
                    }
                }
            }]
        }
        return (
            <View style={styles.container}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>历史能耗曲线</Text>
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')}/>
                </View>
                <ECharts option={option} height={width-44}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navView: {
        flexDirection: 'row',
        width: height,
        height: 44,
        backgroundColor: '#f2d6b8',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#000000",
        fontSize: 19,
    },
});

