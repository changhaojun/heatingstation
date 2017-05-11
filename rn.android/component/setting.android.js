/**
 * Created by Vector on 17/4/17.
 */
// 设置页面
import React from 'react';
import {View, Text, Image, TextInput, Navigator, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity,Button,
    AsyncStorage,} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');


import AboutUS from './about_us.android';
import Message from './message.android';
import Login from '../login.android';
export default class Setting extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            userName: '',
        };

        // 将用户名从本地储存拿出，并更新状态机
        var _this = this;
        AsyncStorage.getItem("userName",function(errs,result){
            if (!errs) {
                _this.setState({userName:result});
            }
        });
    }


    backHome(){
        this.props.navigator.pop();
    }

    exit(){
        this.props.navigator.replace({
            component:Login,
        })
    }

    goAboutUS(){
        this.props.navigator.push({
            component: AboutUS,
        })
    }
    
    goMessage(){
        this.props.navigator.push({
            component: Message,
        })
    }

    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={true}  //status显示与隐藏
                />
                <View style={styles.topView}>
                    {/*<View style={styles.navView}>*/}
                        {/*<Image source={require('../icons/nav_back.png')} style={{ width: 20, height: 20, marginLeft: 10,}}></Image>*/}
                        {/*<Text style={{fontSize:18, textAlign: 'center'}}>个人中心</Text>*/}
                    {/*</View>*/}
                    <View style={styles.navView}>
                    <TouchableOpacity onPress={this.backHome.bind(this)}>
                    <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>个人中心</Text>
                    {/*<TouchableOpacity style={styles.topImage} onPress={this.toNotice.bind(this)}>*/}
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                    </View>
                    <View style={styles.imageView}>
                        <Image style={{width: 90, height: 90,}} source={require('../images/touxiang.png')}/>
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <View style={styles.userView}>
                        <Image style={styles.imageItem} source={require('../icons/user_icon.png')}/>
                        <Text style={styles.textItem}>用户名 {this.state.userName}</Text>
                    </View>
                    
                    <TouchableHighlight underlayColor="#ECEDEE" onPress={this.goMessage.bind(this)} style={styles.aboutView}>
                    <View style={styles.messageView}>
                        <Image style={styles.imageItem} source={require('../icons/message_icon.png')}/>
                        <Text style={styles.textItem}>消息通知</Text>
                    </View>
                    </TouchableHighlight>
                    
                    <View style={styles.versionView}>
                        <Image style={styles.imageItem} source={require('../icons/version_icon.png')}/>
                        <Text style={styles.textItem}>应用版本 V1.0</Text>
                    </View>

                    <TouchableHighlight underlayColor="#ECEDEE" onPress={this.goAboutUS.bind(this)} style={styles.aboutView}>
                    <View style={styles.aboutView}>
                            <Image style={styles.imageItem} source={require('../icons/us_icon.png')}/>
                            <Text style={styles.textItem}>关于我们</Text>
                    </View>
                    </TouchableHighlight>

                    <View style={styles.exitButtonView}>
                        <TouchableOpacity onPress={this.exit.bind(this)}>
                            <View style={styles.exitButton}>
                                <Text style={{fontSize:16}}>退出当前账户</Text>
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
    topView:{
        width: width,
        height: 180,
        backgroundColor: "#f2d6b8",
        flexDirection: 'column',
    },
    bottomView:{
        flex:1,
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 64,
        backgroundColor: '#f2d6b8',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#000000",
        fontSize: 19,
    },
    imageView:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:"center",
     },
    userView:{
        flex:0.15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageView:{
        flex:0.15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    versionView:{
        flex:0.15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    aboutView:{
        flex:0.15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    exitButtonView:{
        flex:0.4,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageItem:{
        width: 22,
        height: 20,
        marginLeft:40,
    },
    textItem:{
        marginLeft: 30,
        fontSize: 16,
    },
    exitButton:{
        width: width - 60,
        height: 50,
        backgroundColor: '#f2d6b8',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

});