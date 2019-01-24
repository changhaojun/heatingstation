/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, AsyncStorage, ListView, TouchableOpacity, ScrollView, ToastAndroid ,ActivityIndicator,ImageBackground ,StatusBar} from 'react-native';
import Dimensions from 'Dimensions';
import Constants from '../constants';
import Echarts from 'native-echarts';
var { width, height } = Dimensions.get('window');
import Unit from './unit_list';
export default class VillageList extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            status:null,
            data:[]
        }
        var _this = this;
        AsyncStorage.getItem("access_token", (errs, result)=> {
            if (!errs) {
               this.getLeveingStrategy(result);
               this.getHeatUser(result);
            }
        }
        )
    }
    getLeveingStrategy(result){
        var uri =`${Constants.indoorSite}/v2/community/${this.props.communityId}?access_token=${result}`             
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.result) {
              this.setState({
                status: responseJson.result.levelling
              })
            }
          })
          .catch((error) => {
            console.error(error);
          });
    }
    getHeatUser(result){
        const datas=[];
        var uri =`${Constants.indoorSite}/v2/community/${this.props.communityId}/building/unit/heatUser?access_token=${result}&only_room_temp=1`  
        // console.log(this.props.communityId)              
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
           if(responseJson.result.length>0){
            responseJson.result.forEach((element,index,arr) => {
                datas.push([index,element.tag_1007])
            });
           }
           this.setState({
               data:datas
           })
          })
          .catch((error) => {
            console.error(error);
          });
    }
    render() {
        const option = {
            visualMap: {
                min: 16,
                max: 25,
                dimension: 1,
                orient: 'vertical',
                right: 10,
                top: 'center',
                calculable: true,
                inRange: {
                    color: ['#2DBAE4', '#FFB636','#D6243C']
                },
                 show: false
            },
            grid : {
                x: 55,
                y: 30,
                x2:25,
                y2:40
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color:"#AAAAAA"
                    }
                },
                splitLine:{show:false}
            },
            yAxis: {
                type: 'value',
                name: '室内温度',
                axisLabel: {
                    formatter: '{value} ℃'
                },
                splitLine:{
                    lineStyle:{
                        color:"#eee"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color:"#AAAAAA"
                    }
                }
            },
            series: [{
                name:"室温：",
                symbolSize: 4,
                data: this.state.data,
                type: 'scatter'
            }]
        };
        return (
            <View style={styles.all}>
                < StatusBar
                    hidden={false}  //status显示与隐藏
                    //translucent={true} //设置status栏是否透明效果,仅支持安卓
                    barStyle='default' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition='slide' //显隐时的动画效果.默认fade
                    backgroundColor={"#2C97DC"}
                />
                <ImageBackground style={{width:width,height:167,}} resizeMode="cover" source={require('../icons/bg_leveing.png')}>
                    <View style={styles.navView}>
                        <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                            <Image style={{ width: 25, height: 20,marginLeft:10}} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                        </TouchableOpacity>
                        <View style={{ width: width - 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 20, color: "#fff" }}>一键调平策略</Text>
                        </View>
                    </View>
                    
                    <View style={styles.houseLabel}>
                        <View style={{marginLeft:20}}>
                            <Text style={{fontSize:20,color:"#fff"}}>{this.props.communityName}</Text>
                            <Text style={{color:"#fff"}}>当前小区</Text>
                        </View>
                        <View style={{marginRight:30}}>
                            <Text style={{fontSize:24,color:"#fff"}}>{this.props.avg_temp?this.props.avg_temp:"- -"}</Text>
                            <Text style={{color:"#fff"}}>平均温度</Text>
                        </View>
                    </View>
                </ImageBackground>
                <ScrollView> 
                    <View style={{height:100,backgroundColor: "#eee",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                            <View style={styles.strategyList}>
                            {
                                this.state.status !==2 ?
                                <Image  style={{ width: 50, height:50,}} resizeMode="cover" source={require('../icons/icon_balance.png')} /> : 
                                <Image  style={{ width: 50, height:50,}} resizeMode="cover" source={require('../icons/icon_balance_active.png')} />       
                            }
                                <Text style={this.state.status ===2?{color:"#2C97DC"}:{color:"#333"}}>平衡型策略</Text>
                            </View>
                            <View style={styles.strategyList}>
                            {
                                this.state.status !==3 ?
                                <Image  style={{ width: 50, height:50,}} resizeMode="cover" source={require('../icons/icon_comfortable.png')} /> :
                                <Image  style={{ width: 50, height:50,}} resizeMode="cover" source={require('../icons/icon_comfortable_active.png')} />
                            }
                                <Text  style={this.state.status ===3?{color:"#2C97DC"}:{color:"#333"}}>舒适型策略</Text>
                            </View>
                            <View style={styles.strategyList}>
                            {
                                this.state.status !==1?
                                <Image  style={{ width: 50, height:50,}} resizeMode="cover" source={require('../icons/icon_economics.png')} /> :
                                <Image  style={{ width: 50, height:50,}} resizeMode="cover" source={require('../icons/icon_economics_active.png')} />   
                            }
                                <Text  style={this.state.status ===1?{color:"#2C97DC"}:{color:"#333"}}>经济型策略</Text>
                            </View>
                    </View>
                <View style={{marginBottom:10}}>
                    <View style={{width:width,height:50,borderBottomColor:"#eee",borderBottomWidth:1,flexDirection:"row",alignItems:"center",}}>
                        <Text style={{width:5,height:20,backgroundColor: "#2A9ADC",marginRight:10,marginLeft:20}}></Text>
                        <Text>{this.state.status ===null ? '未选择调平策略':this.state.status ===1 ?'经济型策略':this.state.status ===2?'平衡型策略':"舒适型策略" }</Text>
                    </View>
                    <View style={{marginLeft:20,marginRight:10}}>
                        {
                            this.state.status ===1?
                            <View styles={{width:width,height:60,justifyContent:"center",marginLeft:20,borderBottomColor:"#EEE",borderBottomWidth:0.5}}>
                                <Text style={{color:"#2C97DC"}}>适用条件：楼前阀</Text>
                                <Text>实现二次网水平衡，用户室内温度分布集中,为实现节能降耗，可能会有部分用户温度偏低</Text>
                            </View>:
                            this.state.status ===2?
                            <View styles={{width:width,height:60,justifyContent:"center",marginLeft:20,borderBottomColor:"#EEE",borderBottomWidth:0.5}}>
                                <Text style={{color:"#2C97DC"}}>适用条件：楼前阀+户内阀</Text>
                                <Text>实现二次网水平衡，用户室内温度分布集中</Text>
                            </View>:
                            this.state.status ===3?
                            <View styles={{width:width,height:60,justifyContent:"center",marginLeft:20,borderBottomColor:"#EEE",borderBottomWidth:0.5}}>
                                <Text style={{color:"#2C97DC"}}>适用条件：楼前阀</Text>
                                <Text>实现二次网水平衡，用户室内温度分布集中,保障所有用户舒适型，可能会有部分用户温度偏高</Text>
                            </View>:null
                        }
                    </View>
                </View>
                <View >
                {
                    this.state.status ===1?
                    <View>
                        <Text style={{width:width,textAlign:"center"}}>预计温度分布</Text>
                        <Image  style={{ width:width-40, height:200,marginLeft:20}} resizeMode="contain" source={require('../icons/echart_economics.png')} />
                    </View>:
                    this.state.status ===2?
                    <View>
                        <Text style={{width:width,textAlign:"center"}}>预计温度分布</Text>
                        <Image  style={{ width:width-40, height:200,marginLeft:20}} resizeMode="contain" source={require('../icons/echart_balance.png')} />
                    </View>:
                    this.state.status ===3?
                    <View>
                        <Text style={{width:width,textAlign:"center"}}>预计温度分布</Text>
                        <Image  style={{ width:width-40, height:200,marginLeft:20}} resizeMode="contain" source={require('../icons/echart_comfortable.png')} />
                    </View>:null
                }      
                    <Text style={{width:width,textAlign:"center"}}>实际温度分布</Text>
                    {
                        this.state.data.length>0?
                        <Echarts option={option} height={200}/>:
                        <Text style={{textAlign:"center",marginTop:30}}>暂无热用户</Text>
                    }
                </View>
                </ScrollView> 
            </View>
        )
    }
}
// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#fff"
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 45,
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    houseLabel:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:35
    },
    strategyList:{
        justifyContent:"center",
        flexDirection:"column",
        alignItems: 'center',
        marginLeft:20,
        marginRight:20
    }   
});