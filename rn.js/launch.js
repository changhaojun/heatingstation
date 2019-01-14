import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  Platform
} from 'react-native';
import Constants from './constants';
import Login from './login';
import Main from './main';
import JPushModule from 'jpush-react-native';

export default class Launch extends React.Component {
  // 初始化数据
  constructor(props) {
    super(props);
    const _this = this;
    AsyncStorage.getItem("userName", function (errs, userName) {
      if (!errs) {
        AsyncStorage.getItem("passWord", function (errs, passWord) {
          if (!errs) {
            AsyncStorage.getItem("access_token", function (errs, access_token) {
              if (!errs && access_token) {
                _this.login(userName, passWord);
              } else {
                _this.props.navigator.replace({
                  name: 'Login',
                  component: Login,
                })
              }
            }
            );
          }
        });
      }
    })
  }
  //登录按钮事件
  login(userName, passWord) {
    const navigator = this.props.navigator;
    Constants.login(userName, passWord, (result) => {
      Constants.getUserInfo(result.access_token, (result) => {
        //跳转
        navigator.replace({
          name: 'Main',
          component: Main,
        })
        if (Platform.OS !== 'ios') {
          if(result.company_code.length==6){
            let tag=[]
            for (let index = 1; index < 8; index++) {
              tag.push(result.company_code+"00000"+index);
            }
            JPushModule.setTags(tag, () => { })
          }else{
            JPushModule.setTags([ result.company_code ], () => { })
          }
        }
      })
    }, () => navigator.replace({
      name: 'Login',
      component: Login,
    }))
  }

  render() {
    return (
      //  最外层主View
      <View style={styles.all}>
        {/*顶部放置Logo的View*/}
        <View style={styles.topView}>
          <Image source={require('./images/login_logo.png')} style={styles.logo} />
          <Text style={styles.logoTitle}>智慧供热系统</Text>
        </View>

        {/*底部是放置登录按钮和公司信息的View*/}
        <Text style={styles.companyInfoText}>北京智信远景软件技术有限公司</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  all: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  topView: {
    flex: 1,
    paddingTop: 200,
    //justifyContent: 'center',
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 53,

  },
  logoTitle: {
    fontSize: 22,
    color: "#0099FF",
    fontWeight: "300",
    paddingTop: 20,
  },
  companyInfoText: {
    fontSize: 16,
    color: '#0099FF',
    marginBottom: 10,
  }
});
