/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet,ScrollView, TouchableOpacity,AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';
import Constants from './../../../constants';

var { width, height } = Dimensions.get('window');

export default class ArchivesInfo  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                fetch(Constants.serverSite+"/v1_0_0/station/"+props.station_id+"/files?access_token=" + result)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        _this.setState({ data: responseJson })
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
                    <TouchableOpacity onPress={()=>this.props.navigator.pop()}><Image style={styles.topSides} resizeMode="contain" source={require('../../../icons/nav_back_icon.png')} /></TouchableOpacity>
                    <Text style={[styles.topText, styles.all]}>换热站信息</Text>
                    <View style={styles.topSides}  />
                </View>
                <ScrollView>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>名称</Text>
                    <Text style={styles.right}>{this.state.data.station_name}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>换热站厂家</Text>
                    <Text style={styles.right}>{this.state.data.create_company}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>建成时间</Text>
                    <Text style={styles.right}>{this.state.data.create_date}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>换热类型</Text>
                    <Text style={styles.right}>{this.state.data.exchange_type==1?"水水换热":"汽水换热"}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>供热用途</Text>
                    <Text style={styles.right}>{this.state.data.exchange_type==1?"采暖":"生活热水"}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>散热类型</Text>
                    <Text style={styles.right}>{this.state.data.exchange_type==1?"地暖":"散热器"}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>供热面积</Text>
                    <Text style={styles.right}>{this.state.data.total_area}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>地理坐标</Text>
                    <Text style={styles.right}>{this.state.data.lng},{this.state.data.lat}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>地势标高</Text>
                    <Text style={styles.right}>{this.state.data.station_elevation}</Text>
                </View>

                <View style={styles.lineView}>
                    <Text style={styles.nameText}>公建面积</Text>
                    <Text style={styles.right}>{this.state.data.building_area}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>公建个数</Text>
                    <Text style={styles.right}>{this.state.data.building_count}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>楼栋总数</Text>
                    <Text style={styles.right}>{this.state.data.building_sum}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>住宅个数</Text>
                    <Text style={styles.right}>{this.state.data.houses}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>住宅面积</Text>
                    <Text style={styles.right}>{this.state.data.residential_area}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>热用户总数</Text>
                    <Text style={styles.right}>{this.state.data.heat_consumer}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>系统形式</Text>
                    <Text style={styles.right}>{this.state.data.system_form}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>热源距离</Text>
                    <Text style={styles.right}>{this.state.data.heat_source_distance}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>热力站类型</Text>
                    <Text style={styles.right}>{this.state.data.heat_station_type}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>调控类型</Text>
                    <Text style={styles.right}>{this.state.data.control_type}</Text>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>备注</Text>
                    <Text style={styles.right}>{this.state.data.remark}</Text>
                </View>
                </ScrollView>
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
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: "#9f9f9f88",
        flexDirection: 'row',
        //justifyContent: 'flex-end',//垂直居中
        alignItems: 'center',
        //paddingBottom:3,
    },

    nameText: {
        //height: 45,
        width: 100,
        borderRightWidth: 1,
        borderColor: "#9f9f9f88",
        borderBottomWidth: 1,
        color: "#323541",
        fontSize: 15,
        paddingRight: 10,
        textAlign: 'right',
        textAlignVertical:"center",
        //backgroundColor:"#f5f5f5"
    },
    right: {
        flex:1,
        color: "#333333",
        fontSize: 16,
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