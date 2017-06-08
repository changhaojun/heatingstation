/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';


var { width, height } = Dimensions.get('window');

export default class ArchivesParam  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                fetch("http://121.42.253.149:18816/v1_0_0/heating_station_params?station_id="+props.station_id+"&access_token=" + result)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ data: responseJson[1] })
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
                    <TouchableOpacity onPress={()=>this.props.navigator.pop()}><Image style={styles.topSides} source={require('../../../icons/nav_back_icon@2x.png')} /></TouchableOpacity>
                    <Text style={[styles.topText, styles.all]}>换热站参数</Text>
                    <View style={styles.topSides}  />
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>供热用途</Text>
                    <Text style={styles.right}>{this.state.data.for_purpose==1?"采暖":"生活热水"}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>供热范围</Text>
                    <Text style={styles.right}>{this.state.data.for_scope}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>供热面积</Text>
                    <Text style={styles.right}>{this.state.data.heat_area}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>旁通管径</Text>
                    <Text style={styles.right}>{this.state.data.pipe_bypass_size}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>板换换热面积</Text>
                    <Text style={styles.right}>{this.state.data.plate_area}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>板换换热量</Text>
                    <Text style={styles.right}>{this.state.data.plate_heat}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>板换类型</Text>
                    <Text style={styles.right}>{this.state.data.plate_type}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>循环泵扬程</Text>
                    <Text style={styles.right}>{this.state.data.recycle_pump_headup}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>循环泵功率</Text>
                    <Text style={styles.right}>{this.state.data.ecycle_pump_power}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>补水泵扬程</Text>
                    <Text style={styles.right}>{this.state.data.supply_pump_headup}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>补水泵功率</Text>
                    <Text style={styles.right}>{this.state.data.supply_pump_power}</Text>
                </View>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        //
    },
    lineView: {
        width: width,
        height: 40,
        borderBottomWidth: 0.2,
        borderBottomColor: "#9f9f9f",
        flexDirection: 'row',
        //justifyContent: 'flex-end',//垂直居中
        alignItems: 'center',
        paddingBottom:3,
    },

    nameText: {
        height: 40,
        width: 100,
        borderRightWidth: 0.2,
        borderRightColor: "#9f9f9f",
        color: "#9f9f9f",
        fontSize: 17,
        paddingRight: 10,
        textAlign: 'right',
        textAlignVertical:"center"
    },
    right: {
        flex:1,
        color: "#9f9f9f",
        fontSize: 15,
        marginLeft: 10,
        textAlign: 'left',
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