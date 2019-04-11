import { AsyncStorage, Alert, Platform } from 'react-native';
export default {
  serverSite: "http://114.215.46.56:18816",

  // serverSite1: "http://121.42.253.149:18859/app/mock/28",
  // serverSite3:"http://121.42.253.149:18859/app/mock/29/GET/",
  serverSite1: "http://114.215.46.56:17739",
  serverSite3:"http://114.215.46.56:17741",

  resourceSite: "http://114.215.46.56:17709",
  serverSite2: "http://114.215.46.56:17717",
  cameraSite: "http://114.215.46.56:17719",
  // indoorSite: "http://192.168.1.133:7001",
  indoorSite:"http://114.215.46.56:17741",
  version: 1.18,
  alarmSum: 0,
  login(userName, passWord, success, fail) {
    AsyncStorage.setItem("userName", userName);
    AsyncStorage.setItem("passWord", passWord);
    let url = this.resourceSite + "/v2/login"

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userName,
        password: passWord,
        platform: Platform.OS
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.code === 200) {
          console.log('responseJson*********:', responseJson)
          AsyncStorage.setItem("access_token", responseJson.result.access_token, function (errs) { });
          AsyncStorage.setItem("fullname", responseJson.result.fullname, function (errs) { });
          success && success(responseJson.result)
        } else {
          fail && fail()
        }
      })
      .catch((e) => {
        console.log(e)
        Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
      });
  },
  getUserInfo(access_token, callback) {
    let url = this.resourceSite + "/v2/user?access_token=" + access_token
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        AsyncStorage.setItem("company_location", responseJson.result.location);
        AsyncStorage.setItem("user_id", responseJson.result.user_id + "");
        AsyncStorage.setItem("company_id", responseJson.result.company_object_id);
        AsyncStorage.setItem("company_code", responseJson.result.company_code);
        callback && callback(responseJson.result)
      }).catch((e) => {
        Alert.alert('提示', "网络连接错误,请检查您的的网络或联系我们")
      });
  }
};