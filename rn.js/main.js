/**
 * Created by Vector on 17/4/15.
 */

// 主页
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import Home from './home/home.js';
//import RunQuality from './temperatmap/runquality_map';
import RunQuality from  "./contrast_analysis/contrast_analysis"
import Maintenance from './tenance/maintenance';
import Indoor from './indoor/company_list';
var Orientation = require('react-native-orientation');

export default class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            centerComponent: props.fromNoti?Maintenance:Home,
            image: require('./icons/ico_envelope.png'),

            homeView: props.fromNoti?styles.bottomViewItem:styles.bottomViewItemClick,
            homeImage: props.fromNoti?require('./icons/tab_icons/tab_home_normal.png'):require('./icons/tab_icons/tab_home_pressed.png'),
            homeText: props.fromNoti?styles.bottomItemText:styles.bottomItemTextClick,

            runqualityView: styles.bottomViewItem,
            runqualityImage: require('./icons/tab_icons/tab_runquality_normal.png'),
            runqualityText: styles.bottomItemText,
             
            indoorView: styles.bottomViewItem,
            indoorImage: require('./icons/tab_icons/tab_indoor.png'),
            indoorText: styles.bottomItemText,

            maintenanceView: props.fromNoti?styles.bottomViewItemClick:styles.bottomViewItem,
            maintenanceImage: props.fromNoti?require('./icons/tab_icons/tab_maintenance_pressed.png'):require('./icons/tab_icons/tab_maintenance_normal.png'),
            maintenanceText: props.fromNoti?styles.bottomItemTextClick:styles.bottomItemText,
        };
        
    }

    original() {
        return {
            homeView: styles.bottomViewItem,
            homeImage: require('./icons/tab_icons/tab_home_normal.png'),
            homeText: styles.bottomItemText,

            runqualityView: styles.bottomViewItem,
            runqualityImage: require('./icons/tab_icons/tab_runquality_normal.png'),
            runqualityText: styles.bottomItemText,

            maintenanceView: styles.bottomViewItem,
            maintenanceImage: require('./icons/tab_icons/tab_maintenance_normal.png'),
            maintenanceText: styles.bottomItemText,

            indoorView: styles.bottomViewItem,
            indoorImage: require('./icons/tab_icons/tab_indoor.png'),
            indoorText: styles.bottomItemText,
        }
    }
    //首页按钮点击
    _homeClick() {
        this.setState(this.original);
        this.setState({ centerComponent: Home });
        this.setState({
            homeView: styles.bottomViewItemClick,
            homeImage: require('./icons/tab_icons/tab_home_pressed.png'),
            homeText: styles.bottomItemTextClick,
            image: require('./icons/ico_envelope.png'),
        });
    }

    //对比分析点击
    _runqualityClick() {
        this.setState({ centerComponent: RunQuality });
        this.setState(this.original);
        this.setState({
            runqualityView: styles.bottomViewItemClick,
            runqualityImage: require('./icons/tab_icons/tab_runquality_pressed.png'),
            runqualityText: styles.bottomItemTextClick,
        });
    }

    //运行维护点击
    _maintenanceClick() {
        this.setState(this.original);
        this.setState({ centerComponent: Maintenance });
        this.setState({
            maintenanceView: styles.bottomViewItemClick,
            maintenanceImage: require('./icons/tab_icons/tab_maintenance_pressed.png'),
            maintenanceText: styles.bottomItemTextClick,
        });
    }
    //点击户内系统
    _indoor(){
        this.setState(this.original);
        this.setState({ centerComponent: Indoor });
        this.setState({
            indoorView: styles.bottomViewItemClick,
            indoorImage: require('./icons/tab_icons/tab_indoored.png'),
            indoorText: styles.bottomItemTextClick,
        });
    }
    toNotice() {
        //跳转
        this.props.navigator.push({
            name: 'NoticeList',
            component: NoticeList,
        })
    }

    render() {
        let defaultComponent = Home;
        return (
            <View style={styles.all} >
                <View style={styles.topView}>
                    <this.state.centerComponent {...this.props}></this.state.centerComponent>
                </View>
                <View style={styles.bottomView}>
                    <TouchableOpacity activeOpacity={0.5} onPress={this._homeClick.bind(this)} >
                        <View style={this.state.homeView} >
                            <Image style={styles.bottomItemImage} source={this.state.homeImage} resizeMode="contain"/>
                            <Text style={this.state.homeText}>首页</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={this._maintenanceClick.bind(this)} >
                        <View style={this.state.maintenanceView}>
                            <Image style={styles.bottomItemImage} source={this.state.maintenanceImage} />
                            <Text style={this.state.maintenanceText}>运行维护</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={this._indoor.bind(this)}  >
                        <View style={this.state.indoorView}>
                            <Image style={styles.bottomItemImage} source={this.state.indoorImage} resizeMode="contain"/>
                            <Text style={this.state.indoorText}>户内系统</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={this._runqualityClick.bind(this)}  >
                        <View style={this.state.runqualityView}>
                            <Image style={styles.bottomItemImage} source={this.state.runqualityImage} />
                            <Text style={this.state.runqualityText}>对比分析</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
    },
    topNameView: {
        flexDirection: 'row',
        width: width,
        height: 64,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#E6E7E8',
    },
    topNameText: {
        flex: 1,
        marginTop: 7,
        textAlign: 'center',
        color: "#daa520",
        fontSize: 19,
    },
    topImage: {
        width: 20,
        height: 17,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 11,
    },
    topView: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    bottomView: {
        flexDirection: 'row',
        width: width,
        height: 49,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: '#E6E7E8',
    },
    bottomViewItem: {
        paddingTop: 5,
        alignItems: 'center',
        width: width / 4,
        height: 60,
        backgroundColor: "#ffffff",
    },
    bottomItemText: {
        fontSize:12,
        alignItems: 'center',
        color: "#7A7E83",
        paddingTop: 4,
    },
    bottomItemImage: {
        height: 18,
        width: 20,
        alignItems: 'center',
    },
    bottomViewItemClick: {
        paddingTop: 5,
        alignItems: 'center',
        width: width / 4,
        height: 60,
        backgroundColor: "#ffffff",
    },
    bottomItemTextClick: {
        fontSize:12,
        alignItems: 'center',
        color: "#35AEFF",
        paddingTop: 4,
    },
});
