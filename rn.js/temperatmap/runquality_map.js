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
import Scada from "./../tenance/station_details/scada/scada";
import WaterChart from './waterchart';

export default class RunqualityMap extends React.Component {


    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            access_token: '',
            text: "",
            showanimating: true,
            type: 1,   //1:供热  2：能耗  3：水压  
            dataList: [],
            tagListShow: false,
            dataListShow: false,
            tagListSource: ds.cloneWithRows([]),
            dataListSource: ds.cloneWithRows([]),
            station_id: "",
            scadaShow: false,
            waterShow: false,
            responseJson: [],
        };
        var _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            _this.setState({ company_code: result })
        });
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) { _this.setState({ access_token: result }); }
        });
    }
    getData() {
        var _this = this;
        AsyncStorage.getItem("company_location", function (errs, result) {
            _this.webview.postMessage("{type:'location',value:'" + result + "'}");
        });
        
        this.getStationData();
        this.getPipeData();
    }
    getStationData() {
        var _this = this;
        _this.setState({ showanimating: true });
        var url = Constants.serverSite + "/v1_0_0/stationAllDatas?access_token=" + this.state.access_token + "&company_code=" + _this.state.company_code;
        console.log(url)
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                _this.setState({ showanimating: false, responseJson: responseJson });
                _this.setData();
            })
            .catch((error) => {
                console.log(error);

            });
    }

getPipeData() {
    var _this = this;
    var uri = Constants.serverSite + "/v1_0_0/pipeDiameter?access_token=" + this.state.access_token + "&company_code=" + this.state.company_code;
    console.log(uri)
    fetch(uri)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            _this.setState({ pipeData: responseJson });
            _this.webview.postMessage("{type:'pipe',value:" + JSON.stringify(responseJson) + "}");
        })
        .catch((error) => {
            console.log(error);
        });
}
setData(type) {
    var responseJson = this.state.responseJson;
    var type = type ? type : this.state.type;
    for (var i = 0; i < responseJson.length; i++) {
        if (type == 1) {
            responseJson[i].unit = "℃"
            responseJson[i].count = responseJson[i].data ? responseJson[i].data["2gw"] : 0;
        }
        if (type == 2) {
            responseJson[i].count = responseJson[i].data ? responseJson[i].data["1sr"] : 0;
            responseJson[i].unit = "KJ/㎡"
        }
        if (type == 3) {
            responseJson[i].count = responseJson[i].data ? responseJson[i].data["1gy"] : 0;
            responseJson[i].unit = "Kpa"
        }
        responseJson[i].color = this.getColor(parseFloat(responseJson[i].count));
    }
    this.webview.postMessage("{type:'data',value:" + JSON.stringify(responseJson) + "}");
}

searchSubmit() {
    this.webview.postMessage("{type:'search',value:'" + this.state.text + "'}");
}

onBridgeMessage(message) {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    console.log(message.nativeEvent.data);
    var data = eval("(" + message.nativeEvent.data + ")");
    switch (data.type) {
        case "click": {
            this.setState({ station_id: data.id, scadaShow: true })
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
    max = 100;
    if (this.state.type == 2) {
        max = 1000;
    }
    if (this.state.type == 3) {
        max = 1;
    }
    if (value > max / 10 && value < max) {
        colorid = parseInt(value * 10 / max);
    } else if (value >= max) {
        colorid = 9;
    }
    var color = ["#05ba74", "#64d102", "#a4df06", "#d2df06", "#ffd800", "#ffc600", "#ffa200", "#ff8400", "#d94e1d", "#ca1414"];
    return color[colorid];
}

selectTag(type) {
    this.setState({ type: type });
    this.webview.postMessage("{type:'type',value:" + type + "}");
    this.setData(type);
}



render() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
        <View style={styles.all}>
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
                onLoad={() => this.getData()}
                ref={webview => this.webview = webview}
                onMessage={this.onBridgeMessage.bind(this)}
                //injectedJavaScript={"window.access_token='" + this.state.access_token + "';"}
                source={Platform.OS === 'ios' ? require('./mapwebview/mapshow.html') : { uri: 'file:///android_asset/mapwebview/mapshow.html' }}
                //source={require('./mapwebview/mapshow.html') }
            />
            <View style={styles.switchView}>
                <TouchableOpacity style={[styles.switchItem]} onPress={() => { this.selectTag(1) }}>
                    <Image style={styles.switchImage} resizeMode="contain" source={this.state.type == 1 ? require('../icons/mapswitch1_s.png') : require('../icons/mapswitch1.png')} />
                    {/* <Text style={styles.switchText}>供热</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={styles.switchItem} onPress={() => { this.selectTag(2) }}>
                    <Image style={styles.switchImage} resizeMode="contain" source={this.state.type == 2 ? require('../icons/mapswitch2_s.png') : require('../icons/mapswitch2.png')} />
                    {/* <Text style={styles.switchText}>能耗</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={styles.switchItem} onPress={() => { this.selectTag(3) }}>
                    <Image style={styles.switchImage} resizeMode="contain" source={this.state.type == 3 ? require('../icons/mapswitch3_s.png') : require('../icons/mapswitch3.png')} />
                    {/* <Text style={styles.switchText}>水压</Text> */}
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
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.scadaShow}
                onRequestClose={() => { }}>
                <View style={{ flex: 1 }}>
                    <Scada style={{ flex: 1 }} station_id={this.state.station_id} />
                    <Text style={{ textAlign: "right", fontSize: 50, color: "#fff", marginTop: 0, marginLeft: width - 40, position: "absolute" }} onPress={() => this.setState({ scadaShow: false })}>×</Text>
                </View>
            </Modal>
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.waterShow}
                onRequestClose={() => { }}>
                <View style={{ flex: 1 }}>
                    <WaterChart style={{ flex: 1 }} _id={this.state.station_id} />
                    <Text style={{ textAlign: "right", fontSize: 50, color: "#fff", marginTop: 0, marginLeft: width - 40, position: "absolute" }} onPress={() => this.setState({ waterShow: false })}>×</Text>
                </View>
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
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#C3AB90',
    },
    searchImageView: {
        height: 28,
        width: 28,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        //marginTop: 20,
        backgroundColor: "#ffffff",
    },
    searchImage: {
        height: 20,
        width: 20,
        margin: 5,
    },
    topInputText: {
        flex: 1,
        //marginTop: 30,
        padding: 0,
        //marginBottom: 10,
        color: "#000",
        fontSize: 15,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: "#ffffff",
    },
    topImage: {
        width: 20,
        height: 20,
        //marginTop: 20,
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
        //paddingTop: 15,
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
        width: 40,
        height: 40,
        //margin: 5,
        //backgroundColor: "#fff",
        marginTop: 10,
        //alignItems: 'center',
    },
    switchImage: {
        width: 40,
        height: 40,
    },
    switchText: {
        fontSize: 12,

    }

});