// 主页
import React from 'react';
import { View, Text, Image, AsyncStorage,ScrollView,TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import Weather from './weather';
import HeatList from './heat_list';
import HomeTab from './hometab';

// import Home from './home.ios';
import Setting from '../setting/setting';
import Warn from './warn';
import Constants from '../constants';
export default class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            data: null,
            company_code: "000005"
        };
        var _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {
                _this.setState({ company_code: result })
            }
        });
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var uri=Constants.serverSite + "/v1_0_0/totalData?company_code=" + _this.state.company_code + "&access_token=" + result;
                console.log(uri)
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ data: responseJson })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        )
    }

    openSetting() {
        const navigator = this.props.navigator;
        this.props.navigator.push({
            component: Setting,
        })
    }

    openWarn() {
        const navigator = this.props.navigator;
        this.props.navigator.push({
            component: Warn,
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.openSetting.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft: 10, }} source={require('../icons/home_nav_user_icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>首页</Text>
                    <TouchableOpacity style={styles.topImage} onPress={this.openWarn.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginRight: 10, }} source={require('../icons/home_nav_warn_icon.png')} />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                <Weather navigator={this.props.navigator} />
                <View style={[styles.line, { marginTop: 5, }]}>
                    <View style={styles.linehelf}>
                        <Image style={styles.lineImage} source={require('../icons/home1.png')} />
                        <Text style={styles.lineText}>换热站数量<Text style={styles.linevalue}>{this.state.data&&this.state.data.allSatations?this.state.data.allSatations.stationCounts:""}</Text><Text style={{ fontSize: 13 }}>个</Text></Text>
                    </View>
                    <View style={styles.linehelf}>
                        <Image style={styles.lineImage} source={require('../icons/home2.png')} />
                        <Text style={styles.lineText}>供热面积<Text style={styles.linevalue}>{this.state.data&&this.state.data.allSatations?this.state.data.allSatations.total_erea:""}</Text><Text style={{ fontSize: 13 }}>万㎡</Text></Text>
                    </View>
                </View>
                <View style={[styles.line, { marginTop: 1, }]}>
                    <View style={styles.linehelf}>
                        <Image style={styles.lineImage} source={require('../icons/home3.png')} />
                        <Text style={styles.lineText}>昨日热量<Text style={styles.linevalue}>{this.state.data&&this.state.data.allSatations?this.state.data.allSatationEnergy.hot_energy:""}</Text><Text style={{ fontSize: 13 }}>万GJ</Text></Text>
                    </View>
                    <View style={styles.linehelf}>
                        <Image style={styles.lineImage} source={require('../icons/home4.png')} />
                        <Text style={styles.lineText}>本周热量<Text style={styles.linevalue}>{this.state.data&&this.state.data.allSatations?this.state.data.weekDatas:""}</Text><Text style={{ fontSize: 13 }}>万GJ</Text></Text>
                    </View>
                </View>
                <HomeTab navigator={this.props.navigator} />
                <HeatList navigator={this.props.navigator} />
                </ScrollView>
            </View>

        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        //marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
    line: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 40,
        flexDirection: 'row',
        backgroundColor: "#fff"
    },
    lineImage: {
        width: 30,
        height: 32,
        //marginVertical:10,
        marginTop: 17,
    },
    lineText: {
        fontSize: 15,
        color: "#666668"
    },
    linevalue: {
        fontSize: 16,
        color: "#26a6ff"
    },
    linehelf: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',

    }

});