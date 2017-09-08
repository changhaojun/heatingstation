/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, Switch, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';
import EditStrategy from './edit_strategy';
import Constants from './../../../constants';
var { width, height } = Dimensions.get('window');
export default class Strategy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                control_value: [],
                type: 0,
                is_enable: 0,
                station_id: props.station_id
            }, {
                control_value: [],
                type: 1,
                is_enable: 0,
                station_id: props.station_id
            }],
        };

        var _this = this;
        console.log(props.station_id);
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                fetch(Constants.serverSite + "/v1_0_0/stationControlStrategy?station_id=" + props.station_id + "&access_token=" + result)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        if (responseJson.length) {
                            var data = _this.state.data;
                            for (var i = 0; i < responseJson.length; i++) {
                                responseJson[i].control_value=responseJson[i].control_value?responseJson[i].control_value:[];//解决control_value为null 的情况
                                data[responseJson[i].type] = responseJson[i];
                                console.log(responseJson[i]);
                                
                            }
                            _this.setState({ data: data })
                            console.log(_this.state.data);
                        }
                    })
                    .catch((error) => {
                        // console.error(error);
                    });
            }
        }
        )
    }
    saveData(i) {   
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            console.log(Constants.serverSite+ "/v1_0_0/stationControlStrategy?access_token=" + result + "&data=" + JSON.stringify(_this.state.data));
            if (!errs) {
                fetch(Constants.serverSite+ "/v1_0_0/stationControlStrategy?access_token=" + result + "&data=" + JSON.stringify(_this.state.data[i]),{method: 'PUT'})
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                    })
                    .catch((error) => {
                         console.error(error);
                    });
            }
        }
        )
    }


    toEdit(i) {
        console.log(this.state.data[i]);
        this.props.navigator.push({
            name: 'EditStrategy',
            component: EditStrategy,
            passProps: {
                data: this.state.data[i],
                i:i,
            }
        })

    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.lineName} onPress={this.toEdit.bind(this, 0)}>
                    <Image style={styles.image} resizeMode="contain" source={require('../../../icons/strategy1.png')}></Image>
                    <Text style={styles.name}>室外温度控制策略</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>启用策略</Text>
                    <Switch
                        onValueChange={value => {
                            var data=this.state.data;
                            data[0].is_enable = Number(value);
                            data[1].is_enable = value?Number(!value):0;
                            this.setState({data:data})
                            this.saveData(0);

                        }}
                        onTintColor={"#48B2FC"}
                        thumbTintColor="#48B2FC"
                        style={styles.right}
                        value={Boolean(this.state.data[0].is_enable)} />
                </View>
                <TouchableOpacity style={styles.lineView} onPress={()=>this.toEdit(0)}>
                    <Text style={styles.nameText}>参数设置</Text>
                    <Text style={styles.right}>›</Text>
                </TouchableOpacity>



                <View style={styles.lineName} onPress={this.toEdit.bind(this, 1)}>
                    <Image style={[styles.image,{width:20}]} resizeMode="contain" source={require('../../../icons/strategy2.png')}></Image>
                    <Text style={styles.name}>回水温度控制策略</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>启用策略</Text>
                    <Switch
                        onValueChange={value => {
                            var data=this.state.data;
                            data[0].is_enable = value?Number(!value):0;
                            data[1].is_enable = Number(value);
                            this.setState({data:data})
                            this.saveData(1);
                        }}
                        onTintColor={"#48B2FC"}
                        thumbTintColor="#48B2FC"
                        style={styles.right}
                        value={Boolean(this.state.data[1].is_enable)} />
                </View>
                <TouchableOpacity style={styles.lineView} onPress={()=>this.toEdit(1)}>
                    <Text style={styles.nameText}>参数设置</Text>
                    <Text style={styles.right}>›</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    lineName: {
        width: width,
        height: 35,
        justifyContent: 'center',//垂直居中
        alignItems: 'center',
        margin: 2,
        flexDirection:"row"
    },

    name: {
        color: "#333333",
        fontSize: 14,
        //marginTop: 25,
    },
    image: {
        width:16,
        height:20,
        marginRight:5
    },
    lineView: {
        width: width,
        height: 45,
        borderBottomWidth: 0.2,
        borderBottomColor: "#9f9f9f",
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 3,
    },

    nameText: {
        color: "#333333",
        fontSize: 15,
        marginLeft: 20,
    },
    right: {
        flex: 1,
        color: "#4e4e4e",
        fontSize: 35,
        marginRight: 20,
        textAlign: 'right',
    },
});