/**
 * Created by Vector on 17/4/24.
 */
import React from 'react';
import {
    View, Text, Image, TextInput, Modal, Platform,
    Slider, Switch, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity, ListView,AsyncStorage
} from 'react-native';
var AlertIOS = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import Orientation from 'react-native-orientation';
import WebViewBridge from 'react-native-webview-bridge';
import Test from './test.ios';

var data = [];
export default class Gateway extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            sliderValue: 0.6,
            dataSource: ds.cloneWithRows([]),
        };
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                fetch("http://121.42.253.149:18816/v1_0_0/homesSataionData?station_id=" + props.station_id + "&access_token=" + result + "&tag_id=" + props.tag_id + "")
                    .then((response) => response.json())
                    .then((responseJson) => {
                        data=[];
                        if (props.batch) {
                            data = responseJson.issued;
                            for (var i = 0; i < data.length; i++) {
                                data[i].check = 1;
                            }
                        }
                        _this.setState({
                            dataSource: ds.cloneWithRows(data),
                            sliderValue: responseJson.data_value / 100,
                        });

                    })
                    .catch((error) => {
                        console.error(error);
                        AlertIOS.alert(
                            '提示',
                            '网络连接失败',
                        );
                    });
            }
        });



    }



    confirm() {
        var _this = this;
        var station_id = '';
        _this.props.close();
        if (data.length) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].check) {
                    station_id += data[i].station_id + ",";
                }
            }
        } else {
            station_id = _this.props.station_id;
        }
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var url="http://121.42.253.149:18816/v1_0_0/gateway?station_id=" + station_id + "&access_token=" + result + "&tag_id=" + _this.props.tag_id + "&data_value=" + _this.state.sliderValue.toFixed(2) * 100;
                console.log(url);
               
                fetch(url,{method: 'POST'})
                    .then((response) => response.json())
                    .then((responseJson) => {
                        AlertIOS.alert(
                            '提示',
                            '下发成功',
                        );
                    })
                    .catch((error) => {
                        console.error(error);
                        AlertIOS.alert(
                            '提示',
                            '网络连接失败',
                        );
                    });
            }
        });

    }

    check(rowID) {
        data[rowID].check = data[rowID].check ? 0 : 1;
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: ds.cloneWithRows(data),
        });
    }


    render() {
        return (
            <View style={styles.all}>
                <View style={styles.sliderView}>
                    <Text style={{ fontSize: 30, color: '#E0960A', marginTop: 20, }}>{parseInt((this.state.sliderValue) * 100)}</Text>
                </View>
                <View style={styles.sliderView}>
                    <Text style={{}}> 0 </Text>
                    <Slider style={{ flex: 0.8 }}
                        value={this.state.sliderValue}
                        onSlidingComplete={() => console.log('当前的值为' + this.state.sliderValue)}
                        onValueChange={(sliderValue) => this.setState({ sliderValue: sliderValue })} />
                    <Text style={{}}> 100 </Text>
                </View>
                <View style={styles.confirmView}>
                    <TouchableOpacity activeOpacity={0.5} onPress={this.confirm.bind(this)}>
                        <View style={{ backgroundColor: '#E0960A', height: 30, width: 100, borderRadius: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontSize: 14, color: '#ffffff' }}>下发</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{ marginTop: 10, color: '#939495' }}>{this.state.confirmTime}</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    contentContainerStyle={styles.listView}
                    enableEmptySections={true}
                    renderRow={(rowData, sectionID, rowID) => {
                        return (
                            <TouchableOpacity onPress={this.check.bind(this, rowID)}>
                                <View style={styles.listItem}>
                                    <Text style={styles.listItemName}>{rowData.station_name}</Text>
                                    <View style={styles.content}>
                                        <View style={styles.textAll}>
                                            <Text style={styles.listItemValue}>{rowData.data_value}</Text>
                                            <Image source={rowData.check ? require('../icons/check_pre.png') : require('../icons/check_nor.png')} style={styles.checkImage}></Image>
                                        </View>
                                        <Text style={styles.time}>{rowData.data_time}</Text>
                                    </View>
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
        minHeight: 150,
        maxHeight: 400,
        backgroundColor: "#ffffff",
        // marginTop: 20,
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 64,
        backgroundColor: '#343439',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth:1,
        // borderColor: '#C3AB90',
    },
    // modal的样式
    modalStyle: {
        // backgroundColor:'#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    // modal上子View的样式
    subView: {
        marginLeft: 30,
        marginRight: 30,
        maxHeight: 400,
        backgroundColor: '#ffffff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderColor: '#ccc',
    },
    // 按钮
    buttonView: {
        marginTop: -5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmView: {
        height: 80,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    listView: {
        // 主轴方向
        flexDirection: 'row',
        // 一行显示不下,换一行
        flexWrap: 'wrap',
        //horizontal :true,
        // 侧轴方向
        alignItems: 'flex-start', // 必须设置,否则换行不起作用
    },
    listItem: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "#7a7d82",
        width: (width - 100) / 2,
        height: 80,
        borderRadius: 3,
        padding: 3,
    },
    listItemValue: {
        fontSize: 26,
        color: "#ffffff"
    },
    content: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: "#fff",
        height: 55,
        marginBottom: 10,
    },
    textAll: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemName: {
        fontSize: 12,
        color: "#ffffff"
    },
    checkImage: {
        width: 20,
        height: 20,
    },
    time: {
        fontSize: 8,
        color: "#ffffff",
        textAlign: "center"
    }
});