/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,TouchableWithoutFeedback, ListView, Modal, TextInput, AsyncStorage, Platform } from 'react-native';
import Dimensions from 'Dimensions';
import Swipeout from 'react-native-swipeout';
import Constants from './../../../constants';
var Alert = Platform.select({
    ios: () => require('AlertIOS'),
    android: () => require('Alert'),
})();

var { width, height } = Dimensions.get('window');
var aa = (!(~+[]) + {})[--[~+""][+[]] * [~+[]] + ~~!+[]] + ({} + [])[[~!+[]] * ~+[]]
export default class EditStrategy extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            data: props.data.control_value,
            dataSource: ds.cloneWithRows(props.data.control_value),
            modalShow: false,
            min_value: "",
            goal_value: "",
            max_value: "",
            edit: -1,
        };
    }
    //编辑数据
    addData() {
        if (parseInt(this.state.min_value) > parseInt(this.state.max_value)) {
            Alert.alert(
                '提示',
                '温度区间必须是从小到大',
            );
            return;
        }
        if (parseInt(this.state.goal_value) > 100) {
            Alert.alert(
                '提示',
                '阀门开度不能超过100',
            );
            return;
        }
        for (var i = 0; i < this.state.data.length; i++) {
            if ((this.state.min_value > this.state.data[i].min_value && this.state.min_value < this.state.data[i].max_value) || (this.state.max_value > this.state.data[i].min_value && this.state.max_value < this.state.data[i].max_value)) {
                Alert.alert(
                    '提示',
                    '温度区间不能和已有区间重合',
                );
                return;
            }
        }
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        if (this.state.edit >= 0) {
            var data = this.state.data;
            data[this.state.edit] = { min_value: this.state.min_value, max_value: this.state.max_value, goal_value: this.state.goal_value }
            this.setState({
                data: data,
                dataSource: ds.cloneWithRows(data),
                modalShow: false,
            })
        } else {
            var data = this.state.data.concat({ min_value: this.state.min_value, max_value: this.state.max_value, goal_value: this.state.goal_value });
            this.setState({
                data: data,
                dataSource: ds.cloneWithRows(data),
                modalShow: false,
            })
        }
        this.saveData();
    }
    //打开modal
    open(i) {
        if (i >= 0) {
            this.setState({
                edit: i,
                modalShow: true,
                min_value: this.state.data[i].min_value,
                goal_value: this.state.data[i].goal_value,
                max_value: this.state.data[i].max_value,
            })
        } else {
            this.setState({
                edit: i,
                modalShow: true,
                min_value: "",
                goal_value: "",
                max_value: "",
            })
        }
    }
    delData(num) {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state.data.splice(num, 1);
        this.setState({
            dataSource: ds.cloneWithRows(this.state.data),
        })
        this.saveData();
    }

    saveData() {
        this.props.data.control_value = this.state.data;
        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                console.log(Constants.serverSite + "/v1_0_0/stationControlStrategy?access_token=" + result + "&data=" + JSON.stringify(_this.props.data));
                fetch(Constants.serverSite + "/v1_0_0/stationControlStrategy?access_token=" + result + "&data=" + JSON.stringify(_this.props.data), { method: 'PUT' })
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
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}><Image style={styles.topSides} resizeMode="contain" source={require('../../../icons/nav_back_icon.png')} /></TouchableOpacity>
                    <Text style={[styles.topText, styles.all]}>{this.props.i?"回水温度控制策略":"室外温度控制策略"}</Text>
                    <TouchableOpacity onPress={this.open.bind(this, -1)}><Image style={styles.topSides} source={require('../../../icons/btn_add.png')} /></TouchableOpacity>
                </View>
                <View style={styles.rowFront}>
                    <Text style={[styles.listText, styles.all]}>温度</Text>
                    <Text style={styles.listText}>阀门开度</Text>
                </View>

                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData, sectionID, rowID) => {
                        return (
                            <Swipeout autoClose={true} right={[{ text: '修改', backgroundColor: "#c8c7cd", onPress: () => this.open(rowID) }, { text: '删除', backgroundColor: "#FF3B2F", onPress: () => this.delData(rowID) }]}>
                                <View style={styles.rowFront}>
                                    <Text style={[styles.listText, styles.all]}>{rowData.min_value}℃~{rowData.max_value}℃</Text>
                                    <Text style={styles.listText}>{rowData.goal_value}%</Text>
                                </View>
                            </Swipeout>
                        )
                    }}
                />

                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.modalShow}
                    onRequestClose={() => { }}>
                    <TouchableOpacity style={styles.modalAll} onPress={() => this.setState({ modalShow: false })}>
                        <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                            <View style={styles.nameView}><Text style={styles.modalNameText}>新增规则</Text></View>
                            <View style={styles.modalLine}>
                                <Text style={styles.lineText}>温度区间</Text>
                                <TextInput style={styles.lineTextInput} onChangeText={(text) => this.setState({ min_value: Number(text) + "" })} keyboardType="numeric">{this.state.min_value}</TextInput>
                                <Text style={styles.lineText}>℃至</Text>
                                <TextInput style={styles.lineTextInput} onChangeText={(text) => this.setState({ max_value: Number(text) + "" })} keyboardType="numeric">{this.state.max_value}</TextInput>
                                <Text style={styles.lineText}>℃</Text></View>
                            <View style={styles.modalLine}>
                                <Text style={styles.lineText}>阀门开度</Text>
                                <TextInput style={styles.lineTextInput} onChangeText={(text) => this.setState({ goal_value: Number(text) + "" })} keyboardType="numeric">{this.state.goal_value}</TextInput>
                                <Text style={styles.lineText}>%</Text></View>
                            <View style={styles.saveView}>
                                <Text style={[styles.saveText,{color:"#a2a2a2"}]} onPress={() => this.setState({ modalShow: false })}>取消</Text>
                                <Text style={styles.saveText} onPress={() => this.addData()}>保存</Text>
                            </View>
                        </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>
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
        color: "#4e4e4e",
        fontSize: 16,
        marginLeft: 40,
        marginRight: 40,
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


    //以下是弹窗的样式
    modalAll: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00000044"
    },
    modal: {
        width: 250,
        height: 200,
        backgroundColor: "#ffffff",
    },
    nameView: {
        width: 250,
        height: 40,
        justifyContent: 'center',
        backgroundColor: "#00b1fb",
        paddingLeft: 15,
    },
    modalNameText: {
        color: "#fff",
        fontSize: 15,
    },
    modalLine: {
        width: 250,
        height: 60,
        paddingLeft: 30,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: "#c8c7cd"
    },
    lineText: {
        fontSize: 15,
    },
    lineTextInput: {
        fontSize: 15,
        width: 40,
    },
    saveView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection:"row"
    },
    saveText: {
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 20,
        //paddingTop: 10,
        //paddingBottom: 10,
        //backgroundColor: "#00b1fb",
        
        color: "#00b1fb"
    },
    close: {
        height: 60,
        width: 60,
        fontSize: 45,
        margin: 50,
        backgroundColor: "#74bee4",
        borderRadius: 50,
        color: "#fff",
        textAlign: 'center',
        padding: -0,
        includeFontPadding: false,
        textAlignVertical: "center",
    },
});