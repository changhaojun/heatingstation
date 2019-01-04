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
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';


import Weather from './weather';
import FollowList from './follow_list';
import HomeTab from './hometab';
import Setting from '../setting/setting';
import Warn from './warn';
import Constants from '../constants';
import ScanningQR from './scanningQR';

const { width, height } = Dimensions.get('window');

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            company_code: "000005",
        };
        const _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {
              console.log(result)
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
                var uri = Constants.serverSite + "/v1_0_0/totalData?company_code=" + _this.state.company_code + "&access_token=" + result + "&company_id=" + _this.state.company_id;
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
            name:"Warn"
        })
        this.props.clearAlarm();
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.openSetting.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft: 10, }} source={require('../icons/home_nav_user_icon.png')} />
                    </TouchableOpacity>
                    <View style={styles.topImage}>
                        <Image style={{ width: 22, height: 22, marginLeft: 15, }} source={require('../icons/nav_flag.png')} />
                    </View>
                    <Text style={styles.topNameText}>首页</Text>
                    <TouchableOpacity style={styles.topImage} onPress={()=>this.props.navigator.push({component: ScanningQR})}>
                        <Image style={{ width: 22, height: 22, marginRight: 15, }} source={require('../icons/icon_scanning.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topImage} onPress={this.openWarn.bind(this)}>
                        <ImageBackground style={{ width: 25, height: 25, marginRight: 10, }} source={require('../icons/home_nav_warn_icon.png')} >
                            {this.props.alarm?<Text style={styles.alarmText}>{this.props.alarm}</Text>:null}
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <Weather navigator={this.props.navigator} />
                    <View style={[styles.line, { marginTop: 5, }]}>
                        <View style={styles.linehelf}>
                            <Image style={styles.lineImage} source={require('../icons/home1.png')} />
                            <Text style={styles.lineText}>换热站数量<Text style={styles.linevalue}>{this.state.data && this.state.data.allSatations ? this.state.data.allSatations.stationCounts : ""}</Text><Text style={{ fontSize: 13 }}>个</Text></Text>
                        </View>
                        <View style={styles.linehelf}>
                            <Image style={styles.lineImage} source={require('../icons/home2.png')} />
                            <Text style={styles.lineText}>供热面积<Text style={styles.linevalue}>{this.state.data && this.state.data.allSatations ? this.state.data.allSatations.total_erea : ""}</Text><Text style={{ fontSize: 13 }}>万㎡</Text></Text>
                        </View>
                    </View>
                    <View style={[styles.line, { marginTop: 1, }]}>
                        <View style={styles.linehelf}>
                            <Image style={styles.lineImage} source={require('../icons/home3.png')} />
                            <Text style={styles.lineText}>昨日热量<Text style={styles.linevalue}>{this.state.data && this.state.data.allSatations ? this.state.data.allSatationEnergy.hot_energy : ""}</Text><Text style={{ fontSize: 13 }}>万GJ</Text></Text>
                        </View>
                        <View style={styles.linehelf}>
                            <Image style={styles.lineImage} source={require('../icons/home4.png')} />
                            <Text style={styles.lineText}>本周热量<Text style={styles.linevalue}>{this.state.data && this.state.data.allSatations ? this.state.data.weekDatas : ""}</Text><Text style={{ fontSize: 13 }}>万GJ</Text></Text>
                        </View>
                    </View>
                    <HomeTab navigator={this.props.navigator} />
                    <FollowList navigator={this.props.navigator} />
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
        width: 20,
        height: 20,
        //marginVertical:10,
        marginHorizontal: 5,
    },
    lineText: {
        fontSize: 15,
        color: "#7c7e7f"
    },
    linevalue: {
        fontSize: 16,
        color: "#000"
    },
    linehelf: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    alarmText:{
        color:"#fff",
        paddingLeft:5,
        paddingRight:5,
        textAlign:"center",
        fontSize:10,
        backgroundColor:"red",
        borderRadius:10,
        marginRight:-5,
        alignSelf:"flex-end"
    }

});