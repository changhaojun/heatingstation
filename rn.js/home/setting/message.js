/**
 * Created by Vector on 17/4/19. 个人中心的消息通知
 */
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

export default class Message extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    backSetting(){
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.backSetting.bind(this)}>
                        <Image style={{ width: 25, height: 20, marginLeft:10, }}  resizeMode="contain" source={require('../../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>公告</Text>
                    <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 10, }} source={require('../../icons/nav_flag.png')}/>
                </View>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#ffffff",
        // marginTop: 20,
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
});