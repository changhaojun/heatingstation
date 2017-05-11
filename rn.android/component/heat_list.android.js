/**
 * Created by Vector on 17/4/18.
 */

// 热源厂列表页面
import React from 'react';
import { View,Text,Image,NavigatorIOS,StyleSheet,TouchableHighlight,ListView,AsyncStorage, Navigator} from 'react-native';
import Dimensions from 'Dimensions';

var {width, height} = Dimensions.get('window');

// import HeatDetail from '../components/heat_detail.ios.js';
import Orientation from 'react-native-orientation';
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
        };

        var _this = this;
        fetch("http://rapapi.org/mockjsdata/16979/v1_0_0/heat")
             .then((response) => response.json())
             .then((responseJson) => {
                _this.setState({
                    dataSource:ds.cloneWithRows(responseJson.heat_data),
                    planTotalEnergy: responseJson.plan_total_energy,
                    realTotalEnergy: responseJson.real_total_energy,
                    }
                );
              })
             .catch((error) => {
                 console.error(error);
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

    gotoHistoryEnergyCharts(){
        Orientation.lockToLandscape();
        const navigator = this.props.navigator;
        navigator.push({
            component: HistoryEnergyCharts,
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <View style={styles.heatTextView}>
                    <Text style={{fontSize: 25, color: '#5e5e5e',marginLeft: 10,}}>热源厂</Text>
                    <Text style={{color:"#b57907",marginLeft: 10,paddingTop:3,}}>计划总能耗:{this.state.planTotalEnergy}</Text>
                    <Text style={{color:"#b57907",marginLeft: 10,paddingTop:3,}}>实际总能耗:{this.state.realTotalEnergy}</Text>
                </View>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                return(

                  <TouchableHighlight onPress={this.gotoHistoryEnergyCharts.bind(this)}>
                    <View style={styles.listItem}>
                        <View style={styles.listItemTextView}>
                            <Text style={styles.listItemText1}>{rowData.heat_name}</Text>
                        </View>
                        <View style={styles.listItemTextView}>
                            <View style={styles.listItemTextView}>
                                <Text style={styles.listItemText2}>计划能耗：{rowData.plan_energy}</Text>
                                <Text style={styles.listItemText2}>实际能耗：{rowData.real_energy}</Text>
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
        height: 50,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        // justifyContent: 'center',
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
        color:"#b57907",
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