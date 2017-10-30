/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, Switch, StyleSheet, ListView, Modal, TouchableOpacity, AsyncStorage, ScrollView, TextInput, Alert } from 'react-native';
import Dimensions from 'Dimensions';
import Constants from './../../../constants';
import Echarts from 'native-echarts';
var { width, height } = Dimensions.get('window');
var timer;  //setValue 的计时器
var trategyTypeId = 100;//切换控制策略的标签
export default class Strategy extends React.Component {
    constructor(props) {
        super(props);
        if (props.i == 0) {
            trategyTypeId = 100;
        } else if (props.i == 1) {
            trategyTypeId = 150;
        } else if (props.i == 2) {
            trategyTypeId = 160;
        }

        var climate = [];//气候补偿的数组
        var xData = [];//气候补偿的x轴数组
        var chartData = [];//气候补偿的x轴数组
        var j = 0;
        var selTrategy;   //当前选择的控制策略的名称
        var bengName; //当前选择的一网泵

        if (props.i < 3) {
            props.ObjectData[trategyTypeId].option_id = props.ObjectData[trategyTypeId].option_id ? props.ObjectData[trategyTypeId].option_id : 1; //选中的控制策略
            for (var i = 0; i < props.ObjectData[trategyTypeId].tag_option.length; i++) {
                if (props.ObjectData[trategyTypeId].tag_option[i].option_id == props.ObjectData[trategyTypeId].option_id) {
                    selTrategy = props.ObjectData[trategyTypeId].tag_option[i].name
                }
            }


            props.ObjectData[130].option_id = props.ObjectData[130].option_id ? props.ObjectData[130].option_id : 1; //选中的控制策略
            for (var i = 0; i < props.ObjectData[130].tag_option.length; i++) {
                if (props.ObjectData[130].tag_option[i].option_id == props.ObjectData[130].option_id) {
                    bengName = props.ObjectData[130].tag_option[i].name
                }
            }

            for (var i = 101; i <= 114; i++) {
                if (props.ObjectData[i]) {
                    climate.push(i);
                    xData.push(props.ObjectData[100].range.initialTemp + props.ObjectData[100].range.intervalTemp * j);
                    chartData.push(props.ObjectData[i].data_value ? props.ObjectData[i].data_value : 0)
                    j++;
                }
            }
        }




        this.state = {
            ObjectData: props.ObjectData,
            trategyName: selTrategy,
            bengName: bengName,
            climate: climate,
            modalVisible: false,
            bengVisible: false,
            xData: xData,
            chartData: chartData,
            password: "",
            remember: false,
            passwordVisible: false
        };
        var _this = this;
        AsyncStorage.getItem("issue_password", function (errs, result) {
            if (!errs && result) {
                _this.setState({ password: result, remember: true });
            }
        });
    }

    saveData() {
        var saveArray = [];
        switch (this.props.i) {
            case 0: {
                switch (this.state.ObjectData[trategyTypeId].option_id) {
                    case 1: {
                        saveArray = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129];
                        break;
                    }
                    case 2: {
                        saveArray = [100, 135];
                        break;
                    }
                    case 3: {
                        saveArray = [100, 136, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129];
                        break;
                    }
                    case 4: {
                        saveArray = [100, 137];
                        break;
                    }
                    case 5: {
                        saveArray = [100, 138];
                        break;
                    }
                    case 6: {
                        saveArray = [100, 130, 131, 132, 133, 134];
                        break;
                    }
                }
                break;
            }
            case 1: {
                switch (this.state.ObjectData[trategyTypeId].option_id) {
                    case 1: {
                        saveArray = [150, 151];
                        break;
                    }
                    case 2: {
                        saveArray = [150, 152];
                        break;
                    }
                    case 3: {
                        saveArray = [150, 153];
                        break;
                    }
                }
                break;
            }
            case 2: {
                switch (this.state.ObjectData[trategyTypeId].option_id) {
                    case 1: {
                        saveArray = [160, 163];
                        break;
                    }
                    case 2: {
                        saveArray = [160, 164];
                        break;
                    }
                }
                break;
            }
            case 3: {
                saveArray = [171, 172, 173];
                break;
            }
        }
        console.log(saveArray);
        var data = [];//保存的数组
        for (var i = 0; i < saveArray.length; i++) {
            if (this.state.ObjectData[saveArray[i]]) { data.push(this.state.ObjectData[saveArray[i]]) }
        }
        if (this.state.remember) {
            AsyncStorage.setItem("issue_password", this.state.password, function (errs) { });
        }

        var _this = this;
        AsyncStorage.getItem("access_token", function (errs, result) {
            console.log(Constants.serverSite + "/v1_0_0/stationIssued?access_token=" + result + "&data=" + JSON.stringify(data) + "&issue_password=" + _this.state.password);
            if (!errs) {
                fetch(Constants.serverSite + "/v1_0_0/stationIssued?access_token=" + result + "&data=" + JSON.stringify(data) + "&issue_password=" + _this.state.password, { method: 'POST' })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        if (responseJson.result) {
                            _this.props.navigator.pop();
                            Alert.alert("提示", "保存成功")
                        } else {
                            Alert.alert("提示", "保存失败")
                        }
                        _this.setState({ passwordVisible: false })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        )
    }

    //开始改变值
    setValue(id, addValue) {
        var _this = this;
        var f = function () {
            var ObjectData = _this.state.ObjectData;
            ObjectData[id].data_value = ((ObjectData[id].data_value ? ObjectData[id].data_value : 0) * 10 + addValue * 10) / 10;
            ObjectData[id].data_value = ObjectData[id].data_value > ObjectData[id].tag_range.upper_value ? ObjectData[id].tag_range.upper_value : ObjectData[id].data_value;
            ObjectData[id].data_value = ObjectData[id].data_value < ObjectData[id].tag_range.lower_value ? ObjectData[id].tag_range.lower_value : ObjectData[id].data_value;
            _this.setState({ ObjectData: ObjectData })
            if (id > 100 && id < 115) {
                var chartData = [];//气候补偿的x轴数组
                for (var i = 101; i <= 114; i++) {
                    if (_this.state.ObjectData[i]) {
                        chartData.push(_this.state.ObjectData[i].data_value ? _this.state.ObjectData[i].data_value : 0)
                    }
                }
                _this.setState({ chartData: chartData })
            }
        }
        f();
        timer = setTimeout(() => {
            timer = setInterval(() => {
                f();
            }, 200);
        }, 100);


    }
    //停止改变值
    setValueOut() {
        clearInterval(timer);
    }
    //保存选择的控制策略
    selectTrategy(option_id) {
        var ObjectData = this.state.ObjectData;
        ObjectData[trategyTypeId].option_id = option_id;
        var selTrategy;   //当前选择的控制策略的名称
        for (var i = 0; i < ObjectData[trategyTypeId].tag_option.length; i++) {
            if (ObjectData[trategyTypeId].tag_option[i].option_id == ObjectData[trategyTypeId].option_id) {
                selTrategy = ObjectData[trategyTypeId].tag_option[i].name
            }
        }
        this.setState({
            ObjectData: ObjectData,
            modalVisible: false,
            trategyName: selTrategy,
        })
    }

    //保存选择的一网泵
    selectBeng(option_id) {
        var ObjectData = this.state.ObjectData;
        ObjectData[130].option_id = option_id;
        var bengName;   //当前选择的控制策略的名称
        for (var i = 0; i < ObjectData[130].tag_option.length; i++) {
            if (ObjectData[130].tag_option[i].option_id == ObjectData[130].option_id) {
                bengName = ObjectData[130].tag_option[i].name
            }
        }
        this.setState({
            ObjectData: ObjectData,
            bengVisible: false,
            bengName: bengName,
        })
    }


    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        var option = {
            grid: {
                top: "30",
                left: '3%',
                right: '70',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                data: this.state.xData,
                name: "室外温度",
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                },
                name: "供水温度",
                splitLine: {
                    show: true
                },
            },
            dataZoom: [
                {
                    type: 'inside',
                }
            ],
            color: ["rgb(92,182,164)"],
            series: [{
                name: '供水温度',
                type: 'line',
                smooth: true,
                areaStyle: { normal: { color: "rgb(200,232,226)" } }, //曲线下方的面积的颜色
                data: this.state.chartData,
            }],
            animation: false
        }
        return (
            <View style={styles.all}>

                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}><Image style={styles.topSides} resizeMode="contain" source={require('../../../icons/nav_back_icon.png')} /></TouchableOpacity>
                    <Text style={[styles.topText, styles.all]}>{this.props.name}</Text>
                    <View style={styles.topSides}></View>
                </View>
                {this.props.i < 3 ? <TouchableOpacity style={styles.lineView} onPress={() => this.setState({ modalVisible: true })}>
                    <Text style={styles.nameText}>选择控制策略</Text>
                    <Text style={styles.strateName}>{this.state.trategyName}</Text>
                    <Text style={styles.right}>›</Text>
                </TouchableOpacity> : null}
                <ScrollView>
                    {this.props.i == 0 ? <View>
                        {/* 气候补偿表格 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 1 ? <View>
                            {this.state.ObjectData[101] ? <View>

                                <View style={styles.title}><View style={styles.leftLine} /><Text style={styles.titleName}>气候补偿曲线</Text></View>
                                <Echarts option={option} height={250} />
                                <View style={[styles.tableRow, { marginHorizontal: 20, }]}>
                                    <View style={styles.tableCell}><Text>室外温度</Text></View>
                                    <View style={styles.tableCell}><Text>供水温度</Text></View>
                                </View>
                                <ListView
                                    style={{ borderWidth: 1, borderColor: "#d2d2d2", marginHorizontal: 20, }}
                                    automaticallyAdjustContentInsets={false}
                                    dataSource={ds.cloneWithRows(this.state.climate)}
                                    //contentContainerStyle={{ marginLeft: 15, }}
                                    enableEmptySections={true}
                                    renderRow={(rowData, j, i) => {
                                        return (
                                            <View style={styles.tableRow}>
                                                <View style={styles.tableCell}>
                                                    <Text style={styles.tableCellText}>{this.state.ObjectData[100].range.initialTemp + this.state.ObjectData[100].range.intervalTemp * parseInt(i)}
                                                        ℃~{this.state.ObjectData[100].range.initialTemp + this.state.ObjectData[100].range.intervalTemp * (parseInt(i) + 1)}℃</Text>
                                                </View>
                                                <View style={styles.tableCell}>
                                                    <TouchableOpacity onPressIn={() => this.setValue(rowData, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                                    <Text style={styles.tableCellText}>{this.state.ObjectData[rowData].data_value ? this.state.ObjectData[rowData].data_value : 0}</Text>
                                                    <TouchableOpacity onPressIn={() => this.setValue(rowData, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }}
                                />

                            </View> : null}
                        </View> : null}

                        {/* 一网阀门开度 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 2 ? <View>
                            {this.state.ObjectData[135] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>阀门开度设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(135, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[135].data_value ? this.state.ObjectData[135].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(135, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}


                        {/* 一网恒定供温给定 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 3 ? <View>
                            {this.state.ObjectData[135] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>恒定供温设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(136, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[136].data_value ? this.state.ObjectData[136].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(136, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}

                        {/* 一网恒定流量 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 4 ? <View>
                            {this.state.ObjectData[137] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>恒定流量设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(137, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[137].data_value ? this.state.ObjectData[137].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(137, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}

                        {/* 一网恒定热量 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 5 ? <View>
                            {this.state.ObjectData[138] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>恒定热量设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(138, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[138].data_value ? this.state.ObjectData[138].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(138, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}

                        {/* 一网泵频率设定 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 6 ? <View>

                            {this.state.ObjectData[130] ? <TouchableOpacity style={[styles.lineView, { marginTop: 10 }]} onPress={() => this.setState({ bengVisible: true })}>
                                <Text style={styles.nameText}>泵号选择</Text>
                                <Text style={styles.strateName}>{this.state.bengName}</Text>
                                <Text style={styles.right}>›</Text>
                            </TouchableOpacity> : null}

                            {this.state.ObjectData[131] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>一网泵{this.state.ObjectData[130] ? "" : "1"}频率设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(131, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[131].data_value ? this.state.ObjectData[131].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(131, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                            {!this.state.ObjectData[130] ? <View>
                                {this.state.ObjectData[132] ? <View style={styles.row}>
                                    <View style={styles.cell}>
                                        <Text style={styles.tableCellText}>一网泵2频率设定：</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(132, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[132].data_value ? this.state.ObjectData[132].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(132, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                </View> : null}
                                {this.state.ObjectData[133] ? <View style={styles.row}>
                                    <View style={styles.cell}>
                                        <Text style={styles.tableCellText}>一网泵3频率设定：</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(133, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[133].data_value ? this.state.ObjectData[133].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(133, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                </View> : null}
                                {this.state.ObjectData[134] ? <View style={styles.row}>
                                    <View style={styles.cell}>
                                        <Text style={styles.tableCellText}>一网泵4频率设定：</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(134, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[134].data_value ? this.state.ObjectData[134].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(134, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                </View> : null}
                            </View> : null}
                        </View> : null}

                        {/* 时间修正 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 1 || this.state.ObjectData[trategyTypeId].option_id == 3 ? <View>
                            <View style={styles.title}><View style={styles.leftLine} /><Text style={styles.titleName}>时间修正</Text></View>
                            <View style={{ borderWidth: 1, borderColor: "#d2d2d2", marginHorizontal: 20, }}>
                                <View style={[styles.tableRow]}>
                                    <View style={styles.tableCell}><Text>时间段</Text></View>
                                    <View style={styles.tableCell}><Text>补偿温度</Text></View>
                                </View>
                                {this.state.ObjectData[120] && this.state.ObjectData[125] ? <View style={styles.tableRow}>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(120, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[120].data_value ? this.state.ObjectData[120].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(120, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(125, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[125].data_value ? this.state.ObjectData[125].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(125, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                </View> : null}
                                {this.state.ObjectData[121] && this.state.ObjectData[126] ? <View style={styles.tableRow}>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(121, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[121].data_value ? this.state.ObjectData[121].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(121, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(126, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[126].data_value ? this.state.ObjectData[126].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(126, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                </View> : null}
                                {this.state.ObjectData[122] && this.state.ObjectData[127] ? <View style={styles.tableRow}>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(122, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[122].data_value ? this.state.ObjectData[122].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(122, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(127, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[127].data_value ? this.state.ObjectData[127].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(127, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                </View> : null}
                                {this.state.ObjectData[123] && this.state.ObjectData[128] ? <View style={styles.tableRow}>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(123, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[123].data_value ? this.state.ObjectData[123].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(123, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(128, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[128].data_value ? this.state.ObjectData[128].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(128, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                </View> : null}
                                {this.state.ObjectData[124] && this.state.ObjectData[129] ? <View style={styles.tableRow}>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(124, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[124].data_value ? this.state.ObjectData[124].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(124, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <TouchableOpacity onPressIn={() => this.setValue(129, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                        <Text style={styles.tableCellText}>{this.state.ObjectData[129].data_value ? this.state.ObjectData[129].data_value : 0}</Text>
                                        <TouchableOpacity onPressIn={() => this.setValue(129, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                    </View>
                                </View> : null}
                            </View>
                        </View> : null}
                    </View> : null}

                    {this.props.i == 1 ? <View>
                        {/* 循环泵频率设定 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 1 ? <View>
                            {this.state.ObjectData[151] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>循环泵频率设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(151, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[151].data_value ? this.state.ObjectData[151].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(151, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}


                        {/* 二次供压设定 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 2 ? <View>
                            {this.state.ObjectData[152] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>二网供压设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(152, 0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[152].data_value ? this.state.ObjectData[152].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(152, -0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}

                        {/* 二次压差设定 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 3 ? <View>
                            {this.state.ObjectData[153] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>二网压差设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(153, 0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[153].data_value ? this.state.ObjectData[153].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(153, -0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}
                    </View> : null}
                    {this.props.i == 2 ? <View>
                        {/* 补水泵频率设定 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 1 ? <View>
                            {this.state.ObjectData[163] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>补水泵频率设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(163, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[163].data_value ? this.state.ObjectData[163].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(163, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}


                        {/* 二网回压设定 */}
                        {this.state.ObjectData[trategyTypeId].option_id == 2 ? <View>
                            {this.state.ObjectData[164] ? <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.tableCellText}>二网回压设定：</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TouchableOpacity onPressIn={() => this.setValue(164, 0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                    <Text style={styles.tableCellText}>{this.state.ObjectData[164].data_value ? this.state.ObjectData[164].data_value : 0}</Text>
                                    <TouchableOpacity onPressIn={() => this.setValue(164, -0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                                </View>
                            </View> : null}
                        </View> : null}
                    </View> : null}
                    {this.props.i == 3 ? <View>
                        {/* 控制死区： */}
                        {this.state.ObjectData[171] ? <View style={styles.row}>
                            <View style={styles.cell}>
                                <Text style={styles.tableCellText}>控制死区：</Text>
                            </View>
                            <View style={styles.cell}>
                                <TouchableOpacity onPressIn={() => this.setValue(171, 1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                <Text style={styles.tableCellText}>{this.state.ObjectData[171].data_value ? this.state.ObjectData[171].data_value : 0}</Text>
                                <TouchableOpacity onPressIn={() => this.setValue(171, -1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                            </View>
                        </View> : null}

                        {/* 开启 */}
                        {this.state.ObjectData[172] ? <View style={styles.row}>
                            <View style={styles.cell}>
                                <Text style={styles.tableCellText}>开启压力：</Text>
                            </View>
                            <View style={styles.cell}>
                                <TouchableOpacity onPressIn={() => this.setValue(172, 0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                <Text style={styles.tableCellText}>{this.state.ObjectData[172].data_value ? this.state.ObjectData[172].data_value : 0}</Text>
                                <TouchableOpacity onPressIn={() => this.setValue(172, -0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                            </View>
                        </View> : null}

                        {/* 关闭 */}
                        {this.state.ObjectData[173] ? <View style={styles.row}>
                            <View style={styles.cell}>
                                <Text style={styles.tableCellText}>关闭压力：</Text>
                            </View>
                            <View style={styles.cell}>
                                <TouchableOpacity onPressIn={() => this.setValue(173, 0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>+</Text></TouchableOpacity>
                                <Text style={styles.tableCellText}>{this.state.ObjectData[173].data_value ? this.state.ObjectData[173].data_value : 0}</Text>
                                <TouchableOpacity onPressIn={() => this.setValue(173, -0.1)} onPressOut={() => this.setValueOut()}><Text style={styles.addBut}>-</Text></TouchableOpacity>
                            </View>
                        </View> : null}
                    </View> : null}

                </ScrollView>
                <TouchableOpacity>
                    <Text style={styles.save} onPress={() => this.setState({ passwordVisible: true })}>确定保存</Text>
                </TouchableOpacity>
                {this.props.i<3?<Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { }}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalCenter}>
                            <Text style={styles.modalTitle}>请选择控制策略</Text>
                            <ListView
                                automaticallyAdjustContentInsets={false}
                                dataSource={ds.cloneWithRows(this.state.ObjectData[trategyTypeId].tag_option)}
                                enableEmptySections={true}
                                renderRow={(rowData, j, i) => {
                                    return (<Text style={styles.modalItem} onPress={this.selectTrategy.bind(this, rowData.option_id)}>{rowData.name}</Text>)
                                }}
                            />
                        </View>
                    </View>
                </Modal>:null}
                {this.props.i==0?<Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.bengVisible}
                    onRequestClose={() => { }}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalCenter}>
                            <Text style={styles.modalTitle}>请选择泵号</Text>
                            <ListView
                                automaticallyAdjustContentInsets={false}
                                dataSource={ds.cloneWithRows(this.state.ObjectData[130].tag_option)}
                                enableEmptySections={true}
                                renderRow={(rowData, j, i) => {
                                    return (<Text style={styles.modalItem} onPress={this.selectBeng.bind(this, rowData.option_id)}>{rowData.name}</Text>)
                                }}
                            />
                        </View>
                    </View>
                </Modal>:null}
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.passwordVisible}
                    onRequestClose={() => { }}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalCenter}>
                            <Text style={styles.modalTitle}>请输入下发密码</Text>
                            <View style={{ flexDirection: "row", marginVertical: 10, justifyContent: "center" }}>
                                <TextInput
                                    style={{ height: 40, alignSelf: "center", width: 150, }}
                                    onChangeText={(password) => this.setState({ password })}
                                    value={this.state.password}
                                />
                                <TouchableOpacity style={styles.switchView} onPress={() => { this.state.remember ? AsyncStorage.removeItem("issue_password") : null; this.setState({ remember: !this.state.remember }); }}>
                                    <Image source={this.state.remember ? require('./../../../icons/check.png') : require('./../../../icons/nocheck.png')} style={styles.check} />
                                    <Text style={styles.rememberText}>记住密码</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginVertical: 20 }}>
                                <Text style={{ fontSize: 15, color: "blue", marginRight: 20, }} onPress={() => this.saveData()}>确定</Text>
                                <Text style={{ fontSize: 15, color: "red", marginRight: 20, }} onPress={() => this.setState({ passwordVisible: false })}>取消</Text>
                            </View>
                        </View>
                    </View>
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
    topSides: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 10,

    },
    topText: {
        color: "#ffffff",
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        //marginBottom: 4,
    },
    topRow: {
        width: width,
        height: 45,
        backgroundColor: '#434b59',
        //justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    lineView: {
        width: width,
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
    },

    nameText: {
        color: "#000",
        fontSize: 17,
        marginLeft: 20,
    },
    strateName: {
        flex: 1,
        color: "#009eda",
        fontSize: 15,
        marginRight: 10,
        textAlign: 'right',
        //lineHeight:30
    },
    right: {
        color: "#4e4e4e",
        fontSize: 35,
        marginRight: 20,
        textAlign: 'right',
        alignItems: "center",
        marginBottom: 7,
    },
    tableRow: {
        flexDirection: "row",

    },
    tableCell: {
        width: (width - 40) / 2,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.5,
        borderColor: "#d2d2d2",
        flexDirection: "row",
    },
    addBut: {
        borderWidth: 1,
        borderColor: "#d2d2d2",
        width: 25,
        height: 25,
        fontSize: 25,
        color: "#00000099",
        textAlign: "center",
        margin: 10,
        lineHeight: 20,
    },
    tableCellText: {
        fontSize: 17,
        color: "#000"
    },
    modal: {
        flex: 1,
        backgroundColor: "#00000066",
        alignItems: "center",
        justifyContent: "center"
    },
    modalCenter: {
        width: width - 40,
        backgroundColor: "#fff"
    },
    modalTitle: {
        fontSize: 17,
        backgroundColor: "#424b59",
        color: "#fff",
        height: 40,
        paddingLeft: 20,
        lineHeight: 30,
    },
    modalItem: {
        height: 40,
        fontSize: 16,
        lineHeight: 30,
        marginLeft: 20
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        width: width,
        alignItems: "center",
        justifyContent: "center",
    },
    cell: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    save: {
        width: width,
        backgroundColor: "#434b59",
        color: "#fff",
        height: 40,
        textAlign: "center",
        fontSize: 18,
        lineHeight: 32,
    },
    leftLine: {
        height: 20,
        width: 4,
        backgroundColor: "#434b59",
        marginHorizontal: 10,
        borderRadius: 2
    },
    titleName: {
        fontSize: 16
    },
    title: {
        alignItems: "center",
        height: 40,
        width: width,
        flexDirection: "row",
        borderColor: "#d2d2d2",
        //borderTopWidth:1,
        //borderBottomWidth:1,
        marginVertical: 10
    },
    switchView: {
        marginLeft: 30,
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 20,
        alignSelf: "flex-end"
    },
    rememberText: {
        fontSize: 14,
        fontWeight: "200",
        marginLeft: 8,
        color: '#000',
        backgroundColor: "#ffffff00"
    },
    check: {
        width: 20,
        height: 20,
    }
});