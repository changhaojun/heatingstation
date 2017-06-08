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
  NavigatorIOS,
} from 'react-native';

import Login from './rn.js/login';
import Orientation from 'react-native-orientation';
export default class WisdomHeating extends Component {

    componentWillMount() {
        Orientation.lockToPortrait();
    }


    componentWillUnmount() {
        Orientation.lockToPortrait();
    }

  render() {
    return (
      <NavigatorIOS
        initialRoute = {{
             component: Login, // 具体的版块
             title:'登录页面',

        }}
        style={{flex:1}}
        navigationBarHidden = {true}
      />
    );
  }
}

AppRegistry.registerComponent('WisdomHeating', () => WisdomHeating);
