/**
 * Created by Vector on 17/4/24.组态
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    Platform,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    AsyncStorage,
    WebView
} from 'react-native';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');
import Constants from '../../../constants';
import Orientation from 'react-native-orientation';

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
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            batch: false,
            tag:0,
            access_token: null,
            system:0
        };
        
    }
    componentDidMount() {
        this._initialScrollIndexTimeout = setTimeout(
            () => {// 从本地存储中将access_token取出
                var _this = this;
                AsyncStorage.getItem("access_token", function (errs, result) {
                    if (!errs) {
                        _this.setState({ access_token: result });
                        _this.webview.postMessage("{type:'token',value:'" + result + "'}");
                        _this.updateData();
                    }
                });
            },
            1000,
        );
    }

    updateData() {
        var _this = this;
        setInterval(() => {
            if (_this.webview) {
                fetch(Constants.serverSite + "/v1_0_0/station/" + this.props.station_id + "/datas?access_token=" + this.state.access_token)
                    .then((response) => response.json())
                    .then((responseJson) => { 
                        if (_this.webview) {_this.webview.postMessage("{type:'data',value:" + JSON.stringify(responseJson) + "}");}
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

        }, 3000);

    }
     //点击反馈
    onBridgeMessage(message) {
        var tag = message.nativeEvent.data;
    }



    render() {
        var _this = this;
        return (
            <View style={styles.all}>
                <WebView
                    ref={webview => this.webview = webview}
                    startInLoadingState={true}
                    onMessage={this.onBridgeMessage.bind(this)}
                    scrollEnabled={true}
                    source={Platform.OS === 'ios' ? require("./scadawebview/scada_view.html") : { uri: 'file:///android_asset/scadawebview/scada_view.html' }}
                    scalesPageToFit={true}
                    automaticallyAdjustContentInsets={true}
                    style={{ backgroundColor: "rgb(36,50,74)"}}
                />
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#ffffff",
       
    },
    // modal的样式
    modalStyle: {
        // backgroundColor:'#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    // modal上子View的样式
    subView: {
        marginLeft: 30,
        marginRight: 30,
        maxHeight: 400,
        backgroundColor: '#ffffff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderColor: '#ccc',
    },
    // 标题
    titleText: {
        marginLeft: 10,
        fontSize: 14,
        textAlign: 'left',
    },
    // 按钮
    buttonView: {
        marginTop: -5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#3393F2',
        textAlign: 'center',
    },
    modalTitleView: {
        height: 39,
        backgroundColor: '#35aeff',
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
    },
    modalTitleViewImage: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    switchView: {
        height: 160,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        alignItems: "center",
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    confirmView: {
        height: 80,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },


    tabText: {
        padding: 12,
    },
});