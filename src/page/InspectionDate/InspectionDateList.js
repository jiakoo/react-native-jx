import React, { Component  } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  PixelRatio,
  FlatList,
  ToastAndroid,
  ProgressBarAndroid,
  DeviceEventEmitter
} from 'react-native';

import {PostionList} from '../../api/Allapi';
import Storage from '../../utils/Storage'
import Chart from '../Componet/Chart'


var IsAndroid = Platform.OS == 'android';
var {height,width} =  Dimensions.get('window');


export default class InspectionDateList extends Component {

    constructor(props){
        super(props)
        this.state ={
            data:{
                statusCode:200,
                messgae:'',
                data:{
                    positions:[
                        // {id:1,name:'DK52+100~DK52+200',verified:0},
                        // {id:1,name:'DK52+100~DK52+200',verified:6},
                        // {id:1,name:'DK52+100~DK52+200',verified:20},
                        // {id:1,name:'DK52+100~DK52+200',verified:5},
                        // {id:1,name:'DK52+100~DK52+200',verified:15},
                        // {id:1,name:'DK52+100~DK52+200',verified:30},
                        // {id:1,name:'DK52+100~DK52+200',verified:0},
                        // {id:1,name:'DK52+100~DK52+200',verified:6},
                        // {id:1,name:'DK52+100~DK52+200',verified:20},
                        // {id:1,name:'DK52+100~DK52+200',verified:5},
                        // {id:1,name:'DK52+100~DK52+200',verified:15},
                        // {id:1,name:'DK52+100~DK52+200',verified:30},
                        // {id:1,name:'DK52+100~DK52+200',verified:0},
                        // {id:1,name:'DK52+100~DK52+200',verified:6},
                        // {id:1,name:'DK52+100~DK52+200',verified:20},
                        // {id:1,name:'DK52+100~DK52+200',verified:5},
                        // {id:1,name:'DK52+100~DK52+200',verified:15},
                        // {id:1,name:'DK52+100~DK52+200',verified:30},
                        // {id:1,name:'DK52+100~DK52+200',verified:0},
                        // {id:1,name:'DK52+100~DK52+200',verified:6},
                        // {id:1,name:'DK52+100~DK52+200',verified:20},
                        // {id:1,name:'DK52+100~DK52+200',verified:5},
                        // {id:1,name:'DK52+100~DK52+200',verified:15},
                        // {id:1,name:'DK52+100~DK52+200',verified:30},
                    ],
                    total:30
                },
            },
            refreshing:false,
        }
        navigation = this.props.navigation
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '检验数据'),
          headerStyle: {
            backgroundColor: '#4584F7',
            height:50,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '400',
            flex: 1,
            textAlign: 'center',
            fontSize:18,
          },
          headerRight:(
                <View/>
          ),
          headerLeft:(
              <View/>
          )
        };
    };


    render(){
        return(       
            <View style={styles.container}>        
                <FlatList 
                    data={this.state.data.data.positions}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this.keyExtractor}
                    // numColumns={2}
                    /**
                     *  头尾布局
                     */                   
                    ListHeaderComponent={<Chart/>}
                    // ListFooterComponent={this.footer}
                    // initialNumToRender={0}

                    //下拉刷新，必须设置refreshing状态
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}

                    //上拉加载
                    onEndReachedThreshold={0.1}
                    onEndReached={()=>{this.onEndReached()}}
                 />
            </View>
        )
    }

    renderItem({item,index}){   
        var total = this.state.data.data.total;
        var divisor = item.verified/total;
        var percentage = (divisor.toFixed(2)*100).toFixed(0)
        var score = item.verified +' / '+ total ;
        var progress;
        var background;
        // var num = index % 3
        // switch(num){
        //     case 0 : background ='#FE7257';break;
        //     case 1 : background = '#19C147';break;
        //     case 2 : background = '#4788FF';break;
        // }
        if( item.verified < 15 ){
            background ='#FE7257';
        }else{
            background = '#19C147'
        }

        if(IsAndroid){
            item.verified<15?
                 progress = <ProgressBarAndroid color='red' styleAttr='Horizontal' progress={parseFloat(divisor)} indeterminate={false} style={{marginTop:0}} />
                 :progress = <ProgressBarAndroid color='green' styleAttr='Horizontal' progress={parseFloat(divisor)} indeterminate={false} style={{marginTop:0}} />
        }else{
            item.verified<15?
                progress = <ProgressViewIOS style={styles.progressView} progressTintColor='red' trackTintColor='gray' progress={parseFloat(divisor)} style={{marginTop:0}} />
                :progress = <ProgressViewIOS style={styles.progressView} progressTintColor='green' trackTintColor='gray' progress={parseFloat(divisor)} style={{marginTop:0}} />
        }
                {/* (index==0||index==1)&&styles.box0, index%2!=0&&styles.box1*/}

            return(         
                    <ImageBackground  source={require('../../img/Ipbg.png')} style={{width:width,alignSelf:'center',marginTop:5}} resizeMode="cover"  >
                        <TouchableOpacity activeOpacity={0.9}  style={[styles.box]} onPress={()=>{navigation.navigate('InspectionDateDeatil',{
                            positionId:item.id,
                            title:item.name,
                        })}}
                        >
                            <View style={styles.left}>
                                <View style={styles.leftTop}>
                                    <Text style={[styles.white,{backgroundColor:background}]}>共{total}条</Text>
                                </View>
                                <View style={styles.leftBottom}>
                                    <Text style={styles.leftBottomL}>{percentage}</Text>
                                    <Text style={styles.leftBottomR}>%</Text>
                                </View>
                            </View>
                            <View style={styles.right}>
                                <Text style={styles.rightTitle} numberOfLines={2} >{item.name}</Text>
                                <Text style={styles.rightBody} numberOfLines={1} >{score}</Text>
                                {/*低于50%用红色，高于50%用绿色*/}
                                {progress}
                            </View>                 
                        </TouchableOpacity>
                    </ImageBackground>
            )
    }


    keyExtractor = (item,index) =>  item + index

    /**
     * 头布局
     */
    header = () => {
        return (
            <Text style={{
                backgroundColor: '#4398ff',
                color: 'white',
                fontSize: 18,
                textAlign: 'center',
                textAlignVertical: 'center',
                height: 30,
            }}>我是头布局</Text>
        )
    };
    /**
     * 尾布局
     */
    footer = () => {
        return (
            <Text style={{
                marginTop: 10,
                backgroundColor: '#EB3695',
                color: 'white',
                fontSize: 18,
                textAlign: 'center',
                textAlignVertical: 'center',
                height: 150,
            }}>我是尾布局</Text>
        )
    };

    /**
     * 下拉属性
     */
    count = 0;
    onRefresh = () => {
        //设置刷新状态为正在刷新
        this.setState({
            refreshing: true,
        });
        //延时加载
        const timer = setTimeout(() => {
            clearTimeout(timer);
            //往数组的第一位插入数据，模拟数据新增 , unshift()会返回数组的长度
            // this.state.data.unshift(
            //     {
            //         name:'加载成功',
            //         creation:this.count,
            //     }
            //  );
            //  this.count++;
            Storage.get('vtoken').then(data=>{
                if(data!=null){
                    this.ReqFn(data)
                }else{
                    this.ReqFn()
                }
            })
            
            this.setState({
                refreshing: false,
            });
        }, 500);
    };

    /**
     * 上拉加载
     */
    onEndReached = () => {
        if(false){
            ToastAndroid.show('正在加载中...', ToastAndroid.SHORT,ToastAndroid.CENTER);
        }
            //  this.state.data.push(
            //     {
            //         name:'加载成功',
            //         creation:this.count,
            //     }
            //  );
            //  this.count++;
    };

    /**
     * 加载数据
     * 
     */

    ReqFn =(data)=>{

        data = data || ''
        let fromdata = new FormData()
        fromdata.append('vtoken',data)

        fetch(PostionList,
            {
                method:'POST',
                body:fromdata,
                headers:{
                    'Content-Type':'multipart/form-data',
                }
            }
        )
        .then((response) => {
            // console.warn(response.headers.get('vtoken')) 
            if(response.headers.get('vtoken')!=null){
                var vtoken = response.headers.get('vtoken')
                Storage.save('vtoken',vtoken)
            }
            return response.json()
        })
        .then((responseJson) => {
            // console.warn(responseJson)
            if(responseJson.statusCode == 301){
                var next =  responseJson.data.next,
                factor = responseJson.data.factor,
                ssid = responseJson.data.ssid;
                navigation.navigate('Login',{
                    factor:factor,
                    ssid:ssid
                })   
            }
            var json = responseJson;
            this.setState({
                data:json,
            })
            DeviceEventEmitter.emit('chart',json)
        })

    }



     componentDidMount(){
         this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',()=>{
                Storage.get('vtoken').then(data=>{
                    if(data!=null){
                        this.ReqFn(data)
                    }else{
                        this.ReqFn()
                    }
                })
            }
        )

    }
    componentWillUnmount(){
        this.willFocusSubscription.remove()
    }

}

const styles = StyleSheet.create({
    container: {
      flex:1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',   
    //   flexDirection:'row',
      backgroundColor:'#4584F7',
    },
    box:{
        width:width-20,
        marginLeft:10,
        marginRight:10,
        padding:10,
        flexDirection:'row',
    },
    left:{
        width:80,
        height:80,
        backgroundColor:'#F0F4FC',
        alignSelf:'center',
        marginRight:10,
        justifyContent:'center',
        alignItems:'center',
    },
    leftTop:{
        borderRadius:15,
        width:48,
        alignSelf:'center',
        marginBottom:8,
    },
    leftBottom:{
        flexDirection:'row',
    },
    leftBottomL:{
        fontSize:26,
        color:'#FE7257',
    },
    leftBottomR:{
        fontSize:13,
        color:'#666666',
    },
    right:{
        flex:1,
        paddingRight:10,
        justifyContent:'center',
    },
    rightTitle:{
        color:'#000',
        fontSize:16,
        marginBottom:8
    },
    rightBody:{
        flexDirection:'row',
        justifyContent:'space-between',
        fontSize:12,
        color:'#666'
    },
    white:{
        color:'#fff',
        textAlign:'center',
        fontSize:10,
        borderRadius:15,
    }
  });
  