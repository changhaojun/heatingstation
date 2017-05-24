// 主页
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import Weather from '../component/weather';
import HeatList from '../component/heat_list';

// import Home from './home.ios';
import Setting from '../component/setting';
import Warn from '../component/warn';

export default class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    openSetting(){
        const navigator = this.props.navigator;
        this.props.navigator.push({
            component: Setting,
        })
    }

    openWarn(){
        const navigator = this.props.navigator;
        this.props.navigator.push({
            component: Warn,
        })
    }

    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    backgroundColor='#343439'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='light-content' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.openSetting.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/home_nav_user_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>首页</Text>
                    <TouchableOpacity style={styles.topImage} onPress={this.openWarn.bind(this)}>
                    <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 10, }} source={require('../icons/home_nav_warn_icon.png')} />
                    </TouchableOpacity>
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