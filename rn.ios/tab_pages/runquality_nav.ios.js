/**
 * Created by Vector on 17/4/18.
 */
/**
 * Created by Vector on 17/4/17.
 */
// 首页导航
import React from 'react';
import {View, Text, Image, TextInput, StyleSheet, TouchableHighlight, StatusBar, NavigatorIOS,} from 'react-native';
import Warn from '../component/warn.ios';
import Runquality from './runquality.ios';
import HeatMap from '../component/heat_map.ios'
export default class RunqualityNav extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    openWarn(){
        this.props.navigator.push({
            component: Warn,
        })
    }

    changeToMap(){
        this.props.navigator.push({
            component: HeatMap,
        })
    }

    render() {
        return (
            <NavigatorIOS
                initialRoute = {{
                component: Runquality, // 具体的版块
                title:'运行质量',
                barTintColor:'#f2d6b8',
                tintColor:'#3b3b3b',
                leftButtonIcon:require('../icons/map_icon.png'),
                rightButtonIcon:require('../icons/tab_home_nav_right.png'),
                onRightButtonPress: ()=> this.openWarn(),
                onLeftButtonPress: ()=> this.changeToMap(),
                }}
                style={{flex:1}}
                navigationBarHidden = {false}
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