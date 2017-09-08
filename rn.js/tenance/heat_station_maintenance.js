/**
 * Created by Vector on 17/4/24.运行维护 换热站列表
 */
import React from 'react';
import {
    View, Text, TouchableOpacity, Image,ActivityIndicator, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, ListView,
    AsyncStorage
} from 'react-native';
import Constants from './../constants';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

import StationDetails from './station_details/station_tab';
import Orientation from 'react-native-orientation';
export default class HeatStationMaintenance extends React.Component {

    componentWillMount() {
        //Orientation.lockToPortrait();
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            access_token: null,
            searchValue: "",
            data: []
        };
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                console.log(Constants.serverSite + "/v1_0_0/stationAllDatas?tag_id=7,14,3,17,6&access_token=" + result + "&company_code=" + _this.props.company_code)
                fetch(Constants.serverSite + "/v1_0_0/stationAllDatas?tag_id=7,14,3,17,6&access_token=" + result + "&company_code=" + _this.props.company_code)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({
                            data: responseJson,
                            dataSource: ds.cloneWithRows(responseJson),

                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        )
    }

    back() {
        this.props.navigator.pop();
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

    searchStation() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        var newdata = [];
        for (var i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].station_name.match(this.state.searchValue)) {
                newdata.push(this.state.data[i]);
            }
            this.setState({
                dataSource: ds.cloneWithRows(newdata),

            });
        }

    }

    render() {
        return (
            <View style={styles.all}>

                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 25, height: 20, marginLeft: 10, }}  resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>换热站运行情况</Text>
                    <Image style={{ width: 25, height: 25, marginRight: 10,}} source={require('../icons/nav_flag.png')} />
                </View>
                <View style={styles.topView}>
                    <View style={styles.searchView}>
                    <Image style={{ width: 18, height: 18, marginLeft: 10, }} source={require('../icons/search_light.png')} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={"请输入您要搜索的换热站关键字"}
                            placeholderTextColor={'#808080'}
                            underlineColorAndroid="transparent"
                            onChangeText={(searchValue) => this.setState({ searchValue })}
                            onSubmitEditing={()=>this.searchStation()}
                            returnKeyType="search"
                        />
                    </View>
                </View>
                <View style={styles.titleView}>
                    <View style={styles.selectItemView}>
                        <Text style={styles.titleText}>换热站</Text>
                    </View>
                    <View style={styles.selectItemView}>
                        <Text style={styles.titleText}>热单耗</Text>
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
                    {this.state.data.length ?
                        <ListView
                            automaticallyAdjustContentInsets={false}
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => {
                                return (
                                    <TouchableHighlight underlayColor="rgba(77,190,255,0.5)" onPress={this.openScada.bind(this, rowData.station_name, rowData.station_id)}>
                                        <View style={styles.listView}>
                                            {/* <Image style={{ width: 19, height: 18, }} source={rowData.is_online ? require('../icons/online.png') : require('../icons/outline.png')} /> */}
                                            <View style={styles.selectItemView}>
                                                <Text style={{ fontSize: 10, color: '#000000', textAlign: 'center',  }} numberOfLines={1}>{rowData.station_name}</Text>
                                                <Text style={{ fontSize: 7, color: '#888888', textAlign: 'center',  }}>{rowData.data?rowData.data.data_time:null}</Text>
                                            </View>
                                            <View style={styles.selectItemView}>
                                                <Text style={rowData.real_data_status ? styles.listText : styles.listWarnText}>{rowData.data?rowData.data["rd"]:"-"}</Text>
                                            </View>
                                            <View style={styles.selectItemView}>
                                                <Text style={rowData.come_temp_status ? styles.listText : styles.listWarnText}>{rowData.data?rowData.data["2gw"]:"-"}</Text>
                                            </View>
                                            <View style={styles.selectItemView}>
                                                <Text style={rowData.home_temp_status ? styles.listText : styles.listWarnText}>{rowData.data?rowData.data["1hw"]:"-"}</Text>
                                            </View>
                                            <View style={styles.selectItemView}>
                                                <Text style={rowData.ins_flow_status ? styles.listText : styles.listWarnText}>{rowData.data?rowData.data["1wc"]:"-"}</Text>
                                            </View>
                                            <View style={styles.selectItemView}>
                                                <Text style={rowData.diff_Pressure_status ? styles.listText : styles.listWarnText}>{rowData.data?rowData.data["1yc"]:"-"}</Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                )
                            }}
                        />
                        : <ActivityIndicator
                            animating={true}
                            size="large"
                        />
                    }


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
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        //marginTop: 10,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
    searchView: {
        width: width - 40,
        height: 38,
        flexDirection: 'row',
        borderRadius: 38,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    textInput: {
        flex: 1,
        //marginLeft: 10,
        //marginTop: 3,
    },
    topView: {
        height: height / 10,
        // flex:0.2,
        width: width,
        backgroundColor: '#343439',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleView: {
        width: width,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    listView: {
        width: width,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e9e9e9',
    },
    selectItemView: {
        width: (width - 18) / 6,
        height: 40,
        alignItems:"center",
        justifyContent: 'center',
    },

    titleText: {
        fontSize: 13,
        color: '#0099ff',
        textAlign: 'center',
    },
    listText: {
        fontSize: 13,
        color: '#000000',
        textAlign: 'center',
    },
    listWarnText: {
        fontSize: 13,
        color: '#333333',
        textAlign: 'center',
    },
    bottomView: {
        backgroundColor: '#e9e9e9',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
    },
    listItem: {
        width: width,
        height: 25,
        flexDirection: 'row',
        backgroundColor: '#E9E9E9',
    },
    listItemText1: {
        color: "#b57907",
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "bold",
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 3,
        height: 32,
    },
    listItemChild: {
        width: width,
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderTopWidth: 2,
        borderColor: '#e9e9e9'
    },
    sectionText: {
        fontSize: 18,
        color: '#515151',
        paddingLeft: 10,
        paddingTop: 4,
    },
    data_valueText: {
        paddingTop: 13,
        fontSize: 16,
        textAlign: 'left',
        color: '#0099ff',
        paddingLeft: 20,
    },
    listItemChild1: {
        width: width / 4,
    },
    listItemText2: {
        paddingTop: 13,
        fontSize: 16,
        textAlign: 'left',
        color: '#515151',
        paddingLeft: 30,
    },
});