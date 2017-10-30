/**
 *检查井录入页面
 */

import React from 'react';
import {
    View, Text, Image, Platform, ActivityIndicator, ScrollView, AsyncStorage, TextInput, Modal, ListView, NavigatorIOS, StyleSheet, StatusBar, TouchableOpacity, WebView
} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');
import Orientation from 'react-native-orientation';
var Alert = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();
import Constants from '../constants';

export default class RunqualityMap extends React.Component {


    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            access_token: '',
            showanimating: true,
            responseJson: [],
            data: {},
            showInfoWin: false,
            company_code: "",
            company_id: "",
            companyList: [],
            selectCompany: false,
        };
        var _this = this;
        _this.setState({ showanimating: true });
        AsyncStorage.getItem("company_id", function (errs, result) {
            _this.setState({ company_id: result })
        });
        AsyncStorage.getItem("access_token", function (errs, result) {
            _this.setState({ access_token: result })
        });
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (result.length == 6) {
                var uri = Constants.serverSite + "/v1_0_0/allChildCompany?access_token=" + _this.state.access_token + "&company_id=" + _this.state.company_id + "&company_code=" + result;
                console.log(uri)
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ companyList: responseJson, selectCompany: true })
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                _this.setState({ company_code: result })
                _this.getData(true)
            }

        });

    }
    //保存检查井信息
    save() {
        var _this = this;
        var data = _this.state.data;
        delete data.lng;
        delete data.lat;
        delete data.last_manhole_code;
        delete data.last_manhole_loc;
        console.log(Constants.serverSite + "/v1_0_0/pipeDiameter?access_token=" + this.state.access_token + "&data=" + _this.state.data)
        fetch(Constants.serverSite + "/v1_0_0/pipeDiameter?access_token=" + this.state.access_token + "&data=" + JSON.stringify(data), { method: this.state.data._id ? 'PUT' : "POST" })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);

                this.webview.postMessage("{type:'reset'}");
                this.getData();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    /**
     * 获取检查井列表
     * init 是否初始化地图
     */
    getData(init, company_code) {
        var _this = this;
        var uri = Constants.serverSite + "/v1_0_0/pipeDiameter?access_token=" + this.state.access_token + "&company_code=" + (company_code ? company_code : this.state.company_code);
        console.log(uri)
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                _this.setState({ showanimating: false, responseJson: responseJson });
                _this.webview.postMessage("{type:'data',value:" + JSON.stringify(responseJson) + ",init:" + init + "}");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    selectCom(company_code, company_id, company_name) {
        this.setState({
            company_code: company_code,
            company_id: company_id,
            company_name: company_name,
            selectCompany: false
        });
        this.getData(true, company_code);
    }
    del() {
        if (this.state.data._id) {
            var uri = Constants.serverSite + "/v1_0_0/pipeDiameter?access_token=" + this.state.access_token + "&_id=" + this.state.data._id;
            console.log(uri)
            fetch(uri, { method: "DELETE" })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.webview.postMessage("{type:'reset'}");
                    this.getData();
                    this.setState({ showInfoWin: false })
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            this.webview.postMessage("{type:'reset'}");
            this.getData();
            this.setState({ showInfoWin: false })
        }

    }
    onBridgeMessage(message) {
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        console.log(message.nativeEvent.data);
        var data = eval("(" + message.nativeEvent.data + ")");
        switch (data.type) {
            //新增检查井
            case "setMarkerLoc": {
                //Alert.alert("d", data.point);
                var stateData = this.state.data;
                stateData.company_code = this.state.company_code;
                stateData.company_id = this.state.company_id;
                stateData.road_name = data.street;
                var point = eval("(" + data.point + ")");
                stateData.manhole_loc = point.lng + "," + point.lat;
                this.setState({
                    showInfoWin: true,
                    data: stateData,
                });
                break;
            }
            //编辑检查井  相当于点击一个检查井开始编辑 
            case "edit": {
                var dataList = this.state.responseJson;
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i]._id == data.id) {
                        this.setState({
                            showInfoWin: true,
                            data: dataList[i],
                        });
                    }
                }
                break;
            }
            //选择上一个检查井时回调这个
            case "last": {
                var stateData = this.state.data;
                var point = eval("(" + data.point + ")");
                stateData.last_manhole = data.id;

                var dataList = this.state.responseJson;
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i]._id == data.id) {
                        stateData.last_manhole_loc = dataList[i].manhole_loc;
                        stateData.last_manhole_code = dataList[i].manhole_code;
                    }
                }
                this.setState({
                    showInfoWin: true,
                    data: stateData,
                });
                break;
            }
        }
    }
    render() {
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image style={{ width: 18, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, color: "#fff", textAlign: "center", fontSize: 17 }}>{this.state.company_name ? this.state.company_name : "检查井录入"}</Text>
                    <TouchableOpacity onPress={() => this.setState({selectCompany:true})}>
                        <Image style={{ width: 18, height: 20, marginRight: 10, }}  resizeMode="contain" source={require('../icons/select_company.png')} />
                    </TouchableOpacity>
                </View>
                <WebView
                    style={{ flex: 1 }}
                    ref={webview => this.webview = webview}
                    onMessage={this.onBridgeMessage.bind(this)}

                    source={Platform.OS === 'ios' ? require("./inspection_well/inspection_well.html") : { uri: 'file:///android_asset/inspection_well/inspection_well.html' }}
                />

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
                    visible={this.state.selectCompany}
                    onRequestClose={() => { }}>
                    <View style={{ backgroundColor: "#ffffff67", flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ width: width - 60, backgroundColor: "#ffffff" }}>
                            <Text style={{ backgroundColor: "#343439", color: "#fff", height: 40, fontSize: 17, textAlignVertical: "center", paddingLeft: 10 }}>请选择分公司</Text>
                            <ListView
                                dataSource={ds.cloneWithRows(this.state.companyList)}
                                enableEmptySections={true}
                                renderRow={(rowData) => {
                                    return (
                                        <Text style={{ marginLeft: 10, fontSize: 16, color: "#777777", height: 35, textAlignVertical: "center", }} onPress={() => { this.selectCom(rowData.company_code, rowData.company_id, rowData.company_name) }}>{rowData.company_name}</Text>
                                    )
                                }}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.showInfoWin}
                    onRequestClose={() => { }}>
                    <View style={{ backgroundColor: "#ffffff67", flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={styles.lineView}>
                            <Text style={styles.nameText}>编码</Text>
                            <TextInput
                                style={styles.right}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => { var d = this.state.data; d.manhole_code = text; this.setState({ data: d }); }}
                                defaultValue={this.state.data.manhole_code}>
                            </TextInput>
                        </View>
                        <View style={styles.lineView}>
                            <Text style={styles.nameText}>道路名称</Text>
                            <TextInput style={styles.right}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => { var d = this.state.data; d.road_name = text; this.setState({ data: d }); }}
                                defaultValue={this.state.data.road_name}>
                            </TextInput>
                        </View>
                        <TouchableOpacity style={styles.lineView} onPress={() => { this.setState({ showInfoWin: false }); }}>
                            <Text style={styles.nameText}>地理坐标</Text>
                            <Text style={styles.right}>{this.state.data.manhole_loc}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.lineView} onPress={() => { this.setState({ showInfoWin: false }); this.webview.postMessage("{type:'selectLast'}"); }}>
                            <Text style={styles.nameText}>上一检查井</Text>
                            <Text style={styles.right}>{this.state.data.last_manhole_code}</Text>
                        </TouchableOpacity>
                        <View style={styles.lineView}>
                            <Text style={styles.nameText}>管道深度(m)</Text>
                            <TextInput style={styles.right}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => { var d = this.state.data; d.manhole_depth = text; this.setState({ data: d }); }}
                                defaultValue={this.state.data.manhole_depth}>
                            </TextInput>
                        </View>
                        <View style={styles.lineView}>
                            <Text style={styles.nameText}>尺寸(L*B*H)</Text>
                            <TextInput style={styles.right}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => { var d = this.state.data; d.manhole_size = text; this.setState({ data: d }); }}
                                defaultValue={this.state.data.manhole_size}>
                            </TextInput>
                        </View>
                        <View style={styles.lineView}>
                            <Text style={styles.nameText}>供水管径</Text>
                            <TextInput style={styles.right}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => { var d = this.state.data; d.for_pipe = text; this.setState({ data: d }); }}
                                defaultValue={this.state.data.for_pipe}>
                            </TextInput>
                        </View>
                        <View style={styles.lineView}>
                            <Text style={styles.nameText}>回水管径</Text>
                            <TextInput style={styles.right}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => { var d = this.state.data; d.back_pipe = text; this.setState({ data: d }); }}
                                defaultValue={this.state.data.back_pipe}>
                            </TextInput>
                        </View>
                        <View style={styles.lineView}>
                            <Text style={styles.nameText}>功能</Text>
                            <TextInput style={styles.right}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => { var d = this.state.data; d.manhole_function = text; this.setState({ data: d }); }}
                                defaultValue={this.state.data.manhole_function}>
                            </TextInput>
                        </View>
                        <View style={styles.lineView}>
                            <Text style={styles.nameText}>备注</Text>
                            <TextInput style={styles.right}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => { var d = this.state.data; d.remark = text; this.setState({ data: d }); }}
                                defaultValue={this.state.data.remark}>
                            </TextInput>
                        </View>
                        <View style={styles.lineView}>
                            <Text style={{ color: "#ff0011", flex: 1, fontSize: 16, textAlign: "center" }} onPress={() => { this.del() }}>{this.state.data._id ? "删除" : "取消"}</Text>
                            <Text style={{ color: "#4ec9b0", flex: 1, fontSize: 16, textAlign: "center" }} onPress={() => { this.save(); this.setState({ showInfoWin: false }) }}>保存</Text>
                        </View>
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
    lineView: {
        width: width - 40,
        height: 45,
        borderBottomWidth: 0.2,
        borderBottomColor: "#9f9f9f",
        flexDirection: 'row',
        //justifyContent: 'flex-end',//垂直居中
        alignItems: 'center',
        //paddingBottom:3,
        backgroundColor: "#fff"
    },

    nameText: {
        height: 45,
        width: 100,
        borderRightWidth: 0.2,
        borderColor: "#9f9f9f",
        borderBottomWidth: 0.2,
        color: "#323541",
        fontSize: 15,
        paddingRight: 10,
        textAlign: 'right',
        textAlignVertical: "center",
        backgroundColor: "#f5f5f5"
    },
    right: {
        flex: 1,
        color: "#333333",
        fontSize: 16,
        paddingLeft: 10,
        textAlign: 'left',
        backgroundColor: "#ffffff"
    },
    topSides: {
        width: 18,
        height: 18,
        marginLeft: 10,
        marginRight: 10,

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
    // searchImageView: {
    //     height: 28,
    //     width: 28,
    //     borderTopLeftRadius: 20,
    //     borderBottomLeftRadius: 20,
    //     //marginTop: 20,
    //     backgroundColor: "#ffffff",
    // },
    // searchImage: {
    //     height: 20,
    //     width: 20,
    //     margin: 5,
    // },
    // topInputText: {
    //     flex: 1,
    //     //marginTop: 30,
    //     padding: 0,
    //     //marginBottom: 10,
    //     color: "#000",
    //     fontSize: 15,
    //     borderTopRightRadius: 20,
    //     borderBottomRightRadius: 20,
    //     backgroundColor: "#ffffff",
    // },
    // topImage: {
    //     width: 20,
    //     height: 20,
    //     //marginTop: 20,
    //     marginLeft: 10,
    //     marginRight: 10,
    // },
    // tagView: {
    //     width: 125,
    //     marginTop: 50,
    //     marginLeft: 5,
    // },
    // tagList: {
    //     backgroundColor: "#343439",
    //     padding: 10,
    // },
    // tagText: {
    //     color: "#fff",
    //     marginRight: 3,
    //     fontSize: 18
    //     //borderBottomWidth:1,
    //     //borderBottomColor:"#fff",

    // },
    // sj: {
    //     width: 10,
    //     height: 10,
    //     marginLeft: 10,
    // },
    // dataList: {
    //     marginTop: 50,
    //     backgroundColor: "#343439a4",
    //     padding: 10,
    //     marginBottom: 50,
    // },
    // listView: {
    //     // 主轴方向
    //     flexDirection: 'row',
    //     // 一行显示不下,换一行
    //     flexWrap: 'wrap',
    //     //horizontal :true,
    //     // 侧轴方向
    //     alignItems: 'flex-start', // 必须设置,否则换行不起作用
    //     justifyContent: 'center',
    // },

    // searchText: {
    //     color: "#fff",
    //     fontSize: 15,
    //     margin: 5,
    //     //paddingTop: 15,
    // },
    // listItem: {
    //     marginTop: 3,
    //     marginLeft: 5,
    //     marginRight: 10,
    //     paddingBottom: 3,
    //     flexDirection: 'row',
    //     height: 35,
    // },
    // switchView: {
    //     position: "absolute",
    //     width: 50,
    //     height: 130,
    //     alignSelf: "flex-end",
    //     marginTop: 100,

    //     //backgroundColor: "#fff"
    // },
    // switchItem: {
    //     width: 40,
    //     height: 40,
    //     //margin: 5,
    //     //backgroundColor: "#fff",
    //     marginTop: 10,
    //     //alignItems: 'center',
    // },
    // switchImage: {
    //     width: 40,
    //     height: 40,
    // },
    // switchText: {
    //     fontSize: 12,

    // }

});