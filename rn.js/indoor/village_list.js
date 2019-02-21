/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, AsyncStorage, ListView, TouchableOpacity, ScrollView, ToastAndroid,ActivityIndicator,Alert} from 'react-native';
import Dimensions from 'Dimensions';
import Constants from '../constants';
import Floor from './floor';
import SearchVillage from './search_village';
var { width, height } = Dimensions.get('window');
const zimu = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var getSectionData = (dataBlob, sectionID) => {
    return sectionID;
  };
  var getRowData = (dataBlob, sectionID, rowID) => {
    return dataBlob[sectionID][rowID];
  };
const ds = new ListView.DataSource({
    getRowData: getRowData,
    getSectionHeaderData: getSectionData,
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
  });
export default class VillageList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSourceInitial: ds.cloneWithRows(zimu),
            company_code:"",
            allData:"",
            dataSource: ds.cloneWithRows({}, [], []),
            room_temperat:""
        }
        var _this = this;
        AsyncStorage.getItem("company_code",(errs, result)=> {
            if (!errs && result) {
              _this.setState({ company_code: result })
            }
        })
        AsyncStorage.getItem("access_token", (errs, result)=> {
            if (!errs) {
                var uri =`${Constants.indoorSite}/v2/community?access_token=${result}&company_code=${this.props.company_code}&user_total=1&avg_temperat=1&room_temperat=1`  
                console.log(uri)              
                fetch(uri)
                  .then((response) => response.json())
                  .then((responseJson) => {
                      console.log(responseJson)
                    if (responseJson.result.rows.length > 0) {
                      _this.setState({
                        allData: responseJson.result.rows,
                        // dataSource: ds.cloneWithRows(responseJson.result),
                      });
                      this.classify()
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
    classify(){
    let allData =this.state.allData
    var section = [];
    var row = [];
    var data = {};
    for (var j = 0; j < zimu.length; j++) {
      var num = 0;
      var rowid = [];
      var rowdata = [];
      for (var i = 0; i < allData.length; i++) {
        // console.log(allData[i])
        if (allData[i].index.toUpperCase() === zimu[j] || zimu[j] == "#" && (allData[i].index.toUpperCase() > "Z" || allData[i].index.toUpperCase() < "A")) {
          rowdata.push(allData[i]);
          rowid.push(num);
          num++;
        }
      }
      if (rowdata.length > 0) {
        row.push(rowid);
        data[zimu[j]] = rowdata;
        section.push(zimu[j]);
      }
    }
    this.setState({
      data: data,
      dataSource: ds.cloneWithRowsAndSections(data, section, row),
    })
    }
    toS(data) {
        let h = 0;
        for (let i = 0; i < zimu.length; i++) {
          if (data === zimu[i]) {
            this.refs.ListView.scrollTo({ x: 0, y: h, animated: true });
          } else {
            if (this.state.data[zimu[i]]) {
              h = h + 19;
              for (let j = 0; j < this.state.data[zimu[i]].length; j++) {
                h = h + 59;
              }
            }
          }
        }
      }
    goFloor(communityId,communityName,avg_temp,room_temperat,status,usertotal){
        console.log(status)
        this.props.navigator.push({
            component: Floor,
            passProps: {
                communityId: communityId,
                communityName: communityName,
                avg_temp:avg_temp,
                room_temperat:room_temperat,
                status:status,
                user_total:usertotal
            }
        })
    }
    searchVillage(){
        this.props.navigator.push({
            component: SearchVillage,
        })
    }
    render() {
        return (
            <View style={styles.all}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                        <Image style={{ width: 10, height: 20, marginLeft: 10,marginRight:10 }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.searchVillage()}}>
                        <View style={{ width: width - 100, height: 30, marginTop: 0, borderRadius: 20, backgroundColor: 'rgb(255,255,255)', marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Image style={{ width: 15, height: 15, marginLeft: 10,marginRight:10 }} resizeMode="contain" source={require('../icons/search.png')} ></Image>
                        <Text style={{ fontSize: 15, color: "rgba(0,0,0,0.3)" }}>搜索</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomView}>
                    {this.state.allData.length ?
                        <ListView
                        ref="ListView"
                        initialListSize={this.state.allData.length}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                        dataSource={this.state.dataSource}
                        renderRow={data => (
                            <TouchableOpacity onPress={()=>{this.goFloor(data.community_id,data.community_name,data.avg_temperat,data.room_temperat,data.status,data.user_total)}}>
                                <View style={[styles.listView, { height: 58, alignItems: "center",justifyContent:"space-between"}]}>
                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <Image style={{ width: 25, height: 25, marginLeft: 10,marginRight:10 }} resizeMode="contain" source={data.status===1? require('../icons/icon_low.png'):data.status===2?require('../icons/icon_normal.png'):require('../icons/icon_high.png')}  />
                                        <Text style={{ fontSize: 15, color: "#333333" }}>{data.community_name}</Text>
                                    </View>
                                    {
                                        data.status ===1?
                                         <Text style={{marginRight:40,color:"#2E93DD"}}>{data.avg_temperat}℃</Text>:
                                        data.status ===2? 
                                        <Text style={{marginRight:40,color:"#FB9823"}}>{data.avg_temperat}℃</Text>:
                                        <Text style={{marginRight:40,color:"#D6243C"}}>{data.avg_temperat}℃</Text> 
                                    }
                                   
                                </View>
                            </TouchableOpacity>
                        )}
                        renderSectionHeader={(sectionData, sectionID) => (
                            <Text style={{ fontSize: 15, paddingLeft: 18, height: 20, backgroundColor: "#f3f3f3", color: "#919293" }}>{sectionData}</Text>
                        )}
                        renderSeparator={() => (
                            <View style={{ height: 1, backgroundColor: "#f2f2f2", width: width - 25, }} />
                        )}
                        /> :
                        <ActivityIndicator
                        animating={true}
                        size="large"
                        />
                    }
            </View>
                <View style={{ position: 'absolute', marginTop: 50, alignSelf: "flex-end", width: 26, }}>
                    <ListView
                        initialListSize={27}
                        dataSource={this.state.dataSourceInitial}
                        enableEmptySections={true}
                        renderRow={data => (
                        <Text style={styles.indexListText} onPress={() => this.toS(data)}>{data}</Text>
                        )}
                    />
                </View>
            </View>
        )
    }
}

// 样式
const styles = StyleSheet.create({
    all: {
        flex: 1,
        backgroundColor:"#f2f2f2"
    },
    navView: {
        flexDirection: 'row',
        width: width,
        height: 45,
        backgroundColor: '#434b59',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }, 
    bottomView: {
        //backgroundColor: '#e9e9e9',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
      },
      listView: {
        width: width,
        height: 30,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: 10,
        marginRight: 25,
    
      },
});