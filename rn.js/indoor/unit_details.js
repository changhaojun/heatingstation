import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SectionList,
  AsyncStorage,
  FlatList,
  ScrollView,
  DeviceEventEmitter
} from 'react-native';
import Constants from './../constants';
import HeatUserDetails from './heat_user_details';
import Dimensions from 'Dimensions';
import UnitList from "./unit_list"
const { width, height } = Dimensions.get('window');

export default class UnitDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      legend: [ { color: "#3C8CED", text: "＜16℃" },
      { color: "#FFFAF3", text: "16℃~18℃" },
      { color: "#FEF5E6", text: "18℃~22℃" },
      { color: "#FDD597", text: "22℃~25℃" },
      { color: "#FA2C3A", text: "＞25℃" } ],
      data: [],

      relieveAlert: false,
      succText: ''
    };

  }
  componentDidMount() {
    this.getHeatUserData();
  }
  componentWillMount() {
    this.setTitle = DeviceEventEmitter.addListener('refresh', (value)=>{
      this.getHeatUserData();
      if(value && value.showAlert) {
        this.setState({
          relieveAlert: true,
          succText: '绑定成功'
        });
        setTimeout(() => {
          this.setState({relieveAlert: false});
        }, 5000);
      }
    });
  }
  componentWillUnmount(){
    this.setTitle.remove();
  }
  getHeatUserData() {
    console.log("进来了")
    this.setState({ refreshing: true })
    let unit_id = this.props.unitId ? this.props.unitId : 1;
    let _this = this;
    http://121.42.253.149:18859/app/mock/29/GET//v2/community/building/unit/:id
    AsyncStorage.getItem("access_token", function (errs, result) {
      if (!errs) {
        let uri = Constants.serverSite3 + "/v2/community/building/unit/" + unit_id + "?access_token=" + result;
        fetch(uri)
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.code == 200) {
              let flow = {}
              for (const key in responseJson.result) {
                if (responseJson.result.hasOwnProperty(key) && responseJson.result[ key ]) {
                  for (let index = 0; index < responseJson.result[ key ].length; index++) {
                    if (responseJson.result[ key ][ index ].tag_id == 2001) {
                      flow[ key ] = responseJson.result[ key ][ index ].data_value;
                    }
                  }
                }
              }
              let uri = Constants.serverSite3 + "/v2/community/building/unit/" + unit_id + "/house?allHouse=1&access_token=" + result;
              console.log('uri::', uri)
              fetch(uri)
                .then((response) => response.json())
                .then((responseJson) => {
                  if (responseJson.code == 200) {
                    let data = responseJson.result;
                    let stateData = [];
                    if (data.all && data.all.length) {
                      stateData.push({ title: { name: "全部", flow: flow.all }, data: _this.arrangeData(data.all) });
                    }
                    if (data.high && data.high.length) {
                      stateData.push({ title: { name: "高区", flow: flow.high }, data: _this.arrangeData(data.high) });
                    }
                    if (data.low && data.low.length) {
                      stateData.push({ title: { name: "低区", flow: flow.low }, data: _this.arrangeData(data.low) });
                    }
                    _this.setState({ data: stateData, refreshing: false, });
                    console.log('data:::', _this.state.data);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          })
      }
    }
    );
  }
  arrangeData(data) {
    let reData = [];
    let dataOne = null;
    for (let index = 0; index < data.length; index++) {
      if (!dataOne) {
        dataOne = { layer: data[ index ].layer, heatUser: [] };
      }
      dataOne.heatUser.push(data[ index ]);
      if (index == data.length - 1 || data[ index ].layer != data[ index + 1 ].layer) {
        reData = reData.concat(dataOne);
        dataOne = null;
      }
    }
    return reData;
  }
  // [ { color: "#3C8CED", text: "＜16℃" },
  // { color: "#FFFAF3", text: "16℃~18℃" },
  // { color: "#FEF5E6", text: "18℃~22℃" },
  // { color: "#FDD597", text: "22℃~25℃" },
  // { color: "#FA2C3A", text: "＞25℃" } ],
  getHeatUserBox(data) {
    let layout = [];
    for (let index = 0; index < data.length; index++) {
      let bgColor = "";
      let voltage = null;
      if (!data[ index ].temp) {
        bgColor = "#eee";
      } else if (data[index].temp.datas[0].data_value < 16) {
        bgColor = "#3C8CED";
      } else if (16 <= data[index].temp.datas[0].data_value && 18 > data[index].temp.datas[0].data_value) {
        bgColor = "#FFFAF3";
      } else if (18 <= data[index].temp.datas[0].data_value && 22 > data[index].temp.datas[0].data_value) {
        bgColor = "#FEF5E6";
      } else if (22 <= data[index].temp.datas[0].data_value && 25 > data[index].temp.datas[0].data_value) {
        bgColor = "#FDD597";
      } else {
        bgColor = "#FA2C3A";
      }
      let params = {
        heat_user_id: data[index].heat_user_id,
        user_number: data[index].user_number,
        addr: this.props.communityName + this.props.buildName + this.props.unitName + "单元",
        value: null,
        temp_data_id: null,
        valves_data_id: null,
        props:this.props,
        heat_user_device_temp_id: null,
        heat_user_device_valves_id: null,
        valves_datas: null,
        valves_device_object_id: ''
      }
      if(data[index].temp) {
        let datas =  data[index].temp.datas[0];
        params.value = datas.data_value;
        params.temp_data_id = datas.data_id;
        params.heat_user_device_temp_id = data[index].temp.heat_user_device_id;
      }
      if(data[index].valves) {
        let valves = data[index].valves;
        params.heat_user_device_valves_id = valves.heat_user_device_id;
        params.valves_device_object_id = valves.device_object_id;
        params.valves_datas = valves.datas;
        valves.datas.forEach((data,index) => {
          if(data.tag_name === '电动阀电压') {
            voltage = data.data_value;
          }
          if(data.tag_name === '电动阀开度') {
            params.valves_data_id = data.data_id;
          }
        })
      }
      layout.push(<TouchableOpacity
        onPress={() => this.props.navigator.push({
          component: HeatUserDetails, 
          passProps: params
          // passProps: {
          //   heat_user_id: data[ index ].heat_user_id,
          //   user_number: data[ index ].user_number,
          //   addr: this.props.communityName + this.props.buildName + this.props.unitName + "单元",
          //   value: data[ index ].temp.datas[0].data_value,
          //   data_id: data[ index ].data_id,
          //   props:this.props,
          //   heat_user_device_id:data[ index ].heat_user_device_id
          // },
        })}
        style={{
          width: data.length < 5 ? (width - 65) / data.length : (width - 65) / 4 - 5, height: 40, borderColor: "#E0E2EA55",
          borderRightWidth: index == data.length - 1 ? 0 : 1, backgroundColor: bgColor,
        }}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <Image style={{ width: 13, height: 13, marginLeft: 6, marginTop: 6, }} resizeMode="contain"
              source={data[index].valves ? ((data[index].temp && data[index].temp.datas[0].data_value >=25) ? require('../icons/icon_fa_.png') : require('../icons/icon_fa.png')) : require('../icons/nav_flag.png')} />
            {
              data[index].temp && data[index].temp.datas[0].data_value >=25 ? 
                <Text style={{ color: "#ffffff", fontSize: 14, textAlign: "center", marginTop: 10, }}>{data[index].user_number}</Text> : 
                <Text style={{ color: "#555555", fontSize: 14, textAlign: "center", marginTop: 10, }}>{data[index].user_number}</Text>
            }
            <Image style={{width: 13, height: 13, marginRight: 6, marginTop: 6}} resizeMode="contain"
              source={data[index].temp ? (data[index].temp.datas[0].data_value >=25 ? require('../icons/icon_wendu_.png') : require('../icons/icon_wendu.png')) : require('../icons/nav_flag.png')} />
          </View>
          <View style={{marginTop: -8}}>
            <Image style={{ width: 13, height: 10, marginLeft: 6, marginTop: 6, }} resizeMode="contain"
              source={
                data[index].valves && voltage===0 && data[index].temp && data[index].temp.datas[0].data_value>=25 ?
                  require('../icons/wudian_.png') :
                  data[index].valves && voltage===0 ? 
                    require('../icons/wudian.png') : 
                    data[index].valves && voltage>0 && voltage<=30 && data[index].temp && 22 <= data[index].temp.datas[0].data_value && 25 > data[index].temp.datas[0].data_value ? 
                      require('../icons/didian.png') : 
                      data[index].valves && voltage>0 && voltage<=30 ? 
                        require('../icons/didian.png') :
                        data[index].valves && voltage>30 ?
                          require('../icons/mandian.png') :
                          require('../icons/nav_flag.png')
              } />
          </View>
        </View>
      </TouchableOpacity>)
    }
    return layout;
  }
  popUnitList(){
    this.props.navigator.push({
      name: 'UnitList',
      component: UnitList,
      passProps: {
        buildName: this.props.buildName,
        buildId: this.props.buildId,
        communityName:this.props.communityName
    }
    })
  }
  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => {this.props.navigator.pop();DeviceEventEmitter.emit('refreshUnit')}}>
            <Image style={{ width: 25, height: 20, marginLeft: 15 }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>{this.props.unitName}单元</Text>
          <View style={{width:40}} />
        </View>
        <Text style={{ backgroundColor: "#434b59", textAlign: "center", width: width, height: 25, color: "#FFFFFF", fontSize: 12 }}>{this.props.communityName}{this.props.buildName}</Text>
        <View style={{width:width,height:37,backgroundColor:"#fff"}}>
          <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={this.state.legend}
          renderItem={({ item }) =>
            <View style={{ flexDirection: "row", margin: 13,marginRight:3, alignItems: "center" }}>
              <View style={{ width: 12, height: 12, backgroundColor: item.color, marginRight: 5, borderRadius: 2 }} />
              <Text style={{ color: "#666666", fontSize: 12 }}>{item.text}</Text>
            </View>}
        />
        </View>
        <ScrollView horizontal={true}>
          <SectionList
            onRefresh={() => this.getHeatUserData()}
            refreshing={this.state.refreshing}
            renderItem={({ item, index, section }) =>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: 63, height: 40, backgroundColor: "#4B4F5A", textAlign: "center", textAlignVertical: "center", fontSize: 14, color: "#fff" }}>{item.layer}楼</Text>
                {this.getHeatUserBox(item.heatUser)}
              </View>
            }
            renderSectionHeader={({ section: { title } }) => (
              <View style={{ width: width, height: 40, flexDirection: "row" }}>
                <View style={{ flex: 1, paddingLeft: 20, justifyContent: "center" }}>
                  <Text style={{ color: "#2E94DD" }}>{title.name}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent:"flex-end",paddingRight:12 }}>
                  <Text style={{ color: "#333333" }}>瞬时热量   </Text>
                  <Text style={{ color: "#2E94DD" }}>-- GJ/h</Text>
                  {/* <Text style={{ color: "#2E94DD" }}>{title.flow}GJ/h</Text> */}
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ flex: 1, height: 1, backgroundColor: "#E0E2EA33" }} />}
            sections={this.state.data}
            keyExtractor={(item, index) => item + index}
          />
        </ScrollView>
        {
          this.state.relieveAlert ?
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', width: width, height: height, position: 'absolute'}}>
              <View style={{backgroundColor: '#fff', borderRadius: 4, height: 100, width: 120, flexDirection: 'column', alignSelf: 'center', justifyContent: 'space-evenly', alignItems: 'center', marginTop: height/2-50}}>
                <Image style={{ width: 30, height: 30 }} resizeMode="contain" source={require('../icons/su.png')} />
                <Text>{this.state.succText}</Text>
              </View>
            </View> : <View></View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  all: {
    flex: 1,
    backgroundColor: "#E3E5E8",
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
  toolbarText: {
    color: "#2EDDDB",
    marginHorizontal: 5
  },
});