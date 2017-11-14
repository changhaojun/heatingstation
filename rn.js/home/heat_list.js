/**
 * Created by Vector on 17/4/18.
 *
 * 首页-【我的关注】子模块
 *
 * 2017/11/4修改 by Vector.
 *      1、删除多余注释
 *      2、删除公用代码
 *      3、删除无用的模块的导入
 *      4、将个别var定义的变量修改为const定义
 *      5、对获取到的数据进行判断,防止页面渲染时因无数据造成的渲染错误
 */

import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ListView,
    AsyncStorage,
    AlertIOS
} from 'react-native';
import Dimensions from 'Dimensions';
import StationDetails from '../tenance/station_details/station_tab';
import Constants from './../constants';
const { width, height } = Dimensions.get('window');

export default class HeatList extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
        };
        const _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                fetch(Constants.serverSite+"/v1_0_0/followStation?access_token=" + result)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.length > 0)
                        {
                            _this.setState({
                                dataSource: ds.cloneWithRows(responseJson),
                            });
                        }
                        else
                        {
                            AlertIOS.alert(
                                '提示',
                                '暂无关注数据',
                            );
                        }
                    })
                    .catch(() => {
                        AlertIOS.alert(
                            '提示',
                            '网络错误,获取数据失败',
                        );
                    });
            }
        });
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
                <Text style={styles.title}>我的关注</Text>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    contentContainerStyle={{ marginLeft: 15, }}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                        return (
                            <TouchableOpacity style={styles.item} onPress={this.openScada.bind(this,rowData.station_name,rowData.station_id)}>
                                <Text style={styles.text}>{rowData.station_name}</Text>
                                <Text style={styles.text}>{rowData.tag_name}</Text>
                                <Image style={styles.image} source={require('./../icons/thermometer.png')} />
                                <Text style={[styles.text,{flex:2,color:"#30adff",fontSize: 14}]}>{rowData.data_value}℃</Text>
                                <Text style={{fontSize: 10,color: "#656565",lineHeight: 20,flex: 3,textAlign:'right',paddingRight:5}}>{rowData.data_time}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor:"#fff",
        marginTop: 5,
    },
    item: {
        height: 40,
        alignItems: "center",
        flexDirection: 'row',
        borderTopWidth:0.2,
        borderTopColor:"#e7e7e7"
    },
    image: {
        marginTop:20,
        width: 30,
        height: 40,
    },
    text: {
        fontSize: 16,
        color: "#656565",
        lineHeight: 20,
        flex: 3
    },
    title:{
        fontSize: 18,
        color: "#3e3e3e",
        marginLeft:15,
        marginTop:5,
    },
    heatTextView: {
        width: width,
        height: 40,
        backgroundColor: "#4dbeff",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    list: {
        width: width,
        backgroundColor: "#f5f5f5",
        height: 1,

    },
    listItem: {
        paddingTop: 4,
        width: width,
        height: 50,
    },
    listItemImage: {
        width: 15,
        height: 15,
        marginTop: 5,
        marginRight: 10,
    },
    listItemText1: {
        fontSize: 16,
        flex: 1,
        marginLeft: 10,
        color: '#3d3d3d',
    },
    listItemTextView: {
        flex: 1,
        flexDirection: 'row',
    },
    listItemText2: {
        color: "#202B3D",
        marginLeft: 10,
        fontSize: 12,
    },
    time: {
        marginTop: 3,
        textAlign: 'right',
        marginRight: 10,
        fontSize: 10,
        color: "#b1b1b1"
    },
});