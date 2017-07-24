/**
 * Created by Vector on 17/4/18.首页
 */

// 分公司列表页面
import React from 'react';
import { View, Text, Image, Platform, NavigatorIOS, StyleSheet, TouchableOpacity, ListView, AsyncStorage, Navigator } from 'react-native';
import Dimensions from 'Dimensions';
import Orientation from 'react-native-orientation';
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
                console.log(Constants.serverSite+"/v1_0_0/followStation?access_token=" + result)
                fetch(Constants.serverSite+"/v1_0_0/followStation?access_token=" + result)
                    .then((response) => response.json())
                    .then((responseJson) => {
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

    gotoHistoryEnergyCharts(name, id) {
        const navigator = this.props.navigator;
        Orientation.lockToLandscape();
        navigator.push({
            component: HistoryEnergyCharts,
            passProps: {
                company_name: name,
                company_id: id,

            }
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <Text style={styles.title}>我的关注</Text>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    contentContainerStyle={{ marginLeft: 15, }}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                        return (
                            <TouchableOpacity style={styles.item} onPress={this.gotoHistoryEnergyCharts.bind(this, rowData.name, rowData.id)}>
                                <Text style={styles.text}>{rowData.station_name}</Text>
                                <Text style={styles.text}>{rowData.tag_name}</Text>
                                <Image style={styles.image} source={require('./../icons/thermometer.png')} />
                                <Text style={[styles.text,{flex:1.5,color:"#30adff"}]}>{rowData.data_value}℃</Text>
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
        backgroundColor:"#fff",
        marginTop: 5,
    },
    item: {
        height: 40,
        alignItems: "center",
        flexDirection: 'row',
        borderTopWidth:0.2,
        borderTopColor:"#e7e7e7"
    },
    image: {
        marginTop:20,
        width: 30,
        height: 40,
    },
    text: {
        fontSize: 16,
        color: "#656565",
        lineHeight: 20,
        flex: 3
    },
    title:{
        fontSize: 18,
        color: "#3e3e3e",
        marginLeft:15,
        marginTop:5,
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