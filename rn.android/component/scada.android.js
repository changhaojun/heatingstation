/**
 * Created by Vector on 17/4/19.
 */
import React from 'react';
import {View, Text, Image, TextInput, Navigator, StyleSheet, TouchableHighlight, StatusBar,TouchableOpacity,
    NativeModules,} from 'react-native';

import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

// 导入自定义原生模块
var Orientation = NativeModules.Orientation;

import WebViewBridge from 'react-native-webview-bridge';

export default class Test extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            uri: "http://114.215.154.122/reli/com.finfosoft.scada.view.ScadaViewForDevice.d?node_id=3&node_type=2",
        };
        this.onBridgeMessage = this.onBridgeMessage.bind(this);
    }

    onBridgeMessage(message){
        // console.log('wk8--------onBridgeMessage'+message);
        switch(message){
            case message:
                // console.log("兄弟们，我们H5单击了");
                this.props.navigator.push({
                    component: Test,
                })
                break;
        }
    }

    back(){
        Orientation.vertical();
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={true}  //status显示与隐藏
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>组态</Text>
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')}/>
                </View>

                <WebViewBridge
                    ref="webviewbridge"
                    onBridgeMessage={this.onBridgeMessage}
                    javaScriptEnabled={true}
                    source={{uri:this.state.uri}}
                    scalesPageToFit={false}
                />
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#ffffff",
        // marginTop: 100,
    },
    navView: {
        flexDirection: 'row',
        width: height,
        height: 44,
        backgroundColor: '#f2d6b8',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#000000",
        fontSize: 19,
    },
});