/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';
import ArchivesInfo from './archives_info';
import ArchivesParam from './archives_param';

var { width, height } = Dimensions.get('window');

export default class ArchivesClassification extends React.Component {
    toInfo(){
        this.props.navigator.push({
                        name: "ArchivesInfo",
                        component: ArchivesInfo,
                        passProps:{
                             station_id:this.props.station_id
                        }
                    })
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
                <TouchableOpacity style={styles.lineView} onPress={()=>this.toInfo()}>
                <Image style={styles.img} source={require('../../../icons/station_info.png')} />
                    <Text style={styles.nameText}>换热站信息</Text>
                    <Text style={styles.right}>›</Text>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.lineView} onPress={()=>this.toParam()}>
                <Image style={styles.img} source={require('../../../icons/station_param.png')} />
                    <Text style={styles.nameText}>换热站参数</Text>
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
        //
    },
    lineView: {
        width: width,
        height: 50,
        borderBottomWidth: 0.2,
        borderBottomColor: "#9f9f9f",
        flexDirection: 'row',
        //justifyContent: 'flex-end',//垂直居中
        alignItems: 'center',
        paddingBottom:3,
    },

    nameText: {
        color: "#333333",
        fontSize: 17,
        marginLeft: 5,
    },
    right: {
        flex:1,
        color: "#9f9f9f",
        fontSize: 35,
        marginRight: 10,
        textAlign: 'right',
    },
    img:{
        width: 20, 
        height: 20, 
        marginLeft: 17, 
   }
});