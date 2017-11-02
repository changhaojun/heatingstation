// 主页
import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, Platform, TouchableOpacity, StatusBar, Switch, AsyncStorage } from 'react-native';
var Alert = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();
import Dimensions from 'Dimensions';
import Constants from './constants';
var { width, height } = Dimensions.get('window');

import Main from './main';
export default class Login extends React.Component {
    // 初始化数据
    constructor(props) {
        super(props);
        this.state = {
            userName: null,
            passWord: null,
            remember: false,

            company_id: null,
            access_token: null,
            refresh_token: null,
        };
        var _this = this;
        // 将用户名、密码从本地存储中提取出来，并更新状态机
        AsyncStorage.getItem("userName", function (errs, result) {
            if (!errs) {

                _this.setState({ userName: result });
                console.log(_this.state.userName);
            }
        });
        AsyncStorage.getItem("passWord", function (errs, result) {
            if (!errs) {
                _this.setState({ passWord: result });

                console.log(_this.state.passWord);
                if (_this.state.userName != null && _this.state.passWord != null) {
                    _this.setState({ remember: true });
                }
            }
        });
    }
    //登录按钮事件
    login() {
        const navigator = this.props.navigator;//上一个页面传过来的值
        console.log(Constants.serverSite+"/authorize/authorize?client_id=heat&client_secret=heat&username=" + this.state.userName + "&password=" + this.state.passWord)
        fetch(Constants.serverSite+"/authorize/authorize?client_id=heat&client_secret=heat&username=" + this.state.userName + "&password=" + this.state.passWord)
            .then((response) => response.json())
            .then((responseJson) => {
                if (navigator && responseJson.code == 200) {
                    if (this.state.remember) {
                        //存储账号密码
                        AsyncStorage.setItem("userName", this.state.userName, function (errs) {});
                        AsyncStorage.setItem("passWord", this.state.passWord, function (errs) {});
                    }
                    console.log(responseJson.access_token);
                    AsyncStorage.setItem("company_location", responseJson.company_location, function (errs) {});
                    AsyncStorage.setItem("access_token", responseJson.access_token, function (errs) {});
                    AsyncStorage.setItem("fullname", responseJson.fullname, function (errs) {});
                    AsyncStorage.setItem("company_id", responseJson.company_id, function (errs) {});
                    AsyncStorage.setItem("company_code", responseJson.company_code, function (errs) {});


                    //跳转
                    navigator.replace({
                        name: 'Main',
                        component: Main,
                    })
                } else {
                    Alert.alert(
                        '有问题',
                        '帐号或密码错误',
                    );
                }
            })
            .catch((error) => {
                console.log(error)
                Alert.alert(
                    '提示',
                    '网络连接失败',
                );
            });
    }

    render() {
        return (
            //  最外层主View
            <View style={styles.all}>
                
                {/*顶部放置Logo的View*/}
                <View style={styles.topView}>
                    <Image source={require('./images/login_logo.png')} style={styles.logo}></Image>
                    <Text style={styles.logoTitle}>智慧供热系统</Text>
                </View>

                {/*中部放置表单的View*/}
                <View style={styles.middleView}>

                    {/*用户名的View*/}
                    <View style={styles.inputView}>
                        <View style={styles.formArea}>
                            <Text style={styles.formText}>账号</Text>
                            <TextInput style={styles.formInputText}
                                placeholder={"请输入您的账号"}
                                placeholderTextColor={'#808080'}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(userName) => this.setState({ userName })}
                                defaultValue={this.state.userName}>
                            </TextInput>
                        </View>
                        <View style={styles.underline}></View>
                    </View>
                    {/*密码的View*/}
                    <View style={styles.inputView}>
                        <View style={styles.formArea}>
                            <Text style={styles.formText}>密码</Text>
                            <TextInput style={styles.formInputText}
                                placeholder={"请输入您的密码"}
                                placeholderTextColor={'#808080'}
                                onChangeText={(passWord) => this.setState({ passWord })}
                                secureTextEntry={true}
                                underlineColorAndroid={'transparent'}
                                defaultValue={this.state.passWord}>
                            </TextInput>
                        </View>
                        <View style={styles.underline}></View>
                    </View>
                    <View style={styles.switchView}>
                        <Switch
                            value={this.state.remember}
                            onTintColor={"#0099FF"}
                            onValueChange={(checked) => this.setState({ remember: checked })}>
                        </Switch>
                        <Text style={styles.rememberText}>记住密码</Text>
                    </View>
                </View>

                {/*底部是放置登录按钮和公司信息的View*/}
                <View style={styles.bottomView}>
                    <TouchableOpacity activeOpacity={0.7} onPress={this.login.bind(this)} style={styles.buttonView}>
                        <Text style={styles.buttonText}>登录</Text>
                    </TouchableOpacity>
                    <Text style={styles.companyInfoText}>北京智信远景软件技术有限公司</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    topView: {
        flex: 0.4,
        backgroundColor: "#ffffff",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
    },
    middleView: {
        flex: 0.25,
        flexDirection: "column",
    },
    bottomView: {
        flex: 0.4,
        flexDirection: 'column',
        alignItems: "center",
    },
    logo: {
        width: 80,
        height: 53,
        //根据宽度或者高度自适应图片大小
        // resizeMode:Image.resizeMode.contain,
    },
    logoTitle: {
        fontSize: 22,
        color: "#0099FF",
        fontWeight: "300",
        paddingTop: 20,
    },
    inputView: {
        flexDirection: 'column',
        marginLeft: 30,
        width: width - 60,
        ...Platform.select({
            ios: {
                marginTop: 20,
            },
            android: {
                height: 70,
            },
        }),
    },
    formArea: {
        flexDirection: 'row',
    },
    formText: {
        fontSize: 16,
        color: "#575859",
        ...Platform.select({
            android: {
                marginTop: 17,
            },
        }),
    },
    formInputText: {
        marginLeft: 10,
        width: 250,
        fontSize: 16,
        color: '#000000',
        ...Platform.select({
            android: {
                marginTop: 10,
                height: 40,
            },
        }),
        // borderWidth: 2,
    },
    underline: {
        width: width - 60,
        height: 1,
        backgroundColor: "#A5A6A7",
        marginTop: 4,
    },
    switchView: {
        marginLeft: 30,
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 20,
    },
    rememberText: {
        fontSize: 16,
        fontWeight: "200",
        marginLeft: 10,
        color: '#000000',
    },
    buttonView: {
        width: width - 80,
        height: 48,
        backgroundColor: '#0099FF',
        borderRadius: 48,
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#ffffff',
    },
    companyInfoText: {
        fontSize: 16,
        color: '#0099FF',
        marginTop: height / 6,
    }
});
module.exports = Login;
