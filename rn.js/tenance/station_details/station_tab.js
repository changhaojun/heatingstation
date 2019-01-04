/**
 * 换热站tab框架页面
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import Dimensions from 'Dimensions';
import LogClassification from "./operation_log/log_classification";
import ArchivesClassification from "./archives/archives_classification";
// import Strategy from "./control_strategy/strategy";
import Scada from "./scada/scada";
import DataList from "./scada/data_list";
import warn from "./../../home/warn.js"
var { width, height } = Dimensions.get('window');
import Orientation from 'react-native-orientation';
export default class StationTab extends React.Component {
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();//竖屏
    this.state = {
      fristView: DataList,
      topStyle1: styles.topTextSelection,
      topStyle2: styles.topTextNormal,
      topStyle3: styles.topTextNormal,
      topStyle4: styles.topTextNormal,
      topStyleView1: styles.topViewSelection,
      topStyleView2: styles.topViewNormal,
      topStyleView3: styles.topViewNormal,
      topStyleView4: styles.topViewNormal,
      position: 0,
    };
  }
  _switch(position, noScroll) {
    // if(!(noScroll)&&position==this.state.position&&position==0){
    //     this.setState({fristView:this.state.fristView==Scada?DataList:Scada,});
    // }
    this.setState({ position: position });
    if (!(noScroll)) this.scrollView.scrollTo({ x: position * width, y: 0, animated: true });

    this.setState({
      topStyle1: styles.topTextNormal,
      topStyle2: styles.topTextNormal,
      topStyle3: styles.topTextNormal,
      topStyle4: styles.topTextNormal,
      topStyleView1: styles.topViewNormal,
      topStyleView2: styles.topViewNormal,
      topStyleView3: styles.topViewNormal,
      topStyleView4: styles.topViewNormal,
    });
    switch (position) {
      case 0: {
        this.setState({
          topStyle1: styles.topTextSelection,
          topStyleView1: styles.topViewSelection,
        });
        break;
      }
      case 1: {
        this.setState({
          topStyle2: styles.topTextSelection,
          topStyleView2: styles.topViewSelection,
        });
        break;
      }
      case 2: {
        this.setState({
          topStyle3: styles.topTextSelection,
          topStyleView3: styles.topViewSelection,
        });
        break;
      }
      case 3: {
        this.setState({
          topStyle4: styles.topTextSelection,
          topStyleView4: styles.topViewSelection,
        });
        break;
      }
    }
  }
  onScroll(x) {
    if (!x % width || (x + 10) % width < 30) {
      this._switch(parseInt((x + 10) / width), true);
    }
  }


  render() {
    return (
      <View style={styles.all}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}><Image style={styles.topSides} resizeMode="contain" source={require('../../icons/nav_back_icon.png')} /></TouchableOpacity>
          <Text style={[ styles.topText, styles.all ]}>{this.props.station_name}</Text>
          <TouchableOpacity onPress={() => this.props.navigator.push({ component: warn, passProps: { station_id: this.props.station_id } })}><Image style={styles.topSides} resizeMode="contain" source={require('../../icons/home_nav_warn_icon.png')} /></TouchableOpacity>
        </View>
        <View style={styles.topView}>
          <TouchableOpacity style={styles.all} onPress={this._switch.bind(this, 0, false)}>
            <View style={styles.topViewItem}>
              <Text style={this.state.topStyle1}>实时数据</Text>
              {/* {this.state.position==0?<Image style={styles.switch}  resizeMode="contain" source={require('../../icons/ico_switch.png')} />:null} */}
            </View>
            <View style={this.state.topStyleView1}></View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.all} onPress={this._switch.bind(this, 1,false)}>
                        <View style={styles.topViewItem}>
                            <Text style={this.state.topStyle2}>控制策略</Text>
                        </View>
                        <View style={this.state.topStyleView2}></View>
                    </TouchableOpacity> */}
          <TouchableOpacity style={styles.all} onPress={this._switch.bind(this, 1, false)}>
            <View style={styles.topViewItem}>
              <Text style={this.state.topStyle2}>实时组态</Text>
            </View>
            <View style={this.state.topStyleView2}></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.all} onPress={this._switch.bind(this, 2, false)}>
            <View style={styles.topViewItem}>
              <Text style={this.state.topStyle3}>换热站档案</Text>
            </View>
            <View style={this.state.topStyleView3}></View>
          </TouchableOpacity>
        </View>
        <ScrollView ref={scrollView => this.scrollView = scrollView} horizontal={true} pagingEnabled={true} onScroll={(data) => { this.onScroll(data.nativeEvent.contentOffset.x); }}>
          <View style={styles.itemStyle}><DataList navigator={this.props.navigator} station_id={this.props.station_id} station_name={this.props.station_name} /></View>
          {/* <View style={styles.itemStyle}><Strategy navigator={this.props.navigator} station_id={this.props.station_id}/></View> */}
          <View style={styles.itemStyle}><Scada navigator={this.props.navigator} station_id={this.props.station_id} station_name={this.props.station_name} /></View>
          <View style={styles.itemStyle}><ArchivesClassification navigator={this.props.navigator} station_id={this.props.station_id} /></View>
        </ScrollView>
      </View>
    )
  }
}

// 样式
const styles = StyleSheet.create({
  all: {
    flex: 1,
  },
  topView: {
    width: this.window.width,
    height: 38,
    flexDirection: 'row',
  },
  topViewItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',//垂直居中
    alignItems: 'center',
  },
  topTextNormal: {
    height: 20,
    color: "#000",
    textAlign: 'center',
  },

  topTextSelection: {
    height: 20,
    color: "#35aeff",
    textAlign: 'center',
  },
  topViewNormal: {
    width: width / 3,
    height: 1,
    backgroundColor: "#fff",
  },
  topViewSelection: {
    width: width / 3,
    height: 1,
    backgroundColor: "#35aeff",
  },
  itemStyle: {
    flex: 1,
    width: width,

  },
  topSides: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10,

  },
  switch: {
    width: 15,
    height: 15,
  },
  topText: {
    color: "#ffffff",
    justifyContent: 'flex-end',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 18,
    //marginBottom: 4,
  },
  topRow: {
    width: width,
    height: 45,
    backgroundColor: '#434b59',
    //justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  }
});