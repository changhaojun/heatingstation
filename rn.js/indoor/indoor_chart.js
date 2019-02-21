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
import Constants from './../constants';
import moment from 'moment';
// const Alert = Platform.select({
//   ios: () => require('AlertIOS'),
//   android: () => require('Alert'),
// })();

const { width, height } = Dimensions.get('window');


var d = new Date();
var start_time = moment(d).format("YYYY-MM-DD HH:mm:ss");
var start_time_stamp = d.getTime();
var end_time_stamp = new Date(start_time_stamp - 24 * 3600 * 1000);
var end_time = moment(end_time_stamp).format("YYYY-MM-DD HH:mm:ss");

export default class DataList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      xArr: [],
      yArr: [],
      yLabel: '',
      prompt: "加载中……"
    };
    this.getData();
  }
  getData() {
    const _this = this;
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        var uri = Constants.indoorSite+"/v2/historyData/"+_this.props.data_id+"?access_token="+result+"&start="+end_time+"&end="+start_time;
        console.log(uri);
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            if (responseJson.result.times.length > 0) {
              for (let index = 0; index < responseJson.result.times.length; index++) {
                responseJson.result.times[index]=moment(responseJson.result.times[index]).format("HH:mm");
              }
              _this.setState({
                xArr: responseJson.result.times,
                yArr: responseJson.result.datas,
                yUnit: "",
              });
            }
            else {
              _this.setState({ prompt: "暂无历史数据" });
            }
            
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
  render() {
    var option = {
      backgroundColor: '#FFF',//背景色
      title: {
        show: false
      },
      legend: {
        show: false
      },
      grid: {
        left: 10,
        right: 20,
        top: 20,
        bottom: 0,
        containLabel: true,
        borderColor: "#998cbf"
      },
      xAxis: {
        data: this.state.xArr,
        boundaryGap: false,
        axisLine: { show: false,lineStyle: { color: "#fff" } },
        nameTextStyle: { color: "#000" },
        axisLabel: { textStyle: { color: "#7f8da5" } },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: { textStyle: { color: "#7f8da5" }, formatter: '{value}' },
        splitLine: { show: true, lineStyle: { color: "#eee" } },
        axisLine: {show: false, lineStyle: { color: "#eee" } },
        nameTextStyle: { color: "#000" },
      },
      dataZoom: [
        {
          type: 'inside',
        }
      ],
      color: [ "#00b5fc" ],
      series: [ {
        // name: '温度',
        type: 'line',
        clipOverflow: true,
        //smooth: true,
        symbol: 'none',
        areaStyle: { normal: { color: "#bbe4f8" } }, //曲线下方的面积的颜色
        data: this.state.yArr,
        itemStyle: { normal: { label: { show: false } } },
        markPoint: {
          symbol: "circle",
          symbolSize: 12,
          label: { normal: { show: false } },
          itemStyle: { normal: { color: "#ffffff", borderColor: "#00b5fc", borderWidth: 3, borderType: "dashed", shadowBlur: 10, shadowColor: 'rgba(225, 225, 225, 0.5)' } },
          // data: [
          //   { type: 'average', name: '平均值' },
          // ]
        },
        // lineStyle: {
        //   normal: {
        //     color: "#c1d7e1",
        //     shadowColor: "#00508a88",
        //     shadowOffsetY: 25,
        //     shadowBlur: 50
        //   }
        // },

      } ]
    };
console.log(option)
    return (
      <View>
        <View style={styles.chartView}>
          {this.state.xArr.length ? <Echarts option={option} height={225} /> : <Text style={{ color: "#000" }}>{this.state.prompt}</Text>}
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  navView: {
    width: height,
    height: 40,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: 'center'
  },
  chartView: {
    width: width,
    height: width * 9 / 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center"
  },
  reText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5
  }
});