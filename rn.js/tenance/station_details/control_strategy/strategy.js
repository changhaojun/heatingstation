/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, Switch, StyleSheet,Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import Dimensions from 'Dimensions';
import Constants from './../../../constants';
import EditStrategy from './edit_strategy';
var { width, height } = Dimensions.get('window');
export default class Strategy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            ObjectData: {},
        };

        var _this = this;
        console.log(props.station_id);
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                fetch(Constants.serverSite + "/v1_0_0/stationControlStrategy?station_id=" + props.station_id + "&access_token=" + result)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        var ObjectData = {};
                        for (var i = 0; i < responseJson.length; i++) {
                            ObjectData[responseJson[i].data_tag] = responseJson[i];
                        }
                        console.log(ObjectData);
                        _this.setState({ data: responseJson, ObjectData: ObjectData })
                    })
                    .catch((error) => {
                        // console.error(error);
                    });
            }
        }
        )
    }


    toEdit(i,name) {
        var trategyTypeId;
        if (i == 0) {
            trategyTypeId = 100;
        } else if (i == 1) {
            trategyTypeId = 150;
        } else if (i == 2) {
            trategyTypeId = 160;
        }
        if(i<3&&!this.state.ObjectData[trategyTypeId]){
            Alert.alert("提示","未配置该控制策略，请前往网页端进行配置")
            return;
        }
        this.props.navigator.push({
            name: 'EditStrategy',
            component: EditStrategy,
            passProps: {
                ObjectData: this.state.ObjectData,
                i: i,
                name:name
            }
        })

    }

    render() {
        return (
            <View style={styles.all}>
                <TouchableOpacity style={styles.lineView} onPress={() => this.toEdit(0,"一网泵阀控制")}>
                    <Text style={styles.nameText}>一网泵阀控制</Text>
                    <Text style={styles.right}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.lineView} onPress={() => this.toEdit(1,"循环泵控制")}>
                    <Text style={styles.nameText}>循环泵控制</Text>
                    <Text style={styles.right}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.lineView} onPress={() => this.toEdit(2,"补水泵控制")}>
                    <Text style={styles.nameText}>补水泵控制</Text>
                    <Text style={styles.right}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.lineView} onPress={() => this.toEdit(3,"泄压阀控制")}>
                    <Text style={styles.nameText}>泄压阀控制</Text>
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
    lineView: {
        width: width,
        height: 50,
        marginTop: 5,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 3,
    },

    nameText: {
        color: "#000",
        fontSize: 17,
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