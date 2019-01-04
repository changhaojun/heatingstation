/**
 * Created by Vector on 17/4/19. 个人中心的消息通知
 */
import React from 'react';
import { View, Text, Image, ImageBackground, Modal, ListView, AsyncStorage, StyleSheet, TouchableHighlight, ActivityIndicator, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');
import Constants from '../constants';
import ContrastChart from "./contrast_chart"
export default class ContrastAnalysis extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            selTagName: "",
            selTagId: -1,
            tagModal: false,
            stationModal: true,
            tagList: [],
            childCompany: [],
            stationData: [],
            selStationSum: 0,
            order: true,       //true:升序，false：降序
            loadShow: false,
        };
        const _this = this;
        var company_id = "";
        var company_code = "";
        AsyncStorage.getItem("contrast_select_tag_id", function (errs, result) {
            if (!errs) {
                _this.setState({ selTagId: result });
            }
        });
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var uri = Constants.serverSite + "/v1_0_0/tags?access_token=" + result + "&level=2";
                console.log(uri)
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        var tagName = "";
                        var tagId = _this.state.selTagId;
                        if (_this.state.selTagId >= 0) {
                            for (var i = 0; i < responseJson.length; i++) {
                                if (responseJson[i].tag_id == tagId) {
                                    tagName = responseJson[i].tag_name;
                                }
                            }
                        }
                        if (!tagName) {
                            tagName = responseJson[0].tag_name;
                            tagId = responseJson[0].tag_id;
                        }

                        _this.setState({
                            tagList: responseJson,
                            selTagName: tagName,
                            selTagId: tagId
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                AsyncStorage.getItem("company_id", function (errs, result1) {
                    if (!errs) {
                        company_id = result;
                        AsyncStorage.getItem("company_code", function (errs, result2) {
                            if (!errs) {
                                company_code = result;
                                uri = Constants.serverSite + "/v1_0_0/allChildCompany?access_token=" + result + "&company_code=" + result2 + "&company_id=" + result1;
                                console.log(uri)
                                fetch(uri)
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        console.log(responseJson);
                                        _this.setState({
                                            childCompany: responseJson,
                                        })

                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    });
                            }
                        });
                    }
                });

            }

        }
        );
    }

    openCompany(i) {
        var childCompany = this.state.childCompany;
        childCompany[i].show = !childCompany[i].show;
        if (!childCompany[i].stations) {
            this.getStation(i);
        }
        this.setState({ childCompany: childCompany });
    }
    selStation(i, j) {
        var childCompany = this.state.childCompany;
        //注意：必须先修改站的，再修改分公司的状态
        childCompany[i].stations[j].select = !childCompany[i].stations[j].select;
        if (!childCompany[i].stations[j].select && childCompany[i].select) {
            childCompany[i].select = false;
        } else {
            //判断是否把所有的站都选中
            var allStatus = true;
            for (var a = 0; a < childCompany[i].stations.length; a++) {
                if (!childCompany[i].stations[a].select) {
                    allStatus = false;
                    break;
                }
            }
            if (allStatus) {
                childCompany[i].select = true;
            }
        }

        this.setState({ childCompany: childCompany, selStationSum: this.state.selStationSum + (childCompany[i].stations[j].select ? 1 : -1) });
    }
    selCompany(i) {
        var childCompany = this.state.childCompany;
        var selStationSum = this.state.selStationSum;
        //注意：必须先修改站的，再修改分公司的状态
        if (childCompany[i].stations) {
            var add = !childCompany[i].select ? 1 : -1;
            for (var j = 0; j < childCompany[i].stations.length; j++) {
                //必须先判断，否则无法判断
                if (childCompany[i].stations[j].select != !childCompany[i].select) {
                    selStationSum = selStationSum + add;
                }
                childCompany[i].stations[j].select = !childCompany[i].select;
            }
        } else {
            this.getStation(i);
        }
        childCompany[i].select = !childCompany[i].select;
        this.setState({ childCompany: childCompany, selStationSum: selStationSum });
    }

    cleanSel() {
        var childCompany = this.state.childCompany;
        for (var i = 0; i < childCompany.length; i++) {
            if (childCompany[i].stations) {
                for (var j = 0; j < childCompany[i].stations.length; j++) {
                    childCompany[i].stations[j].select = false;
                }
            }
            childCompany[i].select = false;
        }
        this.setState({ childCompany: childCompany, selStationSum: 0 });
    }

    getStation(i) {
        const _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var uri = Constants.serverSite + "/v1_0_0/stations?access_token=" + result + "&company_code=" + _this.state.childCompany[i].company_code + "&pageNumber=0&pageSize=0";
                console.log(uri)
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        var childCompany = _this.state.childCompany;
                        if (responseJson.station) {
                            //统一选中状态
                            for (var j = 0; j < responseJson.station.length; j++) {
                                responseJson.station[j].select = childCompany[i].select;
                            }
                            //统一选中个数
                            var selStationSum = _this.state.selStationSum;
                            if (childCompany[i].select) {
                                selStationSum += responseJson.station.length;
                            }
                            childCompany[i].stations = responseJson.station;
                            _this.setState({
                                childCompany: childCompany,
                                selStationSum: selStationSum
                            })
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

        });
    }
    getStationData(tagId, tagName) {
        var data = {
            tagModal: false,
            stationModal: false,
            loadShow: true
        }
        if (tagId) {
            data.selTagId = tagId;
            data.selTagName = tagName;
        }
        this.setState(data);
        var childCompany = this.state.childCompany;
        var companyList = [];
        var stationList = [];
        for (var i = 0; i < childCompany.length; i++) {
            if (childCompany[i].select) {
                companyList.push(childCompany[i].company_code);
            } else if (childCompany[i].stations) {
                for (var j = 0; j < childCompany[i].stations.length; j++) {
                    if (childCompany[i].stations[j].select) {
                        stationList.push(childCompany[i].stations[j].station_id);
                    }
                }
            }
        }
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                var uri = Constants.serverSite + "/v1_0_0/allControl";
                console.log(uri)
                fetch(uri, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
                    body:
                        "access_token=" + result +
                        "&tag_id=" + (tagId ? tagId : _this.state.selTagId) +
                        (companyList.length ? "&company_code=" + JSON.stringify(companyList) : "") +
                        (stationList.length ? "&station_id=" + JSON.stringify(stationList) : "")
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        var data = responseJson.data;
                        data.sort((x, y) => {//比较函数
                            if (!x.data_value || x.data_value < y.data_value) {
                                return -1;
                            } else if (!y.data_value || x.data_value > y.data_value) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        if (!_this.state.order) {
                            data.reverse();
                        }
                        _this.setState({
                            contrastData: responseJson.countData[0],
                            stationData: data,
                            loadShow: false
                        })

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={styles.all}>

                <View style={styles.navView}><Text style={styles.topNameText}>对比分析</Text></View>

                <View style={[styles.toolbar, { borderColor: "#00000011", borderBottomWidth: 1 }]}>
                    <TouchableOpacity style={styles.toolbar} onPress={() => this.setState({ tagModal: !this.state.tagModal, stationModal: false, })}>
                        <Text style={styles.toolbarText}>   {this.state.selTagName}</Text>
                        <Image style={{ width: 10, height: 20, }} resizeMode="contain" source={this.state.tagModal ? require('./../icons/contrast_ico_up.png') : require('./../icons/contrast_ico_down.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolbar} onPress={() => this.setState({ stationModal: true, tagModal: false })}>
                        <Text style={styles.toolbarText}>   筛选</Text>
                        <Text style={{ backgroundColor: "#000", color: "#fff", borderRadius: 7, paddingHorizontal: 4, textAlign: "center", fontSize: 10 }}>{this.state.selStationSum}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={styles.toolbar} onPress={() => { var data = this.state.stationData; this.setState({ stationData: data.reverse(), order: !this.state.order }) }}>
                        <Image style={{ width: 15, height: 20, }} resizeMode="contain" source={this.state.order ? require('./../icons/contrast_ico_rise.png') : require('./../icons/contrast_ico_fall.png')} />
                        <Text style={styles.toolbarText}>{this.state.order ? "升" : "降"}序  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolbar} onPress={() => this.props.navigator.push({ component: ContrastChart, passProps: { data: this.state.stationData, } })}>
                        <Image style={{ width: 15, height: 20, }} resizeMode="contain" source={require('./../icons/contrast_ico_chart.png')} />
                        <Text style={styles.toolbarText}>图表  </Text>
                    </TouchableOpacity>
                </View>
                {this.state.tagModal ?
                    <ListView
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                        dataSource={ds.cloneWithRows(this.state.tagList)}
                        renderRow={data => (
                            <TouchableOpacity style={styles.tagListView} onPress={() => { this.getStationData(data.tag_id, data.tag_name); }}>
                                <Text style={[styles.tagListText, { color: this.state.selTagId == data.tag_id ? "#00b6fc" : "#000" }]}>{data.tag_name}</Text>
                            </TouchableOpacity>
                        )}
                        renderSeparator={() => (
                            <View style={{ height: 1, backgroundColor: "#f5f5f5", width: width }} />
                        )}
                    /> : null
                }
                {this.state.stationModal ?
                    <View style={{ flex: 1, backgroundColor: "#e7f0f3" }}>
                        <ListView
                            showsVerticalScrollIndicator={false}
                            enableEmptySections={true}
                            showsVerticalScrollIndicator={false}
                            dataSource={ds.cloneWithRows(this.state.childCompany)}
                            renderRow={(data, j, i) => (
                                <View>
                                    <TouchableOpacity style={styles.tagListView} onPress={() => { this.selCompany(i) }}>
                                        <Image style={{ width: 15, height: 15, marginLeft: 15, }} resizeMode="contain" source={data.select ? require('./../icons/contrast_ico_on.png') : require('./../icons/contrast_ico_off.png')} />
                                        <Text style={[styles.tagListText]}>{data.company_name}</Text>
                                        <TouchableOpacity style={{ alignItems: "flex-end", flex: 1 }} onPress={() => { this.openCompany(i) }}>
                                            <Image style={{ width: 15, height: 15, marginRight: 15 }} resizeMode="contain" source={data.show ? require('./../icons/contrast_ico_up.png') : require('./../icons/contrast_ico_down.png')} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    {data.show ? (this.state.childCompany[i].stations ? <ListView
                                        showsVerticalScrollIndicator={false}
                                        enableEmptySections={true}
                                        showsVerticalScrollIndicator={false}
                                        dataSource={ds.cloneWithRows(this.state.childCompany[i].stations)}
                                        renderRow={(data, a, b) => (
                                            <TouchableOpacity style={styles.tagListView} onPress={() => { this.selStation(i, b) }}>
                                                <Image style={{ width: 15, height: 15, marginLeft: 45, }} resizeMode="contain" source={data.select ? require('./../icons/contrast_ico_on.png') : require('./../icons/contrast_ico_off.png')} />
                                                <Text style={[styles.tagListText]}>{data.station_name}</Text>
                                            </TouchableOpacity>
                                        )}
                                        renderSeparator={() => (
                                            <View style={{ height: 1, backgroundColor: "#f5f5f5", width: width }} />
                                        )}
                                    /> : <View style={[styles.tagListView, { alignItems: "center", }]}><Text style={styles.tagListText}>正在加载中……</Text></View>) : null}

                                </View>
                            )}
                            renderSeparator={() => (
                                <View style={{ height: 1, backgroundColor: "#f5f5f5", width: width }} />
                            )}
                        />
                        <View style={{ flex: 1 }} />
                        <View style={styles.btuView}>
                            <Text style={[styles.btuText, { color: "#000", backgroundColor: "#ffffff" }]} onPress={() => this.cleanSel()}>清除</Text>
                            <Text style={[styles.btuText, { color: "#fff", backgroundColor: "#00b6fc" }]} onPress={() => this.getStationData()}>完成</Text>
                        </View>
                    </View> : null}
                {!this.state.stationModal && !this.state.tagModal ?
                    <View>
                        <View style={{ flexDirection: "row", height: 35, borderBottomWidth: 1, borderColor: "#e7e7e766", marginLeft: 10, }} >
                            <View style={styles.contrastItem}>
                                <ImageBackground style={styles.contrastImage} resizeMode="contain" source={require('./../icons/contrast_ico_bg.png')} >
                                    <Text style={styles.contrastImageText}>均</Text>
                                </ImageBackground>
                                <Text style={styles.toolbarText}>{this.state.contrastData ? this.state.contrastData.avg : "-"}</Text>
                            </View>
                            <View style={styles.contrastItem}>
                                <ImageBackground style={styles.contrastImage} resizeMode="contain" source={require('./../icons/contrast_ico_bg.png')} >
                                    <Text style={styles.contrastImageText}>大</Text>
                                </ImageBackground>
                                <Text style={styles.toolbarText}>{this.state.contrastData ? this.state.contrastData.max : "-"}</Text>
                            </View>
                            <View style={styles.contrastItem}>
                                <ImageBackground style={styles.contrastImage} resizeMode="contain" source={require('./../icons/contrast_ico_bg.png')} >
                                    <Text style={styles.contrastImageText}>小</Text>
                                </ImageBackground>
                                <Text style={styles.toolbarText}>{this.state.contrastData ? this.state.contrastData.min : "-"}</Text>
                            </View>
                            <View style={styles.contrastItem}>
                                <ImageBackground style={styles.contrastImage} resizeMode="contain" source={require('./../icons/contrast_ico_bg.png')} >
                                    <Text style={styles.contrastImageText}>总</Text>
                                </ImageBackground>
                                <Text style={styles.toolbarText}>{this.state.contrastData ? this.state.contrastData.count : "-"}</Text>
                            </View>
                        </View>
                        <ListView
                            //automaticallyAdjustContentInsets={false}
                            initialListSize={200}
                            dataSource={ds.cloneWithRows(this.state.stationData)}
                            enableEmptySections={true}
                            contentContainerStyle={styles.listView}
                            renderRow={(rowData) => {
                                return (
                                    <View style={styles.item} >
                                        <View style={styles.line} />
                                        <View style={styles.itemContent} >
                                            <Text style={styles.text1} numberOfLines={1}>{rowData.station_name}</Text>
                                            <Text style={styles.value}>{rowData.data_value}</Text>
                                            <Text style={styles.text2}>{rowData.data_time}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View> : null}
                {this.state.loadShow ? <View style={styles.load}>
                    <ActivityIndicator
                        animating={true}
                        size="large"
                    /></View> : null}
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
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'center',
        alignItems: 'center',
    },

    topNameText: {
        flex: 1,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
    toolbar: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",

    },
    toolbarText: {
        color: "#000",
        marginHorizontal: 5
    },
    tagListView: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        backgroundColor: "#fff"
    },
    tagListText: {
        color: "#4f5051",
        fontSize: 15,
        marginLeft: 15,
    },
    btuView: {
        width: width,
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        borderTopColor: "#f2f2f2",
        borderTopWidth: 1
    },
    btuText: {
        fontSize: 16,
        flex: 1,
        textAlign: "center",
        height: 45,
        paddingVertical: 13
    },

    listView: {
        //marginTop: 10,
        // 主轴方向
        flexDirection: 'row',
        // 一行显示不下,换一行
        flexWrap: 'wrap',
        //horizontal :true,
        // 侧轴方向
        alignItems: 'flex-start', // 必须设置,否则换行不起作用
    },
    item: {
        height: 80,

        width: width / 3,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: "#e7e7e766",

    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    line: {
        height: 25,
        width: 3,
        backgroundColor: "#00b5fc",
    },
    image: {
        marginRight: 10,
        width: 18,
        height: 18,
    },
    text1: {
        fontSize: 15,
        color: "#5e5c68",
    },
    text2: {
        fontSize: 10,
        color: "#5e5c6866",
    },
    value: {
        fontSize: 17,
        color: "#00b5fc",
    },
    load: {
        position: "absolute",
        marginTop: 45,
        width: width,
        height: height - 95,
        zIndex: 9999,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "#ffffff66"
    },
    contrastImage: {
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    contrastItem: {
        flex: 1,
        flexDirection: "row",

        alignItems: "center"
    },
    contrastImageText: {
        fontSize: 10,
        padding: 0,
        color: "#fff",
    }
});