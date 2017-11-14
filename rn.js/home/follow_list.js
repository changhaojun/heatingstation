/**
 * Created by Vector on 17/4/18.首页
 */

// 分公司列表页面
import React from 'react';
import { View, Text, Image, Platform, NavigatorIOS, StyleSheet, TouchableOpacity, ListView, AsyncStorage, Navigator } from 'react-native';
import Dimensions from 'Dimensions';
import Orientation from 'react-native-orientation';
import StationDetails from '../tenance/station_details/station_tab';
var Alert = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();
import Constants from './../constants';
var { width, height } = Dimensions.get('window');

// import HeatDetail from '../components/heat_detail.ios.js';
import HistoryEnergyCharts from './history_energy_charts';
export default class HeatList extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
        };
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                console.log(Constants.serverSite + "/v1_0_0/followStation?access_token=" + result)
                fetch(Constants.serverSite + "/v1_0_0/followStation?access_token=" + result)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({
                            dataSource: ds.cloneWithRows(responseJson),
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

    openScada(name, id) {
        this.props.navigator.push({
            component: StationDetails,
            passProps: {
                station_name: name,
                station_id: id,
            }
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.title}>
                    <Image style={styles.titleImage} source={require('../icons/follow_station.png')} />
                    <Text style={styles.titleText}>我的关注</Text>
                </View>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    contentContainerStyle={{ marginLeft: 15, }}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                        return (
                            <TouchableOpacity style={styles.item} onPress={this.openScada.bind(this, rowData.station_name, rowData.station_id)}>
                                <View style={styles.nameAndTime}>
                                    <Text style={styles.text}>{rowData.station_name}</Text>
                                    <Text style={styles.time}>{rowData.data_time}</Text>
                                </View>
                                <Text style={styles.text}>{rowData.tag_name}</Text>
                                <Image style={styles.image} source={require('./../icons/thermometer.png')} />
                                <Text style={[styles.text, { flex: 2, color: "#30adff" }]}>{rowData.data_value}℃</Text>

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
        marginTop: 5,
    },
    item: {
        height: 40,
        alignItems: "center",
        flexDirection: 'row',
        borderTopWidth: 0.2,
        borderTopColor: "#e7e7e7"
    },
    image: {
        marginTop: 20,
        width: 30,
        height: 40,
    },
    text: {
        fontSize: 16,
        color: "#656565",
        flex: 3
    },
    title: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: "center",
    },
    titleImage: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },
    titleText: {
        fontSize: 18,
        color: "#3e3e3e",
        marginLeft: 5,
    },
    time: {
        fontSize: 9,
        color: "#656565",
        flex: 2,
    },
    nameAndTime: {
        flex: 3,

    }

});