import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Alert,
  ToastAndroid,
  SectionList,
  AsyncStorage,
  FlatList,
  ImageBackground,
  ScrollView,
  DeviceEventEmitter
} from 'react-native';
import Dimensions from 'Dimensions';
import Constants from './../constants';
import moment from 'moment';
const { width, height } = Dimensions.get('window');
let rows = [];

export default class ValvesHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            onEndReachedThreshold: 0,
            total: null,
            datas: [],
            page_size: 15,
            page_number: 1
        }
    }

    componentWillMount() {
        rows = []
        this.getHistory();
    }
    getHistory() {
        this.setState({ refreshing: true });
        AsyncStorage.getItem("access_token", (errs, result) => {
            if(!errs) {
                let uri = `${Constants.serverSite3}/v2/gateway?valves=1&heat_user_id=${this.props.heat_user_id}&page_size=${this.state.page_size}&page_number=${this.state.page_number}&access_token=${result}`;
                // console.log(uri)
                fetch(uri)
                    .then((response) => response.json()) 
                    .then((responseJson) => {
                        console.log(responseJson);
                        if(responseJson.code === 200) {
                            responseJson.result.rows.forEach(row => {
                                rows.push(row);
                            });
                            this.setState({datas: rows, refreshing: false, total: responseJson.result.total});
                            // console.log(this.state.datas)
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                        Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
                    });
            }
        })
    }
    onRefresh() {
        rows = [];
        this.setState({page_number: 1});
        this.getHistory();
    }
    onEndReached() {
        this.setState({page_number: ++this.state.page_number});
        const n = Math.ceil(this.state.total/this.state.page_size);
        if(this.state.page_number <= n) {
            this.getHistory();
        }
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image style={{ width: 25, height: 20, marginLeft: 15, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>户内阀历史</Text>
                    <View style={{ width: 40 }} />
                </View>
                <Text style={{ backgroundColor: "#434b59", textAlign: "center", width: width, height: 25, color: "#FFFFFF", fontSize: 12 }}>{this.props.addr}</Text>
                {
                    this.state.datas.length>0 ?
                        <FlatList
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.refreshing}
                            onEndReached={() => this.onEndReached()}
                            onEndReachedThreshold={0.05}
                            data={this.state.datas}
                            renderItem={({item}) => 
                                <View style={styles.itemView}>
                                    <View style={{flexDirection: 'row', flex: 1}}>
                                        <Text style={{color: '#666'}}>开度调整为</Text>
                                        <Text style={{color: '#2A9ADC'}}> {item.value}%</Text>
                                    </View>
                                    <Text style={{color: '#999', width: 130}}>{moment(item.send_time).format('YYYY-MM-DD HH:mm')}</Text>
                                    <View style={{width: 50, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                        {
                                            item.status === 1 ?
                                            <Text style={{color: '#1ab394'}}>成功</Text> :
                                            item.status === 2 ?
                                                <Text style={{color: '#999'}}>失败</Text> :
                                                <Text style={{color: '#999'}}>下发中</Text>
                                        }
                                    </View>
                                </View>
                        }
                        /> : <Text style={{alignSelf: 'center', marginTop: 10}}>暂无数据</Text>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#E3E5E8",
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topNameText: {
        flex: 1,
        textAlign: 'center',
        color: "#ffffff",
        fontSize: 19,
    },
    itemView: {
        flexDirection: 'row',
        justifyContent:"space-between",
        alignItems: 'center',
        height: 50,
        paddingRight: 20,
        marginLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    }
})