/**
 * Created by Vector on 17/4/18.
 */
/**
 * Created by Vector on 17/4/17.
 */
// 设置页面
import React from 'react';
import {View, Text, Image, TextInput, NavigatorIOS, StyleSheet, TouchableHighlight, StatusBar,TouchableOpacity,ListView,} from 'react-native';


import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');
export default class Warn extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            planTotalEnergy: '2000',
            realTotalEnergy: '1800',
            dataSource:ds.cloneWithRows([{
                heatName: '朝阳门',
                warnDetail: '换热站被雷霹了',
                data: '2017-1-15'
            },
                {
                    heatName: '雁塔区',
                    warnDetail: '换热站又被雷霹了',
                    data: '2017-1-15'
                }
            ]),
        };
        //
        // var _this = this;
        // fetch("http://rapapi.org/mockjsdata/16979/v1_0_0/heat")
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         _this.setState({
        //                 dataSource:ds.cloneWithRows(responseJson.heat_data),
        //                 planTotalEnergy: responseJson.plan_total_energy,
        //                 realTotalEnergy: responseJson.real_total_energy,
        //             }
        //         );
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
    }

    back(){
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={styles.all}>
                {/*状态栏*/}
                <StatusBar
                    hidden={false}  //status显示与隐藏
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
                    <Text style={styles.topNameText}>告警</Text>
                    <Image style={{ width: 25, height: 25, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')}/>
                </View>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    contentContainerStyle={styles.listView}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                return(

                  //<TouchableHighlight onPress={this._jump.bind(this,rowData.heat_id,rowData.heat_name)}>
                    <View style={styles.listItem}>
                        <View style={styles.listItemTextView}>
                            <Image source={require('../icons/warn_station_icon@2x.png')} style={{marginLeft: 20, marginTop:2,}}/>
                            <Text style={styles.listItemText1}>{rowData.heatName}</Text>
                        </View>
                        <View style={styles.listItemTextView}>
                            <View style={styles.listItemTextView}>
                                <Text style={styles.listItemText2}>{rowData.warnDetail}</Text>
                            </View>
                            <Text style={styles.time}>{rowData.data}</Text>
                        </View>
                        <View style={styles.list}></View>
                    </View>
                  //</TouchableHighlight>
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
        backgroundColor: "#2C3544",
        // marginTop: 20,
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
    listItem:{
        paddingTop:10,
        width:width,
        height:70,
        backgroundColor: '#ffffff',
        borderTopWidth: 2,
        borderColor: '#0099FF',
        marginBottom:6,
    },
    listItemText1:{
        fontSize:20,
        flex: 1,
        marginLeft: 2,
        color: '#cd4747',
    },
    listItemTextView:{
        flex: 1,
        flexDirection: 'row',
    },
    listItemText2:{
        color:"#3d3d3d",
        marginLeft: 20,
        fontSize:14,
        marginTop:2,

    },
    listView:{
        marginTop:6,
    },
    time:{
        marginTop: 3,
        // flex: 1,
        textAlign: 'right',
        marginRight: 10,
        fontSize:14,
        color:"#b1b1b1"
    },
});