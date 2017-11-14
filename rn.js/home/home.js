/**
 * Created by Vector on 17/4/18.
 *
 * 2017/11/5修改 by Vector.
 *      1、删除多余注释
 *      2、将部分var定义的变量改为const定义
 *      3、删除无用的模块导入
 *      4、删除无用的样式代码
 *
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Weather from './weather';
import HeatList from './heat_list';
import HomeTab from './hometab';
import Setting from '../setting/setting';
import Warn from './warn';
import Constants from '../constants';

const { width, height } = Dimensions.get('window');

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            company_code: "000005"
        };
        const _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {
                _this.setState({ company_code: result })
            }
        });
        AsyncStorage.getItem("company_id", function (errs, result) {
            if (!errs) {
                _this.setState({ company_id: result });
            }
        });
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var uri=Constants.serverSite + "/v1_0_0/totalData?company_code=" + _this.state.company_code + "&access_token=" + result+"&company_id=" + _this.state.company_id;
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
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
        this.props.navigator.push({
            component: Setting,
        })
    }

    openWarn() {
        this.props.navigator.push({
            component: Warn,
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <StatusBar
                    hidden={true}
                />
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
    },
    topNameText: {
        flex: 1,
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