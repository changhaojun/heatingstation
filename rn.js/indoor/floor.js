/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, AsyncStorage, ListView, TouchableOpacity, ScrollView, ToastAndroid ,ActivityIndicator,ImageBackground} from 'react-native';
import Dimensions from 'Dimensions';
import Constants from '../constants';
var { width, height } = Dimensions.get('window');
import Unit from './unit_list';
export default class VillageList extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            floorList: "",
            dataSource: ds.cloneWithRows([]),
            company_code:""
        }
        var _this = this;
        AsyncStorage.getItem("access_token", (errs, result)=> {
            if (!errs) {
                let villageId=this.props.communityId;
                var uri =`${Constants.serverSite3}/v2/community/${villageId}/building?access_token=${result}&user_total=1`                
                fetch(uri)
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if (responseJson.result.length > 0) {
                      _this.setState({
                        floorList: responseJson.result,
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
    goUnit(buildName,buildId){
        this.props.navigator.push({
            component: Unit,
            passProps: {
                buildName: buildName,
                buildId: buildId,
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
                    <View style={{ width: width - 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 20, color: "#fff" }}>{this.props.communityName}</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', position: "absolute", right: 10 }}>
                        <Image style={{ width: 15, height: 15, marginTop: 2 }} resizeMode="contain" source={require('../icons/icon_leveling.png')} />
                        <Text style={{ fontSize: 15, color: "#2EDDDB" }}>一键调平</Text>
                    </TouchableOpacity>
                </View>
                {this.state.floorList.length > 0 ?
                    <ListView
                        style={{ marginTop: 20 }}
                        automaticallyAdjustContentInsets={false}
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        contentContainerStyle={styles.listViewStyle}
                        renderRow={(rowData) => {
                            return (
                                <TouchableOpacity underlayColor="#ECEDEE" onPress={()=>{this.goUnit(rowData.building_name,rowData.building_id)}}>
                                    <ImageBackground style={styles.listItemView} resizeMode="center" source={require('../images/floor_img.png')}>
                                        <View style={styles.listItemTextView}>
                                            <View style={{ flexDirection: "row",marginLeft:20,  paddingBottom: 5, backgroundColor: 'rgba(255,255,255,0)' }}>  
                                                <Text style={{ fontSize: 18, color: '#212121' }}>{rowData.building_name}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", marginTop: 30, marginRight: 20,justifyContent:"space-between" }}>
                                            {
                                                rowData.status === 1 ?
                                                <Text style={{marginLeft:20,color:"#FD8F38",fontSize:16}}>{rowData.avg_temp}℃</Text>:
                                                rowData.status === 2 ?
                                                 <Text style={{marginLeft:20,color:"#2C96DD",fontSize:16}}>{rowData.avg_temp}℃</Text> :
                                                <Text style={{marginLeft:20,color:"#D6243C",fontSize:16}}>{rowData.avg_temp}℃</Text>
                                            }
                                                <Text style={{fontSize:16}}>{rowData.user_total}户</Text>
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
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    listItemView: {
        width: width/2-20,
        height:100,
        flexDirection: 'row',
        backgroundColor: "#fff",
        marginBottom:20,
        marginLeft:13,
        borderRadius: 10,
      },
      listItemTextView: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        marginRight: 10,
      },
      listViewStyle:{
        // 改变主轴的方向  
        flexDirection:'row',  
        // 多行显示  
         flexWrap:'wrap',  
        // 侧轴方向  
        alignItems:'center', // 必须设置,否则换行不起作用  
    },
});