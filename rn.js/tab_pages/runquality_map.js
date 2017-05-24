/**
 * Created by Vector on 17/5/11.
 *
 * 运行质量地图展示页面
 *
 * 此页面主要用来向用户通过地图的marker来展示当前设备的运行情况
 * 包含：设备的数据 设备的状态等...
 */

import React from 'react';
import {View, Text, Image,
    AsyncStorage, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');


import Orientation from 'react-native-orientation';
import WebViewBridge from 'react-native-webview-bridge';

import Runquality from '../component/runquality';
import CompanyChart from '../component/charts/company_chart';
import ChildCompanyChart from '../component/charts/child_company_chart';
import BranchChart from '../component/charts/branch_chart';
import StationChart from '../component/charts/station_chart';

export default class RunqualityMap extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
        };


        // 从本地存储中获取access_token
        var _this = this;
        AsyncStorage.getItem("access_token",function(errs,result){
            if (!errs) {
                _this.setState({access_token:result});
            }
            console.log(_this.state.access_token);
        });


        this.onBridgeMessage = this.onBridgeMessage.bind(this);
    }


    onBridgeMessage(message){

        var resource = message.split(",");

        var station_id = resource[0];
        var station_name = resource[1];
        var num = resource[2];
        var tagLevel = resource[3];

        console.log(station_id);
        console.log(station_name);
        console.log(num);
        console.log(tagLevel);


        const { webviewbridge } = this.refs;
        webviewbridge.sendToBridge(this.state.access_token);


        if(message !== "null"){

            if(tagLevel==0){
                this.props.navigator.push({
                    component: CompanyChart,
                    passProps: {
                        station_id:station_id,
                        station_name:station_name,
                        num:num,
                        tagLevel:tagLevel,

                    }
                })
            }

            if(tagLevel==1){
                this.props.navigator.push({
                    component: ChildCompanyChart,
                    passProps: {
                        station_id:station_id,
                        station_name:station_name,
                        num:num,
                        tagLevel:tagLevel,
                    }
                })
            }

            if(tagLevel==2){
                this.props.navigator.push({
                    component: BranchChart,
                    passProps: {
                        station_id:station_id,
                        station_name:station_name,
                        num:num,
                        tagLevel:tagLevel,
                    }
                })
            }

            if(tagLevel==3){
                this.props.navigator.push({
                    component: StationChart,
                    passProps: {
                        station_id:station_id,
                        station_name:station_name,
                        num:num,
                        tagLevel:tagLevel,
                    }
                })
            }
        }
    }

    openRunquality(){
        this.props.navigator.push({
            component: Runquality,
        })
    }


    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    backgroundColor='#343439'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='light-content' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.openRunquality.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_list_icon@2x.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>运行质量地图</Text>
                    {/*<TouchableOpacity style={styles.topImage} onPress={this.openWarn.bind(this)}>*/}
                        <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                </View>
                <WebViewBridge
                    ref="webviewbridge"
                    onBridgeMessage={this.onBridgeMessage.bind(this)}
                    scrollEnabled={false}
                    startInLoadingState={false}
                    automaticallyAdjustContentInsets={false}
                    source={require('../heatingmapwebview/mapshow.html')}
                    style={{backgroundColor: "rgb(244,243,239)",}}
                />
            </View>

        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
    },
    weather:{
        flex: 1,
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