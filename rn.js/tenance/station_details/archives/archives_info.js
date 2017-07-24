/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';
import ArchivesParam from './archives_param';
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

    toParam(){
        this.props.navigator.push({
                        name: "ArchivesParam",
                        component: ArchivesParam,
                        passProps:{
                             station_id:this.props.station_id
                        }
                    })
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={()=>this.props.navigator.pop()}><Image style={styles.topSides} source={require('../../../icons/nav_back_icon@2x.png')} /></TouchableOpacity>
                    <Text style={[styles.topText, styles.all]}>换热站信息</Text>
                    <View style={styles.topSides}  />
                </View>
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
                    <Text style={styles.nameText}>备注</Text>
                    <Text style={styles.right}>{this.state.data.remark}</Text>
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