/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ListView,AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';
import Constants from './../../../constants';
var { width, height } = Dimensions.get('window');
export default class LogList extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
        };
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                console.log(Constants.serverSite+ "/v1_0_0/operLog?access_token="+result+"&log_type="+props.isDirect+"&station_id="+ props.station_id);
                fetch(Constants.serverSite+ "/v1_0_0/operLog?access_token="+result+"&log_type="+props.isDirect+"&station_id="+ props.station_id)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({
                            dataSource: ds.cloneWithRows(responseJson),
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        )
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}><Image style={styles.topSides} source={require('../../../icons/nav_back_icon@2x.png')} /></TouchableOpacity>
                    <Text style={[styles.topText, styles.all]}>{this.props.isDirect?"策略下发记录":'直接下发记录'}</Text>
                    <View style={styles.topSides}  />
                </View>
                <View style={styles.rowFront}>
                    <View style={styles.rowFront}>
                            <Text style={styles.listText}>名称</Text>
                            <Text style={styles.listText}>目标</Text>
                            <Text style={styles.listText}>结果</Text>
                            <Text style={styles.listText}>{this.props.isDirect?"策略名称":'操作员工'}</Text>
                            <Text style={styles.listText}>操作时间</Text>
                        </View>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={data => (
                        <View style={styles.rowFront}>
                            <Text style={styles.listText}>{data.data_name}</Text>
                            <Text style={styles.listText}>{data.target_value}</Text>
                            <Text style={styles.listText}>{data.handle_result?"成功":"失败"}</Text>
                            <Text style={styles.listText}>{data.user_name}{data.control_strategy_name}</Text>
                            <Text style={styles.listText}>{data.oper_time}</Text>

                        </View>
                    )}
                />
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
    },
    rowFront: {
        width: width,
        height: 50,
        backgroundColor: '#ffffff',
        borderBottomWidth: 0.2,
        borderBottomColor: "#c8c7cd",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    rowBack: {
        width: width,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    delView: {
        height: 50,
        width: 70,
        backgroundColor: '#FF3B2F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editView: {
        height: 50,
        width: 70,
        backgroundColor: '#c8c7cd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgText: {
        color: "#fff",
        fontSize: 18,
    },
    listText: {
        width:(width)/5,
        color: "#4e4e4e",
        fontSize: 13,
        textAlign: 'center',
        //paddingLeft: 3,
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