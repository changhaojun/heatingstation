/**
 * Created by Vector on 17/4/18.
 */

// 热源厂列表页面
import React from 'react';
import { View,Text,Image, AlertIOS,NavigatorIOS,StyleSheet,TouchableHighlight,ListView,AsyncStorage, Navigator} from 'react-native';
import Dimensions from 'Dimensions';
import Orientation from 'react-native-orientation';
var {width, height} = Dimensions.get('window');

// import HeatDetail from '../components/heat_detail.ios.js';
import HistoryEnergyCharts from '../component/history_energy_charts';
export default class HeatList extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            planTotalEnergy: '2000',
            realTotalEnergy: '1800',
            dataSource:ds.cloneWithRows([{
            }]),

            access_token: null,
            company_id: null,
            refresh_token: null,
            url: "http://192.168.1.105/v1_0_0/list?access_token="
        };

        var _this = this;

        // 从本地存储中将company_id和access_token取出

        AsyncStorage.getItem("access_token",function(errs,result){
            if (!errs) {
                _this.setState({access_token:result});
            }
            _this.setState({
                url: _this.state.url+_this.state.access_token+"&tag_id=[1,2,3,4]",
            })
            console.log(_this.state.url);
        });

        AsyncStorage.getItem("company_id",function(errs,result){
            if (!errs) {
                _this.setState({company_id:result});
            }
            _this.setState({
                url: _this.state.url+"&company_id="+_this.state.company_id+"&isStaticInfomation=false&level=0",
            })
            console.log(_this.state.url);

            if (!errs) {
                fetch(_this.state.url)
                    .then((response) => response.json())
                    .then((responseJson) => {

                        console.log(responseJson);

                        _this.setState({
                            dataSource:ds.cloneWithRows(responseJson),
                        });

                        console.log(_this.state.dataSource);
                    })
                    .catch((error) => {
                        AlertIOS.alert(
                            '提示',
                            '网络连接错误，获取列表数据失败',
                        );
                    });
            }
        });
    }
    //
    // _jump(heat_id,heat_name){
    //     const navigator = this.props.navigator;//上一个页面传过来的值
    //     //跳转
    //     this.props.navigator.push({
    //         title: heat_name,
    //         component: HeatDetail,
    //         passProps: {
    //             heatId:heat_id,
    //         }
    //     })
    // }

    gotoHistoryEnergyCharts(name,id){
        const navigator = this.props.navigator;
        Orientation.lockToLandscape();
        navigator.push({
            component: HistoryEnergyCharts,
            passProps:{
                company_name: name,
                company_id: id,

            }
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.heatTextView}>
                    {/*<Text style={{fontSize: 25, color: '#5e5e5e',marginLeft: 10,}}>热源厂</Text>*/}
                    <Text style={{color:"#000000",fontSize:12,paddingBottom:4,}}>计划总能耗:{this.state.planTotalEnergy}</Text>
                    <Text style={{color:"#000000", marginLeft:5,fontSize:12,paddingBottom:4}}>实际总能耗:{this.state.realTotalEnergy}</Text>
                </View>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    contentContainerStyle={{marginTop:15,}}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                return(

                  <TouchableHighlight underlayColor="rgba(80,191,255,0.5)" onPress={this.gotoHistoryEnergyCharts.bind(this,rowData.name,rowData.id)}>
                    <View style={styles.listItem}>
                        <View style={styles.listItemTextView}>
                            <Text style={styles.listItemText1}>{rowData.name}</Text>
                        </View>
                        <View style={styles.listItemTextView}>
                            <View style={styles.listItemTextView}>
                                <Text style={styles.listItemText2}>计划能耗：{rowData.goal_data_value}</Text>
                                <Text style={styles.listItemText2}>实际能耗：{rowData.real_data_value}</Text>
                            </View>
                            <Text style={styles.time}>{rowData.date}</Text>
                        </View>
                        <View style={styles.list}></View>
                    </View>
                  </TouchableHighlight>
                    )
                }}
                />
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        marginBottom: 49,
    },
    heatTextView:{
        width: width,
        height: 40,
        backgroundColor: "#4dbeff",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // justifyContent: 'space-around',
    },

    list:{
        width:width,
        backgroundColor:"#f5f5f5",
        height:1,

    },
    listItem:{
        paddingTop:4,
        width:width,
        height:50,
    },
    listItemImage:{
        width:15,
        height:15,
        marginTop: 5,
        marginRight: 10,
    },
    listItemText1:{
        fontSize:16,
        flex: 1,
        marginLeft: 10,
        color: '#3d3d3d',
    },
    listItemTextView:{
        flex: 1,
        flexDirection: 'row',
    },
    listItemText2:{
        color:"#202B3D",
        marginLeft: 10,
        fontSize:12,
    },
    time:{
        marginTop: 3,
        // flex: 1,
        textAlign: 'right',
        marginRight: 10,
        fontSize:10,
        color:"#b1b1b1"
    },
});