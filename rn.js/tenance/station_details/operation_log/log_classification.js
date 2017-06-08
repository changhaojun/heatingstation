/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';
import LogList from './log_list';

var { width, height } = Dimensions.get('window');

export default class LogClassification extends React.Component {
    
    
    toList(num){
        this.props.navigator.push({
                        name: "LogList",
                        component: LogList,
                        passProps:{
                            isDirect:num,
                             station_id:this.props.station_id
                        }
                    })
    }

    render() {
        return (
            <View style={styles.all}>
                <TouchableOpacity style={styles.lineView} onPress={this.toList.bind(this,0)}><Text style={styles.nameText}>直接下发记录</Text><Text style={styles.right}>›</Text></TouchableOpacity>
                <TouchableOpacity style={styles.lineView} onPress={this.toList.bind(this,1)}><Text style={styles.nameText}>策略下发记录</Text><Text style={styles.right}>›</Text></TouchableOpacity>
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
        color: "#9f9f9f",
        fontSize: 17,
        marginLeft: 30,
    },
    right: {
        flex:1,
        color: "#9f9f9f",
        fontSize: 35,
        marginRight: 30,
        textAlign: 'right',
    },
});