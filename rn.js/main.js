/**
 * Created by Vector on 17/4/15.
 */

// 主页
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import Home from './home/home.js';
import RunQuality from './temperatmap/runquality_map';
import Maintenance from './tenance/maintenance';


var Orientation = require('react-native-orientation');

export default class Main extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            name: "首页",
            centerComponent: Home,
            image: require('./icons/ico_envelope.png'),
            open:false,

            homeView: styles.bottomViewItemClick,
            homeImage: require('./icons/tab_icons/tab_home_pressed.png'),
            homeText: styles.bottomItemTextClick,

            runqualityView: styles.bottomViewItem,
            runqualityImage: require('./icons/tab_icons/tab_runquality_normal.png'),
            runqualityText: styles.bottomItemText,

            maintenanceView: styles.bottomViewItem,
            maintenanceImage: require('./icons/tab_icons/tab_maintenance_normal.png'),
            maintenanceText: styles.bottomItemText,
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

            image: null,
        }
    }
    _homeClick() {

        this.setState(this.original);
        this.setState({ centerComponent: Home });
        this.setState({ name: "首页" });
        this.setState({
            homeView: styles.bottomViewItemClick,
            homeImage: require('./icons/tab_icons/tab_home_pressed.png'),
            homeText: styles.bottomItemTextClick,
            image: require('./icons/ico_envelope.png'),
        });
    }

    _runqualityClick() {
        this.setState({ centerComponent: RunQuality });
        this.setState(this.original);
        this.setState({ name: "运行质量" });
        this.setState({
            runqualityView: styles.bottomViewItemClick,
            runqualityImage: require('./icons/tab_icons/tab_runquality_pressed.png'),
            runqualityText: styles.bottomItemTextClick,
        });
    }

    _maintenanceClick() {
        this.setState(this.original);
        this.setState({ centerComponent: Maintenance });
        this.setState({ name: "运行维护" });
        this.setState({
            maintenanceView: styles.bottomViewItemClick,
            maintenanceImage: require('./icons/tab_icons/tab_maintenance_pressed.png'),
            maintenanceText: styles.bottomItemTextClick,
        });
    }


    toNotice() {
        //跳转
        this.props.navigator.push({
            name: 'NoticeList',
            component: NoticeList,
        })
    }

    openLeft(){
        this._drawer.open();
    }

    render() {
        let defaultComponent = Home;
        return (
            <View style={styles.all} >
                {/*<View style={styles.topNameView}>*/}
                    {/*/!*<TouchableOpacity style={styles.topImage} onPress={this.openLeft.bind(this)}>*!/*/}
                        {/*/!*<Image style={{ width: 20, height: 17 }} source={this.state.groupImage} />*!/*/}
                    {/*/!*</TouchableOpacity>*!/*/}
                    {/*<Text style={styles.topNameText}>{this.state.name}</Text>*/}
                    {/*/!*<TouchableOpacity style={styles.topImage} onPress={this.toNotice.bind(this)}>*!/*/}
                        {/*/!*<Image style={{ width: 20, height: 17 }} source={this.state.image} />*!/*/}
                    {/*/!*</TouchableOpacity>*!/*/}
                {/*</View>*/}
                <View style={styles.topView}>
                    <this.state.centerComponent navigator={this.props.navigator}></this.state.centerComponent>
                </View>
                <View style={styles.bottomView}>
                    <TouchableOpacity activeOpacity={0.5} onPress={this._homeClick.bind(this)} >
                        <View style={this.state.homeView} >
                            <Image style={styles.bottomItemImage} source={this.state.homeImage} />
                            <Text style={this.state.homeText}>首页</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={this._maintenanceClick.bind(this)} >
                        <View style={this.state.maintenanceView}>
                            <Image style={styles.bottomItemImage} source={this.state.maintenanceImage} />
                            <Text style={this.state.maintenanceText}>运行维护</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={this._runqualityClick.bind(this)}  >
                        <View style={this.state.runqualityView}>
                            <Image style={styles.bottomItemImage} source={this.state.runqualityImage} />
                            <Text style={this.state.runqualityText
                            }>运行质量</Text>
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
        width: width / 3,
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
        width: width / 3,
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
// module.exports = Main;
