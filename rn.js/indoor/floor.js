/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, AsyncStorage, ListView, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator, ImageBackground, Alert,DeviceEventEmitter } from 'react-native';
import Dimensions from 'Dimensions';
import Constants from '../constants';
import LeveStrategy from "./leve_strategy";
import Echarts from 'native-echarts';
var { width, height } = Dimensions.get('window');
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
import Unit from './unit_list';
export default class VillageList extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            floorList: "",
            dataSource: ds.cloneWithRows([]),
            company_code: "",
            pieData: []
        }
        var _this = this;
        this.getFloor()
    }
    getFloor(){
        console.log('获取楼列表')
        AsyncStorage.getItem("access_token", (errs, result) => {
            if (!errs) {
                let villageId = this.props.communityId;
                var uri = `${Constants.indoorSite}/v2/community/${villageId}/building?access_token=${result}&user_total=1&avg_temperat=1&room_temperat=1`
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson)
                        if (responseJson.result.length > 0) {
                            this.setState({
                                floorList: responseJson.result,
                                dataSource: ds.cloneWithRows(responseJson.result),
                            });
                        }
                        else {
                            Alert.alert(
                                '提示',
                                '暂无数据'
                            )
                        }

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        )
    }
    goUnit(buildName, buildId) {
        this.props.navigator.push({
            component: Unit,
            passProps: {
                buildName: buildName,
                buildId: buildId,
                communityName: this.props.communityName
            }
        })
    }
    goLeveStrategy() {
        this.props.navigator.push({
            component: LeveStrategy,
            passProps: {
                // buildName: buildName,
                communityId: this.props.communityId,
                avg_temp: this.props.avg_temp,
                communityName: this.props.communityName
            }
        })
    }
    componentWillMount() {
        this.setTitle = DeviceEventEmitter.addListener('refreshFloor', ()=>{
            this.getFloor()
        });
      }
      componentWillUnmount(){
        this.setTitle.remove();
      }
    render() {
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{c}户 <br/>{d}%",
                extraCssText: 'width:50px;height:40px;'
            },
            color: ['#2DBAE4', '#FD8F38', '#D6243C'],
            series: [
                {
                    // name:'访问来源',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    hoverAnimation: true,
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            shadowBlur: 60,
                            shadowColor: 'rgba(0,0, 0, 0.2)'
                        }
                    },
                    label: {
                        normal: {
                            show: false,

                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                // fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        { value: this.props.room_temperat.cold ? this.props.room_temperat.cold : 0, name: "<16℃" },
                        { value: this.props.room_temperat.tepid ? this.props.room_temperat.tepid : 0, name: "16~18℃" },
                        { value: this.props.room_temperat.hot ? this.props.room_temperat.hot : 0, name: ">25℃" }
                    ]
                }
            ]
        }
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <View style={{ width: width - 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 20, color: "#fff" }}>{this.props.communityName}</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', position: "absolute", right: 10 }} onPress={() => { this.goLeveStrategy() }}>
                        <Image style={{ width: 15, height: 15, marginTop: 2 }} resizeMode="contain" source={require('../icons/icon_leveling.png')} />
                        <Text style={{ fontSize: 15, color: "#2EDDDB" }}>一键调平</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: "#fff", height: 150, width: width, flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: width - 150 }}>
                        <View style={{ flexDirection: "row", marginLeft: 10 }}>
                            <View>
                                <Text style={this.props.status === 1 ? { fontSize: 26, color: "#2E93DD" } : this.props.status === 2 ? { fontSize: 26, color: "#FB9823" } : this.props.status === 3 ? { fontSize: 26, color: "#D6243C" } : { fontSize: 26, color: "#333" }}>{this.props.avg_temp}<Text style={{ fontSize: 20 }}>℃</Text></Text>
                                <Text style={{ color: "#999999", fontSize: 12, marginLeft: 5 }}>平均温度</Text>
                            </View>
                            <View style={{ marginLeft: 30, marginTop: 7 }}>
                                <Text><Text style={{ fontSize: 20 }}>{this.props.user_total}</Text>户</Text>
                                <Text style={{ color: "#999999", fontSize: 12 }}>小区住户</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: 150, backgroundColor: "#777" }}>
                        <Echarts option={option} height={150} backgroundColor="rgba(0,0,0,1)" />
                    </View>
                </View>
                {this.state.floorList.length > 0 ?
                    <ListView
                        style={{ marginTop: 13 }}
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        contentContainerStyle={styles.listViewStyle}
                        renderRow={(rowData) => {
                            return (
                                <TouchableOpacity underlayColor="#ECEDEE" onPress={() => { this.goUnit(rowData.building_name, rowData.building_id) }}>
                                    <ImageBackground style={styles.listItemView} resizeMode="center" source={require('../images/floor_img.png')}>
                                        <View style={styles.listItemTextView}>
                                            <View style={{ flexDirection: "row", marginLeft: 15, marginRight: 10, paddingBottom: 5, backgroundColor: 'rgba(255,255,255,0)', justifyContent: "space-between" }}>
                                                <Text style={{ fontSize: 18, color: '#212121' }}>{rowData.building_name}</Text>
                                                <Text style={{ fontSize: 16, color: "#999999" }}>{rowData.user_total}户</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", marginTop: 8, marginLeft: 15, alignItems: "center", justifyContent: "center" }}>
                                                {/* <Text style={{color:"#aaa",marginRight:5}}>平均温度</Text> */}
                                                <Text style={rowData.status === 1 ? { color: "#2C96DD", fontSize: 20 } : rowData.status === 2 ? { color: "#FD8F38", fontSize: 20 } : { color: "#D6243C", fontSize: 20 }}>{rowData.avg_temperat}<Text style={{ fontSize: 16 }}>℃</Text></Text>
                                            </View>
                                        </View>
                                        <View style={{ height: 5, width: width / 2 - 40, backgroundColor: "#eee", borderRadius: 5, marginLeft: 10, flexDirection: "row" }}>
                                            {
                                                (rowData.room_temperat.tepid === 0 || rowData.room_temperat.tepid === null) && (rowData.room_temperat.hot === 0 || rowData.room_temperat.hot === null) ?
                                                    <Text style={{ height: 5, width: (rowData.room_temperat.cold / (rowData.room_temperat.cold + rowData.room_temperat.tepid + rowData.room_temperat.hot)) * (width / 2 - 40), backgroundColor: "#2DBAE4", borderRadius: 5 }}></Text> :
                                                    <Text style={{ height: 5, width: (rowData.room_temperat.cold / (rowData.room_temperat.cold + rowData.room_temperat.tepid + rowData.room_temperat.hot)) * (width / 2 - 40), backgroundColor: "#2DBAE4", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}></Text>
                                            }
                                            {
                                                (rowData.room_temperat.cold === 0 || rowData.room_temperat.cold === null) && (rowData.room_temperat.hot === 0 || rowData.room_temperat.hot === null) ?
                                                    <Text style={{ height: 5, width: (rowData.room_temperat.tepid / (rowData.room_temperat.cold + rowData.room_temperat.tepid + rowData.room_temperat.hot)) * (width / 2 - 40), backgroundColor: "#FD8F38", alignItems: "center", borderRadius: 5 }}></Text> :
                                                    <Text style={{ height: 5, width: (rowData.room_temperat.tepid / (rowData.room_temperat.cold + rowData.room_temperat.tepid + rowData.room_temperat.hot)) * (width / 2 - 40), backgroundColor: "#FD8F38", alignItems: "center" }}></Text>
                                            }
                                            {
                                                (rowData.room_temperat.cold === 0 || rowData.room_temperat.cold === null) && (rowData.room_temperat.tepid === 0 || rowData.room_temperat.tepid === null) ?
                                                    <Text style={{ height: 5, width: (rowData.room_temperat.hot / (rowData.room_temperat.cold + rowData.room_temperat.tepid + rowData.room_temperat.hot)) * (width / 2 - 40), backgroundColor: "#D6243C", borderRadius: 5 }}></Text> :
                                                    <Text style={{ height: 5, width: (rowData.room_temperat.hot / (rowData.room_temperat.cold + rowData.room_temperat.tepid + rowData.room_temperat.hot)) * (width / 2 - 40), backgroundColor: "#D6243C", borderBottomRightRadius: 5, borderTopRightRadius: 5 }}></Text>
                                            }
                                        </View>
                                        {
                                            rowData.user_total !== 0 ?
                                                <View style={{ flexDirection: "row", paddingLeft: 10, paddingRight: 10, height: 25, backgroundColor: "#fff", width: width / 2 - 20, borderBottomRightRadius: 15, borderBottomLeftRadius: 15 }}>
                                                    {
                                                        rowData.room_temperat.cold ?
                                                            <View style={{ width: (rowData.room_temperat.cold / (rowData.room_temperat.cold + rowData.room_temperat.tepid + rowData.room_temperat.hot)) * (width / 2 - 40) + 10 }}>
                                                                <Text style={{ color: "#2DBAE4", marginTop: 1, fontSize: 12 }}>{rowData.room_temperat.cold}户</Text>
                                                                {/* <Text style={{color:"#2DBAE4",fontSize:12,marginTop:-3}}>{isNaN(rowData.room_temperat.cold/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))?0: (rowData.room_temperat.cold/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot)).toFixed(2)}%</Text> */}
                                                            </View>
                                                            : null
                                                    }
                                                    {
                                                        rowData.room_temperat.tepid ?
                                                            <View style={{ width: (rowData.room_temperat.tepid / (rowData.room_temperat.cold + rowData.room_temperat.tepid + rowData.room_temperat.hot)) * (width / 2 - 40) + 10 }}>
                                                                <Text style={{ color: "#FD8F38", marginTop: 1, fontSize: 12, width: 20 }}>{rowData.room_temperat.tepid}户</Text>
                                                                {/* <Text style={{color:"#FD8F38",fontSize:12,marginTop:-3}}>{isNaN(rowData.room_temperat.tepid/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))?0:(rowData.room_temperat.tepid/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot)).toFixed(2)}%</Text> */}
                                                            </View>
                                                            : null
                                                    }
                                                    {
                                                        rowData.room_temperat.hot ?
                                                            <View>
                                                                <Text style={{ color: "#D6243C", marginTop: 1, fontSize: 12, zIndex: 99 }}>{rowData.room_temperat.hot}户</Text>
                                                                {/* <Text style={{color:"#D6243C",fontSize:12,marginTop:-3}}>{isNaN(rowData.room_temperat.hot/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))?0:(rowData.room_temperat.hot/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot)).toFixed(2)}%</Text> */}
                                                            </View>
                                                            : null
                                                    }
                                                </View> : null
                                        }

                                    </ImageBackground>
                                </TouchableOpacity>
                            )
                        }}
                    /> :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator
                            style={{ marginTop: 20 }}
                            animating={true}
                            size="large"
                        />
                    </View>
                }
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    listItemView: {
        width: width / 2 - 20,
        height: 110,
        flexDirection: 'column',
        backgroundColor: "#fff",
        marginBottom: 13,
        marginLeft: 13,
        borderRadius: 10,
    },
    listItemTextView: {
        // flex: 1,
        // flexDirection: 'column',
        marginTop: 10,
        height: 100 - 25,
        marginRight: 10,
        // backgroundColor: "#444",
    },
    listViewStyle: {
        // 改变主轴的方向  
        flexDirection: 'row',
        // 多行显示  
        flexWrap: 'wrap',
        // 侧轴方向  
        alignItems: 'center', // 必须设置,否则换行不起作用  
    },
});