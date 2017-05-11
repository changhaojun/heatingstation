/**
 * Created by Vector on 17/4/20.
 */
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, ListView,
    TouchableOpacity, Modal, Picker, PickerIOS} from 'react-native';

import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import HeatStation from '../component/heat_station.ios';

export default class Branch extends React.Component {

    // state: {dataSource: any};


    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            // tagName: '流量',
            name:props.name,
            dataSource:ds.cloneWithRows([]),
            dataSource1:ds.cloneWithRows([]),

            data: [],
            show:false,
            selectedCourse: "",
            selectedValue: 1,


            dataStatus: styles.data_valueText,
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

            // }
        // });
    }


    back(){
        this.props.navigator.pop();
    }

    gotoHeatStation(){
        const navigator = this.props.navigator;
        this.props.navigator.push({
            component: HeatStation,
        })
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }
    //选择框
    _select(selectedCourse,selectedIndex) {

        console.log(selectedCourse);
        this.setState({
            selectedValue: selectedCourse,
            selectedCourse: this.state.data[selectedIndex].tag_name,
        });
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

       var _this = this;
       var initials=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',]
        fetch('http://rapapi.org/mockjsdata/16979/v1_0_0/company/branch_count1?'+selectedCourse)
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson.branch_count);

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

                                // deviceId:responseJson.data[i].device_id,
                                // deviceName:responseJson.data[i].device_name,
                                // runStatus:responseJson.data[i].run_status
                            })
                                // _this.setState({
                                //     dataStatus: styles.data_valueTextWarn,
                                // })

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
                    <TouchableOpacity activeOpacity={ 0.5 } onPress={this.back.bind(this)}>
                    <Image style={{ width: 25, height: 25, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                        <Text style={styles.topNameText}>支线运行情况</Text>
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                </View>

                <View style={styles.topView}>
                    <View style={styles.searchView}>
                    <TextInput
                    style={styles.textInput}
                    placeholder={"请输入您要搜索的支线关键字"}
                    placeholderTextColor={'#808080'}
                    onChangeText={(searchValue)=>this.setState({searchValue})}
                    />
                    {/*<TouchableOpacity onPress={this._search.bind(this)}>*/}
                    <Image style={{width:18, height: 18, marginRight:10,}} source={require('../icons/search_light.png')} />
                    {/*</TouchableOpacity>*/}
                    </View>
                </View>
                <TouchableOpacity onPress={this._setModalVisible.bind(this)} activeOpacity = {1}>
                <View style={styles.selectView}>
                    <Text style={{fontSize:16, color: '#0099FF'}}>当前指标：{this.state.selectedCourse}</Text>
                    <Image source={require('../icons/down_icon.png')} style={{width:18, height:12,}}></Image>
                </View>
                </TouchableOpacity>
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
                        <ListView
                            enableEmptySections={true}
                            dataSource={rowData.device}
                            renderRow={(rowData) => {
                                return(
                                    <TouchableOpacity activeOpacity={0.5} onPress={this.gotoHeatStation.bind(this)}>
                                    <View style={styles.listItemChild}>
                                        <View style={styles.listItemChild1}>
                                            <Text style={styles.listItemText2}>{rowData.branch_name}</Text>
                                        </View>
                                        <View style={styles.listItemChild1}>
                                            <Text style={rowData.data_value>1?styles.data_valueTextWarn:styles.data_valueText}>{rowData.data_value}</Text>
                                        </View>
                                        <View style={styles.listItemChild1}>
                                            <Text style={styles.data_valueText}>{rowData.max_data_value}</Text>
                                        </View>
                                        <View style={styles.listItemChild1}>
                                            <Text style={styles.data_valueText}>{rowData.min_data_value}</Text>
                                        </View>
                                    </View>
                                    </TouchableOpacity>

                                    )
                                }}
                            />
                    </View>
                    )
                }}
                    />
                    <ListView
                        //style={styles.rightView}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource1}
                        initialListSize={26}//右边的一次加载完成
                        renderRow={(rowData) => {
                return(
                     <TouchableHighlight onPress={() =>{if(rowData.hight>=0){_listView.scrollTo({ x: 0,y: rowData.hight, animated: true})}}}>
                    <View style={styles.rightView}>
                        <Text style={styles.rightText}>{rowData.groupName}</Text>
                    </View>
                     </TouchableHighlight>
                    )
                }}
                    />
                </View>


                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.modalStyle}>
                        <View style={styles.subView}>
                            <Text style={styles.titleText}>
                                请选择指标
                            </Text>
                            <View>
                                <PickerIOS
                                    selectedValue={this.state.selectedValue}
                                    onValueChange={(selectedCourse,selectedIndex)=>this._select(selectedCourse,selectedIndex,this)}>
                                    {this.state.dataSource2}
                                </PickerIOS>
                            </View>
                            <View style={styles.horizontalLine}/>
                            <View style={styles.buttonView}>
                                <TouchableOpacity
                                                    //underlayColor="#f2d6b8"
                                                    style={styles.buttonStyle}
                                                    onPress={this._setModalVisible.bind(this)}>
                                    {/*<Text style={styles.buttonText}>*/}
                                        {/*确定*/}
                                    {/*</Text> */}
                                    <Image source={require('../icons/cancel@2x.png')} style={{width:40, height:40, marginTop:4, }}/>
                                </TouchableOpacity>
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
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 64,
        backgroundColor: '#343439',
        justifyContent: 'center',
        alignItems: 'center',
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
        borderColor:"#ffffff",
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
        paddingTop: 3,
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
    bottomView: {
        backgroundColor:'#e9e9e9',
        flexDirection: 'row',
    },
    listItem:{
        width:width,
        height:20,
        flexDirection: 'row',
        backgroundColor:'#E9E9E9',
    },
    listItemImage1:{
        height:38,
        width:8,
        paddingBottom:20,
        overlayColor:"#e9e9e9",
        backgroundColor:'#e9e9e9',
    },
    listItemImage2:{
        height:35,
        width:16,
        overlayColor:"#e9e9e9",
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
    connect:{
        width:24,
        height:24,
    },
    listItemText2:{
        paddingTop:13,
        fontSize:16,
        textAlign: 'left',
        color: '#515151',
        paddingLeft: 30,
    },
    rightView:{
        height: (height-170)/26,
        width:15,
        backgroundColor:"#f5f5f5",
    },
    rightText:{
        textAlign: 'center',
        color:"#aaa9a9",
    },
    navBar:{
        width: width,
        height: 64,
    },
    sectionText:{
        fontSize:16,
        color:'#515151',
        paddingLeft:10,
        paddingTop: 2,
    },
    data_valueText:{
        paddingTop:13,
        fontSize:16,
        textAlign: 'left',
        color: '#515151',
        paddingLeft: 20,
    },
    data_valueTextWarn:{
        paddingTop:13,
        fontSize:16,
        textAlign: 'left',
        color: 'red',
        paddingLeft: 20,
    },
    listItemChild1:{
        width: width/4,
    },
    selectView:{
        width: width,
        backgroundColor: '#ffffff',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor:'rgba(255, 255, 255, 0.9)',
        alignSelf: 'stretch',
        justifyContent:'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor:'#ccc',
    },
    // 标题
    titleText:{
        marginTop:10,
        marginBottom:5,
        fontSize:16,
        fontWeight:'bold',
        textAlign:'center',
        color: '#0099FF',
    },
    // 水平的分割线
    horizontalLine:{
        marginTop:5,
        height:0.5,
        width: width-120,
        backgroundColor:'#ccc',
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
});
