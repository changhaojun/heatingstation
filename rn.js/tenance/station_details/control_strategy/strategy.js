/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';
import OpenStrategy from './open_strategy';

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
                fetch("http://121.42.253.149:18816/v1_0_0/station_control_strategy?station_id=" + props.station_id + "&access_token=" + result)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        if (responseJson.length) {
                            var data = _this.state.data;
                            for (var i = 0; i < responseJson.length; i++) {
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



    toEdit(i) {
        this.props.navigator.push({
            name: 'OpenStrategy',
            component: OpenStrategy,
            passProps: {
                data: this.state.data[i],
            }
        })

    }

    render() {
        return (
            <View style={styles.all}>
                <TouchableOpacity style={styles.lineView} onPress={this.toEdit.bind(this, 0)}><Text style={styles.nameText}>室外温度控制策略</Text><Image style={styles.image} resizeMode="contain" source={this.state.data[0].is_enable ? require('../../../images/open.png') : require('../../../images/close.png')}></Image></TouchableOpacity>
                <TouchableOpacity style={styles.lineView} onPress={this.toEdit.bind(this, 1)}><Text style={styles.nameText}>回水温度控制策略</Text><Image style={styles.image} resizeMode="contain" source={this.state.data[1].is_enable ? require('../../../images/open.png') : require('../../../images/close.png')}></Image></TouchableOpacity>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        flexDirection: 'row',
    },
    lineView: {
        width: width / 2 - 4,
        height: width / 2,
        //justifyContent: 'flex-end',//垂直居中
        alignItems: 'center',
        margin: 2,
        backgroundColor: '#35343a',
    },

    nameText: {
        color: "#9f9f9f",
        fontSize: 14,
        marginTop: 25,
    },
    image: {
        flex: 1,
        //margin: 10,
        width: width / 2 - 90,
        //height:width/2-100,
    },
});