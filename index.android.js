/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, BackAndroid, ToastAndroid, Text, StatusBar, View, Alert, Modal } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components'

import JPushModule from 'jpush-react-native';
import Login from './rn.js/login';
import Orientation from 'react-native-orientation';
import AppUpdate from 'react-native-appupdate';
import Constants from './rn.js/constants';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');
var _navigator;
var lastBackPressed;
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        Orientation.lockToPortrait();//竖屏
        _navigator.pop();
        return true;
    } else if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        return false;
    }
    ToastAndroid.show("再按一次退出应用", ToastAndroid.SHORT);
    lastBackPressed = Date.now();
    return true;
});

export default class WisdomHeating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            updateModal: false,
            downloaded: 0
        };
    }
    componentDidMount() {
        this.getEdition();
        JPushModule.initPush();
        JPushModule.setTags(["ert"], () => {
            console.log('Set tags null is success');
        });
        JPushModule.addReceiveCustomMsgListener((message) => { });
    }
    getEdition() {

        var _this = this;
        var uri = Constants.serverSite + "/v1_0_0/appVersion";
        console.log(uri);
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
                if (Constants.version != responseJson.version_number) {
                    _this.setState({
                        data: responseJson,
                    });
                    const appUpdate = new AppUpdate({
                        iosAppId: '123456',
                        apkVersionUrl: {
                            "versionName": this.state.data.version_number,
                            "apkUrl": this.state.data.download_address,
                            "forceUpdate": false
                        },
                        needUpdateApp: (needUpdate) => {
                            if (this.state.data.force) {
                                needUpdate(true);
                            } else {
                                Alert.alert(
                                    '更新提示',
                                    this.state.data.version_introduce,
                                    [
                                        { text: '取消', onPress: () => { } },
                                        { text: '更新', onPress: () => needUpdate(true) }
                                    ]
                                );
                            }

                        },
                        forceUpdateApp: () => {
                            console.log("Force update will start")
                        },
                        notNeedUpdateApp: () => {
                            console.log("App is up to date")
                        },
                        downloadApkStart: () => { this.setState({ updateModal: true }) },
                        downloadApkProgress: (progress) => { this.setState({ downloaded: progress }) },
                        downloadApkEnd: () => { this.setState({ updateModal: false }) },
                        onError: () => { console.log("downloadApkError") }
                    });
                    appUpdate.checkUpdate();
                }

            })
            .catch((error) => {
                console.error(error)
                Alert.alert(
                    '提示',
                    '网络连接错误，请检查网络，或联系客服人员',
                );
            });

    }
    render() {
        let defaultName = "Login";
        let defaultComponent = Login;
        return (
            <View style={{ flex: 1 }}>
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    //translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='default' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                    backgroundColor={"#434b59"}
                />
                <Navigator
                    initialRoute={{ name: defaultName, component: defaultComponent }}
                    configureScene={(route) => {
                        return Navigator.SceneConfigs.FadeAndroid;
                    }}
                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        _navigator = navigator;
                        return <Component {...route.passProps} navigator={navigator} />
                    }
                    }
                />
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.updateModal}
                    onRequestClose={() => { }}>
                    <View style={{ backgroundColor: "#00000067", flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ backgroundColor: "#fff", width: width - 80, height: 150, justifyContent: 'center',}}>
                            <Text style={{ backgroundColor: "#0099FF", width: width - 80, height: 40,fontSize:17,color:"#fff", textAlignVertical: 'center', paddingLeft: 20 }}>版本更新</Text>
                            <View style={{ flex:1, justifyContent: 'center', paddingLeft: 40 }}>
                                <Text style={{marginTop:-15}}>下载中({this.state.downloaded}%)……</Text>
                                <View style={{ width: width - 160, height: 3, backgroundColor: "#d2d2d2",marginTop:5 }}><View style={{ width: (width - 160) * this.state.downloaded / 100, height: 3, backgroundColor: "#fff222" }} /></View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('WisdomHeating', () => WisdomHeating);
