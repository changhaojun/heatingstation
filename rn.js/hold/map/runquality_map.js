/**
 * Created by Vector on 17/5/11.
 *
 * 运行质量地图展示页面
 *
 * 此页面主要用来向用户通过地图的marker来展示当前设备的运行情况
 * 包含：设备的数据 设备的状态等...
 */

import React from 'react';
import {
    View, Text, Image, AsyncStorage, TextInput, Modal, ListView, NavigatorIOS, StyleSheet, StatusBar, TouchableOpacity, WebView
} from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');
import Orientation from 'react-native-orientation';

import CompanyChart from './map_chart/company_chart';
import ChildCompanyChart from './map_chart/child_company_chart';
import BranchChart from './map_chart/branch_chart';
import MapChart from './waterchart';

export default class RunqualityMap extends React.Component {


    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            access_token: '',
            text: "",
            tagList: [],
            dataList: [],
            tagListShow: false,
            dataListShow: false,
            tagListSource: ds.cloneWithRows([]),
            dataListSource: ds.cloneWithRows([]),
        };

        // 从本地存储中获取access_token
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                _this.setState({ access_token: result });
            }
            console.log(_this.state.access_token);
        });
    }


    searchSubmit() {
        this.webview.postMessage("{type:'search',value:'" + this.state.text + "'}");
    }
    changeTag(tag_id){
        this.setState({ tagListShow: false });
        this.webview.postMessage("{type:'tag',value:" + tag_id + "}");
    }
    changeCenter(location){
        this.setState({ dataListShow: false });
        this.webview.postMessage("{type:'center',value:'" + location + "'}");
    }

    onBridgeMessage(message) {
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        console.log(message.nativeEvent.data);
        var data = eval("(" + message.nativeEvent.data + ")");
        switch (data.type) {
            case "data": {
                this.setState({
                    dataList: data.data,
                    dataListSource: ds.cloneWithRows(data.data),
                });
                break;
            }
            case "tag": {
                this.setState({
                    tagList: data.data,
                    tagListSource: ds.cloneWithRows(data.data),
                });
                console.log(data.data)
                break;
            }
            case "click": {
                var _id=this.state.dataList[data.index].heating_station_id?this.state.dataList[data.index].heating_station_id:this.state.dataList[data.index].branch_id?this.state.dataList[data.index].branch_id:this.state.dataList[data.index].company_id;
                this.props.navigator.push({
                    component: MapChart,
                    passProps: {
                        _id:_id,
                        tag:data.tag,
                        level:data.level,
                    }
                })
                break;
            }
        }
    }


    openRunquality() {
        this.props.navigator.push({
            component: Runquality,
        })
    }



    render() {
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
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
                    <TouchableOpacity onPress={() => this.setState({ tagListShow: true })}>
                        <Image style={styles.topImage} source={require('../icons/map_tag.png')} />
                    </TouchableOpacity>
                    <View style={styles.searchImageView}>
                        <Image style={styles.searchImage} source={require('../icons/map_search.png')} />
                    </View>
                    <TextInput
                        style={styles.topInputText}
                        returnKeyType={"search"}
                        returnKeyLabel={"search"}
                        onSubmitEditing={this.searchSubmit.bind(this)}
                        underlineColorAndroid={"transparent"}
                        placeholder={"搜索"}
                        onChangeText={(text) => this.setState({ text })}>{this.state.text}</TextInput>
                    <TouchableOpacity onPress={() => { this.setState({ dataListShow: true }); console.log(this.state.dataList.length) }} >
                        <Image style={styles.topImage} source={require('../icons/map_list.png')} />
                    </TouchableOpacity>
                </View>
                <WebView
                    ref={webview => this.webview = webview}
                    onMessage={this.onBridgeMessage.bind(this)}
                    injectedJavaScript={"window.access_token='" + this.state.access_token + "';"}
                    source={require('./mapwebview/mapshow.html')}
                />


                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.dataListShow}
                    onRequestClose={() => { }}>
                    <TouchableOpacity onPress={() => this.setState({ dataListShow: false })} style={styles.all}>
                        <ListView
                            style={styles.dataList}
                            enableEmptySections={true}
                            dataSource={this.state.dataListSource}
                            renderRow={(rowData) => <Text style={styles.tagText} onPress={this.changeCenter.bind(this,rowData.location)}>{rowData.company_name}{rowData.branch_name}{rowData.heating_station_name}</Text>}
                        />
                    </TouchableOpacity>
                </Modal>
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.tagListShow}
                    onRequestClose={() => { }}>
                    <TouchableOpacity onPress={() => this.setState({ tagListShow: false })} style={styles.all}>
                        <View style={styles.tagView}>
                            <Image style={styles.sj} source={require('../icons/sanjiao.png')} />
                            <ListView
                                style={styles.tagList}
                                enableEmptySections={true}
                                dataSource={this.state.tagListSource}
                                renderRow={(rowData) =>
                                    <Text onPress={this.changeTag.bind(this,rowData._id)} style={styles.tagText}>● {rowData.tag_name}</Text>
                                }
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
    },
    weather: {
        flex: 1,
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 74,
        backgroundColor: '#343439',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#C3AB90',
    },
    searchImageView: {
        height: 28,
        width: 28,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginTop: 20,
        backgroundColor: "#ffffff",
    },
    searchImage: {
        height: 20,
        width: 20,
        margin: 5,
    },
    topInputText: {
        flex: 1,
        marginTop: 30,
        padding: 0,
        marginBottom: 10,
        color: "#000",
        fontSize: 15,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: "#ffffff",
    },
    topImage: {
        width: 20,
        height: 20,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    tagView: {
        width: 125,
        marginTop: 50,
        marginLeft: 5,
    },
    tagList: {
        backgroundColor: "#343439",
        padding:10,
    },
    tagText:{
        color:"#fff",
        borderBottomWidth:1,
        borderBottomColor:"#fff",
        fontSize:16,
        marginTop:3,
        paddingBottom:3,
        textAlign:"center"
    },
    sj: {
        width: 10,
        height: 10,
        marginLeft: 10,
    },
    dataList:{
        marginTop: 50,
        backgroundColor: "#34343944",
        padding:10,
        marginBottom: 50,
    },

});