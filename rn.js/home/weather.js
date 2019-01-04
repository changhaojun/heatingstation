/**
 * Created by Vector on 17/4/18.
 *
 * 首页-【天气】子模块
 *
 * 2017/11/4修改 by Vector.
 *      1、修改天气图标在iOS平台不出现的Bug
 *      2、优化部分代码逻辑
 *
 */
// 设置页面
import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ListView,
  StyleSheet,
  PermissionsAndroid,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
const Geolocation = require('Geolocation');
export default class Weather extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      x: 0,
      dataSource: ds.cloneWithRows([])
    };
    const _this = this;
    // fetch("http://114.215.46.56:18825/v1/weathers?city_id=310")
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log(responseJson);
    //     _this.setState({ dataSource: ds.cloneWithRows(responseJson.daily) })
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    //   const _this = this;

    const url = "https://api.seniverse.com/v3/weather/daily.json?key=61nbeh5awvksr63d&location=ip"
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        _this.setState({ dataSource: ds.cloneWithRows(responseJson.results[ 0 ].daily) })
      })
      .catch((error) => { console.error('error', error) });
  }
  //滑动结束后调用
  onScroll(x) {
    if (this.state.x < x && x % (width - 76)) {
      this.listView.scrollTo({ x: (parseInt(x / (width - 76)) + 1) * (width - 76), y: 0, animated: true })
    }
    if (this.state.x > x && x % (width - 76)) {
      this.listView.scrollTo({ x: parseInt(x / (width - 76)) * (width - 76), y: 0, animated: true })
    }
  }
  render() {
    return (
      <View style={styles.all}>
        <ListView
          dataSource={this.state.dataSource}
          showsHorizontalScrollIndicator={false}
          ref={listView => this.listView = listView}
          style={styles.list}
          enableEmptySections={true}
          contentContainerStyle={styles.contentContainerStyle}
          horizontal={true}
          onScrollBeginDrag={(evt) => this.setState({ x: evt.nativeEvent.contentOffset.x })}
          onScrollEndDrag={(evt) => this.onScroll(evt.nativeEvent.contentOffset.x)}
          renderRow={(rowData) => {
            return (
              <ImageBackground source={require('../images/weatherbg.png')} style={styles.image1}>
                <View style={styles.topView}>
                  <View style={styles.leftView}>
                    <Text style={{ fontSize: 25, color: "#FFF" }}>{rowData.low}~{rowData.high}℃</Text>
                    <Text style={{ fontSize: 17, color: "#FFF" }}>{rowData.text_day}</Text>
                    <Text style={{ fontSize: 12, color: "#FFF", marginTop: 3 }}>{rowData.date}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Image source={{ uri: "https://s1.sencdn.com/web/icons/3d_50/" + rowData.code_day + ".png" }} resizeMode={"contain"} style={{ width: 60, height: 60 }} />
                  </View>
                </View>
              </ImageBackground>
            )
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  all: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  list: {
    width: width,
    height: 140,
  },
  image1: {
    width: width - 90,
    height: 120,
    margin: 8,
    borderRadius: 5,
    borderColor: "#fff000"
  },
  contentContainerStyle: {
    paddingHorizontal: 38,
    borderRadius: 5,
  },
  weatherimage: {
    margin: 30,
    width: 50,
    height: 50,
  },
  topView: {
    flexDirection: 'row',
    flex: 1,
  },
  leftView: {
    flex: 1,
    margin: 15,
    backgroundColor: "rgba(255,255,255,0)"
  },
  rightView: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
