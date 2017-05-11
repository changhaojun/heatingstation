/**
 * Created by Vector on 17/4/20.
 */
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import WebViewBridge from 'react-native-webview-bridge';
import Test from './test.ios';

export default class Message extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};

        this.onBridgeMessage = this.onBridgeMessage.bind(this);
    }

    onBridgeMessage(message){
        // console.log('wk8--------onBridgeMessage'+message);
        switch(message){
            case message:
                // console.log("兄弟们，我们H5单击了");
                this.props.navigator.push({
                    component: Test,
                    passProps: {
                        message:message,

                    }
                })
                break;
        }
    }


    backSetting(){
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    backgroundColor='red'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='default' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.backSetting.bind(this)}>
                        <Image style={{ width: 20, height: 18, marginLeft:10,marginTop: 20, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>换热站地图</Text>
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 20, }} source={require('../icons/nav_flag.png')}/>
                </View>

                <WebViewBridge
                    ref="webviewbridge"
                    onBridgeMessage={this.onBridgeMessage}
                    javaScriptEnabled={true}
                    source={require('../webview/mapshow.html')}
                    style={{
                         backgroundColor: "#f2d6b8",
                    }
                    }
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
        // marginTop: 20,
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 44,
        backgroundColor: '#f2d6b8',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth:0.1,
        // borderColor: '#000000',
    },
    topNameText: {
        flex: 1,
        marginTop: 20,
        textAlign: 'center',
        color: "#000000",
        fontSize: 19,
    },
});