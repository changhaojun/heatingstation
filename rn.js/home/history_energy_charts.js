/**
 * Created by Vector on 17/4/24.首页分公司列表进入的历史能耗图表
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
    StatusBar,
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
            data_unit:'',

            companyName: '城北分公司',

            // 121.42.253.149:18816

            url: "http://121.42.253.149:18816/v1_0_0/hourDatas?access_token="
        };

        var _this = this;

        // 从本地存储中将company_id和access_token取出

        AsyncStorage.getItem("access_token",function(errs,result){
            if (!errs) {
                _this.setState({access_token:result});
            }
            _this.setState({
                url: _this.state.url+_this.state.access_token+"&_id="+_this.props.company_id+"&tag_id=2&level=1&start_time=2017$04$26$13:31:54&end_time=2017$04$26$20:31:54",
            })

            if (!errs) {
                fetch(_this.state.url)
                    .then((response) => response.json())
                    .then((responseJson) => {

                        //输出获取到的数据
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
                            // data_unit: responseJson[0].data_unit,
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

            console.log(_this.state.url);
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
                // show: true,
                left:40,
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
                    formatter: '{value}'
                },
                name:"能耗单位：GJ",
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
                <View style={styles.companyNameView}>
                    <Text style={styles.companyNameText}>{this.props.company_name}</Text>
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

