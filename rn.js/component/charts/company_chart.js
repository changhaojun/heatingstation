/**
 * Created by Vector on 17/5/16.
 *
 * 地图页面总公司的能耗图表
 */
import React, { Component } from 'react';
import { StyleSheet, Text, AlertIOS,View, AsyncStorage, StatusBar, NativeModules, TouchableOpacity, Image, Dimensions } from 'react-native';
import Echarts from 'native-echarts';
var {width, height} = Dimensions.get('window');
import Orientation from 'react-native-orientation';

export default class CompanyChart extends Component {

    componentWillMount() {
            Orientation.lockToLandscape();
        }

    constructor(props) {
        super(props);
        this.state = {
            xAxisData: [],
            data: [],

            access_token: null,
            url: "http://121.42.253.149:18816/v1_0_0/dayDatas?access_token=",
        };

        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                _this.setState({
                    access_token:result
                });
                _this.setState({
                    url: _this.state.url+_this.state.access_token+"&_id="+_this.props.station_id+"&tag_id=2&level=0&start_time=2017$04$20&end_time=2017$04$31",
                })
                console.log(_this.state.url);

                fetch(_this.state.url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        var arrX = [];
                        var arrY = [];
                        for(var i=0; i<responseJson.length-1; i++){

                            arrX.push(responseJson[i].create_date);
                            arrY.push(responseJson[i].data_value);

                        }
                        _this.setState({
                            xAxisData:arrX,
                            data: arrY,
                        });
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
                show: true,
                left:30,
                // right:30,
                top:30,
                bottom:80,
                containLabel: true,
            },
            xAxis: {
                show: true,
                data: this.state.xAxisData,
                name:"时间",
                boundaryGap: false,
                splitLine:{                  //设置折线图竖直线
                    show:false,
                },
            },
            yAxis: {
                show: true,
                type: 'value',
                axisLabel: {
                    formatter: '{value} GJ'
                },
                name:"能耗",
                splitLine:{
                    show:true,
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
                        <Image style={{ width: 20, height: 20, marginLeft:10,marginTop: 10, }} source={require('../../icons/nav_back_icon@2x.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>历史能耗图表</Text>
                    <Image style={{ width: 20, height: 20, marginRight:10,marginTop: 10, }} source={require('../../icons/nav_flag.png')}/>
                </View>
                <View style={styles.companyNameView}>
                    <Text style={styles.companyNameText}>{this.props.station_name}</Text>
                </View>
                <View style={styles.selectView}>
                    <Text style={styles.selectText}>指标</Text>
                    <Image source={require('../../icons/real_energy_icon.png')} style={styles.indicatorsImage}></Image>
                    <Text style={styles.changeText}>实际能耗</Text>
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
    },
    selectView:{
        height: 24,
        width: height,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
    },
    selectText:{
        fontSize: 16,
        color: '#000000',
        marginLeft: 15,
    },
    indicatorsImage:{
        width:16,
        height:16,
        marginLeft:10,
    },
    changeText:{
        fontSize: 16,
        color: '#000000',
        marginLeft: 6,
    }
});
