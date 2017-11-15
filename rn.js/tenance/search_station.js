/**
 * Created by vector on 2017/11/15.
 *
 * 换热站搜索页面
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
    TouchableOpacity
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Constants from './../constants';
import StationDetails from './station_details/station_tab';
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
export default class WisdomHeating extends Component {


    constructor(props) {
        super(props);

        this.state = {
            searchValue:"新城",
            company_code:"",
            access_token:"",
            dataSource: ds.cloneWithRows([]),
            listShow:false,
        };

        const _this = this;
        AsyncStorage.getItem("company_code", function (errs, result) {
            if (!errs) {
                _this.setState({
                    company_code:result
                })
            }
        });

        AsyncStorage.getItem("access_token", function (errs, result) {
                if (!errs) {
                    _this.setState({
                        access_token:result
                    })
                }

            }
        );

    }



    getDataFromApi() {
        var uri = Constants.serverSite + "/v1_0_0/stationAllDatas?tag_id=10,11,12,20,16&access_token=" +
            this.state.access_token + "&company_code=" + this.state.company_code + "&name=" + "{'station_name':'" + this.state.searchValue +"'}";

        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.length > 0)
                {
                    this.setState({
                        listShow:true,
                        dataSource: ds.cloneWithRows(responseJson),
                    });
                }
                else
                {
                    Alert.alert(
                        '提示',
                        '无此换热站',
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    pop() {
        this.props.navigator.pop();
    }

    openScada(name, id) {
        this.props.navigator.push({
            component: StationDetails,
            passProps: {
                station_name: name,
                station_id: id,
            }
        })
    }


    render() {
        return (
           <View>
               <View style={styles.navView}>
                   <View style={{width:width-100,height:30,borderRadius:5,backgroundColor:'rgb(255,255,255)',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                       <TextInput
                           placeholder="输入你要查询的换热站名称"
                           placeholderTextColor="rgba(0,0,0,0.7)"
                           onChangeText={(searchValue) => this.setState({ searchValue })}
                           returnKeyType={"search"}
                           onSubmitEditing={this.getDataFromApi.bind(this)}
                           style={{fontSize:15,color:"rgba(0,0,0,0.7)",width:width-100,height:30,textAlign:"center"}}
                       >
                       </TextInput>
                   </View>
                   <Text style={{color:"#ffffff",marginLeft:10}} onPress={this.pop.bind(this)}>
                       取消
                   </Text>
               </View>

               {this.state.listShow?
                   <View style={{width:width,marginLeft:5}}>
                       <View style={styles.titleView}>
                           <View style={styles.selectItemView}>
                               <Text style={styles.titleText}>换热站</Text>
                           </View>
                           <View style={styles.selectItemView}>
                               <Text style={styles.titleText}>一网供温</Text>
                           </View>
                           <View style={styles.selectItemView}>
                               <Text style={styles.titleText}>一网回温</Text>
                           </View>
                           <View style={styles.selectItemView}>
                               <Text style={styles.titleText}>一网供压</Text>
                           </View>
                           <View style={styles.selectItemView}>
                               <Text style={styles.titleText}>二网供温</Text>
                           </View>
                           <View style={styles.selectItemView}>
                               <Text style={styles.titleText}>一网流量</Text>
                           </View>
                       </View>
                       <ListView
                           ref="ListView"
                           showsVerticalScrollIndicator={false}
                           enableEmptySections={true}
                           dataSource={this.state.dataSource}
                           renderRow={ data =>(
                               <TouchableOpacity underlayColor="rgba(77,190,255,0.5)" onPress={this.openScada.bind(this, data.station_name, data.station_id)}>
                                   <View style={styles.listView}>
                                       <View style={styles.selectItemView1}>
                                           <Text style={data.status === 1?{ fontSize: 10, color: '#0099ff', textAlign: 'left', marginLeft:9 }:{fontSize: 10, color: 'rgb(248,184,54)', textAlign: 'left',marginLeft:9}} numberOfLines={1}>{data.station_name}</Text>
                                           <Text style={data.status === 1?{ fontSize: 7, color: '#0099ff', textAlign: 'left', marginLeft:9 }:{ fontSize: 7, color: 'rgb(248,184,54)', textAlign: 'left', marginLeft:9}}>{data.data?data.data.data_time:null}</Text>
                                       </View>
                                       <View style={styles.selectItemView}>
                                           <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data?data.data["1gw"]:"-"}</Text>
                                       </View>
                                       <View style={styles.selectItemView}>
                                           <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data?data.data["1hw"]:"-"}</Text>
                                       </View>
                                       <View style={styles.selectItemView}>
                                           <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data?data.data["1gy"]:"-"}</Text>
                                       </View>
                                       <View style={styles.selectItemView}>
                                           <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data?data.data["2gw"]:"-"}</Text>
                                       </View>
                                       <View style={styles.selectItemView}>
                                           <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data?data.data["1sl"]:"-"}</Text>
                                       </View>
                                   </View>
                               </TouchableOpacity>
                           )}
                       />
                   </View>
                   :null
               }

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
        alignItems:"center"
    },
    titleView: {
        width: width,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectItemView: {
        width: (width - 18) / 6,
        height: 40,
        alignItems:"center",
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 13,
        color: '#0099ff',
        textAlign: 'center',
    },
    listView: {
        width: width,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e9e9e9'
    },
    selectItemView1: {
        width: (width - 18) / 6,
        height: 40,
        flexDirection:'column',
        alignItems:"flex-start",
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
});