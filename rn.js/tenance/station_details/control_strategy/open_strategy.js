/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Switch,AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';
import EditStrategy from './edit_strategy';

var { width, height } = Dimensions.get('window');
export default class OpenStrategy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : props.data,
            open: props.data.is_enable?true:false,
        };
    }

    toEdit() {
        this.props.navigator.push({
            name: 'EditStrategy',
            component: EditStrategy,
            passProps: {
                data: this.state.data,
            }
        })
    }
    saveData() {
        
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            console.log("http://121.42.253.149:18816/v1_0_0/station_control_strategy?access_token=" + result + "&data=" + JSON.stringify(_this.state.data));
            if (!errs) {
                fetch("http://121.42.253.149:18816/v1_0_0/station_control_strategy?access_token=" + result + "&data=" + JSON.stringify(_this.state.data),{method: 'PUT'})
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

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={()=>this.props.navigator.pop()}><Image style={styles.topSides} source={require('../../../icons/nav_back_icon@2x.png')} /></TouchableOpacity>
                    <Text style={[styles.topText, styles.all]}>室外温度控制策略</Text>
                    <TouchableOpacity ><View style={styles.topSides} /></TouchableOpacity>
                </View>
                <View style={styles.lineView}>
                    <Text style={styles.nameText}>启用策略</Text>
                    <Switch
                        onValueChange={value => {
                            this.setState({ open: value });
                            this.state.data.is_enable = Number(value);
                            this.saveData();
                        }}
                        onTintColor={"#48B2FC"}
                        thumbTintColor="#48B2FC"
                        style={styles.right}
                        value={this.state.open} />
                </View>
                <TouchableOpacity style={styles.lineView} onPress={this.toEdit.bind(this)}>
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
        paddingBottom: 3,
    },

    nameText: {
        color: "#4e4e4e",
        fontSize: 17,
        marginLeft: 30,
    },
    right: {
        flex: 1,
        color: "#4e4e4e",
        fontSize: 35,
        marginRight: 30,
        textAlign: 'right',
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
    },
});