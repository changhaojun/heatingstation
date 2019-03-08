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
      data: []
    };

  }
  componentDidMount() {
    this.getHeatUserData();
  }
  componentWillMount() {
    this.setTitle = DeviceEventEmitter.addListener('refresh', ()=>{
      this.getHeatUserData();
    })
  }
  componentWillUnmount(){
    this.setTitle.remove();
  }
  getHeatUserData() {
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
                    // console.log('data:::', _this.state.data);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          })
      }
    })
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

  getHeatUserBox(data) {
    let layout = [];
    for (let index = 0; index < data.length; index++) {
      let params = {
        props:this.props,
        heat_user_id: data[index].heat_user_id,
        user_number: data[index].user_number,
        addr: this.props.communityName + this.props.buildName + this.props.unitName + "单元",
        temp_value: null,
        temp_voltage: null,
        heat_user_device_temp_id: null,
        valve_value: null,
        valve_voltage: null,
        heat_user_device_valve_id: null,
        valve_device_object_id: ''
      }
      if(data[index].temp) {
        params.heat_user_device_temp_id = data[index].temp.heat_user_device_id;
        let datas = data[index].temp.datas;
        datas.forEach(data => {
          if('data_value' in data) {
            if(data.tag_name.includes('室内温度')) {
              params.temp_value = data.data_value;
            }
            if(data.tag_name.includes('温度计电压')) {
              params.temp_voltage = data.data_value;
            }
          }
        })
      }
      if(data[index].valves) {
        params.heat_user_device_valve_id = data[index].valves.heat_user_device_id;
        params.valve_device_object_id = data[index].valves.device_object_id;
        let datas = data[index].valves.datas;
        datas.forEach(data => {
          if('data_value' in data) {
            if(data.tag_name.includes('电动阀开度')) {
              params.valve_value = data.data_value;
            }
            if(data.tag_name.includes('电动阀电压')) {
              params.valve_voltage = data.data_value;
            }
          }
        })
      }

      let bgColor = "";
      if(!params.temp_value) {
        bgColor = "#eee";
      }else if(params.temp_value < 16) {
        bgColor = "#3C8CED";
      }else if(16 <= params.temp_value && params.temp_value < 18) {
        bgColor = "#FFFAF3";
      }else if(18 <= params.temp_value && params.temp_value < 22) {
        bgColor = "#FEF5E6";
      }else if(22 <= params.temp_value && params.temp_value < 25) {
        bgColor = "#FDD597";
      }else {
        bgColor = "#FA2C3A";
      }
      
      layout.push(<TouchableOpacity key={index}
        onPress={() => this.props.navigator.push({
          component: HeatUserDetails, 
          passProps: params
        })}
        style={{
          width: data.length < 5 ? (width - 65) / data.length : (width - 65) / 4 - 5, height: 40, borderColor: "#E0E2EA55",
          borderRightWidth: index == data.length - 1 ? 0 : 1, backgroundColor: bgColor,
        }}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <Image style={{ width: 13, height: 13, marginLeft: 6, marginTop: 6, }} resizeMode="contain"
              source={data[index].valves ? (params.temp_value >= 25 ? require('../icons/icon_fa_.png') : require('../icons/icon_fa.png')) : require('../icons/nav_flag.png')} />
            {
              data[index].temp && params.temp_value >= 25 ? 
                <Text style={{ color: "#ffffff", fontSize: 14, textAlign: "center", marginTop: 10, }}>{data[index].user_number}</Text> : 
                <Text style={{ color: "#555555", fontSize: 14, textAlign: "center", marginTop: 10, }}>{data[index].user_number}</Text>
            }
            <Image style={{width: 13, height: 13, marginRight: 6, marginTop: 6}} resizeMode="contain"
              source={data[index].temp ? (params.temp_value >= 25 ? require('../icons/icon_wendu_.png') : require('../icons/icon_wendu.png')) : require('../icons/nav_flag.png')} />
          </View>
          <View style={{marginTop: -8}}>
            <Image style={{ width: 13, height: 10, marginLeft: 6, marginTop: 6, }} resizeMode="contain"
              source={
                params.valve_voltage !== null && params.valve_voltage < 0.2 && params.temp_value >=25 ?
                  require('../icons/wudian_.png') :
                  params.valve_voltage !== null && params.valve_voltage < 0.2 ?
                    require('../icons/wudian.png') :
                    params.valve_voltage !== null && params.valve_voltage >= 0.2 && params.valve_voltage < 0.8 && params.temp_value >= 22 && params.temp_value < 25 ?
                      require('../icons/didian.png') :
                      params.valve_voltage !== null && params.valve_voltage >= 0.2 && params.valve_voltage < 0.8 ?
                        require('../icons/didian.png') :
                        params.valve_voltage !== null && params.valve_voltage >= 0.8 ?
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