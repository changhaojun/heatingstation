/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry,StyleSheet,BackAndroid,ToastAndroid,StatusBar,View} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components'

import JPushModule from 'jpush-react-native';
import Login from './rn.js/login';
import Orientation from 'react-native-orientation';


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
    componentDidMount() {
        JPushModule.initPush();
        JPushModule.setTags(["ert"], () => {
            console.log('Set tags null is success');
        });
        JPushModule.addReceiveCustomMsgListener((message) => { });
    }
    render() {
        let defaultName = "Login";
        let defaultComponent = Login;
        return (
            <View style={{flex:1}}>
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
