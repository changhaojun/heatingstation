/**
 * 换热站tab框架页面
 *
 *
 * 首页-【热耗】子模块
 *
 * 2017/11/4修改 by Vector.
 *      1、删除无用的模块的导入
 *      2、对获取到的数据进行判断,防止页面渲染时因无数据造成的渲染错误
 *      3、删除多余注释
 *
 * 2017/11/6修改 by Vector.
 *      1、修复热耗进度条越界的问题
 *
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    ListView,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import Dimensions from 'Dimensions';
import Constants from '../constants';
import Echarts from 'native-echarts';
const colors=['#5ca5b4', '#f4bf30'];
const { width, height } = Dimensions.get('window');

export default class StationTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onshow: 0,
            company_code: "000005",
            data1: [],
            data2: [],
            data3: [],
        };
        const _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {
                _this.setState({ company_code: result })
            }
        });
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var url = Constants.serverSite + "/v1_0_0/stationTopData?tag_id=2&company_code=" + _this.state.company_code + "&access_token="+result
                fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.length > 0)
                        {
                            _this.setState({
                                data1: responseJson
                            });
                        }
                        else
                        {
                            Alert.alert(
                                '提示',
                                '暂无热耗数据'
                            )
                        }

                    })
                    .catch((error) => {
                        console.error(error);
                    });

                url = Constants.serverSite + "/v1_0_0/stationTopData?tag_id=14&company_code=" + _this.state.company_code + "&access_token="+result
                fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ data2: responseJson })
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                url = Constants.serverSite + "/v1_0_0/stationTopData?tag_id=17&company_code=" + _this.state.company_code + "&access_token="+result
                fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ data3: responseJson })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        )
    }

    getOption(chartData,i) {
        return {
            color: colors,
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                height: "75%",
                bottom: '5%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true // 保证刻度线与刻度标签的对齐
                    },
                    axisLine: {
                        lineStyle: {
                            color: colors[i]
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#bbbbbb'
                        }
                    },
                    data: function () {
                        var result = [];
                        for (var i = 0; i < chartData.length; i++) {
                            result.push(chartData[i].station_name);
                        }
                        return result;
                    }()
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: i?'一网温差(℃)':"二网供温(℃)",
                    axisLine: {
                        lineStyle: {
                            color: colors[i]
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#eee",
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisLabel: {
                        textStyle: { // 改变想轴label的字体样式
                            color: '#bbbbbb'
                        },
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '面积(万㎡)',
                    splitLine: { show: false }, // 去除网格中的坐标线
                    axisLine: {
                        lineStyle: {
                            color: colors[i]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            fontSize: 12, // 让字体变大
                            fontFamily: "Microsoft YaHei",
                            color: '#bbbbbb'
                        }
                    }
                },

            ],
            series: [
                {
                    type: 'bar',
                    yAxisIndex: 0,
                    smooth:true, // 使折线平滑
                    itemStyle: { // 改变柱状图的颜色以及透明度
                        normal: {
                            color: colors[i],
                            opacity: 0.5
                        }
                    },
                    data: function () {
                        var result = [];
                        for (var i = 0; i < chartData.length; i++) {
                            result.push(chartData[i].data_value);
                        }
                        return result;
                    }()
                },
                {
                    name: '面积',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: { normal: {} },
                    itemStyle: {
                        normal: {
                            color: colors[i],
                            lineStyle: {
                                color: colors[i],
                                opacity: 0.55
                            }
                        }
                    },
                    data: function () {
                        var result = [];
                        for (var i = 0; i < chartData.length; i++) {
                            result.push(chartData[i].total_area);
                        }
                        return result;
                    }()
                }
            ],
            animation:false
        };
    }
    _switch(position, noScroll) {
        if (!(noScroll)) this.scrollView.scrollTo({ x: position * width, y: 0, animated: true });
        this.setState({ onshow: position })
    }

    onScroll(x) {
      console.log(x)
      if (!x % width||(x+10) % width<30) {
        this._switch(parseInt((x+10) / width), true);
      }
    }

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={styles.all}>
                <View style={styles.topView}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this._switch.bind(this, 0, false)}>
                        <View style={styles.topViewItem}>
                            <Text style={this.state.onshow == 0 ? styles.topTextSelection : styles.topTextNormal}>热耗TOP</Text>
                        </View>
                        <View style={this.state.onshow == 0 ? styles.topViewSelection : styles.topViewNormal}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this._switch.bind(this, 1, false)}>
                        <View style={styles.topViewItem}>
                            <Text style={this.state.onshow == 1 ? styles.topTextSelection : styles.topTextNormal}>二网供温BOTTOM</Text>
                        </View>
                        <View style={this.state.onshow == 1 ? styles.topViewSelection : styles.topViewNormal}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this._switch.bind(this, 2, false)}>
                        <View style={styles.topViewItem}>
                            <Text style={this.state.onshow == 2 ? styles.topTextSelection : styles.topTextNormal}>一网温差TOP</Text>
                        </View>
                        <View style={this.state.onshow == 2 ? styles.topViewSelection : styles.topViewNormal}></View>
                    </TouchableOpacity>
                </View>
                <ScrollView ref={scrollView => this.scrollView = scrollView} horizontal={true} pagingEnabled={true} onScroll={(data) => { this.onScroll(data.nativeEvent.contentOffset.x); }}>
                    <View style={styles.itemStyle}>
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.data1)}
                            enableEmptySections={true}
                            renderRow={(rowData) => {
                                return (
                                    <View style={{ paddingLeft: 15, }}>
                                        <Text style={{ fontSize: 13, color: "#777777", lineHeight: 20 }}>{rowData.station_name}</Text>
                                        <View style={{ flexDirection: 'row', }}>
                                            <View style={{ height: 10, width: 250, backgroundColor: "#f3f7fa" }}><View style={{ height: 10, width: 200 * rowData.data_value / this.state.data1[0].data_value, backgroundColor: "#53cbff" }} /></View>
                                            <Text style={{ marginLeft: 5, fontSize: 10, color: "#777777", lineHeight: 10, }}>{rowData.data_value}GJ</Text>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <View style={styles.itemStyle}><Echarts option={this.getOption(this.state.data2,0)} width={width} height={160} /></View>
                    <View style={styles.itemStyle}><Echarts option={this.getOption(this.state.data3,1)} width={width} height={160} /></View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    all: {
        height: 200,
        width: width,
        backgroundColor: "#fff",
        marginTop: 5,
    },
    topView: {
        width: this.window.width,
        height: 38,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea"
    },
    topViewItem: {
        flex: 1,
        justifyContent: 'center',
    },
    topTextNormal: {
        height: 20,
        color: "#000",
        textAlign: 'center',
    },
    topTextSelection: {
        height: 20,
        color: "#35aeff",
        textAlign: 'center',
    },
    topViewNormal: {
        width: width / 3,
        height: 1,
        backgroundColor: "#fff",
    },
    topViewSelection: {
        width: width / 3,
        height: 1,
        backgroundColor: "#35aeff",
    },
    itemStyle: {
        flex: 1,
        width: width,
    },
    topSides: {
        width: 18,
        height: 18,
        marginLeft: 10,
        marginRight: 10,
    },
    topText: {
        color: "#ffffff",
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 4,
    },
    topRow: {
        width: width,
        height: 50,
        backgroundColor: '#000000',
        alignItems: 'center',
        flexDirection: 'row',
    }
});