/**
 * Created by Vector on 17/4/17.
 * 运行维护页面
 */

import React from 'react';
import {
    View, Text, TouchableOpacity,
    Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar, ListView, AsyncStorage
} from 'react-native';
import Constants from './../constants';
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');
import HeatStation from './heat_station_maintenance';
import Abnormal from './abnormal';
export default class Maintenance extends React.Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            access_token: null,
            company_id: null,
            company_code: null,
            refresh_token: null,
        };

        var _this = this;

        // 从本地存储中将company_id和access_token取出
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                _this.setState({ access_token: result });
            }
        });
        AsyncStorage.getItem("company_id", function (errs, result) {
            if (!errs) {
                _this.setState({ company_id: result });
            }
        });
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {

                _this.setState({ company_code: result });
                var uri = Constants.serverSite + "/v1_0_0/stationOnline?access_token=" + _this.state.access_token + "&company_code=" + _this.state.company_code + "&company_id=" + _this.state.company_id;
                console.log(uri);
                fetch(uri)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({
                            dataSource: ds.cloneWithRows(responseJson),
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            }
        });


    }

    gotoHeatStation(company_code) {
        this.props.navigator.push({
            component: HeatStation,
            passProps: {
                company_code: company_code,
            }
        })
    }

    render() {
        return (
            <View style={styles.all}>


                <View style={styles.navView}>
                    <Image style={{ width: 25, height: 25, marginLeft: 10, marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    <Text style={styles.topNameText}>运行维护</Text>
                    <TouchableHighlight onPress={() => { this.props.navigator.push({ component: Abnormal }) }}><Image style={{ width: 25, height: 20, marginRight: 10, }} resizeMode="contain" source={require('../icons/abnormal_icon.png')} /></TouchableHighlight>
                </View>
                <ListView
                    style={{ marginTop: 20 }}
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                        return (
                            <TouchableHighlight underlayColor="#ECEDEE" onPress={this.gotoHeatStation.bind(this, rowData.company_code)}>
                                <Image style={styles.listItemView} resizeMode="contain" source={require('../icons/bg_company.png')}>
                                    <Image style={styles.listItemIconView} resizeMode="contain" source={require('../icons/company_icon.png')}>
                                        <Text style={{ fontSize: 16, color: '#fff', marginTop: -28 }}>{rowData.company_name.substring(0, 2)}</Text>
                                    </Image>
                                    <View style={styles.listItemTextView}>
                                        <View style={{ flexDirection: "row", borderBottomColor: "#d7d8d9", borderBottomWidth: 0.5, marginHorizontal: 15, paddingBottom: 5 }}>
                                            <Image style={styles.minImage} resizeMode="contain" source={require('../icons/gongsi_icon.png')} />
                                            <Text style={{ fontSize: 16, color: '#212121' }}>{rowData.company_name}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", marginTop: 20, }}>

                                            <View style={styles.listItemTextView2}>
                                                <Text style={styles.listItemTextRight}>{rowData.onLine}/{rowData.station_count}</Text>
                                                <Text style={styles.listItemTextLeft}>换热站数量</Text>
                                            </View>
                                            <View style={styles.listItemTextView2}>
                                                <Text style={styles.listItemTextRight}>{rowData.total_area.toFixed(2)}</Text>
                                                <Text style={styles.listItemTextLeft}>供热面积(万㎡)</Text>
                                            </View>
                                            <View style={styles.listItemTextView2}>
                                                <Text style={styles.listItemTextRight}>{rowData.amount_rh ? rowData.amount_rh : "-"}</Text>
                                                <Text style={styles.listItemTextLeft}>热耗(GJ)</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Image>
                            </TouchableHighlight>
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
        backgroundColor: "#f1f2f3",
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
        marginLeft: 10,
        marginTop: 3,
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
    listItemView: {
        width: width,
        height: 147,
        flexDirection: 'row',
    },
    listItemIconView: {
        width: 90,
        height: 110,
        marginLeft: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItemTextView: {
        flex: 1,
        flexDirection: 'column',
        //marginLeft: 15,
        marginTop: 10,
        marginRight: 10,
    },
    listItemTextLeft: {
        fontSize: 12,
        color: '#656667',
    },
    listItemTextRight: {
        fontSize: 17,
        color: '#009ddd',
    },
    listItemTextView2: {
        alignItems: 'center',
        flex: 1,
    },
    minImage: {
        width: 20,
        height: 20,
        marginRight: 10,
        //marginLeft: 20
    }
});
