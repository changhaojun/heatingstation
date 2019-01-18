/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, AsyncStorage, ListView, TouchableOpacity, ScrollView, ToastAndroid ,ActivityIndicator,ImageBackground} from 'react-native';
import Dimensions from 'Dimensions';
import Constants from '../constants';
import UnitDetail from './unit_details';
var { width, height } = Dimensions.get('window');

export default class VillageList extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            unitList: "",
            dataSource: ds.cloneWithRows([]),
        }
        var _this = this;
        AsyncStorage.getItem("access_token",  (errs, result)=> {
            if (!errs) {
                var uri =`${Constants.serverSite3}/v2/community/building/${_this.props.buildId}/unit?access_token=${result}&user_total=1`
                fetch(uri)
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if (responseJson.result.length > 0) {
                      _this.setState({
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
                buildName:this.props.buildName,
                communityName:this.props.communityName
            }
          })
    }
    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <View style={{ width: width - 80, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ fontSize: 20, color: "#fff" }}>{this.props.buildName}</Text>
                        <Text style={{ fontSize: 14, color: "#ddd" }}>{this.props.communityName}</Text>

                    </View>
                    {/* <TouchableOpacity style={{ flexDirection: 'row', position: "absolute", right: 10 }}>
                        <Image style={{ width: 15, height: 15, marginTop: 2 }} resizeMode="contain" source={require('../icons/icon_leveling.png')} />
                        <Text style={{ fontSize: 15, color: "#2EDDDB" }}>一键调平</Text>
                    </TouchableOpacity> */}
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
                                                    <Text style={{ fontSize: 16, color: '#fff' }}>{rowData.unit_number}单元</Text>
                                                    </View>
                                                </View> 
                                                {
                                                    rowData.status === 0 ?
                                                    <Text style={{marginLeft:20,color:"#FD8F38",fontSize:16}}>{rowData.avg_temp}℃</Text>:
                                                    rowData.status === 1 ?
                                                    <Text style={{marginLeft:20,color:"#2C96DD",fontSize:16}}>{rowData.avg_temp}℃</Text> :
                                                    <Text style={{marginLeft:20,color:"#D6243C",fontSize:16}}>{rowData.avg_temp}℃</Text>
                                                }
                                            </View>
                                            <View style={{ flexDirection: "row",  marginRight: 20, justifyContent:"space-between",alignItems:"center" }}>
                                            
                                                <Text style={{fontSize:16,color:"#999999"}}>{rowData.user_total}户</Text>
                                                <Image  style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/icon-right.png')}></Image>
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
        width: width-10,
        height: 80,
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 10,
        marginLeft:5,
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