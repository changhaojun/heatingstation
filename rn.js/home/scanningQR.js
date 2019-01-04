/**
 * 扫描二维码
 */
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  InteractionManager,
  Dimensions,
  Alert,
  Easing
} from 'react-native';
import StationDevice from '../tenance/station_details/archives/station_device_details'
import Constants from '../constants';
import { RNCamera } from 'react-native-camera';

const { width, height } = Dimensions.get('window');

var load = 0;
export default class ScanningQR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scanned: false, // 判断是否已经扫描出结果
      torch: RNCamera.Constants.FlashMode.off,
      anim: new Animated.Value(0),
    };
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      let scanAnimated = Animated.timing(this.state.anim, {
        toValue: width - 120,
        duration: 2000,
        easing: Easing.linear,
      });
      Animated.loop(scanAnimated).start();
    });
  }
  scanning(e) {
    if (!e.data.match("SD#")) {
      if(!this.state.scanned){
        Alert.alert("提示", "这不是设备二维码", [
          { text: 'OK', onPress: () => this.setState({ scanned: false }) },
        ]);
      }
      this.setState({
        scanned: true,
      });
      return;
    }
    this.setState({
      scanned: true,
      torch: RNCamera.Constants.FlashMode.off,
    });
    this.props.navigator.replace({
      name: "StationDevice",
      component: StationDevice,
      passProps: {
        device_id: e.data.split("#")[ 1 ]
      }
    })
    // }
  }
  switchTorch() {
    let torch = this.state.torch === RNCamera.Constants.FlashMode.off ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off;
    this.setState({ torch: torch });
  }
  render() {
    return (
      <View style={styles.all}>
        <View style={styles.navView}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Image style={{ width: 25, height: 20, marginLeft: 10, }} resizeMode="contain" source={require('../icons/nav_back_icon.png')} />
          </TouchableOpacity>
          <Text style={styles.topNameText}>扫描二维码</Text>
          <Image style={{ width: 25, height: 20, marginRight: 10, }} source={require('../icons/nav_flag.png')} />
        </View>
        <RNCamera
          ref={(cam) => this.camera = cam}
          style={styles.all}
          onBarCodeRead={(e) => this.scanning(e)}
          flashMode={this.state.torch}
          barCodeTypes={[ RNCamera.Constants.BarCodeType.qr ]}>
          <View style={styles.allCamera}>
            <View style={styles.top} />
            <View style={styles.scanningRow}>
              <View style={styles.scanningLeft} />
              <View style={styles.scanningBox}>
                <View style={styles.scanningBorder}>
                  <View style={[ { borderLeftWidth: 3, borderTopWidth: 3, marginTop: -15, marginLeft: -15 }, styles.scanningHorn ]} />
                  <View style={{ flex: 1 }} />
                  <View style={[ { borderRightWidth: 3, borderTopWidth: 3, marginTop: -15, marginRight: -15 }, styles.scanningHorn ]} />
                </View>
                <View style={styles.scanningView}>
                  <Animated.Image style={[ styles.scanning, { marginTop: this.state.anim } ]} source={require('../icons/scanning.png')} />
                </View>
                <View style={styles.scanningBorder}>
                  <View style={[ { borderLeftWidth: 3, borderBottomWidth: 3, marginBottom: -15, marginLeft: -15 }, styles.scanningHorn ]} />
                  <View style={{ flex: 1 }} />
                  <View style={[ { borderRightWidth: 3, borderBottomWidth: 3, marginBottom: -15, marginRight: -15 }, styles.scanningHorn ]} />
                </View>
              </View>
              <View style={styles.scanningLeft} />
            </View>
            <View style={styles.scanningBottom}>
              <Text style={styles.textStyle}>将二维码放入框内即可扫描</Text>
              <TouchableOpacity onPress={() => { this.switchTorch() }}>
                <Text style={styles.torch}>{this.state.torch ? '关闭' : '打开'}手电筒</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RNCamera>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  all: {
    flex: 1,
    backgroundColor: "#f2f2f2",
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
  allCamera: {
    flex: 1,
    alignItems: 'center',
  },
  top: {
    width: width,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanningRow: {
    width: width,
    flexDirection: 'row',
  },
  scanningBox: {
    width: width - 120,
    height: width - 120,
  },
  scanningLeft: {
    width: 60,
    height: width - 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanningView: {
    width: width - 120,
    height: width - 120,
    margin: -5,
    borderWidth: 1,
    borderColor: "#1e9ed1",
    alignSelf: "center"
  },
  scanning: {
    width: width - 120,
    height: (width - 120) * 36 / 1022,
  },
  scanningBorder: {
    flexDirection: 'row',
  },
  scanningHorn: {
    width: 20,
    height: 20,
    borderColor: "#1e9ed1",
    zIndex: 999,
  },
  scanningBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: width,
    alignItems: 'center'
  },
  textStyle: {
    color: '#fff',
    fontSize: 15,
    marginTop: 30,
  },
  torch: {
    color: '#1e9ed1',
    marginTop: 130,
    fontSize: 15,
    borderColor: "#1e9ed1",
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 2,
  },
});
