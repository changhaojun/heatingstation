/**
 * Created by Vector on 17/4/17.
 */
// 个人中心页面
import React from 'react';
import {
    View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity, Button,
    AsyncStorage,
} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import InspectionWell from "./inspection_well"
import AboutUS from './about_us';
import Message from './message';
import Login from  '../login';

export default class Setting extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            userName: '',
        };

        // 将用户名从本地储存拿出，并更新状态机
        var _this = this;
        AsyncStorage.getItem("userName", function (errs, result) {
            if (!errs) {
                _this.setState({ userName: result });
            }
        });
    }


    backHome() {
        this.props.navigator.pop();
    }

    exit() {
        this.props.navigator.replace({
            component:Login,
        })
    }

    goAboutUS() {
        this.props.navigator.push({
            component: AboutUS,
        })
    }

    goMessage() {
        this.props.navigator.push({
            component: Message,
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.topView}>
                    <View style={styles.navView}>
                        <TouchableOpacity onPress={this.backHome.bind(this)}>
                            <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                        </TouchableOpacity>
                        <Text style={styles.topNameText}>个人中心</Text>
                        <Image style={{ width: 25, height: 25, marginRight: 10, marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    </View>
                    <View style={styles.imageView}>
                        <Image style={{ width: 90, height: 90, }} source={require('../images/touxiang.png')} />
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <View style={styles.lineView}>
                        <Image style={styles.imageItem} source={require('../icons/user_icon.png')} />
                        <Text style={styles.textItem}>用户名 {this.state.userName}</Text>
                    </View>

                    <TouchableHighlight underlayColor="#ECEDEE" onPress={this.goMessage.bind(this)}>
                        <View style={styles.lineView}>
                            <Image style={styles.imageItem} source={require('../icons/message_icon.png')} />
                            <Text style={styles.textItem}>消息通知</Text>
                        </View>
                    </TouchableHighlight>

                    <View style={styles.lineView}>
                        <Image style={styles.imageItem} source={require('../icons/version_icon.png')} />
                        <Text style={styles.textItem}>应用版本 V1.0</Text>
                    </View>

                    <TouchableHighlight underlayColor="#ECEDEE" onPress={this.goAboutUS.bind(this)} >
                        <View style={styles.lineView}>
                            <Image style={styles.imageItem} source={require('../icons/us_icon.png')} />
                            <Text style={styles.textItem}>关于我们</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#ECEDEE" onPress={()=>this.props.navigator.push({component:InspectionWell})} >
                        <View style={styles.lineView}>
                            <Image style={styles.imageItem} source={require('../icons/well.png')} />
                            <Text style={styles.textItem}>检查井录入</Text>
                        </View>
                    </TouchableHighlight>

                    <View style={styles.exitButtonView}>
                        <TouchableOpacity onPress={this.exit.bind(this)}>
                            <View style={styles.exitButton}>
                                <Text style={{ fontSize: 16, color: "#ffffff" }}>退出当前账户</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        // backgroundColor: "#ffffff",
        flexDirection: 'column',
    },
    topView: {
        width: width,
        height: 180,
        backgroundColor: "#343439",
        flexDirection: 'column',
    },
    bottomView: {
        flex: 1,
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
        //marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
    imageView: {
        flex: 1,
        backgroundColor:"#434b59",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
    },
    lineView: {
        //flex:0.15,
        paddingVertical: 18,
        backgroundColor: "#fff",
        flexDirection: 'row',
        alignItems: 'center',
    },
    exitButtonView: {
        flex: 0.4,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageItem: {
        width: 22,
        height: 20,
        marginLeft: 40,
    },
    textItem: {
        marginLeft: 30,
        fontSize: 16,
    },
    exitButton: {
        width: width - 60,
        height: 45,
        backgroundColor: '#0099FF',
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

});