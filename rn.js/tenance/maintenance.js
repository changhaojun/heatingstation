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
                console.log(Constants.serverSite+"/v1_0_0/list?access_token=" + _this.state.access_token + "&level=0&tag_id=2&company_code=" + _this.state.company_code + "&_id=" + _this.state.company_id);
                fetch(Constants.serverSite+"/v1_0_0/list?access_token=" + _this.state.access_token + "&level=0&tag_id=2&company_code=" + _this.state.company_code + "&_id=" + _this.state.company_id)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        for (var i = 0; i < responseJson.length; i++) {
                            responseJson[i].heat_consum = responseJson[i].value[0].data_value;
                        }
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
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
                    backgroundColor='#343439'  //status栏背景色,仅支持安卓
                    translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='light-content' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                />

                <View style={styles.navView}>
                    {/*<TouchableOpacity onPress={this.backHome.bind(this)}>*/}
                    <Image style={{ width: 25, height: 25, marginLeft: 10, marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                    <Text style={styles.topNameText}>运行维护</Text>
                    {/*<TouchableOpacity style={styles.topImage} onPress={this.toNotice.bind(this)}>*/}
                    <Image style={{ width: 25, height: 25, marginRight: 10, marginTop: 10, }} source={require('../icons/nav_flag.png')} />
                    {/*</TouchableOpacity>*/}
                </View>
                <View style={styles.topView}>
                    <View style={styles.searchView}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={"请输入您要搜索的关键字"}
                            placeholderTextColor={'#808080'}
                            onChangeText={(searchValue) => this.setState({ searchValue })}
                        />
                        <TouchableOpacity activeOpacity={0.5}>
                            <Image style={{ width: 18, height: 18, marginRight: 10, }} source={require('../icons/search_light.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                        return (

                            <TouchableHighlight underlayColor="#ECEDEE" onPress={this.gotoHeatStation.bind(this, rowData.company_code)}>
                                <View style={styles.listItemView}>
                                    <Image style={styles.listItemIconView} source={require('../icons/company_icon.png')}></Image>
                                    <View style={styles.listItemTextView}>
                                        <View>
                                            <Text style={{ fontSize: 16, color: '#212121' }}>{rowData.name}</Text>
                                        </View>
                                        <View style={{ backgroundColor: 'rgb(60,61,64)', height: 20, marginTop: 2, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}>
                                            <Text style={styles.listItemTextLeft}>热耗</Text>
                                            <Text style={styles.listItemTextRight}>{rowData.heat_consum}GJ</Text>
                                        </View>
                                        <View style={styles.listItemTextView2}>
                                            <Text style={styles.listItemTextLeft}>换热站数量</Text>
                                            <Text style={styles.listItemTextRight}>{rowData.station_count}</Text>
                                        </View>
                                        <View style={styles.listItemTextView2}>
                                            <Text style={styles.listItemTextLeft}>供热面积</Text>
                                            <Text style={styles.listItemTextRight}>{rowData.heating_area}万㎡</Text>
                                        </View>
                                    </View>
                                </View>
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
    searchView: {
        width: width - 40,
        height: 38,
        // borderColor:"#ffffff",
        // borderWidth:1,
        // marginTop: 74,
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
        height: 140,
        flexDirection: 'row',
    },
    listItemIconView: {
        width: 110,
        height: 110,
        marginLeft: 10,
        marginTop: 10,
    },
    listItemTextView: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 15,
        marginTop: 10,
        marginRight: 10,
        // alignItems:'center',
        // justifyContent: 'center',
    },
    listItemTextLeft: {
        fontSize: 12,
        color: '#ffffff',
        textAlign: 'left',
    },
    listItemTextRight: {
        fontSize: 12,
        color: '#ffffff',
        textAlign: 'left',
        marginRight: 5,
    },
    listItemTextView2: {
        backgroundColor: 'rgb(60,61,64)',
        height: 20,
        alignItems: 'center',
        // justifyContent: 'center',
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }

});
