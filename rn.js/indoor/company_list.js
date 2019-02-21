/**
 * Created by Vector on 17/4/17.
 * 运行维护页面
 *
 *
 * 2017/11/10修改 by Vector.
 *      1、修复列表项字体下面有阴影的bug
 *      2、优化模块导入
 *      3、
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ListView,
  AsyncStorage,
  Alert,
  ActivityIndicator,
  Dimensions,
  TextInput
} from 'react-native';
import Constants from '../constants';
const { width, height } = Dimensions.get('window');
// import HeatStation from './heat_station_maintenance';
import Abnormal from '../tenance/abnormal';
import VillageList from './village_list';
import Floor from './floor';
export default class Maintenance extends React.Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      access_token: null,
      company_id: null,
      company_code: null,
      refresh_token: null,
      data: [],
      searchValue: '',
      stationList: false,
    };
    var _this = this;
    // 从本地存储中将company_id和access_token取出
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        _this.setState({ access_token: result });
      }
    });
    AsyncStorage.getItem("company_id", function (errs, result) {
      if (!errs) {
        _this.setState({ company_id: result });
      }
    });
    AsyncStorage.getItem("company_code", function (errs, result) {
      if (!errs) {
        _this.setState({ company_code: result });

        var uri =  `${Constants.indoorSite}/v2/company?access_token=${_this.state.access_token}&company_code=${result}&avg_temperat=1&area=1` 
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.result.length > 0) {
              _this.setState({
                data: responseJson.result,
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
    });
  }
  gotoVillageList(company_code,company_name) {
    this.props.navigator.push({
      component: VillageList,
      passProps: {
        company_code: company_code,
        company_name: company_name,
      }
    })
  }
  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
            <View style={{ width: width - 50, height: 30, marginTop: 10, borderRadius: 5, marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, color: "#fff" }}>分户系统</Text>
            </View>
          {/* <TouchableOpacity onPress={() => { this.props.navigator.push({ component: Abnormal }) }}>
            <Image style={{ marginTop: 15, width: 25, height: 20,marginRight:10}} resizeMode="contain" source={require('../icons/abnormal_icon.png')} />
          </TouchableOpacity> */}
        </View>
        {this.state.data.length > 0 ?
          <ListView
            style={{ marginTop: 20 }}
            automaticallyAdjustContentInsets={false}
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={(rowData) => {
              return (
                <TouchableOpacity underlayColor="#ECEDEE" onPress={()=>this.gotoVillageList(rowData.company_code,rowData.company_name)}>
                  <ImageBackground style={styles.listItemView} resizeMode="cover" source={require('../icons/bg_company.png')}>
                    <ImageBackground style={styles.listItemIconView} resizeMode="contain" source={require('../icons/company_icon.png')}>
                      <Text style={{ fontSize: 16, color: '#fff', marginTop: -28, }}>{rowData.company_name.substr(0, 2)}</Text>
                    </ImageBackground>
                    <View style={styles.listItemTextView}>
                      <View style={{ flexDirection: "row", borderBottomColor: "#d7d8d9", borderBottomWidth: 0.5, marginHorizontal: 15, paddingBottom: 5, backgroundColor: 'rgba(255,255,255,0)' }}>
                        <Image style={styles.minImage} resizeMode="contain" source={require('../icons/gongsi_icon.png')} />
                        <Text style={{ fontSize: 16, color: '#212121' }}>{rowData.company_name}</Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 20, marginRight:10}}>
                        <View style={styles.listItemTextView2}>
                          <Text style={styles.listItemTextRight}>{rowData.avg_temperat ? rowData.avg_temperat : "-"}</Text>
                          <Text style={styles.listItemTextLeft}>平均温度(℃)</Text>
                        </View>
                        <View style={styles.listItemTextView2}>
                          <Text style={styles.listItemTextRight}>{rowData.area ? rowData.area : "-"}</Text>
                          <Text style={styles.listItemTextLeft}>房间面积(万㎡)</Text>
                        </View>
                        {/* <View style={styles.listItemTextView2}>
                          <Text style={styles.listItemTextRight}>{rowData.station_count? rowData.station_count : "-"}</Text>
                          <Text style={styles.listItemTextLeft}>换热站数量</Text>
                        </View>           */}
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )
            }}
          /> :
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
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
  },
  topNameText: {
    flex: 1,
    textAlign: 'center',
    color: "#ffffff",
    fontSize: 19,
  },
  searchView: {
    width: width - 40,
    height: 38,
    flexDirection: 'row',
    borderRadius: 38,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    marginTop: 3,
  },
  topView: {
    height: height / 10,
    width: width,
    backgroundColor: '#343439',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemView: {
    width: width,
    height: 147,
    flexDirection: 'row',
  },
  listItemIconView: {
    width: 90,
    height: 110,
    marginLeft:10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0)'
  },
  listItemTextView: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    marginRight: 10,
  },
  listItemTextLeft: {
    fontSize: 12,
    color: '#656667',
  },
  listItemTextRight: {
    fontSize: 17,
    color: '#009ddd',
  },
  listItemTextView2: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0)'
  },
  minImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  }
});
