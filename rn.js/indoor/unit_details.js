import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Alert,
  SectionList,
  AsyncStorage,
  FlatList,
  ScrollView
} from 'react-native';
import Constants from './../constants';
import HeatUserDetails from './heat_user_details';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');

export default class UnitDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      legend: [ { color: "#3C8CED", text: "＜16℃" }, { color: "#FFFAF3", text: "16℃~18℃" }, { color: "#FEF5E6", text: "16℃~18℃" }, { color: "#FDD597", text: "16℃~18℃" }, { color: "#FA2C3A", text: "＞25℃" } ],
      data: [
        {
          title: { name: "一区", flow: 32 }, data: [
            { layer: 1, heatUser: [ { id: 1, number: 101 }, { id: 1, number: 102 }, { id: 1, number: 103 }, { id: 1, number: 104 } ] },
            { layer: 2, heatUser: [ { id: 1, number: 201 }, { id: 1, number: 202 }, { id: 1, number: 203 }, { id: 1, number: 204 } ] },
            { layer: 3, heatUser: [ { id: 1, number: 301 }, { id: 1, number: 302 }, { id: 1, number: 303 }, { id: 1, number: 304 } ] },
            { layer: 4, heatUser: [ { id: 1, number: 401 }, { id: 1, number: 402 }, { id: 1, number: 403 }, { id: 1, number: 404 } ] },
            { layer: 5, heatUser: [ { id: 1, number: 501 }, { id: 1, number: 502 }, { id: 1, number: 503 }, { id: 1, number: 504 } ] },
            { layer: 6, heatUser: [ { id: 1, number: 601 }, { id: 1, number: 602 }, { id: 1, number: 603 }, { id: 1, number: 604 } ] },
            { layer: 7, heatUser: [ { id: 1, number: 701 }, { id: 1, number: 702 }, { id: 1, number: 703 }, { id: 1, number: 704 } ] },
            { layer: 8, heatUser: [ { id: 1, number: 801 }, { id: 1, number: 802 }, { id: 1, number: 803 }, { id: 1, number: 804 } ] }, ]
        },
        {
          title: { name: "二区", flow: 35 }, data: [
            { layer: 9, heatUser: [ { id: 1, number: 101 }, { id: 1, number: 102 }, { id: 1, number: 103 }, { id: 1, number: 104 } ] },
            { layer: 10, heatUser: [ { id: 1, number: 201 }, { id: 1, number: 202 }, { id: 1, number: 203 }, { id: 1, number: 204 } ] },
            { layer: 11, heatUser: [ { id: 1, number: 301 }, { id: 1, number: 302 }, { id: 1, number: 303 }, { id: 1, number: 304 } ] },
            { layer: 12, heatUser: [ { id: 1, number: 401 }, { id: 1, number: 402 }, { id: 1, number: 403 }, { id: 1, number: 404 } ] },
            { layer: 13, heatUser: [ { id: 1, number: 501 }, { id: 1, number: 502 }, { id: 1, number: 503 }, { id: 1, number: 504 } ] },
            { layer: 14, heatUser: [ { id: 1, number: 601 }, { id: 1, number: 602 }, { id: 1, number: 603 }, { id: 1, number: 604 } ] },
            { layer: 15, heatUser: [ { id: 1, number: 701 }, { id: 1, number: 702 }, { id: 1, number: 703 }, { id: 1, number: 704 } ] },
            { layer: 16, heatUser: [ { id: 1, number: 801 }, { id: 1, number: 802 }, { id: 1, number: 803 }, { id: 1, number: 804 } ] }, ]
        }
      ],
    };
  }
  getHeatUserBox(data) {
    let layout = [];
    for (let index = 0; index < data.length; index++) {
      layout.push(<TouchableOpacity
      onPress={()=>this.props.navigator.push({component:HeatUserDetails})}
        style={{
          width: (width - 65) / 4, height: 40, borderColor: "#E0E2EA55",
          borderRightWidth: index == data.length - 1 ? 0 : 1, backgroundColor: "#FEF5E6", justifyContent: "center"
        }}>
        <Text style={{ color: "#555555", fontSize: 14, textAlign: "center", }}>{data[ index ].number}</Text>
      </TouchableOpacity>)
    }
    return layout;
  }
  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Image style={{ width: 25, height: 20, marginLeft: 15, marginRight: 30 }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>{this.props.unitName}单元</Text>
          <TouchableOpacity style={styles.toolbar} onPress={() => this.setState({ modal: true })}>
            <Text style={styles.toolbarText}>温度说明</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ backgroundColor: "#434b59", textAlign: "center", width: width, height: 25, color: "#FFFFFF", fontSize: 12 }}>{this.props.communityName}{this.props.buildName}</Text>
        <ScrollView horizontal={true}>
          <SectionList
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
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <Image style={{ width: 12, height: 12, marginRight: 5 }} resizeMode="contain" source={require('../icons/indoor_valve.png')} />
                  <Text style={{ fontWeight: "#333333" }}>楼前阀   </Text>
                  <Text style={{ color: "#2E94DD" }}>{title.flow}GJ/h</Text>
                </View>
                <View style={{ flex: 1 }} />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ flex: 1, height: 1, backgroundColor: "#E0E2EA33" }} />}
            sections={this.state.data}
            keyExtractor={(item, index) => item + index}
          />
        </ScrollView>
        <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => { }}>
          <View style={{ backgroundColor: "#00000040", flex: 1, justifyContent: "center", alignItems: 'center', }}>
            <View style={{ width: width - 60, height: 170, backgroundColor: "#fff" }}>
              <View style={{ width: width - 60, height: 45, flexDirection: "row", alignItems: "center", backgroundColor: "#00b5fc", paddingLeft: 30 }}>
                <Text style={{ color: "#fff", textAlign: "center", flex: 1, fontSize: 17 }}>温度说明</Text>
                <Text style={{ color: "#fff", fontSize: 25, marginRight: 10 }} onPress={() => this.setState({ modal: false })}>ㄨ</Text>
              </View>
              <View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
                <FlatList
                  numColumns={3}
                  data={this.state.legend}
                  renderItem={({ item }) =>
                    <View style={{ flexDirection: "row", margin: 13, alignItems: "center" }}>
                      <View style={{ width: 12, height: 12, backgroundColor: item.color, marginRight: 5, borderRadius: 2 }} />
                      <Text style={{ color: "#666666", fontSize: 12 }}>{item.text}</Text>
                    </View>}
                />
              </View>
            </View>
          </View>

        </Modal>
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
  toolbar: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  toolbarText: {
    color: "#2EDDDB",
    marginHorizontal: 5
  },
});