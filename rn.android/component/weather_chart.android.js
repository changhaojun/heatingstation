import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, NativeModules, TouchableOpacity, Image, Dimensions,} from 'react-native';
import Echarts from 'native-echarts';
var {width, height} = Dimensions.get('window');

var Orientation = NativeModules.Orientation;

export default class WeatherChart extends Component {

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
        Orientation.transverse();
        var _this = this;
        AsyncStorage.getItem("userKey", function (errs, result) {
            console.info(result);
            if (!errs) {
                fetch("http://114.215.154.122/reli/android/androidAction?type=getHourlyWeather&userKey=0db71a843c04420cb16b516fb81c940b" +
                    "")
                    .then((response) => response.json())
                    .then((responseJson) => {
                        _this.setState({
                            xAxisData: responseJson.data.xData,
                            data: responseJson.data.temperature
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            }
        });

    }

    back(){
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
                top:50,
                bottom:100,
            },
            xAxis: {
                data: this.state.xAxisData,
                name:"时间"
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                },
                name:"温度"
            },
            dataZoom: [
                {
                    type: 'inside',

                }
            ],
            color: ["#d48265"],
            series: [{
                name: '温度',
                type: 'line',
                clipOverflow: false,
                smooth: true,
                //areaStyle: { normal: { color: "#111111" } },曲线下方的面积的颜色
                data: this.state.data,
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
                        show: true,
                        formatter: "{c}℃"
                    }
                }
            }]
        }
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 20, height: 18, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>今日天气趋势</Text>
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')}/>
                </View>
                <Echarts option={option} height={width} />
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
        backgroundColor: '#f2d6b8',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth:0.1,
        borderColor: '#000000',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#000000",
        fontSize: 19,
    },
});
