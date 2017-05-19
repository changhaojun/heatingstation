/**
 * Created by Vector on 17/4/24.
 *
 * 运行质量页面的换热站
 */
import React from 'react';
import {View, Text, TouchableOpacity, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, ListView,
    AsyncStorage,
    AlertIOS} from 'react-native';

import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');


import Orientation from 'react-native-orientation';
export default class HeatStation extends React.Component {

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource:ds.cloneWithRows([]),
            access_token: null,
            searchValue: "",

            dixianValue: "我是有底线的，别扯了",

            //121.42.253.149:18816
            base_url: "http://121.42.253.149:18816/v1_0_0/list?access_token=",
            start_url: "",
        };


        var _this = this;
        console.log(_this.props.branch_id);
        AsyncStorage.getItem("access_token",function(errs,result) {

                if (!errs) {
                    _this.setState({access_token:result});

                    _this.setState({
                        start_url: _this.state.base_url + _this.state.access_token + "&tag_id=[1,2,3,4,5,6]&level=2&isStaticInfomation=true&company_id="+_this.props.branch_id+"&name=",
                    });
                    //从服务器取出数据
                    fetch(_this.state.start_url)
                        .then((response) => response.json())
                        .then((responseJson) => {

                            console.log(responseJson);
                            _this.setState({
                                dataSource: ds.cloneWithRows(responseJson),

                            });
                        })
                        .catch((error) => {
                            // console.error(error);
                        });
                }
            }
        )}

    back() {
        this.props.navigator.pop();
    }


    searchStation(){

        var _this = this;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        // 从服务器取出数据
        fetch(_this.state.start_url+_this.state.searchValue)
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);

                _this.setState({
                    dataSource: ds.cloneWithRows(responseJson),

                });
            })
            .catch((error) => {
                // console.error(error);
            });

    }

    onEndReached(){
        AlertIOS.alert(
            '别扯了',
            '------我是有底线的------',
        );
    }

    render() {
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
                        <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>换热站运行情况</Text>
                    <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                </View>
                <View style={styles.topView}>
                    <View style={styles.searchView}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={"请输入您要搜索的换热站关键字"}
                            placeholderTextColor={'#808080'}
                            onChangeText={(searchValue)=>this.setState({searchValue})}
                        />
                        <TouchableOpacity onPress={this.searchStation.bind(this)}>
                            <Image style={{width:18, height: 18, marginRight:10,}} source={require('../icons/search_light.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.titleView}>
                    <View style={styles.selectItemView}>
                        <Text style={{fontSize:13,color:'#0099ff',textAlign: 'center',paddingTop: 15, }}>换热站</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.titleText}>热网单耗</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.titleText}>二网供温</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.titleText}>一网回温</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.titleText}>一网温差</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.titleText}>一网压差</Text>
                    </View>
                </View>
                <View style={styles.bottomView}>

                    <ListView
                        automaticallyAdjustContentInsets={false}
                        contentContainerStyle={{marginTop:15,}}
                        enableEmptySections={true}
                        //onEndReached={this.onEndReached.bind(this)}
                        onEndReachedThreshold={0}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => {
                            return(
                                    <View style={styles.listView}>
                                        <View style={styles.selectItemView}>
                                            <Text style={{fontSize:10,color:'#000000',textAlign: 'center',paddingTop: 15, }}>{rowData.name}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={rowData.real_data_status==1?styles.listText:styles.listWarnText}>{rowData.real_data_value}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={rowData.come_temp_status==1?styles.listText:styles.listWarnText}>{rowData.come_temp_value}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={rowData.home_temp_status==1?styles.listText:styles.listWarnText}>{rowData.home_temp_value}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={rowData.ins_flow_status==1?styles.listText:styles.listWarnText}>{rowData.ins_flow_value}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={rowData.diff_Pressure_status==1?styles.listText:styles.listWarnText}>{rowData.diff_Pressure_value}</Text>
                                        </View>
                                    </View>

                            )
                        }}
                    />
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
    searchView:{
        width:width - 40,
        height:38,
        flexDirection: 'row',
        borderRadius:38,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    textInput:{
        flex:1,
        marginLeft:10,
        marginTop:3,
    },
    topView:{
        height: height/10,
        // flex:0.2,
        width:width,
        backgroundColor:'#343439',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    titleView:{
        width: width,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    listView:{
        width: width,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e9e9e9',
    },
    selectItemView:{
        width: width/6,
        height: 40,
    },

    titleText:{
        fontSize:13,
        color:'#0099ff',
        textAlign: 'center',
        paddingTop: 15,
    },
    listText:{
        fontSize:13,
        color:'#000000',
        textAlign: 'center',
        paddingTop: 15,
    },
    listWarnText:{
        fontSize:13,
        color:'red',
        textAlign: 'center',
        paddingTop: 15,
    },
    bottomView: {
        backgroundColor:'#e9e9e9',
        flexDirection: 'column',
        flex:1,
    },
    listItem:{
        width:width,
        height:25,
        flexDirection: 'row',
        backgroundColor:'#E9E9E9',
    },
    listItemText1:{
        color:"#b57907",
        fontSize:18,
        textAlign: 'center',
        fontWeight :"bold",
        paddingLeft:30,
        paddingRight:30,
        paddingTop:3,
        height:32,
    },
    listItemChild:{
        width:width,
        height:45,
        flexDirection: 'row',
        backgroundColor:'#ffffff',
        borderTopWidth:2,
        borderColor: '#e9e9e9'
    },
    sectionText:{
        fontSize:18,
        color:'#515151',
        paddingLeft:10,
        paddingTop: 4,
    },
    data_valueText:{
        paddingTop:13,
        fontSize:16,
        textAlign: 'left',
        color: '#0099ff',
        paddingLeft: 20,
    },
    listItemChild1:{
        width: width/4,
    },
    listItemText2:{
        paddingTop:13,
        fontSize:16,
        textAlign: 'left',
        color: '#515151',
        paddingLeft: 30,
    },
});