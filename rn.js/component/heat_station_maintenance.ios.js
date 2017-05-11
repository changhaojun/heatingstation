/**
 * Created by Vector on 17/4/24.
 */
import React from 'react';
import {View, Text, TouchableOpacity, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, ListView} from 'react-native';

import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import Scada from '../component/scada.ios';
import Orientation from 'react-native-orientation';
export default class HeatStation extends React.Component {

    // state: {dataSource: any};

    componentWillMount() {
            Orientation.lockToPortrait();
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            name:props.name,
            dataSource:ds.cloneWithRows([]),
            dataSource1:ds.cloneWithRows([]),
        };
        var _this = this;
        var initials=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',]
        //从AsyncStorage取出userKey
        // AsyncStorage.getItem("userKey",function(errs,result){
        // console.info(result);
        // if (!errs) {
        //     var url = "";
        //     switch (_this.props.type) {
        //         case "group": url = "http://114.215.154.122/reli/android/androidAction?type=getDeviceForGroup&userKey=" + result + "&groupId=" + _this.props.id; break;
        //         case "search": url = "http://114.215.154.122/reli/android/androidAction?type=getDeviceByName&userKey=" + result + "&deviceName=" + _this.props.id; break;
        //         case "online": url = "http://114.215.154.122/reli/android/androidAction?type=getDeviceForOnLine&userKey=" + result + "&stateId=" + _this.props.id; break;
        //         case "warn": url = "http://114.215.154.122/reli/android/androidAction?type=getDeviceForState&userKey=" + result + "&stateId=" + _this.props.id; break;
        //     }
        fetch('http://rapapi.org/mockjsdata/16979/v1_0_0/station_tag/tag_id')
            .then((response)=>response.json())
            .then((responseJson)=>{
                // 数组
                var itemAry = [];
                for(var i=0;i<responseJson.station_tag_information.length;i++){

                    // 为每个Picker的Item放入数据
                    itemAry.push(
                        <PickerIOS.Item
                            key={i}
                            value = {responseJson.station_tag_information[i].tag_id}
                            label = {responseJson.station_tag_information[i].tag_name}
                        />
                    );
                }
                _this.setState({
                    selectedValue: responseJson.station_tag_information[0].tag_id,
                    selectedCourse:responseJson.station_tag_information[0].tag_name,  // 为选择器初始化值
                    dataSource2:itemAry,
                    data: responseJson.station_tag_information
                });

            })
            .catch((error)=>{
                console.log(error);
            });

        //从服务器取出数据
        fetch("http://rapapi.org/mockjsdata/16979/v1_0_0/company/branch_count")
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson.data);

                if (responseJson.branch_count.length <= 0) {
                    _this.props.navigator.pop();//返回上一个页面
                    return;
                }
                var allInitials=[];
                var rightInitials=[];
                var allHight=0;
                var childHight=0;
                //使用for循环整理数据
                for(var j=0;j<initials.length;j++){
                    childHight=0;
                    let oneInitials=[];
                    for(var i=0;i<responseJson.branch_count.length;i++){
                        if(initials[j]==responseJson.branch_count[i].Initials){
                            oneInitials.push({
                                data_value: responseJson.branch_count[i].data_value,
                                min_data_value: responseJson.branch_count[i].min_data_value,
                                max_data_value: responseJson.branch_count[i].max_data_value,
                                branch_name: responseJson.branch_count[i].branch_name,
                            })
                            childHight=childHight+41;
                        }

                    }
                    if(oneInitials.length>0){
                        //向左边队列添加数据
                        allInitials.push({
                            groupName:initials[j].toUpperCase(),
                            device:ds.cloneWithRows(oneInitials),
                        })
                        //向右边队列添加数据
                        rightInitials.push({
                            groupName:initials[j].toUpperCase(),
                            hight:allHight
                        })
                        allHight=allHight+38;
                        allHight=allHight+childHight;
                    }else{
                        //向右边队列添加数据
                        rightInitials.push({
                            groupName:initials[j].toUpperCase(),
                            hight:-1
                        })
                    }
                }
                _this.setState({
                    dataSource:ds.cloneWithRows(allInitials),
                    dataSource1:ds.cloneWithRows(rightInitials),
                });
            })
            .catch((error) => {
                // console.error(error);
            });
    }

    back() {
        this.props.navigator.pop();
    }

    openScada(){
        const navigator = this.props.navigator;
        navigator.push({
            component: Scada,
        })
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
                    {/*<TouchableOpacity style={styles.topImage} onPress={this.toNotice.bind(this)}>*/}
                    <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                </View>
                <View style={styles.topView}>
                    <View style={styles.searchView}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={"请输入您要搜索的换热站关键字"}
                            placeholderTextColor={'#808080'}
                            onChangeText={(searchValue)=>this.setState({searchValue})}
                        />
                        {/*<TouchableOpacity onPress={this._search.bind(this)}>*/}
                        <Image style={{width:18, height: 18, marginRight:10,}} source={require('../icons/search_light.png')} />
                        {/*</TouchableOpacity>*/}
                    </View>
                </View>
                <View style={styles.selectView}>
                    <View style={styles.selectItemView}>
                        <Text style={{fontSize:13,color:'#E0960A',textAlign: 'center',paddingTop: 15, }}>换热站</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.selectText}>热网单耗</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.selectText}>二网供温</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.selectText}>一网回温</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.selectText}>一网温差</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.selectText}>一网压差</Text>
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <ListView
                        enableEmptySections={true}
                        ref={(listView) => { _listView = listView; }}
                        dataSource={this.state.dataSource}
                        automaticallyAdjustContentInsets={false}
                        renderRow={(rowData) => {
                return(
                    <View>
                        <View style={styles.listItem}>
                            <Text style={styles.sectionText}>{rowData.groupName}</Text>
                        </View>

                        <TouchableHighlight underlayColor="#f2d6b8" onPress={this.openScada.bind(this)}>
                        <ListView
                            enableEmptySections={true}
                            dataSource={rowData.device}
                            renderRow={(rowData) => {
                                return(
                                        <View style={styles.selectView}>
                                        <View style={styles.selectItemView}>
                                            <Text style={{fontSize:13,color:'#E0960A',textAlign: 'center',paddingTop: 15, }}>换热站</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={styles.selectText}>热网单耗</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={styles.selectText}>二网供温</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={styles.selectText}>一网回温</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={styles.selectText}>一网温差</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={styles.selectText}>一网压差</Text>
                                        </View>
                                    </View>

                                    )
                                }}
                            />
                        </TouchableHighlight>
                    </View>
                    )
                }}
                    />
                    {/*<ListView*/}
                    {/*//style={styles.rightView}*/}
                    {/*enableEmptySections={true}*/}
                    {/*dataSource={this.state.dataSource1}*/}
                    {/*initialListSize={26}//右边的一次加载完成*/}
                    {/*renderRow={(rowData) => {*/}
                    {/*return(*/}
                    {/*<TouchableHighlight onPress={() =>{if(rowData.hight>=0){_listView.scrollTo({ x: 0,y: rowData.hight, animated: true})}}}>*/}
                    {/*<View style={styles.rightView}>*/}
                    {/*<Text style={styles.rightText}>{rowData.groupName}</Text>*/}
                    {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                    {/*)*/}
                    {/*}}*/}
                    {/*/>*/}
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
        // borderColor:"#f2d6b8",
        // borderWidth:1,
        // marginTop: 74,
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
    selectView:{
        width: width,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: "#dedede",
    },
    selectItemView:{
        width: width/6,
        height: 40,
    },
    selectText:{
        fontSize:13,
        color:'#000000',
        textAlign: 'left',
        paddingTop: 15,
    },
    bottomView: {
        backgroundColor:'#e9e9e9',
        flexDirection: 'row',
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
        color: '#515151',
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