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
  ImageBackground,
  ScrollView
} from 'react-native';
import Constants from './../constants';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');

export default class HeatUserDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      info: [ { name: "房间号", value: "301" }, { name: "联系电话", value: "13453453343" }, { name: "建筑面积", value: "102㎡" }, { name: "用户环境", value: "低区" }, { name: "是否复式", value: "是" }, { name: "缴费情况", value: "已缴费" } ]
    };
  }
  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Image style={{ width: 25, height: 20, marginLeft: 15, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>dsds</Text>
          <View style={{ width: 40}} />
        </View>
        <Text style={{ backgroundColor: "#434b59", textAlign: "center", width: width, height: 25, color: "#FFFFFF", fontSize: 12 }}>大夏龙雀公馆1号楼</Text>
        <ScrollView>
          <ImageBackground style={{ width: width, height: width * 0.42, marginTop: 15, flexDirection: "row", alignItems: "center", paddingBottom: 35 }} resizeMode="contain" source={require('../icons/indoor_bg.png')}>
            <Image style={{ width: 51, height: 51, marginLeft: 50 }} resizeMode="contain" source={require('../icons/indoor_portrait.png')} />
            <View style={{ marginLeft: 13, flex: 1 }}>
              <Text style={{ fontSize: 15, color: "#fff" }}>叶一水</Text>
              <Text style={{ fontSize: 12, color: "#ffffffdd" }}>户主</Text>
            </View>
            <View style={{ marginRight: 41, alignItems: "center" }}>
              <Text style={{ fontSize: 36, color: "#fff" }}>19<Text style={{ fontSize: 17 }}>℃</Text></Text>
              <Text style={{ fontSize: 12, color: "#ffffffdd" }}>室内温度</Text>
            </View>
          </ImageBackground>
          <View style={{ flexDirection: "row", alignItems: "center" ,marginBottom:13}}>
            <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12 }} />
            <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>温度变化曲线</Text>
          </View>
          <View style={{ height: 243, width: width, backgroundColor: "#fff", marginBottom: 23 }}>

          </View>
          <View style={{ flexDirection: "row", alignItems: "center",marginBottom:13 }}>
            <View style={{ width: 3, height: 14, backgroundColor: "#2A9ADC", marginLeft: 12 }} />
            <Text style={{ fontSize: 14, color: "#333333", marginLeft: 9 }}>基本信息</Text>
          </View>
          <FlatList
            data={this.state.info}
            renderItem={({ item }) =>
              <View style={{ flexDirection: "row", height: 48, width: width, backgroundColor: "#fff", alignItems: "center", paddingHorizontal: 12 }}>
                <Text style={{ color: "#999999", fontSize: 15, flex: 1 }}>{item.name}</Text>
                <Text style={{ color: "#333333", fontSize: 15 }}>{item.value}</Text>
              </View>}
            ItemSeparatorComponent={() => <View style={{ flex: 1, height: 1, backgroundColor: "#DADFE4", marginLeft: 12 }} />}
          />
          <View style={{height:20}}/>
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