/**
 * Created by Vector on 17/4/17.
 */
// 运行维护页面
import React from 'react';
import {View, Text, TouchableOpacity,
    Image, TextInput, Navigator, StyleSheet, TouchableHighlight, StatusBar, ListView, ToastAndroid,} from 'react-native';

import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');
// import HeatStation from '../component/heat_station_maintenance.ios';

export default class Maintenance extends React.Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource:ds.cloneWithRows([{
                companyName: '西安雁塔公司',
                heatStation: '23',
                heatArea: '10000',
                heatEnergy: '111111',
            },
                {
                    companyName: '西安雁塔公司',
                    heatStation: '23',
                    heatArea: '10000',
                    heatEnergy: '111111',
                },
                {
                    companyName: '西安雁塔公司',
                    heatStation: '23',
                    heatArea: '10000',
                    heatEnergy: '111111',
                }
            ]),
        };
        var _this = this;
        // AsyncStorage.getItem("userKey",function(errs,result){
        //     console.info(result);
        //     if (!errs) {
                fetch("http://rapapi.org/mockjsdata/16979/v1_0_0/Static_information")
                    .then((response) => response.json())
                    .then((responseJson) => {
                        _this.setState({
                            dataSource:ds.cloneWithRows(responseJson.company_data)
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            // }
        // });
    }

    // gotoHeatStation(){
    //     const navigator = this.props.navigator;
    //     this.props.navigator.push({
    //         component: HeatStation,
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
                    {/*<TouchableOpacity onPress={this.backHome.bind(this)}>*/}
                        <Image style={{ width: 20, height: 18, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_flag.png')}/>
                    {/*</TouchableOpacity>*/}
                    <Text style={styles.topNameText}>运行维护</Text>
                    {/*<TouchableOpacity style={styles.topImage} onPress={this.toNotice.bind(this)}>*/}
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                </View>
                {/*<View style={styles.topView}>*/}
                    {/*<View style={styles.searchView}>*/}
                        {/*<TextInput*/}
                            {/*style={styles.textInput}*/}
                            {/*placeholder={"请输入您要搜索的换热站关键字"}*/}
                            {/*placeholderTextColor={'#808080'}*/}
                            {/*onChangeText={(searchValue)=>this.setState({searchValue})}*/}
                        {/*/>*/}
                        {/*<TouchableOpacity activeOpacity={0.5}>*/}
                        {/*<Image style={{width:18, height: 18, marginRight:10,}} source={require('../icons/search_icon.png')} />*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                {/*</View>*/}
                {/*<ListView*/}
                    {/*automaticallyAdjustContentInsets={false}*/}
                    {/*dataSource={this.state.dataSource}*/}
                    {/*enableEmptySections={true}*/}
                    {/*renderRow={(rowData) => {*/}
                {/*return(*/}

                  {/*<TouchableHighlight underlayColor="#ECEDEE" onPress={this.gotoHeatStation.bind(this)}>*/}
                    {/*<View style={styles.listItemView}>*/}
                        {/*<Image style={styles.listItemIconView} source={require('../icons/company_icon.png')}></Image>*/}
                        {/*<View style={styles.listItemTextView}>*/}
                            {/*<View>*/}
                                {/*<Text style={{fontSize:16, color: '#212121'}}>{rowData.company_name}</Text>*/}
                            {/*</View>*/}
                            {/*<View style={{backgroundColor: '#f2d6b8',height: 20,marginTop:2,justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',}}>*/}
                                {/*<Text style={styles.listItemTextLeft}>换热站能耗</Text>*/}
                                {/*<Text style={styles.listItemTextRight}>{rowData.data_value}</Text>*/}
                            {/*</View>*/}
                            {/*<View style={styles.listItemTextView2}>*/}
                                {/*<Text style={styles.listItemTextLeft}>换热站数量</Text>*/}
                                {/*<Text style={styles.listItemTextRight}>{rowData.station_count}</Text>*/}
                            {/*</View>*/}
                            {/*<View style={styles.listItemTextView2}>*/}
                                {/*<Text style={styles.listItemTextLeft}>供热面积</Text>*/}
                                {/*<Text style={styles.listItemTextRight}>{rowData.heating_area}</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                  {/*</TouchableHighlight>*/}
                    {/*)*/}
                {/*}}*/}
                {/*/>*/}
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
        height: height/10,
        // flex:0.2,
        width:width,
        backgroundColor:'#f2d6b8',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    listItemView:{
        width:width,
        height:140,
        flexDirection: 'row',
    },
    listItemIconView:{
        width: 110,
        height: 110,
        marginLeft:10,
        marginTop: 10,
    },
    listItemTextView:{
        flex: 1,
        flexDirection: 'column',
        marginLeft:15,
        marginTop: 10,
        marginRight: 10,
        // alignItems:'center',
        // justifyContent: 'center',
    },
    listItemTextLeft:{
        fontSize:12,
        color: '#212121',
        textAlign: 'left',
    },
    listItemTextRight:{
        fontSize:12,
        color: '#212121',
        textAlign: 'left',
        marginRight:5,
    },
    listItemTextView2:{
        backgroundColor: '#f2d6b8',
        height: 20,
        alignItems:'center',
        // justifyContent: 'center',
        marginTop:12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }

});
