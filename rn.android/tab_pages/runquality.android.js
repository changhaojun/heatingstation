/**
 * Created by Vector on 17/4/17.
 */
// 这是运行质量页面
import React from 'react';
import {View, Text, Image, TextInput, Navigator, StyleSheet, TouchableHighlight, StatusBar, TouchableOpacity,} from 'react-native';
import Dimensions from 'Dimensions';

var {width, height} = Dimensions.get('window');
// import WebViewBridge from 'react-native-webview-bridge';
//
// import Test from '../tab_pages/test.ios';

// import TotalEnergyChart from '../component/total_energy_chart.ios';
// import Company from '../component/company.ios';
// import HeatMap from '../component/heat_map.ios';


export default class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};

        // this.onBridgeMessage = this.onBridgeMessage.bind(this);
    }

    // onBridgeMessage(message){
    //     // console.log('wk8--------onBridgeMessage'+message);
    //     switch(message){
    //         case message:
    //             // console.log("兄弟们，我们H5单击了");
    //             this.props.navigator.push({
    //                 component: Test,
    //             })
    //             break;
    //     }
    // }

    // goToHeatMap(){
    //     const navigator = this.props.navigator;
    //     this.props.navigator.push({
    //         component: HeatMap,
    //     })
    // }

    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={true}  //status显示与隐藏
                />
                <View style={styles.navView}>
                    {/*<TouchableOpacity onPress={this.goToHeatMap.bind(this)}>*/}
                        <Image style={{ width: 30, height: 30, marginLeft:10,marginTop: 10, }} source={require('../icons/map_icon.png')}/>
                    {/*</TouchableOpacity>*/}
                    <Text style={styles.topNameText}>运行质量</Text>
                    {/*<TouchableOpacity style={styles.topImage} onPress={this.toNotice.bind(this)}>*/}
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                </View>
                {/*<WebViewBridge*/}
                    {/*ref="webviewbridge"*/}
                    {/*onBridgeMessage={this.onBridgeMessage}*/}
                    {/*javaScriptEnabled={true}*/}
                    {/*source={require('../test.html')}*/}
                {/*/>*/}
                {/*<View style={styles.topView}>*/}
                    {/*<View style={styles.searchView}>*/}
                        {/*<TextInput*/}
                            {/*style={styles.textInput}*/}
                            {/*placeholder={"请输入您要搜索的换热站关键字"}*/}
                            {/*placeholderTextColor={'#808080'}*/}
                            {/*onChangeText={(searchValue)=>this.setState({searchValue})}*/}
                        {/*/>*/}
                        {/*/!*<TouchableOpacity onPress={this._search.bind(this)}>*!/*/}
                        {/*<Image style={{width:18, height: 18, marginRight:10,}} source={require('../icons/search_icon.png')} />*/}
                        {/*/!*</TouchableOpacity>*!/*/}
                    {/*</View>*/}
                {/*</View>*/}
                {/*<View style={styles.chartView}>*/}
                {/*<TotalEnergyChart />*/}
                {/*</View>*/}
                {/*<Company style={styles.company} navigator={this.props.navigator}/>*/}

            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#ffffff",
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

});
