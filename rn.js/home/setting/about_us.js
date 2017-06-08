/**
 * Created by Vector on 17/4/19.关于我们
 */
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

export default class Home extends React.Component {


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
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    backgroundColor='red'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='light-content' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.backSetting.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>关于我们</Text>
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../../icons/nav_flag.png')}/>
                </View>
                <Text style={{fontSize:15, paddingLeft:5, paddingRight:5, paddingTop:15,fontWeight: '300',color:'#343439'}}>
                      智信远景拥有一支由计算机技术、自动化控制的专家及经营者组成的核心团队。更与国际著名的麻省理工学院及清华大学等HVAC智信远景秉承"卓越、专业以及创新"的产品理念，追求创新，视挑战为机遇，致力于为用户提供卓越的产品与服务。
                </Text>
                <Text style={{fontSize:15, paddingLeft:5, paddingRight:5, paddingTop:5,fontWeight: '300',color:'#343439'}}>
                      智信远景员工80%为本科以上学历，硕士以上学历比例占到15%,研发技术人员占到30%。在网络技术，嵌入式硬件技术，软件技术，互联网技术等方面均有高级专业人才。
                </Text>
                <Text style={{fontSize:15, paddingLeft:5, paddingRight:5, paddingTop:5,fontWeight: '300',color:'#343439'}}>
                      智信远景秉承"卓越、专业、创新"的产品理念，追求创新，视挑战为机遇，致力于为用户提供卓越的产品与服务。智信远景坚信"诚实守信，共谋发展"的态度，服务客户和合作伙伴，努力成为值得信赖高科技企业。
                </Text>

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
        height: 64,
        backgroundColor: '#343439',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
});
