/**
 * Created by Vector on 17/4/18.
 */
/**
 * Created by Vector on 17/4/17.
 */
// 设置页面
import React from 'react';
import {View, Text, Image, TextInput, Navigator, StyleSheet, TouchableHighlight, StatusBar,TouchableOpacity,ListView,} from 'react-native';


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
                    hidden={true}  //status显示与隐藏
                />
                <View style={styles.navView}>
                    <TouchableOpacity onPress={this.back.bind(this)}>
                        <Image style={{ width: 20, height: 18, marginLeft:10,marginTop: 10, }} source={require('../icons/nav_back_icon.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>告警</Text>
                    <Image style={{ width: 18, height: 20, marginRight:10,marginTop: 10, }} source={require('../icons/nav_flag.png')}/>
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
                            <Text style={styles.listItemText1}>{rowData.heatName}</Text>
                        </View>
                        <View style={styles.listItemTextView}>
                            <View style={styles.listItemTextView}>
                                <Image source={require('../icons/warn_station_icon@2x.png')} style={{marginLeft: 20,}}/>
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
        backgroundColor: "#f2d6b8",
        // marginTop: 20,
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 64,
        backgroundColor: '#f2d6b8',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#C3AB90',
    },
    topNameText: {
        flex: 1,
        marginTop: 10,
        textAlign: 'center',
        color: "#000000",
        fontSize: 19,
    },
    listItem:{
        paddingTop:10,
        width:width,
        height:70,
        backgroundColor: '#ffffff',
        borderTopWidth: 3,
        borderColor: '#ffba00',
        marginBottom:10,
    },
    listItemText1:{
        fontSize:20,
        flex: 1,
        marginLeft: 20,
        color: '#cd4747',
    },
    listItemTextView:{
        flex: 1,
        flexDirection: 'row',
    },
    listItemText2:{
        color:"#3d3d3d",
        marginLeft: 2,
        fontSize:14,
        marginTop:2,
    },
    listView:{
        marginTop:10,
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
