/**
 * Created by Vector on 17/5/11.
 *
 * 运行质量地图展示页面
 *
 * 此页面主要用来向用户通过地图的marker来展示当前设备的运行情况
 * 包含：设备的数据 设备的状态等...
 */

import React from 'react';
import {
    View, Text, Image, Platform, ActivityIndicator, AsyncStorage, TextInput, Modal, ListView, NavigatorIOS, StyleSheet, StatusBar, TouchableOpacity, WebView
} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');
import Orientation from 'react-native-orientation';
var Alert = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();
import CompanyChart from './map_chart/company_chart';
import ChildCompanyChart from './map_chart/child_company_chart';
import BranchChart from './map_chart/branch_chart';
import MapChart from './waterchart';
import Constants from './../constants';

export default class RunqualityMap extends React.Component {


    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            access_token: '',
            text: "",
            showanimating: true,
            tag_id: 14,
            dataList: [],
            tagListShow: false,
            dataListShow: false,
            tagListSource: ds.cloneWithRows([]),
            dataListSource: ds.cloneWithRows([]),
        };
        this.getData();

    }
    getData() {
        var _this = this;
        _this.setState({ showanimating: true });
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                _this.setState({ access_token: result });
                fetch(Constants.serverSite + "/v1_0_0/stationAllDatas?access_token=" + result + "&company_code=000005&tag_id=" + _this.state.tag_id)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        for (var i = 0; i < responseJson.length; i++) {
                            responseJson[i].count = responseJson[i].value[0] ? responseJson[i].value[0].data_value : 0;
                            if (_this.state.tag_id = 14) {
                                responseJson[i].unit = "℃"
                            }
                        }
                        _this.webview.postMessage("{type:'data',value:" + JSON.stringify(responseJson) + "}");
                        _this.setState({ showanimating: false });
                    })
                    .catch((error) => {
                        console.log(error);

                    });
            }
        });


    }
    searchSubmit() {
        this.webview.postMessage("{type:'search',value:'" + this.state.text + "'}");
    }

    changeCenter(location) {
        this.setState({ dataListShow: false });
        this.webview.postMessage("{type:'center',value:'" + location + "'}");
    }

    onBridgeMessage(message) {
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        console.log(message.nativeEvent.data);
        var data = eval("(" + message.nativeEvent.data + ")");
        switch (data.type) {
            case "click": {
                var _id = this.state.dataList[data.index].heating_station_id ? this.state.dataList[data.index].heating_station_id : this.state.dataList[data.index].branch_id ? this.state.dataList[data.index].branch_id : this.state.dataList[data.index].company_id;
                this.props.navigator.push({
                    component: MapChart,
                    passProps: {
                        _id: _id,
                        tag: data.tag,
                        level: data.level,
                    }
                })
                break;

            }
            case "data": {
                var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                this.setState({
                    dataList: data.data,
                    dataListSource: ds.cloneWithRows(data.data),
                });
                break;
            }
        }
    }


    openRunquality() {
        this.props.navigator.push({
            component: Runquality,
        })
    }

    getColor(value) {
        var colorid = 0;
        if (value > 10 && value < 100) {
            colorid = parseInt(value / 10);
        } else if (value >= 100) {
            colorid = 9;
        }
        var color = ["#05ba74", "#64d102", "#a4df06", "#d2df06", "#ffd800", "#ffc600", "#ffa200", "#ff8400", "#d94e1d", "#ca1414"];
        return color[colorid];
    }



    render() {
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    backgroundColor='#343439'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='light-content' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />

                <View style={styles.navView}>
                    <TouchableOpacity onPress={() => { this.setState({ dataListShow: true }) }}>
                        <Image style={styles.topImage} source={require('../icons/map_list.png')} />
                    </TouchableOpacity>
                    <View style={styles.searchImageView}>
                        <Image style={styles.searchImage} source={require('../icons/map_search.png')} />
                    </View>
                    <TextInput
                        style={styles.topInputText}
                        returnKeyType={"search"}
                        returnKeyLabel={"search"}
                        onSubmitEditing={this.searchSubmit.bind(this)}
                        underlineColorAndroid={"transparent"}
                        placeholder={"搜索"}
                        onChangeText={(text) => this.setState({ text })}>{this.state.text}</TextInput>

                    <Text style={styles.searchText} onPress={this.searchSubmit.bind(this)}>搜索</Text>
                </View>
                <WebView
                    style={{ flex: 1 }}
                    ref={webview => this.webview = webview}
                    onMessage={this.onBridgeMessage.bind(this)}
                    //injectedJavaScript={"window.access_token='" + this.state.access_token + "';"}
                    source={require('./mapwebview/mapshow.html')}
                />
                <View style={styles.switchView}>
                    <TouchableOpacity style={styles.switchItem} onPress={() => { this.setState({ tag_id: 14 }); this.getData(); }}>
                        <Image style={styles.switchImage} resizeMode="contain" source={require('../icons/mapswitch1.png')} />
                        <Text style={styles.switchText}>供热</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.switchItem} onPress={() => { this.setState({ tag_id: 7 }); this.getData(); }}>
                        <Image style={styles.switchImage} resizeMode="contain" source={require('../icons/mapswitch2.png')} />
                        <Text style={styles.switchText}>能耗</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.switchItem} onPress={() => { this.setState({ tag_id: 12 }); this.getData(); }}>
                        <Image style={styles.switchImage} resizeMode="contain" source={require('../icons/mapswitch3.png')} />
                        <Text style={styles.switchText}>水压</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.showanimating}
                    onRequestClose={() => { }}>
                    <View style={{ backgroundColor: "#ffffff67", flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <ActivityIndicator
                            animating={true}
                            size="large"
                        />
                    </View>
                </Modal>


                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.dataListShow}
                    onRequestClose={() => { }}>
                    <TouchableOpacity onPress={() => { this.setState({ dataListShow: false }) }} style={styles.all}>
                        <ListView
                            style={styles.dataList}
                            enableEmptySections={true}
                            contentContainerStyle={styles.listView}
                            initialListSize={this.state.dataList.length}
                            dataSource={this.state.dataListSource}
                            renderRow={(rowData) =>
                                <TouchableOpacity style={styles.listItem}>
                                    <Text style={styles.tagText} >{rowData.station_name}</Text>
                                    <Text style={[styles.tagText, { color: this.getColor(rowData.count) }]} >{rowData.count}℃</Text>
                                </TouchableOpacity>}
                        />
                    </TouchableOpacity>
                </Modal>
            </View>

        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
    },
    weather: {
        flex: 1,
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 74,
        backgroundColor: '#343439',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#C3AB90',
    },
    searchImageView: {
        height: 28,
        width: 28,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginTop: 20,
        backgroundColor: "#ffffff",
    },
    searchImage: {
        height: 20,
        width: 20,
        margin: 5,
    },
    topInputText: {
        flex: 1,
        marginTop: 30,
        padding: 0,
        marginBottom: 10,
        color: "#000",
        fontSize: 15,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: "#ffffff",
    },
    topImage: {
        width: 20,
        height: 20,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    tagView: {
        width: 125,
        marginTop: 50,
        marginLeft: 5,
    },
    tagList: {
        backgroundColor: "#343439",
        padding: 10,
    },
    tagText: {
        color: "#fff",
        marginRight: 3,
        fontSize: 18
        //borderBottomWidth:1,
        //borderBottomColor:"#fff",

    },
    sj: {
        width: 10,
        height: 10,
        marginLeft: 10,
    },
    dataList: {
        marginTop: 50,
        backgroundColor: "#343439a4",
        padding: 10,
        marginBottom: 50,
    },
    listView: {
        // 主轴方向
        flexDirection: 'row',
        // 一行显示不下,换一行
        flexWrap: 'wrap',
        //horizontal :true,
        // 侧轴方向
        alignItems: 'flex-start', // 必须设置,否则换行不起作用
        justifyContent: 'center',
    },

    searchText: {
        color: "#fff",
        fontSize: 15,
        margin: 5,
        paddingTop: 15,
    },
    listItem: {
        marginTop: 3,
        marginLeft: 5,
        marginRight: 10,
        paddingBottom: 3,
        flexDirection: 'row',
        height: 35,
    },
    switchView: {
        position: "absolute",
        width: 50,
        height: 130,
        alignSelf: "flex-end",
        marginTop: 100,

        //backgroundColor: "#fff"
    },
    switchItem: {
        width: 37,
        height: 35,
        margin: 5,
        backgroundColor: "#fff",
        marginTop: 3,
        alignItems: 'center',
    },
    switchImage: {
        width: 20,
        height: 20,
    },
    switchText: {
        fontSize: 12,

    }

});