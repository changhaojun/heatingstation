/**
 * Created by Vector on 17/4/15.
 *
 * 登录页面
 *
 * 2017/11/5修改 by Vector.
 *      1、将登录提示由强提示改为弱提示
 *      2、删除无用的模块导入
 *      3、删除多余注释和无用代码
 *      4、为本地存储信息失败加入弱提示
 *
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Platform,
    TouchableOpacity,
    StatusBar,
    Switch,
    AsyncStorage,
    Dimensions
} from 'react-native';

import Toast from 'react-native-simple-toast';
import Constants from './constants';
import Main from './main';

const { width, height } = Dimensions.get('window');

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

        const _this = this;
        // 将用户名、密码从本地存储中提取出来，并更新状态机
        AsyncStorage.getItem("userName", function (errs, result) {
            if (!errs) {
                _this.setState({ userName: result });
            }
        });
        AsyncStorage.getItem("passWord", function (errs, result) {
            if (!errs) {
                _this.setState({ passWord: result });
                if (_this.state.userName !== null && _this.state.passWord !== null) {
                    _this.setState({ remember: true });
                }
            }
        });
    }
    //登录按钮事件
    login() {
        const navigator = this.props.navigator;
        console.log(Constants.serverSite+"/authorize/authorize?client_id=heat&client_secret=heat&username=" + this.state.userName + "&password=" + this.state.passWord)
        fetch(Constants.serverSite+"/authorize/authorize?client_id=heat&client_secret=heat&username=" + this.state.userName + "&password=" + this.state.passWord)
            .then((response) => response.json())
            .then((responseJson) => {
                if (navigator && responseJson.code === 200) {

                    if (this.state.remember) {
                        AsyncStorage.setItem("userName", this.state.userName, function (errs) {
                            // Toast.showWithGravity("存储账号失败",Toast.SHORT,Toast.BOTTOM);
                        });
                        AsyncStorage.setItem("passWord", this.state.passWord, function (errs) {
                            // Toast.showWithGravity("存储密码失败",Toast.SHORT,Toast.CENTER);
                        });
                    }
                    AsyncStorage.setItem("company_location", responseJson.company_location, function (errs) {
                        // Toast.showWithGravity("存储company_location失败",Toast.SHORT,Toast.CENTER);
                    });
                    AsyncStorage.setItem("access_token", responseJson.access_token, function (errs) {
                        // Toast.showWithGravity("存储access_token失败",Toast.SHORT,Toast.CENTER);
                    });
                    AsyncStorage.setItem("fullname", responseJson.fullname, function (errs) {
                        // Toast.showWithGravity("存储fullname失败",Toast.SHORT,Toast.CENTER);
                    });
                    AsyncStorage.setItem("company_id", responseJson.company_id, function (errs) {
                        // Toast.showWithGravity("存储company_id失败",Toast.SHORT,Toast.CENTER);
                    });
                    AsyncStorage.setItem("company_code", responseJson.company_code, function (errs) {
                        // Toast.showWithGravity("存储company_code失败",Toast.SHORT,Toast.CENTER);
                    });

                    //跳转
                    navigator.replace({
                        name: 'Main',
                        component: Main,
                    })
                } else {
                    Toast.showWithGravity("账号或密码错误",Toast.SHORT,Toast.CENTER)
                }
            })
            .catch(() => {
                Toast.showWithGravity("网络连接错误",Toast.SHORT,Toast.CENTER)
            });
    }

    render() {
        return (
            //  最外层主View
            <View style={styles.all}>
                <StatusBar hidden={true}/>
                {/*顶部放置Logo的View*/}
                <View style={styles.topView}>
                    <Image source={require('./images/login_logo.png')} style={styles.logo}/>
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
                        <View style={styles.underline}>
                        </View>
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
                        <View style={styles.underline}>
                        </View>
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
