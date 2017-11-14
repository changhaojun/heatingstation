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
            dataSource: ds.cloneWithRows([]),
            data: []
        };

        const _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var uri = Constants.serverSite + "/v1_0_0/station/" + _this.props.station_id + "/datas?access_token=" + result;
                console.log(uri);
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        var data = [];
                        for (var i = 0; i < responseJson.length; i++) {
                            if (responseJson[i].tag_id < 100) {
                                data.push(responseJson[i])
                            }
                        }
                        _this.setState({
                            data: data,
                            dataSource: ds.cloneWithRows(data),
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
    pushToChart(tag_id,tag_name) {
        this.props.navigator.push({
            component: HeatStationChart,
            passProps:{
                tag_id:tag_id,
                station_id:this.props.station_id,
                tag_name:tag_name,
            }
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.timeView}>
                    <Image style={styles.image} source={require('./../../../icons/ico_time.png')} />
                    <Text style={styles.timeText}>{this.state.data.length ? this.state.data[0].data_time : ""}</Text>
                </View>
                <ListView
                    //automaticallyAdjustContentInsets={false}
                    initialListSize={200}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    contentContainerStyle={styles.listView}
                    renderRow={(rowData) => {
                        return (
                            <TouchableOpacity style={styles.item} onPress={this.pushToChart.bind(this,rowData.tag_id,rowData.tag_name)}>
                                <View style={styles.line} />
                                <View style={styles.itemContent} >
                                    <Text style={styles.value}>{rowData.data_value}{rowData.data_unit}</Text>
                                    <Text style={styles.text1}>{rowData.tag_name}</Text>
                                </View>
                            </TouchableOpacity>
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
    itemContent:{
        flex:1,
        justifyContent: 'center',
        alignItems: "center",
    },
    line:{
        height:25,
        width:3,
        backgroundColor:"#00b5fc",
    },
    image: {
        marginRight: 10,
        width: 18,
        height: 18,
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
        height: 40,
        justifyContent: 'center',
        backgroundColor:"#f1f2f4"
    },




    heatTextView: {
        width: width,
        height: 40,
        backgroundColor: "#4dbeff",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // justifyContent: 'space-around',
    },

    list: {
        width: width,
        backgroundColor: "#f5f5f5",
        height: 1,

    },
    listItem: {
        paddingTop: 4,
        width: width,
        height: 50,
    },
    listItemImage: {
        width: 15,
        height: 15,
        marginTop: 5,
        marginRight: 10,
    },
    listItemText1: {
        fontSize: 16,
        flex: 1,
        marginLeft: 10,
        color: '#3d3d3d',
    },
    listItemTextView: {
        flex: 1,
        flexDirection: 'row',
    },
    listItemText2: {
        color: "#202B3D",
        marginLeft: 10,
        fontSize: 12,
    },
    time: {
        marginTop: 3,
        // flex: 1,
        textAlign: 'right',
        marginRight: 10,
        fontSize: 10,
        color: "#b1b1b1"
    },
});