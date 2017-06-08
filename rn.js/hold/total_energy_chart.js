/**
 * Created by Vector on 17/4/19.
 */
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, AsyncStorage} from 'react-native';


import Dimensions from 'Dimensions';

var {width, height} = Dimensions.get('window');

import ECharts from 'native-echarts';

export default class TotalEnergyChart extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            xAxisData:[],
            data:[],

            access_token: null,
            company_id: null,

            url: "http://121.42.253.149:18816/v1_0_0/dayDatas?access_token="
        };


        // 从本地存储中将company_id和access_token取出
        var _this = this;
        AsyncStorage.getItem("access_token",function(errs,result){
            if (!errs) {
                _this.setState({access_token:result});
            }
            _this.setState({
                url: _this.state.url+_this.state.access_token,
            })
            console.log(_this.state.url);
        });

        AsyncStorage.getItem("company_id",function(errs,result){
            if (!errs) {
                _this.setState({company_id:result});
            }

            _this.setState({
                url: _this.state.url+"&_id="+_this.state.company_id+"&tag_id=2&level=0&start_time=2017$04$20&end_time=2017$04$31",
            })

            console.log(_this.state.url);

            if (!errs) {
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

                        console.log(_this.state.xAxisData);
                        console.log(_this.state.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
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
                        top:0,
                },
            grid:{
                    show: false,
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
                    // markPoint : {
                    //     data : [
                    //         {type : 'max', name: '最大值',symbolSize:30},
                    //         {type : 'min', name: '最小值',symbolSize:30}
                    //     ]
                    // },
                    itemStyle: {
                        normal: {
                            color: '#35aeff'
                        }
                    },
                    data: this.state.data
                }
            ]
        };
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