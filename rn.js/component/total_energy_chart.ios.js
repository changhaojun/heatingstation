/**
 * Created by Vector on 17/4/19.
 */
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar,} from 'react-native';


import Dimensions from 'Dimensions';

var {width, height} = Dimensions.get('window');

import ECharts from 'native-echarts';

export default class TotalEnergyChart extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            xAxisData:[],
            data:[],
        };

        var _this = this;
        fetch("http://rapapi.org/mockjsdata/16979/v1_0_0/chart")
            .then((response) => response.json())
            .then((responseJson) => {
                _this.setState({
                    xAxisData: responseJson.coordinate[0].xAxisData,
                    data: responseJson.coordinate[0].yAxisData,
                });
                // console.log(_this.state.xAxisData);
                // console.log(_this.state.data);
            })
            .catch((error) => {
                // console.error(error);
                // AlertIOS.alert(
                //     '提示',
                //     '网络连接失败',
                // );
            });
    }

    render() {
        var option = {
            title: {
                        show: true,
                        text: '西安总公司',
                        subtext: '实际总能耗图表',
                        textStyle: {
                            fontWeight: '400',
                            color: '#ffffff',
                            fontSize: 16,

                        },
                        subtextStyle:{
                            fontWeight: '400',
                            color: '#ffffff',
                            fontSize: 16,
                        },
                        itemGap: 2,
                        left:20,
                        top:-4,
                },
            grid:{
                    show: true,
                    left:0,
                    right: 0,
                    bottom:0,
                    top:0,
                    //backgroundColor: '#343439'
            },
            backgroundColor: '#343439',
            xAxis: {
                name:"日期",
                type: 'category',
                boundaryGap: false,
                data: this.state.xAxisData,
                show: false,
            },
            yAxis: {
                name: '能耗',
                boundaryGap: [0, '50%'],
                type: 'value',
                show: false,
            },
            series: [
                {
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    stack: 'a',
                    areaStyle: {
                        normal: {}
                    },
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值',symbolSize:30},
                            {type : 'min', name: '最小值',symbolSize:30}
                        ]
                    },
                    itemStyle: {
                        normal: {
                            color: '#E4C095'
                        }
                    },
                    data: this.state.data
                }
            ]
        };
        // var option = {
        //     title: {
        //         show: true,
        //         text: '西安总公司',
        //         subtext: '实际总能耗图表',
        //         textStyle: {
        //             fontWeight: '400',
        //             color: '#3d3d3d',
        //             fontSize: 16,
        //
        //         },
        //         subtextStyle:{
        //             fontWeight: '400',
        //             color: '#3d3d3d',
        //             fontSize: 16,
        //         },
        //         itemGap: 5,
        //         left:20,
        //     },
        //     legend: {
        //         show: false
        //     },
        //     grid:{
        //         show: true,
        //         top:30,
        //         right: 50,
        //         bottom:90,
        //         top:80,
        //         backgroundColor: '#f2d6b8'
        //     },
        //     xAxis: {
        //         data: this.state.xAxisData,
        //         name:"日期",
        //         axisLabel:{
        //             show:true,
        //             textStyle:{
        //                 color: 'rgb(248,201,78)',
        //             },
        //             rotate: 0,
        //             onZero: true,
        //         },
        //     },
        //     yAxis: {
        //         type: 'value',
        //         scale:true,
        //         name: '能耗',
        //         axisLabel:{
        //             inside: false,
        //             show:true,
        //             textStyle:{
                        {/*color: 'rgb(200,119,17)',*/}
                    {/*},*/}
                {/*}*/}
            {/*},*/}
            {/*dataZoom: [*/}
                {/*{*/}
                    {/*type: 'inside',*/}
                {/*}*/}
            {/*],*/}
            {/*color: [], // 设置这折线的构造颜色*/}
            {/*series: [{*/}
                {/*name: '温度',*/}
                {/*type: 'line',*/}
                {/*clipOverflow: false,*/}
        //         smooth: true,
        //         areaStyle: { normal: { color: "#E4C095" } },//曲线下方的面积的颜色
        //         data: this.state.data,
        //         label: {
        //             normal: {
        //                 show: true,
        //             }
        //         }
        //     }]
        // }
        return (
            <View>
                <ECharts option={option} height={200}/>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({

});