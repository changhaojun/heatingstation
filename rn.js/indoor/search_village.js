/**
 * Created by vector on 2017/11/15.
 *
 * 小区搜索页面
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    AsyncStorage,
    ListView,
    Alert,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    Image
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Constants from '../constants';
import Floor from './floor'
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
export default class WisdomHeating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            company_code: "",
            access_token: "",
            dataSource: [],
            loadShow: false,
            historySearch: [],
        }
        const _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {
                _this.setState({
                    company_code: result
                })
            }
        });
        AsyncStorage.getItem("history_search_village", function (errs, result) {
            console.log(result)
            if (!errs && result && result.length > 0) {
                _this.setState({ historySearch: result.split(",") })
            }
        });

        AsyncStorage.getItem("access_token", function (errs, result) {
            if (!errs) {
                _this.setState({
                    access_token: result
                })
            }

        }
        );

    }



    getDataFromApi(text) {
        // console.log(text)
        if (text) {
            this.setState({ searchValue: text })
        } else {
            text = this.state.searchValue;
        }
        var data = this.state.historySearch;
        for (var i = 0; i < data.length; i++) {
            if (data[i] == text) { data.splice(i, 1) }
        }
        if (text) { data.unshift(text); }

        if (data.length > 15) { data.pop() }
        console.log(data)
        AsyncStorage.setItem("history_search_village", data.join(","), function (errs) { });
        this.setState({ loadShow: true, });
        var uri =`${Constants.indoorSite}/v2/community?access_token=${this.state.access_token}&company_code=${this.state.company_code}&user_total=1&keyword=${text}&avg_temperat=1` 
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson)
                if (responseJson.result.rows.length > 0) {
                    this.setState({
                        loadShow: false,
                        dataSource: responseJson.result.rows,
                    });
                } else {
                    Alert.alert(
                        '提示',
                        '无此换热站',
                    );
                    this.setState({
                        loadShow: false,
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    pop() {
        if (Platform.OS === 'ios' || this.state.searchValue.length < 1) {
            this.props.navigator.pop();
        } else {
            this.getDataFromApi();
        }

    }

    goFloor(communityId,communityName,avg_temp){
        this.props.navigator.push({
            component: Floor,
            passProps: {
                communityId: communityId,
                communityName: communityName,
                avg_temp:avg_temp
            }
        })
    }
    clear(){
        this.setState({
            searchValue:""
        })
    }
    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <View style={{ width: width - 50, height: 30, borderRadius: 20, backgroundColor: 'rgb(255,255,255)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TextInput
                            placeholder="输入你要查询的小区名"
                            placeholderTextColor="rgba(0,0,0,0.7)"
                            onChangeText={(searchValue) => this.setState({ searchValue: searchValue.replace(/(^\s*)|(\s*$)/g, "") })}
                            returnKeyType={"search"}
                            onSubmitEditing={() => this.getDataFromApi()}
                            style={styles.searchInput}
                            underlineColorAndroid="transparent"
                            autoFocus={true}
                            clearTextOnFocus={true}
                            value={this.state.searchValue}
                        >
                       </TextInput>
                        {
                            this.state.searchValue.length>0 ?
                            <TouchableOpacity style={styles.clearBox} onPress={()=>{this.clear()}}>
                                <Image style={{ width: 15, height: 15 }} resizeMode="center" source={require('../icons/cancel_icon.png')}/>
                            </TouchableOpacity>  :null
                        }         
                    </View>
                    <Text style={{ color: "#ffffff", marginLeft: 10 }} onPress={this.pop.bind(this)}>
                        {Platform.OS === 'ios' || this.state.searchValue.length < 1 ? "取消" : "搜索"}
                    </Text>
                </View>
                    <View style={{ width: width, }}>
            
                        <ListView
                            ref="ListView"
                            showsVerticalScrollIndicator={false}
                            enableEmptySections={true}
                            dataSource={ds.cloneWithRows(this.state.dataSource)}
                            renderRow={data => (
                                <TouchableOpacity onPress={()=>{this.goFloor(data.community_id,data.community_name,data.avg_temp)}}>
                                    <View style={[styles.listView, { height: 58, alignItems: "center",justifyContent:"space-between"}]}>
                                        <View style={{flexDirection:"row",alignItems:"center"}}>
                                            <Image style={{ width: 25, height: 25, marginLeft: 10,marginRight:10 }} resizeMode="contain" source={data.status===1? require('../icons/icon_normal.png'):data.status===2?require('../icons/icon_low.png'):require('../icons/icon_high.png')}  />
                                            <Text style={{ fontSize: 15, color: "#333333" }}>{data.community_name}</Text>
                                        </View>
                                        {
                                            data.status ===1?
                                            <Text style={{marginRight:40,color:"#FB9823"}}>{data.avg_temperat}℃</Text>:
                                            data.status ===2? 
                                            <Text style={{marginRight:40,color:"#2E93DD"}}>{data.avg_temperat}℃</Text>:
                                            <Text style={{marginRight:40,color:"#D6243C"}}>{data.avg_temperat}℃</Text> 
                                        }
                                    
                                    </View>
                                </TouchableOpacity>
                            )}
                            renderSeparator={() => (
                                <View style={{ height: 1, backgroundColor: "#f2f2f2", width: width - 25, }} />
                            )}
                        />
                    </View>
                {!this.state.loadShow && !this.state.dataSource.length ? 
                    <ListView
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                    dataSource={ds.cloneWithRows(this.state.historySearch)}
                    renderRow={data => (
                        <TouchableOpacity style={styles.historyView} onPress={() => { this.getDataFromApi(data) }}>
                            <Image source={require('../icons/search.png')} style={styles.search} />
                            <Text style={[styles.historyText, { flex: 1 }]} >{data}</Text>
                            <Text style={[styles.historyText, { fontSize: 22, color: "#4f505166", }]} onPress={() => { this.setState({ searchValue: data }) }}> ↖  </Text>
                        </TouchableOpacity>
                    )}
                    renderSeparator={() => (
                        <View style={{ height: 1, backgroundColor: "#00000009", width: width }} />
                    )}
                /> : null}
                {this.state.loadShow ? <View style={styles.load}>
                    <ActivityIndicator
                        animating={true}
                        size="large"
                    /></View> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#f1f2f3",
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'center',
        alignItems: "center"
    },
    titleView: {
        width: width,
        height: 30,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    titleText: {
        fontSize: 13,
        color: '#0099ff',
        textAlign: 'center',
    },
    listView: {
        width: width,
        height: 30,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    selectItemView: {
        width: (width - 20) / 5,
        height: 40,
        alignItems: "flex-end",
        justifyContent: 'center',
    },
    selectItemView1: {
        width: (width - 20) / 5,
        height: 40,
        alignItems: "flex-start",
        justifyContent: 'center',
    },
    listText: {
        fontSize: 13,
        color: '#000000',
        textAlign: 'left',
    },
    listWarnText: {
        fontSize: 13,
        color: 'rgb(248,184,54)',
        textAlign: 'left',
    },
    searchInput: {
        fontSize: 15,
        color: "rgba(0,0,0,0.7)",
        width: width - 50,
        height: 30,
        textAlign: "center",
        padding: 0,

    },
    historyText: {
        color: "#4f5051",
        fontSize: 17,
        marginLeft: 8,
    },
    historyView: {
        flexDirection: "row",
        height: 45,
        alignItems: "center",
    },
    load: {
        position: "absolute",
        width: width,
        height: height,
        zIndex: 9999,
        justifyContent: "center",
        alignItems: 'center',
    },
    search: {
        width: 15,
        height: 15,
        marginLeft: 15
    },
    clearBox:{
        width:20,
        height:20,
        borderRadius: 20,
        backgroundColor: "#aaa",
        justifyContent: 'center',
        alignItems: 'center',
        position:"absolute",
        right:10
    }
});