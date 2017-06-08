/**
 * Created by Vector on 17/4/17.
 */
// 这是运行质量页面 地图后面那个
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity,} from 'react-native';
import Dimensions from 'Dimensions';

var {width, height} = Dimensions.get('window');

import TotalEnergyChart from './total_energy_chart';
import Company from './company';


export default class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }
    back(){
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={true}  //status显示与隐藏
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='light-content' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon@2x.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>运行质量</Text>
                    {/*<TouchableOpacity style={styles.topImage} onPress={this.toNotice.bind(this)}>*/}
                    <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                </View>
                <View style={styles.chartView}>
                <TotalEnergyChart />
                </View>
                <Company style={styles.company} navigator={this.props.navigator}/>

            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        // backgroundColor: "#ffffff",
        // marginTop: 64,
    },
    company:{
        flex: 0.2,
        width: width,
        marginTop: -64,
    },
    searchView:{
        width:width - 40,
        height:38,
        borderColor:"#f2d6b8",
        borderWidth:1,
        // marginTop: 74,
        flexDirection: 'row',
        borderRadius:38,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    textInput:{
        flex:1,
        marginLeft:10,
    },
    topView:{
        flex:0.2,
        width:width,
        backgroundColor:'#f2d6b8',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    chartView:{
        // flex:0.2,
        // height: 200,
        backgroundColor: '#f2d6b8',
        // marginTop: -64,
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 64,
        backgroundColor: '#343439',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },

});
