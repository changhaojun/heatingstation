/**
 * Created by vector on 2017/11/15.
 *
 * 换热站搜索页面
 */


import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    AsyncStorage,
    ListView,
    Alert,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    Image
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Constants from './../constants';
import StationDetails from './station_details/station_tab';
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
export default class WisdomHeating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            company_code: "",
            access_token: "",
            dataSource: [],
            loadShow: false,
            historySearch: [],
        }

        const _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {
                _this.setState({
                    company_code: result
                })
            }
        });
        AsyncStorage.getItem("history_search_station", function (errs, result) {
            console.log(result)
            if (!errs && result && result.length > 0) {
                _this.setState({ historySearch: result.split(",") })
            }
        });

        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                _this.setState({
                    access_token: result
                })
                var uri = Constants.serverSite + "/v1_0_0/tags?access_token=" + result + "&level=2";
                console.log(uri)
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ tagList: responseJson })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

        }
        );

    }



    getDataFromApi(text) {
        if (text) {
            this.setState({ searchValue: text })
        } else {
            text = this.state.searchValue;
        }

        var data = this.state.historySearch;
        for (var i = 0; i < data.length; i++) {
            if (data[i] == text) { data.splice(i, 1) }
        }
        if (text) { data.unshift(text); }

        if (data.length > 15) { data.pop() }
        AsyncStorage.setItem("history_search_station", data.join(","), function (errs) { });

        this.setState({ loadShow: true, });
        var uri = Constants.serverSite + "/v1_0_0/stationAllDatas?tag_id=10,11,12,20,16&access_token=" +
            this.state.access_token + "&company_code=" + this.state.company_code + "&name=" + "{'station_name':'" + text + "'}";
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.length > 0) {
                    this.setState({
                        loadShow: false,
                        dataSource: responseJson,
                    });
                } else {
                    Alert.alert(
                        '提示',
                        '无此换热站',
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    pop() {
        if (Platform.OS === 'ios' || this.state.searchValue.length < 1) {
            this.props.navigator.pop();
        } else {
            this.getDataFromApi();
        }

    }

    openScada(name, id) {
        this.props.navigator.push({
            component: StationDetails,
            passProps: {
                station_name: name,
                station_id: id,
            }
        })
    }


    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <View style={{ width: width - 50, height: 30, borderRadius: 5, backgroundColor: 'rgb(255,255,255)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TextInput
                            placeholder="输入你要查询的换热站名称"
                            placeholderTextColor="rgba(0,0,0,0.7)"
                            onChangeText={(searchValue) => this.setState({ searchValue: searchValue.replace(/(^\s*)|(\s*$)/g, "") })}
                            returnKeyType={"search"}
                            onSubmitEditing={() => this.getDataFromApi()}
                            style={styles.searchInput}
                            underlineColorAndroid="transparent"
                            autoFocus={true}
                            value={this.state.searchValue}
                        >
                        </TextInput>
                    </View>
                    <Text style={{ color: "#ffffff", marginLeft: 10 }} onPress={this.pop.bind(this)}>
                        {Platform.OS === 'ios' || this.state.searchValue.length < 1 ? "取消" : "搜索"}
                    </Text>
                </View>

                {this.state.dataSource.length ?
                    <View style={{ width: width,  }}>
                        <View style={styles.titleView}>
                            
                            <View style={styles.selectItemView1}>
                                <Text style={styles.titleText}>{this.state.tagList ? this.state.tagList[0].tag_name : ""}</Text>
                            </View>
                            <View style={styles.selectItemView}>
                                <Text style={styles.titleText}>{this.state.tagList ? this.state.tagList[1].tag_name : ""}</Text>
                            </View>
                            <View style={styles.selectItemView}>
                                <Text style={styles.titleText}>{this.state.tagList ? this.state.tagList[2].tag_name : ""}</Text>
                            </View>
                            <View style={styles.selectItemView}>
                                <Text style={styles.titleText}>{this.state.tagList ? this.state.tagList[3].tag_name : ""}</Text>
                            </View>
                            <View style={styles.selectItemView}>
                                <Text style={styles.titleText}>{this.state.tagList ? this.state.tagList[4].tag_name : ""}</Text>
                            </View>
                        </View>
                        <ListView
                            ref="ListView"
                            showsVerticalScrollIndicator={false}
                            enableEmptySections={true}
                            dataSource={ds.cloneWithRows(this.state.dataSource)}
                            renderRow={data => (
                                <TouchableOpacity underlayColor="rgba(77,190,255,0.5)" onPress={this.openScada.bind(this, data.station_name, data.station_id)}>
                                    <View style={[styles.listView, { height: 28, alignItems: "flex-end", }]}>
                                        <Text style={{ fontSize: 15, color: data.status === 1 ? '#0099ff' : "#919293", }} numberOfLines={1}>{data.station_name}</Text>
                                        <View style={{ flex: 1 }} />
                                        <Text style={{ fontSize: 11, color: '#919293', marginRight: 0, marginBottom: 3, }}>{data.data ? data.data.data_time : null}</Text>
                                    </View>
                                    <View style={styles.listView}>
                                        <View style={styles.selectItemView1}>
                                            <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data ? data.data[this.state.tagList[0].abbre] : "-"}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data ? data.data[this.state.tagList[1].abbre] : "-"}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data ? data.data[this.state.tagList[2].abbre] : "-"}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data ? data.data[this.state.tagList[3].abbre] : "-"}</Text>
                                        </View>
                                        <View style={styles.selectItemView}>
                                            <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data ? data.data[this.state.tagList[4].abbre] : "-"}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            renderSeparator={() => (
                                <View style={{ height: 1, backgroundColor: "#f2f2f2", width: width - 25, }} />
                            )}
                        />
                    </View>
                    : null}
                {!this.state.loadShow && !this.state.dataSource.length ? <ListView
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                    dataSource={ds.cloneWithRows(this.state.historySearch)}
                    renderRow={data => (
                        <TouchableOpacity style={styles.historyView} onPress={() => { this.getDataFromApi(data) }}>
                            <Image source={require('../icons/search.png')} style={styles.search} />
                            <Text style={[styles.historyText, { flex: 1 }]} >{data}</Text>
                            <Text style={[styles.historyText, { fontSize: 22, color: "#4f505166", }]} onPress={() => { this.setState({ searchValue: data }) }}> ↖  </Text>
                        </TouchableOpacity>
                    )}
                    renderSeparator={() => (
                        <View style={{ height: 1, backgroundColor: "#00000009", width: width }} />
                    )}
                /> : null}
                {this.state.loadShow ? <View style={styles.load}>
                    <ActivityIndicator
                        animating={true}
                        size="large"
                    /></View> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#f1f2f3",
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'center',
        alignItems: "center"
    },
    titleView: {
        width: width,
        height: 30,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    titleText: {
        fontSize: 13,
        color: '#0099ff',
        textAlign: 'center',
    },
    listView: {
        width: width,
        height: 30,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal : 10,
    },
    selectItemView: {
        width: (width - 20) / 5,
        height: 40,
        alignItems: "flex-end",
        justifyContent: 'center',
    },
    selectItemView1: {
        width: (width - 20) / 5,
        height: 40,
        alignItems: "flex-start",
        justifyContent: 'center',
    },
    listText: {
        fontSize: 13,
        color: '#000000',
        textAlign: 'left',
    },
    listWarnText: {
        fontSize: 13,
        color: 'rgb(248,184,54)',
        textAlign: 'left',
    },
    searchInput: {
        fontSize: 15,
        color: "rgba(0,0,0,0.7)",
        width: width - 50,
        height: 30,
        textAlign: "center",
        padding: 0,

    },
    historyText: {
        color: "#4f5051",
        fontSize: 17,
        marginLeft: 8,
    },
    historyView: {
        flexDirection: "row",
        height: 45,
        alignItems: "center",
    },
    load: {
        position: "absolute",
        width: width,
        height: height,
        zIndex: 9999,
        justifyContent: "center",
        alignItems: 'center',
    },
    search: {
        width: 15,
        height: 15,
        marginLeft: 15
    }
});