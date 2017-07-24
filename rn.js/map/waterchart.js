/**
 * Created by Vector on 17/5/16.
 *
 * 地图页面支线的能耗图表
 */
import React, { Component } from 'react';
import { StyleSheet, Text, AlertIOS, View, AsyncStorage, StatusBar, NativeModules, TouchableOpacity, Image, Dimensions } from 'react-native';
import Echarts from 'native-echarts';
var { width, height } = Dimensions.get('window');
import Orientation from 'react-native-orientation';

var colors = ['#ce6c49', '#80b2b9', '#1495d6'];
export default class MapChart extends Component {

    componentWillMount() {
        Orientation.lockToLandscape();
    }

    constructor(props) {
        super(props);
        this.state = {
            xAxisData: [],
            data1: [],
            data2: [],
            data3: [],
        };

        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                console.log("http://121.42.253.149:18816/v1_0_0/v1_0_0/2d?access_token=" + result + "&branch_id=" + props._id + "&time=" + new Date().getFullYear() + "$" + new Date().getMonth() + 1 + "$" + new Date().getDate());
                fetch("http://121.42.253.149:18816/v1_0_0/2d?access_token="+result+"&branch_id=590164c45f8d5e2ab842ee57&time=2017$04$26")
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        var xAxisData=[], data1=[], data2=[], data3=[];
                        for (var i = 0; i < responseJson.length - 1; i++) {
                            xAxisData.push(responseJson[i].station_name);
                            data1.push(responseJson[i].pro_pressure_value[0]);
                            data2.push(responseJson[i].back_pressure_value[0]);
                            data3.push(responseJson[i].station_elevation_value);
                        }
                        console.log(xAxisData.length+""+data1.length+data2.length+data3.length)
                        _this.setState({
                            xAxisData: xAxisData,
                            data1: data1,
                            data2: data2,
                            data3: data3,
                        })
                    })
                    .catch((error) => {
                        AlertIOS.alert(
                            '提示',
                            '获取历史能耗数据失败',
                        );

                    });
            }
        });
    }

    back() {
        Orientation.lockToPortrait();
        this.props.navigator.pop();
    }

    render() {
        var option = {
            color: colors,//重新定义颜色
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'cross' // 默认为直线，可选为：'line' | 'shadow' | 'cross'
                }
            },
            legend: {
                data: ['供水压力', '回水压力', '地势标高']//图表标题
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: 60,
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisLabel: {
                    interval: 0,
                    //rotate:-45
                    textStyle: {
                        fontSize: 12,// 让字体变大
                        fontFamily: "Microsoft YaHei",
                        color: "#000"
                    }
                },
                data: this.state.xAxisData
            }],
            yAxis: [
                {
                    type: 'value',
                    //splitLine: { show: false }, //去除网格中的坐标线
                    name: '压力',
                    axisLabel: {//调整x轴的lable
                        //rotate:-45,//倾斜度 -90 至 90 默认为0
                        formatter: '{value}Kpa',
                        textStyle: {
                            fontSize: 12,// 让字体变大
                            fontFamily: "Microsoft YaHei",
                            color: "#000"
                        }
                    }
                },
                {
                    type: 'value',
                    name: '高度',
                    
                    //min: maxMin.station_elevation_min_value,
                    //max: maxMin.station_elevation_max_value,
                    splitLine: { show: false }, //去除网格中的坐标线
                    axisLabel: {
                        //rotate:-45,//倾斜度 -90 至 90 默认为0
                        formatter: '{value}m',
                        textStyle: {
                            fontSize: 12,// 让字体变大
                            fontFamily: "Microsoft YaHei",
                            color: "#000"
                        }
                    }
                },
            ],
            series: [
                {
                    name: '供水压力',//tips名称
                    type: 'bar',//图表形状
                    //stack: '压力',//表示可堆叠
                    barGap:"-100%",                    
                    yAxisIndex: 0,
                    data: this.state.data1
                },
                {
                    name: '回水压力',
                    type: 'bar',
                    yAxisIndex: 0,
                    //stack: '压力',
                    barGap:"-100%",                    
                    data: this.state.data2
                },
                {
                    name: '地势标高',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,//使折线平滑
                    data: this.state.data3,
                    itemStyle: {  //折线拐点的样式
                        normal: {
                            color: '#20aefc',  //折线拐点的颜色
                        }
                    },

                }
            ]
        };
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
                        <Image style={{ width: 20, height: 20, marginLeft: 10, marginTop: 10, }} source={require('../icons/nav_back_icon@2x.png')} />
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>水压图</Text>
                    <Image style={{ width: 20, height: 20, marginRight: 10, marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                </View>
                
                <Echarts option={option} height={width - 44} />
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
        borderBottomWidth: 0.1,
        borderColor: '#000000',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
    companyNameView: {
        height: 44,
        width: height,
        backgroundColor: "#f9f9f9",
        flexDirection: "row",
        alignItems: "center",
    },
    companyNameText: {
        fontSize: 16,
        color: '#000000',
        marginLeft: 15,
    },
    selectView: {
        height: 24,
        width: height,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
    },
    selectText: {
        fontSize: 14,
        color: '#000000',
        marginLeft: 15,
    },
    indicatorsImage: {
        width: 16,
        height: 16,
        marginLeft: 30,
    },
    changeText: {
        fontSize: 14,
        color: '#000000',
        marginLeft: 5,
    }
});
