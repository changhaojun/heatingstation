/**
 * Created by Vector on 17/4/17.
 */
// 首页导航
import React from 'react';
import {View, Text, Image, TextInput, StyleSheet, TouchableHighlight, StatusBar, NavigatorIOS,} from 'react-native';

import Maintenance from './maintenance.ios';
export default class MaintenanceNav extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <NavigatorIOS
                initialRoute = {{
                component: Maintenance, // 具体的版块
                title:'运行维护',
                barTintColor:'#f2d6b8',
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