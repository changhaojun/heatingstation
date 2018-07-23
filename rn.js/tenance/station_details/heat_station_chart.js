/**
 * Created by vector on 2017/11/2.
 * 换热站信息图标页面
 *
 *
 * 2017/11/10修改 by Vector.
 *      1、修改图表背景色
 */

import React from 'react';
import {
    Text,
    View,
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ListView,
    AsyncStorage,
    Dimensions
} from 'react-native';
import Echarts from 'native-echarts';
import Constants from '../../constants';
import Orientation from 'react-native-orientation';

const Alert = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();

const { width, height } = Dimensions.get('window');


var d = new Date();
var year = d.getFullYear();
var month = d.getMonth() + 1;
var day = d.getDate();
var h = d.getHours();
var m = d.getMinutes();
var s = d.getSeconds();
var start_time = year + "$" + month + "$" + day + "$" + h + ":" + m + ":" + s;


var start_time_stamp = d.getTime();
var end_time_stamp = new Date(start_time_stamp - 4 * 3600 * 1000);
var end_time_year = end_time_stamp.getFullYear();
var end_time_month = end_time_stamp.getMonth() + 1;
var end_time_day = end_time_stamp.getDate();
var end_time_h = end_time_stamp.getHours();
var end_time_m = end_time_stamp.getMinutes();
var end_time_s = end_time_stamp.getSeconds();
var end_time = end_time_year + "$" + end_time_month + "$" + end_time_day + "$" + end_time_h + ":" + end_time_m + ":" + end_time_s;

export default class DataList extends React.Component {

    componentWillMount() {
        Orientation.lockToLandscape();
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            xArr: [],
            yArr: [],
            xUnit: '时间',
            yUnit: '',
            yLabel: '',
            prompt:"加载中……"
        };

        const _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var uri = Constants.serverSite + "/v1_0_0/hourDatas?access_token=" + result + "&_id=" + _this.props.station_id + "&tag_id=" + _this.props.tag_id + "&start_time=" + end_time + "&end_time=" + start_time + "&level=3";
                console.log(uri);
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);

                        var xArr = [];
                        var yArr = [];
                        var yUnit;


                        if (responseJson.length > 0) {
                            responseJson.pop()
                            for (var i = 0; i < responseJson.length; i++) {
                                xArr.push(responseJson[i].create_date.split(" ")[1]);
                                yArr.push(responseJson[i].data_value);
                            }

                            yUnit = responseJson[0].data_unit?responseJson[0].data_unit:"";
                        }
                        else {
                            Alert.alert(
                                '',
                                '暂无图表数据',
                            );
                            _this.setState({prompt:"暂无数据"});
                        }


                        _this.setState({
                            xArr: xArr,
                            yArr: yArr,
                            yUnit: yUnit,
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        Alert.alert(
                            '提示',
                            '网络连接错误，获取列表数据失败',
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
            backgroundColor: '#0071b2',//背景色
            title: {
                show: false
            },
            legend: {
                show: false
            },
            grid: {
                left: 20,
                right: 50,
                top: 50,
                bottom: 80,
                containLabel: true,
                borderColor:"#998cbf"
            },
            xAxis: {
                data: this.state.xArr,
                name: this.state.xUnit,
                boundaryGap: false,
                axisLine:{lineStyle:{color:"#118cbf"}},
                nameTextStyle:{color:"#fff"},
                axisLabel:{textStyle:{color:"#fff"}},
            },
            yAxis: {
                type: 'value',
                scale:true,
                axisLabel: {textStyle:{color:"#fff"}, formatter: '{value}' + (this.state.yUnit?this.state.yUnit:"")},
                name: this.props.tag_name + (this.state.yUnit?"/" + this.state.yUnit:""),
                splitLine: {show: true,lineStyle:{color:"#118cbf"}},
                axisLine:{lineStyle:{color:"#118cbf"}},
                nameTextStyle:{color:"#fff"},
            },
            dataZoom: [
                {
                    type: 'inside',

                }
            ],
            color: ["rgb(92,182,164)"],
            series: [{
                // name: '温度',
                type: 'line',
                clipOverflow: true,
                //smooth: true,
                symbol: 'none',
                //areaStyle: { normal: { color: "rgb(200,232,226)" } }, //曲线下方的面积的颜色
                data: this.state.yArr,
                itemStyle: { normal: { label: { show: false }} },
                markPoint: {
                    symbol:"circle",
                    symbolSize:12,
                    label:{normal:{show:false}},
                    itemStyle:{normal:{color:"#ffffff",borderColor:"#6eb3d7",borderWidth:3,borderType:"dashed",shadowBlur:10,shadowColor: 'rgba(225, 225, 225, 0.5)'}},
                    data: [
                        { type: 'average', name: '平均值' },
                    ]
                },
                lineStyle: {
                    normal: {
                        color:"#c1d7e1",
                        shadowColor: "#00508a88", 
                        shadowOffsetY: 25,
                        shadowBlur:50 
                    }
                },

            }]
        };

        return (
            <View>
                <TouchableOpacity style={styles.navView} activeOpacity={0.5} onPress={this.back.bind(this)}>
                        <Image style={{ width: 10, height: 18, marginLeft: 10, }} source={require('../../icons/nav_back_icon.png')} />
                        <Text style={styles.reText}>{this.props.station_name}</Text>
                    </TouchableOpacity>
                <View style={styles.chartView}>
                    {this.state.xArr.length?<Echarts option={option} height={width} />:<Text style={{ color:"#fff"}}>{this.state.prompt}</Text>}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    navView: {
        width: height,
        height: 40,
        backgroundColor: "#434b59",
        flexDirection: "row",
        alignItems: 'center'
    },
    chartView: {
        width: height,
        height: width - 40,
        backgroundColor: "#0071b2",
        alignItems:"center",
        justifyContent:"center"
    },
    reText:{
        color:"#fff",
        fontSize:16,
        marginLeft:5
    }
});