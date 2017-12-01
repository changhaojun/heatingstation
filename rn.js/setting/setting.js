/**
 * Created by Vector on 17/4/17.
 *
 * 设置页面
 *
 * 2017/11/5修改 by Vector.
 *      1、删除无用的模块导入
 *      2、隐藏状态栏
 *      3、优化代码逻辑
 *      4、修改个别图标样式问题
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    StatusBar,
    TouchableOpacity,
    AsyncStorage,
    Dimensions,
    Alert
} from 'react-native';
const { width, height } = Dimensions.get('window');

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

        const _this = this;
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
    delCache(){
        AsyncStorage.removeItem("history_search_station"); //清除搜索换热站历史
        Alert.alert('提示','清除完成');
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

                    <TouchableOpacity underlayColor="#ECEDEE" onPress={this.goMessage.bind(this)}>
                        <View style={styles.lineView}>
                            <Image style={styles.imageItem} source={require('../icons/message_icon.png')} />
                            <Text style={styles.textItem}>消息通知</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.lineView}>
                        <Image style={styles.imageItem} source={require('../icons/version_icon.png')} />
                        <Text style={styles.textItem}>应用版本 V1.0</Text>
                    </View>
                    <TouchableOpacity style={styles.lineView} onPress={()=>this.delCache()}>
                        <Image style={styles.imageItem} source={require('../icons/ico_clear.png')} />
                        <Text style={styles.textItem}>清除缓存</Text>
                    </TouchableOpacity>

                    <TouchableOpacity underlayColor="#ECEDEE" onPress={this.goAboutUS.bind(this)} >
                        <View style={styles.lineView}>
                            <Image style={styles.imageItem} source={require('../icons/us_icon.png')} />
                            <Text style={styles.textItem}>关于我们</Text>
                        </View>
                    </TouchableOpacity>
                    {/*<TouchableHighlight underlayColor="#ECEDEE" onPress={()=>this.props.navigator.push({component:InspectionWell})} >*/}
                        {/*<View style={styles.lineView}>*/}
                            {/*<Image style={{width:22,height:22,marginLeft:40,}} source={require('../icons/well.png')} />*/}
                            {/*<Text style={styles.textItem}>检查井录入</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}

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

const styles = StyleSheet.create({
    all: {
        flex: 1,
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