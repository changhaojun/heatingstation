import React, { Component } from 'react';
import { AppRegistry, NetInfo, StyleSheet, AsyncStorage, BackHandler, NavigatorIOS, Platform, ToastAndroid, Text, StatusBar, View, Alert, Modal } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components'

import Login from './rn.js/login';
import Launch from './rn.js/launch';
import Orientation from 'react-native-orientation';
import AppUpdate from 'rn-roc-appupdate';
import Constants from './rn.js/constants';
import Dimensions from 'Dimensions';
import JPushModule from 'jpush-react-native';
import Warn from './rn.js/home/warn';
var { width, height } = Dimensions.get('window');
var _navigator;
var lastBackPressed;

BackHandler.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    Orientation.lockToPortrait();//竖屏
    _navigator.pop();
    return true;
  } else if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
    //最近2秒内按过back键，可以退出应用。
    return false;
  }
  ToastAndroid.show("再按一次退出应用", ToastAndroid.SHORT);
  lastBackPressed = Date.now();
  return true;
});

export default class WisdomHeating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateModal: false,
      downloaded: 0,
      alarm: 0
    };
  }
  componentDidMount() {
    if (Platform.OS !== 'ios') {
      this.checkUpdate(true);
      const _this = this;
      JPushModule.initPush();
      JPushModule.notifyJSDidLoad((resultCode) => { });
      JPushModule.addReceiveNotificationListener((event) => {
        this.setState({ alarm: this.state.alarm + 1 })
      })
      JPushModule.addReceiveOpenNotificationListener((event) => {
        AsyncStorage.getItem("access_token", function (errs, access_token) {
          if (!errs && access_token) {
            _this.setState({ alarm: 0 })
            JPushModule.clearLocalNotifications();
            JPushModule.clearAllNotifications();
            // const extras=JSON.parse(event.extras);
            const routes = _navigator.getCurrentRoutes();
            if (routes[ routes.length - 1 ].name == "Warn") {
              _navigator.replace({
                component: Warn,
                name: "Warn"
              })
            } else {
              _navigator.push({
                component: Warn,
                name: "Warn"
              })
            }
          } else {
            _navigator.replace({
              name: 'Login',
              component: Login,
            })
          }
        });

      })
    }
  }
  // noUpdateShow为true时不显示无更新提示
  checkUpdate(noUpdateShow) {
    // var uri = Constants.serverSite + "/v1_0_0/appVersion";
    // fetch(uri)
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     if (Constants.version != responseJson.version_number) {
    //       const appUpdate = new AppUpdate({
    //         apkUrl: responseJson.download_address,
    //         downloadApkStart: () => { this.setState({ updateModal: true }) },
    //         downloadApkProgress: (progress) => { this.setState({ downloaded: progress }) },
    //         downloadApkEnd: () => { this.setState({ updateModal: false }) },
    //         onError: () => { console.log("downloadApkError") }
    //       });
    //       NetInfo.getConnectionInfo().then((connectionInfo) => {
    //         let net = connectionInfo.type == 'wifi' ? 'wifi' : '流量';
    //         Alert.alert(
    //           responseJson.force ? "重要更新" : "更新提示" + '（当前处于' + net + '环境）',
    //           responseJson.version_introduce,
    //           [
    //             { text: '下次再说', onPress: () => { } },
    //             { text: '立即更新', onPress: () => appUpdate.downloadApk() }
    //           ],
    //           { cancelable: false }
    //         );
    //       });

    //     } else {
    //       if (!noUpdateShow) {
    //         Alert.alert(
    //           '提示',
    //           "当前已是最新版本",
    //         );
    //       }
    //     }

    //   })
    //   .catch((error) => {
    //     console.error(error)
    //     Alert.alert(
    //       '提示',
    //       '网络连接错误，请检查网络，或联系客服人员',
    //     );
    //   });
  }
  saveLog(router) {
    AsyncStorage.getItem("user_id", (errs, user_id) => {
      if (!errs && user_id) {
        let url = Constants.resourceSite + "/v2/logResource";
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "system_id": 10,
            "user_id": user_id,
            "url": router,
            "type": 1,
          })
        })
          .then((response) => response.json())
          .then((responseJson) => {
          })
      }
    });
  }
  render() {
    return (
      <View style={{
        flex: 1, marginTop: Platform.OS !== 'ios' ? 0 : 20
      }}>
        {/*状态栏*/}
        < StatusBar
          hidden={false}  //status显示与隐藏
          //translucent={true} //设置status栏是否透明效果,仅支持安卓
          barStyle='default' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
          networkActivityIndicatorVisible={true} //设置状态栏上面的网络进度菊花,仅支持iOS
          showHideTransition='slide' //显隐时的动画效果.默认fade
          backgroundColor={"#434b59"}
        />
        {/* {Platform.OS !== 'ios' ? */}
        < Navigator
          initialRoute={{ name: "Launch", component: Launch }}
          configureScene={(route) => {
            return Navigator.SceneConfigs.FadeAndroid;
          }}
          renderScene={(route, navigator) => {
            let Component = route.component;
            _navigator = navigator;
            return <Component {...route.passProps}
              navigator={navigator}
              alarm={this.state.alarm}
              clearAlarm={() => { this.setState({ alarm: 0 }); if (Platform.OS !== 'ios') JPushModule.clearAllNotifications(); }}
              checkUpdate={() => this.checkUpdate()} />
          }
          }
          onDidFocus={(router) => this.saveLog(router.component.displayName)}
        />
        {/* : <NavigatorIOS
            initialRoute={{
              component: Login, // 具体的版块
              title: '登录页面',
              passProps: {
                alarm: this.state.alarm,
                clearAlarm: () => {
                  this.setState({ alarm: 0 });
                  JPushModule.clearAllNotifications();
                }
              }
            }}
            style={{ flex: 1, marginTop: 20 }}
            navigationBarHidden={true}
          />}*/}
        <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.updateModal}
          onRequestClose={() => { }}>
          <View style={{ backgroundColor: "#00000067", flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <View style={{ backgroundColor: "#fff", width: width - 80, height: 150, justifyContent: 'center', }}>
              <Text style={{ backgroundColor: "#0099FF", width: width - 80, height: 40, fontSize: 17, color: "#fff", textAlignVertical: 'center', paddingLeft: 20 }}>版本更新</Text>
              <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 40 }}>
                <Text style={{ marginTop: -15 }}>下载中({this.state.downloaded}%)……</Text>
                <View style={{ width: width - 160, height: 3, backgroundColor: "#d2d2d2", marginTop: 5 }}><View style={{ width: (width - 160) * this.state.downloaded / 100, height: 3, backgroundColor: "#fff222" }} /></View>
              </View>
            </View>
          </View>
        </Modal>
      </View >
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
AppRegistry.registerComponent('WisdomHeating', () => WisdomHeating);
