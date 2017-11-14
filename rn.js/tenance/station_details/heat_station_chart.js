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
var month = d.getMonth()+1;
var day = d.getDate();
var h = d.getHours();
var m = d.getMinutes();
var s = d.getSeconds();
var start_time = year + "$" + month + "$" + day + "$" + h + ":" + m + ":" + s;


var start_time_stamp = d.getTime();
var end_time_stamp = new Date(start_time_stamp - 4*3600*1000);
var end_time_year = end_time_stamp.getFullYear();
var end_time_month = end_time_stamp.getMonth()+1;
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
            xArr:[],
            yArr:[],
            xUnit:'时间',
            yUnit:'',
            yLabel:'',
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


                        if (responseJson.length > 0)
                        {
                            for (var i = 0; i < responseJson.length; i++) {
                                xArr.push(responseJson[i].create_date);
                                yArr.push(responseJson[i].data_value);
                            }

                            yUnit = responseJson[0].data_unit;
                        }
                        else
                        {
                            Alert.alert(
                                '',
                                '暂无图表数据',
                            );
                        }


                        _this.setState({
                            xArr:xArr,
                            yArr:yArr,
                            yUnit:yUnit,
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
            title: {
                show:false
            },
            legend: {
                show:false
            },
            grid:{
                left:50,
                right:50,
                top:50,
                bottom:80,
                containLabel: true,
            },
            xAxis: {
                data: this.state.xArr,
                name: this.state.xUnit,
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'+ this.state.yUnit
                },
                name: this.props.tag_name + "/" + this.state.yUnit,
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
                // name: '温度',
                type: 'line',
                clipOverflow: true,
                smooth: true,
                symbol: 'none',
                //areaStyle: { normal: { color: "rgb(200,232,226)" } }, //曲线下方的面积的颜色
                data: this.state.yArr,
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
            }]
        };

        return(
            <View>
                <View style={styles.navView}>
                    <TouchableOpacity activeOpacity={0.5} onPress={this.back.bind(this)}>
                    <Image style={{width:30,height:25,marginLeft:10,marginTop:15}} source={require('../../icons/back.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.chartView}>
                    <Echarts option={option} height={width} />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    navView:{
        width:height,
        height:50,
        backgroundColor:"#434b59",
        flexDirection:"row",
        alignItems:'center'
    },
    chartView:{
        width:height,
        height:width-50,
        backgroundColor:"#ffffff"
    }
});