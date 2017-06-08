/**
 * Created by Vector on 17/4/19.公司列表 地图后面那个首页的一部分
 */
import React from 'react';
import { View,Text,Image,NavigatorIOS,StyleSheet,TouchableHighlight,ListView,AsyncStorage,StatusBar, TextInput,
    TouchableOpacity,} from 'react-native';
import Dimensions from 'Dimensions';

var {width, height} = Dimensions.get('window');
import Branch from './branch';

export default class CompanyList extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource:ds.cloneWithRows([{
                companyName: '西安雁塔公司',
                heatStation: '23',
                heatArea: '10000',
                heatEnergy: '111111',
            },
                {
                    companyName: '西安雁塔公司',
                    heatStation: '23',
                    heatArea: '10000',
                    heatEnergy: '111111',
                },
                {
                    companyName: '西安雁塔公司',
                    heatStation: '23',
                    heatArea: '10000',
                    heatEnergy: '111111',
                }
            ]),

            access_token: null,
            company_id: null,
            refresh_token: null,
            url: "http://121.42.253.149:18816/v1_0_0/list?access_token="
        };
        var _this = this;

        // 从本地存储中将company_id和access_token取出

        AsyncStorage.getItem("access_token",function(errs,result){
            if (!errs) {
                _this.setState({access_token:result});
            }
            _this.setState({
                url: _this.state.url+_this.state.access_token+"&tag_id=[1,2,3,4]",
            })
            console.log(_this.state.url);
        });

        AsyncStorage.getItem("company_id",function(errs,result){
            if (!errs) {
                _this.setState({company_id:result});
            }
            _this.setState({
                url: _this.state.url+"&company_id="+_this.state.company_id+"&isStaticInfomation=true&level=0",
            })
            console.log(_this.state.url);

            if (!errs) {
                fetch(_this.state.url)
                    .then((response) => response.json())
                    .then((responseJson) => {

                        console.log(responseJson);

                        _this.setState({
                            dataSource:ds.cloneWithRows(responseJson),
                        });

                        console.log(_this.state.dataSource);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
              }
        });
    }


    gotoBranch(id){
        this.props.navigator.push({
            component: Branch,
            passProps:{
                company_id: id,
            }
        })
    }

    render() {
        return (
            <View style={styles.all}>
                <StatusBar
                    barStyle = 'default' //设置状态栏文字效果,仅支持iOS,枚举类型:default黑light-content白
                    networkActivityIndicatorVisible = {true} //设置状态栏上面的网络进度菊花,仅支持iOS
                    showHideTransition = 'slide' //显隐时的动画效果.默认fade
                />

                <ListView
                    dataSource={this.state.dataSource}
                    contentContainerStyle={styles.listView}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    renderRow={(rowData) => {
                return(

                    <TouchableOpacity activeOpacity={0.5} onPress={this.gotoBranch.bind(this,rowData.id)}>
                        <View style={styles.textAll}>
                            <Text style={styles.listItemText1}>{rowData.name}</Text>
                            <Text style={styles.listItemText2}>换热站:{rowData.station_count} 面积:{rowData.heating_area}</Text>
                            <Text style={styles.listItemText2}>能耗:{rowData.real_data_value}</Text>
                        </View>
                    </TouchableOpacity>
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
    },
    listView:{
        // 主轴方向
        flexDirection:'row',
        // 一行显示不下,换一行
        flexWrap:'wrap',
        //horizontal :true,
        // 侧轴方向
        alignItems:'flex-start', // 必须设置,否则换行不起作用

        // justifyContent: 'flex-start',
    },

    listItemImage:{
        overlayColor:"#e9e9e9"
    },
    textAll: {
        // flex: 1,
        width: (width-30)/2,
        height:70,
        backgroundColor:'#5d5d61',
        marginLeft: 10,
        borderRadius: 5,
        paddingTop:10,
        marginTop:10,
    },
    listItemText1:{
        fontSize:16,
        textAlign: 'left',
        fontWeight :"300",
        marginLeft: 5,
        color: '#ffffff',


    },
    listItemText2:{
        color:"#ffffff",
        fontSize:13,
        textAlign: 'left',
        marginLeft: 5,
        marginTop: 3,
    },
    textInput:{
        flex:1,
        marginLeft:10,
    },
});
