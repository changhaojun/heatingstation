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
} from 'react-native';

import Dimensions from 'Dimensions';
import ECharts from 'native-echarts';
import Orientation from 'react-native-orientation';
var {width, height} = Dimensions.get('window');

//  图表模块
export default class LineChart extends Component {


    // componentWillMount() {
    //     Orientation.lockToLandscape();
    // }
    //
    //
    // componentWillUnmount() {
    //    Orientation.lockToPortrait();
    // }

    constructor(props) {
        super(props);
        this.state = {
            // 默认属性及数量
            xAxisData:[],
            data:[],

            xAxisData: [],
            data: [],
        };
        var _this = this;
        //AsyncStorage.getItem("userKey",function(errs,result){
                //console.info(result);
                //if (!errs) {
                    fetch("http://rapapi.org/mockjsdata/16979/weather/history")
                        .then((response) => response.json())
                        .then((responseJson) => {
                            _this.setState({
                                xAxisData: responseJson.data.time,
                                data: responseJson.data.temp,
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
        Orientation.lockToPortrait();
        this.props.navigator.pop();
    }

    render() {
        var option = {
            title: {
                show: false
            },
            legend: {
                show: false
            },
            grid:{
                // show: true,
                left:30,
                rright:30,
                top:50,
                bottom:80,
                containLabel: true,
            },
            xAxis: {
                data: this.state.xAxisData,
                name:"时间",
                boundaryGap: false,
                // splitLine:{                  //设置折线图竖直线
                //     show:true,
                // },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                },
                name:"温度",
                splitLine:{
                    show:true
                },
            },
            dataZoom: [
                {
                    type: 'inside',

                }
            ],
            color: ["rgb(92,182,164)"],
            series: [{
                name: '温度',
                type: 'line',
                clipOverflow: true,
                smooth: true,
                symbol: 'none',
                areaStyle: { normal: { color: "rgb(200,232,226)" } }, //曲线下方的面积的颜色
                data: this.state.data,
                itemStyle : { normal: {label : {show: false}}},
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                },
                label: {
                    normal: {
                        show: false,
                        formatter: "{c}℃"
                    }
                }
            }]
        }

        return (
            <View style={styles.container}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 20, height: 20, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>历史能耗曲线</Text>
                    <Image style={{ width: 20, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')}/>
                </View>
                <ECharts option={option} height={width}/>
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
        backgroundColor: '#343439',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth:0.1,
        borderColor: '#000000',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
});

