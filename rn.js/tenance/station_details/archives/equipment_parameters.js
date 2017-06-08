import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    AsyncStorage,
    Image,
    ViewPagerAndroid,
} from 'react-native';
import Dimensions from 'Dimensions';
import Toolbar from './toolbar'

// 求屏幕的宽和高。
var { width, height } = Dimensions.get('window');
export default class EquipmentParameters extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            viewList: [],
        };
        var _this = this;
        AsyncStorage.getItem("userKey", function (errs, result) {
            console.info(_this.props.deviceId);
            if (!errs) {
                fetch("http://114.215.154.122/reli/android/androidAction?type=getInfoForDevice&userKey=" + result + "&deviceId=" + _this.props.deviceId)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson.param);
                        var list = [];
                        for (var i = 0; i < responseJson.param.length; i++) {
                            list.push(_this.getList(ds.cloneWithRows(responseJson.param[i])));
                        }
                        _this.setState({
                            viewList: list
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            }
        });
    }
    getList(dataSource) {
        return (
            <View style={styles.container}>
                <ListView
                    automaticallyAdjustContentInsets={true}
                    dataSource={dataSource}
                    renderRow={(rowData) => {
                        return (
                            <View style={styles.listItem}>
                                <View style={styles.topView}>
                                    {/* Name */}
                                    <View style={styles.listItemTextView1}>
                                        <Text style={styles.listItemName}>{rowData.info_label}</Text>
                                    </View>

                                    {/* 中间的分割线 */}
                                    <View style={styles.line2}></View>

                                    {/* Value */}
                                    <View style={styles.listItemTextView2}>
                                        <Text style={styles.listItemValue}>{rowData.info_content}</Text>
                                    </View>
                                </View>

                                {/* 分割线 */}
                                <View style={styles.line}></View>

                            </View>
                        )
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar name={"系统参数"} navigator={this.props.navigator} />
                <ViewPagerAndroid
                    initialPage={0}
                    style={styles.container} >
                    {this.state.viewList}
                </ViewPagerAndroid>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    line: {
        width: width - 30,
        backgroundColor: "#f5f5f5",
        height: 1,
    },
    line2: {
        width: 1,
        height: 36,
        backgroundColor: '#f5f5f5',
    },
    listItem: {
        flexDirection: 'column',
        width: width - 30,
        height: 36,
        backgroundColor: '#ffffff',
        marginLeft: 15,
    },
    listItemImage: {
        width: 15,
        height: 15,
        marginTop: 0,
        marginRight: 10,
    },
    listItemName: {
        fontSize: 15,
    },
    listItemValue: {
        fontSize: 15,
        flex: 7,
    },
    listItemTextView1: {
        flex: 5.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 5,
    },
    listItemTextView2: {
        flex: 4.5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
    },
    topView: {
        flex: 1,
        flexDirection: 'row',
    },
});
