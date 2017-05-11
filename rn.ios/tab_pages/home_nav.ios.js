/**
 * Created by Vector on 17/4/17.
 */
// 首页导航
import React from 'react';
import {View, Text,Image, TextInput, StyleSheet, TouchableHighlight, StatusBar, NavigatorIOS, AlertIOS} from 'react-native';
import Orientation from 'react-native-orientation';
import Home from './home.ios';
import Setting from '../component/setting.ios';
import Warn from '../component/warn.ios';
export default class HomeNav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    openSetting(){
        this.props.navigator.push({
            component: Setting,
        })
    }

    openWarn(){
        this.props.navigator.push({
            component: Warn,
        })
    }


    render() {
        return (
            <NavigatorIOS
                initialRoute = {
                  {
                    component: Home, // 具体的版块
                    title:'首页',
                    barTintColor:'#f2d6b8',
                    titleTextColor: "#000000",
                    tintColor:'#3b3b3b',
                    leftButtonIcon:require('../icons/tab_home_nav_left.png'),
                    rightButtonIcon:require('../icons/tab_home_nav_right.png'),
                    onLeftButtonPress: () => this.openSetting(),
                    onRightButtonPress: ()=> this.openWarn(),
                 }
               }
               // 一定要设置style，不然leftButton和rightButton的点击事件不能用
                style={{flex:1}}
                navigationBarHidden={false}
            />
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
});