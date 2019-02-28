/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, AsyncStorage, ListView, TouchableOpacity, ScrollView, ToastAndroid ,ActivityIndicator,ImageBackground,Alert, DeviceEventEmitter} from 'react-native';
import Dimensions from 'Dimensions';
import Constants from '../constants';
import UnitDetail from './unit_details';
var { width, height } = Dimensions.get('window');
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
export default class VillageList extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            unitList: "",
            dataSource: ds.cloneWithRows([]),
        }
        var _this = this;
      this.getUnit()
    }
    getUnit(){
        console.log('获取单元列表')
        AsyncStorage.getItem("access_token",  (errs, result)=> {
            if (!errs) {
                var uri =`${Constants.indoorSite}/v2/community/building/${this.props.buildId}/unit?access_token=${result}&user_total=1&avg_temperat=1&room_temperat=1`
               console.log(uri)
                fetch(uri)
                  .then((response) => response.json())
                  .then((responseJson) => {
                      console.log(responseJson)
                    if (responseJson.result.length > 0) {
                      this.setState({
                        unitList: responseJson.result,
                        dataSource: ds.cloneWithRows(responseJson.result),
                      });
                    }
                    else {
                      Alert.alert(
                        '提示',
                        '暂无数据'
                      )
                    }
        
                  })
                  .catch((error) => {
                    console.error(error);
                  });
            }
        }
        )  
    }
    goUnitDetail(unitId,unitName){
        this.props.navigator.push({
            component: UnitDetail,
            passProps: {
                unitId: unitId,
                unitName: unitName,
                buildId:this.props.buildId,
                buildName:this.props.buildName,
                communityName:this.props.communityName
            }
          })
    }
    componentWillMount() {
        this.setTitle = DeviceEventEmitter.addListener('refreshUnit', ()=>{
            this.getUnit()
        });
      }
      componentWillUnmount(){
        this.setTitle.remove();
      }
    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={() =>{this.props.navigator.pop();DeviceEventEmitter.emit('refreshFloor')}}>
                        <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <View style={{ width: width - 80, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ fontSize: 20, color: "#fff" }}>{this.props.buildName}</Text>
                        <Text style={{ fontSize: 14, color: "#ddd" }}>{this.props.communityName}</Text>
                    </View>
                </View>
                {this.state.unitList.length > 0 ?
                    <ListView
                        style={{ marginTop: 10}}
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        renderRow={(rowData) => {
                            return (
                                <TouchableOpacity underlayColor="#ECEDEE" onPress={()=>{this.goUnitDetail(rowData.unit_id,rowData.unit_number)}}>
                                    <ImageBackground style={styles.listItemView} resizeMode="cover" source={require('../images/unit_img.png')}>
                                        <View style={styles.listItemTextView}>
                                            <View style={{ flexDirection: "row",marginLeft:20,alignItems:"center" }}> 
                                                <View style={styles.innerBox}>
                                                    <View style={styles.outBox}>
                                                        <Text style={{ fontSize: 14, color: '#fff' }}>{rowData.unit_number}单元</Text>
                                                    </View>
                                                </View>                                      
                                            </View>
                                            <View style={{flexDirection:"column",alignItems:"center"}}>
                                                <View style={{ flexDirection: "row",  marginRight: 10,width:width-100, justifyContent:"space-between",alignItems:"center" }}>     
                                                    {
                                                        rowData.status === 1 ?
                                                        <Text style={{marginLeft:20,color:"#2C96DD",fontSize:20}}>{rowData.avg_temperat}<Text  style={{fontSize:14}}>℃</Text></Text>:
                                                        rowData.status === 2 ?
                                                        <Text style={{marginLeft:20,color:"#FD8F38",fontSize:20}}>{rowData.avg_temperat}<Text  style={{fontSize:14}}>℃</Text></Text> :
                                                        <Text style={{marginLeft:20,color:"#D6243C",fontSize:20}}>{rowData.avg_temperat}<Text  style={{fontSize:14}}>℃</Text></Text>
                                                    }
                                                    <View style={{flexDirection:"row"}}>
                                                        <Text style={{fontSize:16,color:"#999999"}}>{rowData.user_total}户</Text>
                                                        <Image  style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/icon-right.png')}></Image>
                                                    </View>
                                                    
                                                </View>
                                                <View style={{height:5,width:width-130,backgroundColor: "#eee",borderRadius:5,flexDirection:"row",marginTop:10}}>
                                                    {
                                                        (rowData.room_temperat.tepid===0||rowData.room_temperat.tepid===null)&&(rowData.room_temperat.hot===0||rowData.room_temperat.hot===null)?
                                                        <Text style={{height:5,width:(rowData.room_temperat.cold/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))*(width-130),backgroundColor: "#2DBAE4",borderRadius:5}}></Text>:
                                                        <Text style={{height:5,width:(rowData.room_temperat.cold/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))*(width-130),backgroundColor: "#2DBAE4",borderBottomLeftRadius:5,borderTopLeftRadius:5}}></Text>
                                                    }
                                                    {
                                                        (rowData.room_temperat.cold ===0 ||rowData.room_temperat.cold ===null) &&(rowData.room_temperat.hot===0 ||rowData.room_temperat.hot===null)?
                                                        <Text  style={{height:5,width:(rowData.room_temperat.tepid/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))*(width-130),backgroundColor: "#FD8F38",alignItems:"center",borderRadius:5}}></Text> :
                                                        <Text  style={{height:5,width:(rowData.room_temperat.tepid/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))*(width-130),backgroundColor: "#FD8F38",alignItems:"center"}}></Text>                                               
                                                    }
                                                    {
                                                        (rowData.room_temperat.cold ===0 ||rowData.room_temperat.cold ===null) &&(rowData.room_temperat.tepid===0 ||rowData.room_temperat.tepid===null)?
                                                        <Text style={{height:5,width:(rowData.room_temperat.hot/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))*(width-130),backgroundColor: "#D6243C",borderRadius:5}}></Text>:
                                                        <Text style={{height:5,width:(rowData.room_temperat.hot/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))*(width-130),backgroundColor: "#D6243C",borderBottomRightRadius:5,borderTopRightRadius:5}}></Text>    
                                                    }  
                                                </View>
                                                {
                                                   rowData.user_total !==0?
                                                    <View style={{flexDirection:"row",height:10,backgroundColor:"#fff",width:width-130,borderBottomRightRadius:15,borderBottomLeftRadius:15,justifyContent:"space-between"}}>
                                                        <View >
                                                            {/* {
                                                                rowData.room_temperat.cold? */}
                                                                <Text style={{color:"#2DBAE4",marginTop:1,fontSize:12}}>{rowData.room_temperat.cold?rowData.room_temperat.cold:0}户</Text>
                                                                {/* :null
                                                            } */}
                                                            
                                                            {/* <Text style={{color:"#2DBAE4",fontSize:12,marginTop:-3}}>{isNaN(rowData.room_temperat.cold/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))?0: (rowData.room_temperat.cold/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot)).toFixed(2)}%</Text> */}
                                                        </View>
                                                        <View >
                                                            {/* {
                                                                rowData.room_temperat.tepid? */}
                                                                <Text style={{color:"#FD8F38",marginTop:1,fontSize:12}}>{rowData.room_temperat.tepid?rowData.room_temperat.tepid:0}户</Text>
                                                                {/* :
                                                            //     null
                                                            // } */}
                                                            
                                                            {/* <Text style={{color:"#FD8F38",fontSize:12,marginTop:-3}}>{isNaN(rowData.room_temperat.tepid/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))?0:(rowData.room_temperat.tepid/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot)).toFixed(2)}%</Text> */}
                                                        </View>
                                                        <View >
                                                        {/* {
                                                            rowData.room_temperat.hot? */}
                                                            <Text style={{color:"#D6243C",marginTop:1,fontSize:12}}>{rowData.room_temperat.hot?rowData.room_temperat.hot:0}户</Text>
                                                        {/* //     :
                                                        //     null
                                                        // } */}
                                                            {/* <Text style={{color:"#D6243C",fontSize:12,marginTop:-3}}>{isNaN(rowData.room_temperat.hot/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot))?0:(rowData.room_temperat.hot/(rowData.room_temperat.cold+rowData.room_temperat.tepid+rowData.room_temperat.hot)).toFixed(2)}%</Text> */}
                                                        </View>
                                                    </View>:null
                                                }
                                            </View>     
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )
                        }}
                    /> :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator
                            style={{ marginTop: 20 }}
                            animating={true}
                            size="large"
                        />
                    </View>
                }
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 60,
        backgroundColor: '#434b59',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    listItemView: {
        width: width-20,
        height: 90,
        flexDirection: 'column',
        marginBottom: 10,
        borderRadius: 10,
        marginLeft:10,
        marginTop:-5
        // backgroundColor: "#444",
       
      },
      listItemTextView: {
        flex: 1,
        flexDirection: 'row',
        // marginTop: 10,
        marginRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      innerBox:{
          backgroundColor: "#4A4F53",
          width:60,
          height:60,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
         
      },
      outBox:{
          backgroundColor: "#4A4F53",
          width:50,
          height:50,
          borderRadius: 40,
          borderColor: "#fff",
          borderWidth: 2,
          justifyContent: 'center',
          alignItems: 'center',
      }
    //   listViewStyle:{
    //     // 改变主轴的方向  
    //     flexDirection:'row',  
    //     // 多行显示  
    //      flexWrap:'wrap',  
    //     // 侧轴方向  
    //     alignItems:'center', // 必须设置,否则换行不起作用  
    // },
});