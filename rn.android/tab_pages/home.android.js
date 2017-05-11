// 主页
import React from 'react';
import {View, Text, Image, TextInput, Navigator, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import Weather from '../component/weather.android';
import HeatList from '../component/heat_list.android';
//
// // import Home from './home.ios';
// import Setting from '../component/setting.ios';
// import Warn from '../component/warn.ios';

export default class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    // openSetting(){
    //     const navigator = this.props.navigator;
    //     this.props.navigator.push({
    //         component: Setting,
    //     })
    // }
    //
    // openWarn(){
    //     const navigator = this.props.navigator;
    //     this.props.navigator.push({
    //         component: Warn,
    //     })
    // }

    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={true}  //status显示与隐藏
                />
                <View style={styles.navView}>
                {/*<TouchableOpacity onPress={this.openSetting.bind(this)}>*/}
                    <Image style={{ width: 35, height: 35, marginLeft:10,marginTop: 10, }} source={require('../icons/tab_home_nav_left.png')}/>
                {/*</TouchableOpacity>*/}
                <Text style={styles.topNameText}>首页</Text>
                {/*<TouchableOpacity style={styles.topImage} onPress={this.openWarn.bind(this)}>*/}
                    <Image style={{ width: 35, height: 35, marginRight:10,marginTop: 10, }} source={require('../icons/tab_home_nav_right.png')} />
                {/*</TouchableOpacity>*/}
                </View>

                <Weather style={styles.weather} navigator={this.props.navigator}/>
                <HeatList navigator={this.props.navigator}/>
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