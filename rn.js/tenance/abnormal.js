/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, AsyncStorage, ListView, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import Dimensions from 'Dimensions';
import Constants from '../constants';
import Echarts from 'native-echarts';
var colors = ['#5ca5b4', '#f4bf30'];
var { width, height } = Dimensions.get('window');

export default class Abnormal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onshow: 0,
            company_code: "000005",
            dataList: [],
            abnormal: {},
            online: {},
        };
        var _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {
                _this.setState({ company_code: result })
            }
        });
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var url = Constants.serverSite + "/v1_0_0/abnormalData?company_code=" + _this.state.company_code + "&access_token=" + result
                fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ dataList: responseJson })
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                url = Constants.serverSite + "/v1_0_0/abnormalCount?company_code=" + _this.state.company_code + "&access_token=" + result
                fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ abnormal: responseJson })
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                url = Constants.serverSite + "/v1_0_0/offline?company_code=" + _this.state.company_code + "&access_token=" + result
                fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ online: responseJson })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        )
    }


    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        var option1 = {
            color: ["#2a9adc", "#f05c5c"],
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    hoverAnimation: false,
                    labelLine: {
                        normal: {
                            length: 5,
                            length2: 10,
                        }
                    },
                    data: [
                        { value: this.state.abnormal.normalCount, name: '正常' },
                        { value: this.state.abnormal.abnormalCount, name: '异常' },
                    ],
                },
                {
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    hoverAnimation: false,
                    label: {
                        normal: {
                            position: "inside",
                            formatter: "{d}%"
                        }
                    },
                    data: [
                        { value: this.state.abnormal.normalCount, name: '正常' },
                        { value: this.state.abnormal.abnormalCount, name: '异常' },
                    ],
                }
            ]
        };
        var option2 = {
            color: ["#95d654", "#d2d2d2"],
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    hoverAnimation: false,
                    labelLine: {
                        normal: {
                            length: 5,
                            length2: 10,
                        }
                    },
                    data: [
                        { value: this.state.online.onlineCount, name: '在线' },
                        { value: this.state.online.offlineCount, name: '掉线' },
                    ],
                },
                {
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    hoverAnimation: false,
                    label: {
                        normal: {
                            position: "inside",
                            formatter: "{d}%"
                        }
                    },
                    data: [
                        { value: this.state.online.onlineCount, name: '在线' },
                        { value: this.state.online.offlineCount, name: '掉线' },
                    ],
                }
            ]
        };
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                        <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>异常</Text>
                    <Image style={{ width: 25, height: 25, marginRight: 10, }} source={require('../icons/nav_flag.png')} />
                </View>
                <Text style={styles.title}>异常{"&"}掉线比例</Text>
                <View style={{ flexDirection: "row", height: 160, width: width, }}>
                    <Echarts option={option1} height={160} width={width / 2} />
                    <Echarts option={option2} height={160} width={width / 2} />
                </View>
                <Text style={styles.title}>异常数据列表</Text>
                <View style={{ width: width, height: 40, paddingHorizontal: 10, backgroundColor: "#fff", flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.titleText}>换热站</Text>
                    <Text style={styles.titleText}>异常指标</Text>
                    <Text style={styles.titleText}>异常值</Text>
                    <Text style={styles.titleText}>发生时间</Text>
                </View>
                <ListView
                    dataSource={ds.cloneWithRows(this.state.dataList)}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                        return (
                            <View style={{ width: width, height: 40, paddingHorizontal: 10, backgroundColor: "#fff", flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={styles.listText}>{rowData.station_name}</Text>
                                <Text style={styles.listText}>{rowData.data_name}</Text>
                                <Text style={styles.listText}>{rowData.data_value}</Text>
                                <Text style={styles.listText}>{rowData.start_time}</Text>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor:"#f2f2f2"
    },
    listText: {
        fontSize: 14,
        color: "#333333",
        flex: 1,
        textAlign: "center"
    },
    titleText: {
        fontSize: 15,
        color: "#2b98db",
        flex: 1,
        textAlign: "center"
    },

    navView: {
        flexDirection: 'row',
        width: width,
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topNameText: {
        flex: 1,
        //marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
    title:{
        borderLeftColor:"#2b98db",
        borderLeftWidth:4,
        marginLeft:10,
        paddingLeft:10,
        marginVertical:10,
        color:"#323232",
        fontSize:16,
    },


























    topView: {
        width: this.window.width,
        height: 38,
        flexDirection: 'row',
        //paddingHorizontal:20,
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea"
    },
    topViewItem: {
        flex: 1,
        justifyContent: 'center',//垂直居中
    },
    topTextNormal: {
        height: 20,
        color: "#000",
        textAlign: 'center',
    },
    topTextSelection: {
        height: 20,
        color: "#35aeff",
        textAlign: 'center',
    },
    topViewNormal: {
        width: width / 3,
        height: 1,
        backgroundColor: "#fff",
    },
    topViewSelection: {
        width: width / 3,
        height: 1,
        backgroundColor: "#35aeff",
    },
    itemStyle: {
        flex: 1,
        width: width,

    },
    topSides: {
        width: 18,
        height: 18,
        marginLeft: 10,
        marginRight: 10,

    },
    topText: {
        color: "#ffffff",
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 4,
    },
    topRow: {
        width: width,
        height: 50,
        backgroundColor: '#000000',
        //justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }
});