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

export default class BatteryLow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            total: null,
            datas: [],
            page_size: 15,
            page_number: 1
        }
    }

    componentWillMount() {
        rows = []
        this.getDatas();
    }
    getDatas() {
        this.setState({ refreshing: true });
        const villageId = this.props.communityId;
        let uri = `${Constants.serverSite1}/v1/datas/lowVoltage?type=2&community_id=${villageId}&page_size=${this.state.page_size}&page_number=${this.state.page_number}`;
        fetch(uri)
            .then((response) => response.json()) 
            .then((responseJson) => {
                // console.log(responseJson);
                if(responseJson.code === 200) {
                    responseJson.result.rows.forEach(row => {
                        rows.push(row);
                    });
                    this.setState({datas: rows, refreshing: false, total: responseJson.result.total});
                }
            })
            .catch((e) => {
                console.log(e)
                Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
            });
    }
    onEndReached() {
        this.setState({page_number: ++this.state.page_number});
        const n = Math.ceil(this.state.total/this.state.page_size);
        if(this.state.page_number <= n) {
            this.getDatas();
        }
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.topNameText}>户内阀电量不足用户</Text>
                    <View style={{ width: 40 }} />
                </View>
                {
                    this.state.datas.length>0 ?
                        <FlatList
                            refreshing={this.state.refreshing}
                            onEndReached={() => this.onEndReached()}
                            onEndReachedThreshold={0.05}
                            data={this.state.datas}
                            renderItem={({item}) => 
                                <View style={styles.itemView}>
                                    <View style={{flexDirection: 'row', flex: 1}}>
                                        <Text style={{color: '#666'}}>{item.building_name}{item.unit_number}单元{item.user_number}</Text>
                                    </View>
                                    <Text style={{color: '#999'}}>{moment(item.record_time).format('YYYY-MM-DD HH:mm')}</Text>
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