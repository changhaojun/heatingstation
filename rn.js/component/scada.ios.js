/**
 * Created by Vector on 17/4/24.
 */
import React from 'react';
import {View, Text, Image, TextInput, Modal, AlertIOS,
    Slider, Switch, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity, AsyncStorage} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import Orientation from 'react-native-orientation';
import WebViewBridge from 'react-native-webview-bridge';

// 获取当期的时间戳
var now = new Date();
// 获取年份(整年)
var years = now.getFullYear();
// 获取月份
var months = now.getMonth();
// 获取当前日
var days = now.getDay();
// 获取当前小时
var hours = now.getHours();
// 获取当前分钟
var minutes = now.getMinutes();
// 获取当前秒
var seconds = now.getSeconds();

export default class Scada extends React.Component {

    // componentWillMount() {
    //     Orientation.lockToLandscape();
    // }
    //
    //
    // var initial = Orientation.getInitialOrientation();
    // componentWillUnmount() {
    //     var initial = Orientation.getInitialOrientation();
    //     if (initial !== 'PORTRAIT') {
    //         Orientation.lockToPortrait();
    //     } else {
    //         Orientation.lockToPortrait();
    //     }
    //
    // }

    constructor(props) {
        super(props);
        this.state = {
            show:false,
            remember:false,


            appear:false,

            sliderValue:0,
            minValue: 0,
            maxValue: 100,

            confirm: '下发',
            confirmTime: years+"-"+months+"-"+days+" "+hours+":"+minutes+":"+seconds,
            value: 0,

            access_token: null,
            base_url: "http://121.42.253.149:18815/list/group?accessToken=",
            start_url: "",
            // uri: "http://192.168.1.106:8080/list/group?station_name=瑾华小区&accessToken=59141b5ef77ace00059f37fb&station_id=58f0844316f12022002098b3",
            // uri: "http://114.215.154.122/reli/com.finfosoft.scada.view.ScadaViewForDevice.d?node_id=3&node_type=2",
        };

        // 从本地存储中将company_id和access_token取出
        var _this = this;
        AsyncStorage.getItem("access_token",function(errs,result){
            if (!errs) {
                _this.setState({access_token:result});
            }
            _this.setState({
                start_url: _this.state.base_url + _this.state.access_token + "&station_name=" + _this.props.station_name + "&station_id=" + _this.props.station_id,
            })

            console.log(_this.state.start_url);
        });

        this.onBridgeMessage = this.onBridgeMessage.bind(this);
    }

    onBridgeMessage(message){
        // console.log('wk8--------onBridgeMessage'+message);
        switch(message){
            case "1":
                //_setConfirmtModalVisible();
                this._setSwitchModalVisible();
                // console.log(message);
                // this.props.navigator.push({
                //     component: Test,
                //     passProps: {
                //         message:message,
                //
                //     }
                // })
                break;
            case "2":
                this._setConfirmtModalVisible();
                break;
        }
    }

    _setConfirmtModalVisible() {
        this.setState({
            value:  this.state.sliderValue,
        });
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }


    _setSwitchModalVisible() {
        let isAppear = this.state.appear;
        this.setState({
            appear:!isAppear,
        });
    }


    back(){
        Orientation.lockToPortrait();
        this.props.navigator.pop();
    }

    switch(checked){
        this.setState({
            remember: checked,
        })
        if(!this.state.remember){
            console.log("打开");
        }
    }

    confirm(){
        AlertIOS.alert(
            '提示',
            '下发成功',
            //this.state.sliderValue.toString(),
        );
    }


    render() {
        var _this = this;
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={true}  //status显示与隐藏
                    backgroundColor='red'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='light-content' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 20, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>组态</Text>
                    <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 20, }} source={require('../icons/nav_flag.png')}/>
                </View>

                <WebViewBridge
                    ref="webviewbridge"
                    onBridgeMessage={this.onBridgeMessage}
                    scrollEnabled={false}
                    javaScriptEnabled={true}
                    source={{uri: this.state.start_url}}
                    scalesPageToFit={true}
                    automaticallyAdjustContentInsets={false}
                    style={{ backgroundColor: "#f2d6b8",}}
                />


                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.modalStyle}>
                        <View style={styles.subView}>
                            <View style={styles.modalTitleView}>
                                <Text style={styles.titleText}>
                                    设置阀门开度
                                </Text>
                                <TouchableOpacity activeOpacity={ 0.5 } onPress={this._setConfirmtModalVisible.bind(this)}>
                                    <Image source={require('../icons/cancel_icon@2x.png')} style={styles.modalTitleViewImage} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.sliderView}>
                                <Text style={{fontSize:30, color:'#E0960A',marginTop: 20,}}>{parseInt((this.state.sliderValue)*100)}</Text>
                            </View>
                            <View style={styles.sliderView}>
                                <Text style={{}}> {this.state.minValue} </Text>
                                <Slider  style={{flex:0.8}}
                                         value={this.state.value}
                                         onSlidingComplete={()=>console.log('当前的值为'+this.state.sliderValue)}
                                         onValueChange={(sliderValue)=>this.setState({sliderValue:sliderValue})}/>
                                <Text style={{}}> {this.state.maxValue} </Text>
                            </View>
                            <View style={styles.confirmView}>
                                <TouchableOpacity activeOpacity={ 0.5 } onPress={this.confirm.bind(this)}>
                                    <View style={{backgroundColor: '#E0960A',height:30,width:100,borderRadius:50,flexDirection: 'row', justifyContent: 'center', alignItems:'center',}}>
                                        <Text style={{fontSize:14, color: '#ffffff'}}>{this.state.confirm}</Text>
                                    </View>
                                </TouchableOpacity>
                                <Text style={{marginTop:10,color:'#939495' }}>{this.state.confirmTime}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.appear}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.modalStyle}>
                        <View style={styles.subView}>
                            <View style={styles.modalTitleView}>
                                <Text style={styles.titleText}>
                                    阀门
                                </Text>
                                <TouchableHighlight underlayColor='transparent' onPress={this._setSwitchModalVisible.bind(this)}>
                                    <Image source={require('../icons/cancel_icon@2x.png')} style={styles.modalTitleViewImage} />
                                </TouchableHighlight>
                            </View>
                            <View style={styles.switchView}>
                                <View style={styles.switch}>
                                    <Text style={{marginRight:10, color:'#9D9E9F'}}>关闭</Text>
                                    <Switch
                                        value={this.state.remember}
                                        onTintColor={"#f2d6b8"}
                                        thumbTintColor={"#E0960A"}
                                        onValueChange={(checked) => this.switch(checked)}
                                    />

                                    <Text style={{marginLeft:10, color:'#E0960A'}}>打开</Text>
                                </View>
                                <Text style={{marginTop: 50}}>2017-02-06 12:45:36</Text>
                            </View>
                        </View>
                    </View>
                </Modal>

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
        // borderBottomWidth:1,
        // borderColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        marginTop: 20,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
    // modal的样式
    modalStyle: {
        // backgroundColor:'#ccc',
        alignItems: 'center',
        justifyContent:'center',
        flex:1,
    },
    // modal上子View的样式
    subView:{
        marginLeft:60,
        marginRight:60,
        backgroundColor:'#ffffff',
        alignSelf: 'stretch',
        justifyContent:'center',
        borderColor:'#ccc',
    },
    // 标题
    titleText:{
        marginLeft:10,
        fontSize:14,
        textAlign:'left',
    },
    // 按钮
    buttonView:{
        marginTop: -5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle:{
        flex:1,
        height:50,
        alignItems: 'center',
        justifyContent:'center',
    },
    buttonText:{
        fontSize:16,
        color:'#3393F2',
        textAlign:'center',
    },
    modalTitleView:{
        height: 30,
        backgroundColor: '#f2d6b8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalTitleViewImage:{
        width: 20,
        height: 20,
        marginRight: 10,
    },
    switchView:{
        height: 160,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        alignItems: "center",
    },
    switch:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    sliderView:{
        height: 30,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sliderView:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmView:{
        height:80,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    }
});