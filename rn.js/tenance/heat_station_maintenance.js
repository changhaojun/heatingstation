/**
 * Created by Vector on 17/4/24.运行维护 换热站列表
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ListView,
  Alert,
  AsyncStorage
} from 'react-native';
import Constants from './../constants';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');
const zimu = [ "#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];


var getSectionData = (dataBlob, sectionID) => {
  return sectionID;
};
var getRowData = (dataBlob, sectionID, rowID) => {
  return dataBlob[ sectionID ][ rowID ];
};
const ds = new ListView.DataSource({
  getRowData: getRowData,
  getSectionHeaderData: getSectionData,
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

import StationDetails from './station_details/station_tab';
export default class HeatStationMaintenance extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows({}, [], []),
      dataSourceInitial: ds.cloneWithRows(zimu),
      data: {},
      zimu: "",
      tagModal: false,

      allSelect: false,
      onLineSelect: true,
      offLineSelect: false,

      allArr: [],
      onLineArr: [],
      offLineArr: [],
      tagList: null,
      selTag: null,
    };

    const _this = this;
    AsyncStorage.getItem("sel_tag", function (errs, result) {
      if (!errs && result) {
        _this.setState({ selTag: JSON.parse(result) })
      }
    })
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        var uri = Constants.serverSite + "/v1_0_0/tags?access_token=" + result + "&level=2";
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            let selTag = _this.state.selTag;
            if (!selTag) {
              selTag = {};
              for (let index = 0; index < 5; index++) {
                selTag[ responseJson[ index ].tag_id ] = responseJson[ index ]
              }
            }
            _this.setState({ tagList: responseJson, selTag: selTag })
          })
          .catch((error) => {
            console.error(error);
          });
        uri = Constants.serverSite + "/v1_0_0/stationAllDatas?tag_id=10,11,12,20,16&access_token=" + result + "&company_code=" + _this.props.company_code;
        console.log(uri)
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            // 提取在线设备 和 掉线设备 并存放到对应的数组中
            // 点击切换时调用
            let onLineArr = [];
            let offLineArr = [];
            for (let i = 0; i < responseJson.length; i++) {
              if (responseJson[ i ].status === 1) {
                onLineArr.push(responseJson[ i ]);
              } else {
                offLineArr.push(responseJson[ i ])
              }
            }
            // 更新状态机
            _this.setState({
              allArr: responseJson,
              onLineArr: onLineArr,
              offLineArr: offLineArr,
            });
            _this.selClicked(1);

          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    )
  }

  back() {
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
  // 选择点击事件  1：在线  2：掉线   3：全部
  selClicked(sel) {
    var allData = sel == 1 ? this.state.onLineArr : sel == 2 ? this.state.offLineArr : this.state.allArr;
    var section = [];
    var row = [];
    var data = {};
    for (var j = 0; j < zimu.length; j++) {
      var num = 0;
      var rowid = [];
      var rowdata = [];
      for (var i = 0; i < allData.length; i++) {
        if (allData[ i ].index.toUpperCase() === zimu[ j ] || zimu[ j ] == "#" && (allData[ i ].index.toUpperCase() > "Z" || allData[ i ].index.toUpperCase() < "A")) {
          rowdata.push(allData[ i ]);
          rowid.push(num);
          num++;
        }
      }
      if (rowdata.length > 0) {
        row.push(rowid);
        data[ zimu[ j ] ] = rowdata;
        section.push(zimu[ j ]);
      }
    }
    this.setState({
      allSelect: sel == 3 ? true : false,
      onLineSelect: sel == 1 ? true : false,
      offLineSelect: sel == 2 ? true : false,
      data: data,
      dataSource: ds.cloneWithRowsAndSections(data, section, row),
    })
  }

  toS(data) {
    let h = 0;
    for (let i = 0; i < zimu.length; i++) {
      if (data === zimu[ i ]) {
        this.refs.ListView.scrollTo({ x: 0, y: h, animated: true });
      } else {
        if (this.state.data[ zimu[ i ] ]) {
          h = h + 19;
          for (let j = 0; j < this.state.data[ zimu[ i ] ].length; j++) {
            h = h + 59;
          }
        }
      }
    }
  }
  clickTag(tag) {
    let selTag = this.state.selTag;
    if (selTag[ tag.tag_id ]) {
      delete selTag[ tag.tag_id ];
    } else {
      if (Object.keys(selTag).length < 5) {
        selTag[ tag.tag_id ] = tag;
      } else {
        Alert.alert("提示", "最多只能选择5个标签");
      }
    }
    this.setState({ selTag: selTag });
    AsyncStorage.setItem("sel_tag",JSON.stringify(selTag))

  }
  getTableHeader() {
    let layout = [];
    let i = 0;
    for (const key in this.state.selTag) {
      layout.push(<View style={i ? styles.selectItemView : styles.selectItemView1}>
        <Text style={styles.titleText}>{this.state.selTag[ key ].tag_name}</Text>
      </View>)
      i++;
    }
    return layout;
  }
  getTableBody(data) {
    let layout = [];
    let i = 0;
    for (const key in this.state.selTag) {
      layout.push(<View style={i ? styles.selectItemView : styles.selectItemView1}>
        <Text style={data.status === 1 ? styles.listText : styles.listWarnText}>{data.data && data.data[ this.state.selTag[ key ].abbre ] ? data.data[ this.state.selTag[ key ].abbre ].toFixed(2) : "-"}</Text>
      </View>)
      i++;
    }
    return layout;
  }
  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={this.back.bind(this)}>
            <Image style={{ width: 25, height: 20, marginHorizontal: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>{this.props.company_name}</Text>
          <TouchableOpacity style={styles.toolbar} onPress={() => this.setState({ tagModal: !this.state.tagModal, stationModal: false, })}>
            <Text style={styles.toolbarText}>标签</Text>
            <Image style={{ width: 10, height: 20, marginRight: 10 }} resizeMode="contain" source={this.state.tagModal ? require('./../icons/contrast_ico_up_white.png') : require('./../icons/contrast_ico_down_white.png')} />
          </TouchableOpacity>
        </View>
        {this.state.tagModal ?
          <ListView
            showsVerticalScrollIndicator={false}
            enableEmptySections={true}
            showsVerticalScrollIndicator={false}
            dataSource={ds.cloneWithRows(this.state.tagList)}
            renderRow={data => (
              <TouchableOpacity style={styles.tagListView} onPress={() => { this.clickTag(data) }}>
                <Text style={styles.tagListText}>{data.tag_name}</Text>
                <Image style={{ width: 20, height: 20, marginRight: 20 }} resizeMode="contain" source={this.state.selTag[ data.tag_id ] ? require('./../icons/check_pre.png') : require('./../icons/check_nor.png')} />
              </TouchableOpacity>
            )}
            renderSeparator={() => (
              <View style={{ height: 1, backgroundColor: "#f5f5f5", width: width }} />
            )}
          /> :
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: '#434b59', width: width, height: 40, flexDirection: 'row' }}>
              <View style={styles.topTabView}>
                <TouchableOpacity onPress={() => this.selClicked(1)} style={this.state.onLineSelect ? styles.topTabBorderDisplay : styles.topTabBorderUnDisplay}>
                  <Text style={this.state.onLineSelect ? styles.topTabTextActive : styles.topTabTextInactive}>在线</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.topTabView}>
                <TouchableOpacity onPress={() => this.selClicked(2)} style={this.state.offLineSelect ? styles.topTabBorderDisplay : styles.topTabBorderUnDisplay}>
                  <Text style={this.state.offLineSelect ? styles.topTabTextActive : styles.topTabTextInactive}>掉线</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.topTabView}>
                <TouchableOpacity onPress={() => this.selClicked(3)} style={this.state.allSelect ? styles.topTabBorderDisplay : styles.topTabBorderUnDisplay}>
                  <Text style={this.state.allSelect ? styles.topTabTextActive : styles.topTabTextInactive}>全部</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.titleView}>
              {this.getTableHeader()}
            </View>
            <View style={styles.bottomView}>
              {this.state.allArr.length && this.state.tagList && this.state.tagList.length ?
                <ListView
                  ref="ListView"
                  initialListSize={this.state.allArr.length}
                  showsVerticalScrollIndicator={false}
                  enableEmptySections={true}
                  showsVerticalScrollIndicator={false}
                  dataSource={this.state.dataSource}
                  renderRow={data => (
                    <TouchableOpacity underlayColor="rgba(77,190,255,0.5)" onPress={this.openScada.bind(this, data.station_name, data.station_id)}>
                      <View style={[ styles.listView, { height: 28, alignItems: "flex-end", } ]}>
                        <Text style={{ fontSize: 15, color: data.status === 1 ? '#0099ff' : "#919293", }} numberOfLines={1}>{data.station_name}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={{ fontSize: 11, color: '#919293', marginRight: 0, marginBottom: 3, }}>{data.data ? data.data.data_time : null}</Text>
                      </View>
                      <View style={styles.listView}>
                        {this.getTableBody(data)}
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
            <View style={{ position: 'absolute', marginTop: 80, alignSelf: "flex-end", width: 26, }}>
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
        }
      </View>

    )
  }
}

const styles = StyleSheet.create({
  all: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  },
  topView: {
    height: height / 10,
    width: width,
    backgroundColor: '#343439',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleView: {
    width: width-35,
    height: 30,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 25,
  },
  listView: {
    width: width-35,
    height: 30,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 25,

  },
  selectItemView: {
    flex: 1,
    height: 40,
    alignItems: "flex-end",
    justifyContent: 'center',
  },
  selectItemView1: {
    flex: 1,
    height: 40,
    alignItems: "flex-start",
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 11,
    color: '#0099ff',
    textAlign: 'right',
  },
  listText: {
    fontSize: 16,
    color: '#000000',
  },
  listWarnText: {
    fontSize: 16,
    color: '#919293',
  },
  bottomView: {
    //backgroundColor: '#e9e9e9',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  listItem: {
    width: width,
    height: 25,
    flexDirection: 'row',
    backgroundColor: '#E9E9E9',
  },
  listItemText1: {
    color: "#b57907",
    fontSize: 18,
    textAlign: 'center',
    fontWeight: "bold",
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 3,
    height: 32,
  },
  listItemChild: {
    width: width,
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 2,
    borderColor: '#e9e9e9'
  },
  sectionText: {
    fontSize: 18,
    color: '#515151',
    paddingLeft: 10,
    paddingTop: 4,
  },
  data_valueText: {
    paddingTop: 13,
    fontSize: 16,
    textAlign: 'left',
    color: '#0099ff',
    paddingLeft: 20,
  },
  listItemChild1: {
    width: width / 4,
  },
  listItemText2: {
    paddingTop: 13,
    fontSize: 16,
    textAlign: 'left',
    color: '#515151',
    paddingLeft: 30,
  },
  topTabView: {
    width: width * 1 / 3,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topTabTextInactive: {
    color: '#ffffff',
    fontSize: 18
  },
  topTabTextActive: {
    color: 'rgb(84,141,183)',
    fontSize: 18
  },
  topTabBorderDisplay: {
    width: width * 1 / 3 - 20,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(84,141,183)'
  },
  topTabBorderUnDisplay: {
    borderBottomWidth: 0
  },
  rowFront: {
    width: width,
    height: 50,
    backgroundColor: '#ffffff',

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  indexListText: {
    flex: 1,
    //paddingLeft:10,
    color: "#00000088",
    fontSize: 15,
    backgroundColor: "#ffffff00",
    textAlign: "center",
    height: (height - 165) / 26,
    width: 26
  },
  listImage: {
    width: 28,
    height: 28,
    margin: 10,
  },
  listRight: {
    width: 20,
    height: 18,
    margin: 10,
  },
  toolbar: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  toolbarText: {
    color: "#fff",
    marginHorizontal: 5
  },
  tagListView: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  tagListText: {
    color: "#4f5051",
    fontSize: 15,
    marginLeft: 15,
    flex: 1
  },
});