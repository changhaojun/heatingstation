/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    BackAndroid,
    NativeModules,
    ToastAndroid,
} from 'react-native';

import Login from './rn.android/login.android';
var Orientation = NativeModules.Orientation;


var _navigator;
var lastBackPressed;
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        Orientation.vertical();//竖屏
        _navigator.pop();
        return true;
    }else if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        return false;
    }
    ToastAndroid.show("再按一次退出应用", ToastAndroid.SHORT);
    lastBackPressed=Date.now();
    return true;
});

export default class WisdomHeating extends Component {
  render() {
      let defaultName="Login";
      let defaultComponent=Login;
      return (
          <Navigator
              initialRoute={{ name: defaultName, component: defaultComponent }}
              configureScene={(route) => {
            return Navigator.SceneConfigs.FadeAndroid;
          	}}
              renderScene={(route, navigator) =>{
      		let Component=route.component;
					_navigator=navigator;
      		return <Component {...route.params} navigator={navigator} />
      		}
        }
          />
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