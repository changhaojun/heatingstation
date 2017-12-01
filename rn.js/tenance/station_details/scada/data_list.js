/**
 * Created by Vector on 17/4/18.首页
 */

// 分公司列表页面
import React from 'react';
import { View, Text, Image, Platform, NavigatorIOS, StyleSheet, TouchableOpacity, ListView, AsyncStorage, Navigator } from 'react-native';
import Dimensions from 'Dimensions';
import Orientation from 'react-native-orientation';
const Alert = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();
import Constants from './../../../constants';
import HeatStationChart from '../heat_station_chart';

const { width, height } = Dimensions.get('window');

export default class DataList extends React.Component {

    // componentWillUnmount() {
    //     Orientation.lockToLandscape();
    // }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataTime: "",
            groupList: [],
        };

        const _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var uri = Constants.serverSite + "/v1_0_0/tagGroup?access_token=" + result;
                console.log(uri);
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        var groupList = [];
                        for (var i = 0; i < responseJson.length; i++) {
                            groupList = groupList.concat(responseJson[i].child);
                        }
                        var uri = Constants.serverSite + "/v1_0_0/station/" + _this.props.station_id + "/datas?access_token=" + result;
                        console.log(uri);
                        fetch(uri)
                            .then((response) => response.json())
                            .then((responseJson) => {
                                console.log(responseJson);
                                for (var i = 0; i < responseJson.length; i++) {
                                    if (responseJson[i].data_type != 3) {
                                        for (var j = 0; j < groupList.length; j++) {
                                            if (i == 0) { groupList[j].data = [] }
                                            if (groupList[j].id == responseJson[i].group_id) {
                                                groupList[j].data.push(responseJson[i]);
                                            }
                                        }
                                    }
                                }
                                _this.setState({
                                    dataTime: responseJson[0].data_time,
                                    groupList: groupList,
                                });
                            })
                            .catch((error) => {
                                console.error(error)
                                Alert.alert(
                                    '提示',
                                    '网络连接错误，获取列表数据失败',
                                );
                            });
                    })
                    .catch((error) => {
                        console.error(error)
                        Alert.alert(
                            '提示',
                            '网络连接错误，获取列表数据失败',
                        );
                    });

            }
        });
    }

    // 点击跳转到详细信息图表
    pushToChart(tag_id, tag_name) {
        this.props.navigator.push({
            component: HeatStationChart,
            passProps: {
                tag_id: tag_id,
                station_id: this.props.station_id,
                tag_name: tag_name,
                station_name: this.props.station_name
            }
        })
    }

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={styles.all}>
                <View style={styles.timeView}>
                    <Image style={styles.image} source={require('./../../../icons/ico_time.png')} />
                    <Text style={styles.timeText}>{this.state.dataTime}</Text>
                </View>

                <ListView
                    dataSource={ds.cloneWithRows(this.state.groupList)}
                    enableEmptySections={true}
                    renderRow={(rowData, j, i) => {
                        return (
                            rowData.data.length ? <View >
                                <TouchableOpacity style={styles.groupView} onPress={() => { var list = this.state.groupList; list[i].show = !list[i].show; this.setState({ groupList: list }) }}>
                                    <Image style={{ width: 15, height: 15, }} resizeMode="contain" source={require('../../../icons/contrast_ico_bg.png')} />
                                    <Text style={{ fontSize: 15, paddingLeft: 5, height: 20, color: "#919293", flex: 1 }}>{rowData.group_name}</Text>
                                    <Image style={{ width: 18, height: 15, }} resizeMode="contain" source={!rowData.show ? require('../../../icons/contrast_ico_up.png') : require('../../../icons/contrast_ico_down.png')} />
                                </TouchableOpacity>
                                {!rowData.show ?<ListView
                                    initialListSize={200}
                                    dataSource={ds.cloneWithRows(rowData.data)}
                                    enableEmptySections={true}
                                    contentContainerStyle={styles.listView}
                                    renderRow={(rowData) => {
                                        return (
                                            <TouchableOpacity style={styles.item} onPress={this.pushToChart.bind(this, rowData.tag_id, rowData.tag_name)}>
                                                <View style={styles.line} />
                                                <View style={styles.itemContent} >
                                                    <Text style={styles.value}>{rowData.data_value}{rowData.data_unit}</Text>
                                                    <Text style={styles.text1}>{rowData.tag_name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />:null}
                            </View> : null
                        )
                    }}
                />
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#fff",
    },
    listView: {
        //marginTop: 10,
        // 主轴方向
        flexDirection: 'row',
        // 一行显示不下,换一行
        flexWrap: 'wrap',
        //horizontal :true,
        // 侧轴方向
        alignItems: 'flex-start', // 必须设置,否则换行不起作用
    },
    item: {
        height: 80,

        width: width / 3,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: "#e7e7e766",

    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    line: {
        height: 25,
        width: 3,
        backgroundColor: "#00b5fc",
    },
    image: {
        marginRight: 10,
        width: 15,
        height: 15,
    },
    text1: {
        fontSize: 15,
        color: "#5e5c68",
    },
    value: {
        fontSize: 16,
        color: "#00b5fc",
    },
    timeText: {
        fontSize: 14,
        color: "#656565",
        //lineHeight: 20,
    },

    timeView: {
        alignItems: "center",
        flexDirection: 'row',
        height: 35,
        justifyContent: 'center',
        backgroundColor: "#fff"
    },
    groupView: {
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderTopWidth: 10,
        borderColor: "#e7e7e766",
    }




});