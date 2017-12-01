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
import Orientation from 'react-native-orientation';

const Alert = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();

const { width, height } = Dimensions.get('window');
export default class ContrastChart extends React.Component {

    componentWillMount() {
        Orientation.lockToLandscape();
    }

    constructor(props) {
        super(props);
        var xData = [];
        var stationValues = [];
        for (let i in this.props.data) {
            var valueList=this.props.data[i].station_name.split("");
            var value="";
            for(var j=0;j<valueList.length;j++){
                value=value+valueList[j]+"\n";
            }
            xData.push(value);
            stationValues.push(this.props.data[i].data_value);
        }
        this.state = {
            xData: xData,
            stationValues: stationValues
        }
    }


    back() {
        Orientation.lockToPortrait();
        this.props.navigator.pop();
    }

    render() {

        var option = {
            backgroundColor: '#0071b2',//背景色
            grid: {
                left: 20,
                right: 60,
                top: 20,
                bottom: 100,
                containLabel: true,
                borderColor: "#998cbf",
            },
            xAxis: {
                data: this.state.xData,
                name: "换热站",
                axisLine: { lineStyle: { color: "#118cbf" } },
                nameTextStyle: { color: "#fff" },
                axisLabel: {
                    inside: true, textStyle: { color: "#005192" }, interval: 0,rotate:90
                    // formatter: function (val) {
                    //     return  val.split("").join("\n");
                    // },//使用这个之后图表不显示了
                    
                },
                z:90
            },
            yAxis: {
                axisLabel: { textStyle: { color: "#fff" } },
                axisLine: { lineStyle: { color: "#118cbf" } },
                nameTextStyle: { color: "#fff" },
            },
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    minValueSpan: 10,
                    maxValueSpan: 20,
                    startValue: 0,
                    endValue: 15,
                    zoomLock: true
                }
            ],
            series: [
                { // For shadow
                    type: 'bar',
                    data: this.state.stationValues,
                    itemStyle: {
                        normal: { color: "#fff" }
                    },
                    barMaxWidth: 20,

                }
            ]
        };
        return (
            <View>
                <TouchableOpacity style={styles.navView} activeOpacity={0.5} onPress={this.back.bind(this)}>
                    <Image style={{ width: 10, height: 18, marginLeft: 10, }} source={require('../icons/nav_back_icon.png')} />
                    <Text style={styles.reText}>对比分析</Text>
                </TouchableOpacity>
                <View style={styles.chartView}>
                    <Echarts option={option} height={width} />
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
        backgroundColor: "#0071b2"
    },
    reText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 5
    }
});