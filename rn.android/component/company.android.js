/**
 * Created by Vector on 17/4/19.
 */
import React from 'react';
import { View,Text,Image,NavigatorIOS,StyleSheet,TouchableHighlight,ListView,AsyncStorage,StatusBar, TextInput,
    TouchableOpacity,} from 'react-native';
import Dimensions from 'Dimensions';

var {width, height} = Dimensions.get('window');
import Branch from './branch.android';

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
        };
        var _this = this;
        AsyncStorage.getItem("userKey",function(errs,result){
            console.info(result);
            if (!errs) {
                fetch("http://rapapi.org/mockjsdata/16979/v1_0_0/company")
                    .then((response) => response.json())
                    .then((responseJson) => {
                        _this.setState({
                            dataSource:ds.cloneWithRows(responseJson.company_data)
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            }
        });
    }


    gotoBranch(){
        const navigator = this.props.navigator;//上一个页面传过来的值
        this.props.navigator.push({
            component: Branch,
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

                    <TouchableOpacity activeOpacity={0.5} onPress={this.gotoBranch.bind(this)}>
                        <View style={styles.textAll}>
                            <Text style={styles.listItemText1}>{rowData.company_name}</Text>
                            <Text style={styles.listItemText2}>换热站:{rowData.station_num} 供热面积:{rowData.heating_area}</Text>
                            <Text style={styles.listItemText2}>能耗:{rowData.curr_energy_data}</Text>
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
        backgroundColor:'#f2d6b8',
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
        color: '#3d3d3d',


    },
    listItemText2:{
        color:"#b57907",
        fontSize:13,
        textAlign: 'left',
        marginLeft: 5,
        marginTop: 1,
    },
    textInput:{
        flex:1,
        marginLeft:10,
    },
});

module.exports = CompanyList;