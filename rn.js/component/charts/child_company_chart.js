/**
 * Created by Vector on 17/5/16.
 *
 * 地图页面子公司的能耗图表
 */
import React, { Component } from 'react';
import { StyleSheet, Text, AlertIOS,View, AsyncStorage, StatusBar, NativeModules, TouchableOpacity, Image, Dimensions } from 'react-native';
import Echarts from 'native-echarts';
var {width, height} = Dimensions.get('window');
import Orientation from 'react-native-orientation';

export default class ChildCompanyChart extends Component {

    // componentWillMount() {
    //     var initial = Orientation.getInitialOrientation();
    //     if (initial === 'PORTRAIT') {
    //         Orientation.lockToLandscape();
    //     } else {}}
    //
    // componentWillUnmount() {
    //     var initial = Orientation.getInitialOrientation();
    //     if (initial === 'PORTRAIT') {
    //         Orientation.lockToPortrait();
    //     } else {}}

    constructor(props) {
        super(props);
        this.state = {
            xAxisData: [],
            data: []
        };
        var _this = this;
        // AsyncStorage.getItem("userKey", function (errs, result) {
        //     console.info(result);
        //     if (!errs) {
        fetch("http://rapapi.org/mockjsdata/16979/weather/history")
            .then((response) => response.json())
            .then((responseJson) => {
                _this.setState({
                    xAxisData: responseJson.data.time,
                    data: responseJson.data.temp,
                });
            })
            .catch((error) => {
                // console.error(error);
                AlertIOS.alert(
                    '提示',
                    '获取天气历史数据失败',
                );

            });

        // }
        // });

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
                // right:30,
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
            <View style={styles.all}>
                <StatusBar
                    hidden={true}  //status显示与隐藏
                    backgroundColor='red'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='default' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 20, height: 20, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>今日天气趋势</Text>
                    <Image style={{ width: 20, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')}/>
                </View>
                <View style={styles.companyNameView}>
                    <Text style={styles.companyNameText}>西安</Text>
                </View>
                <Echarts option={option} height={width-44} />
            </View>
        );
    }
}
// 样式
const styles = StyleSheet.create({
    all: {
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
    companyNameView:{
        height: 44,
        width: height,
        backgroundColor: "#f9f9f9",
        flexDirection: "row",
        alignItems: "center",
    },
    companyNameText:{
        fontSize: 16,
        color: '#000000',
        marginLeft: 15,
    }
});
