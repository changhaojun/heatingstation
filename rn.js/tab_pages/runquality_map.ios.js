/**
 * Created by Vector on 17/5/11.
 *
 * 运行质量地图展示页面
 *
 * 此页面主要用来向用户通过地图的marker来展示当前设备的运行情况
 * 包含：设备的数据 设备的状态等...
 */

import React from 'react';
import {View, Text, Image,
    AsyncStorage, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');


import Orientation from 'react-native-orientation';
import WebViewBridge from 'react-native-webview-bridge';

import Runquality from '../component/runquality.ios';

export default class RunqualityMap extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
        };


        // 从本地存储中获取access_token
        var _this = this;
        AsyncStorage.getItem("access_token",function(errs,result){
            if (!errs) {
                _this.setState({access_token:result});
            }
            console.log(_this.state.access_token);
        });


        this.onBridgeMessage = this.onBridgeMessage.bind(this);
    }


    onBridgeMessage(message){
        const { webviewbridge } = this.refs;
        webviewbridge.sendToBridge(this.state.access_token);
        console.log(message);
    }



    openRunquality(){
        this.props.navigator.push({
            component: Runquality,
        })
    }


    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    backgroundColor='red'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='light-content' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.openRunquality.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_list_icon@2x.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>运行质量地图</Text>
                    {/*<TouchableOpacity style={styles.topImage} onPress={this.openWarn.bind(this)}>*/}
                        <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                </View>
                <WebViewBridge
                    ref="webviewbridge"
                    onBridgeMessage={this.onBridgeMessage.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    source={require('../heatingmapwebview/mapshow.html')}
                    style={{height: height, width:width, backgroundColor: "#f2d6b8",}}
                />
            </View>

        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
    },
    weather:{
        flex: 1,
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 64,
        backgroundColor: '#343439',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },

});