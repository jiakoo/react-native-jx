import React, { Component } from 'react';
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
  DeviceEventEmitter,
  Alert
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import Storage from '../../utils/Storage';
import {DoubleUrl,notice} from '../../api/Allapi'
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'
import formatTime from '../../utils/formatTime'

export default class Message extends Component{

    constructor(props){
        super(props)
        this.state ={
            data:[
                {
                    title:'待办',
                    time:'2018/08/08 13:05',
                    content:'暂无消息',
                    num:0,
                },
                {
                    title:'提醒',
                    time:'2018/08/08 13:05',
                    content:'暂无消息',
                    num:0,
                },
                {
                    title:'预警',
                    time:'2018/08/08 13:05',
                    content:'暂无消息',
                    num:0,
                },
                {
                    title:'系统消息',
                    time:'2018/08/08 13:05',
                    content:'暂无消息',
                    num:0,
                }
            ],
            refreshing:false,
            AvatarNum:0,
            verifyDatas:[],    
            subject:{}    
        }
        navigation = this.props.navigation
        this.willFocusNum=0
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '消息'),
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
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
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

    renderItem = ({item,index})=>{   
        var url
        switch(index){
            case 0 : url = require('../../img/m1.png');break;
            case 1 : url = require('../../img/m2.png');break;
            case 2 : url = require('../../img/m3.png');break;
            case 3 : url = require('../../img/m4.png');break;
        }
  
         
        return(
            <TouchableOpacity activeOpacity={0.9}  style={styles.message} onPress={()=>{
                   if(item.num == 0){ Alert.alert('','暂无内容'); return false;} 
                    navigation.navigate('TodoList',{
                        title:'待办',
                    })
            }}
            >
                <View style={styles.messageLeft} >
                    <View style={styles.messageLeftBox}>
                        <Image style={styles.messageLeftImg} resizeMethod="auto" source={url}/>
                    </View>
                    {item.num>0?  
                        <View style={styles.Badge}>
                            <Text style={styles.BadgeText}>{item.num}</Text>
                        </View>
                        : null
                     }
                </View>
                <View style={styles.messageRight} >
                        <View style={styles.messageRightTop}>
                            <Text style={styles.messageRightTopL}>{item.title}</Text>
                            <Text style={styles.messageRightTopR}>{item.time}</Text>
                        </View>
                        <Text style={styles.messageRB} numberOfLines={1}>{item.content}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    keyExtractor = (item,index) =>  item + index

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
            this.setState({
                refreshing: false,
            });
        }, 1500);
    }

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
    }


    /**
     * 加载数据
     */

     componentDidMount(){
        this.connect();
        this.notice();
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',()=>{
                if(this.willFocusNum>0){
                    this.notice();
                }     
                this.willFocusNum++         
            }
        )
        Storage.get('subject').then((data)=>{
            if(data!=null){
                // console.warn(data)
                this.setState({
                    subject:data
                })
            }
        })
     }
     componentWillUnmount(){
        this.willFocusSubscription.remove()
     }

     /**
      * 待办事项
      */
     notice=()=>{
        Storage.get('vtoken').then((data)=>{
            let formdata =  new FormData()
            formdata.append('vtoken'.data)
            fetch(notice,{
                method:'POST',
                body:formdata,
                headers:{
                    'Content-Type':'multipart/form-data',
                },
            })
            .then((response) =>{
                if(response.headers.get('vtoken')!=null){
                    var vtoken = response.headers.get('vtoken')
                    Storage.save('vtoken',vtoken)
                }
                return response.json()
            })
            .then((response)=>{

                var verifyDatas = response.data.verifyDatas;
                var AvatarNum  = verifyDatas.length;
                var noticeNum = this.state.data;

                verifyDatas.sort((a,b)=>{
                    return  this.TimeStamp(b.prevOperateTime) -  this.TimeStamp(a.prevOperateTime) 
                })
                noticeNum[0].num = AvatarNum;
                noticeNum[0].content = '您有'+ AvatarNum + '条待办需处理';
                noticeNum[0].time = this.TimeChange(verifyDatas[0].prevOperateTime)
                this.setState({
                    verifyDatas:verifyDatas,
                    AvatarNum:AvatarNum,
                    data:noticeNum,
                })

                DeviceEventEmitter.emit('dataChange',AvatarNum)
            })
        })

     }


     /**
      * webSocket 链接
      */
     connect() {
        this.stompClient = Stomp.over(new SockJS(DoubleUrl));
        this.stompClient.connect('','', (frame) => {
            this.stompClient.subscribe('/monitor/verify', (response) => {
                const message = JSON.parse(response.body);
                // console.warn(message)
                // var id = message.id;
                // var arr= this.state.verifyDatas

                var arr = this.state.verifyDatas;
                message.map((item,index)=>{
                    var id = item.id;         
                    isInArray =(arr,value) =>{
                        for(var i = 0; i < arr.length; i++){
                            if(value === arr[i].id){
                                return true;
                            }
                        }
                        return false;
                    }

                    var flag = isInArray(arr,id)
                    if(flag){
                        for(var i= 0; i<arr.length;i++){
                            if(arr[i].id == id){
                                arr.splice(i, 1)
                                i--;
                            }
                        }
                    }else{               
                        arr.unshift(item)
                    }       
        
                })
                this.setState({
                    verifyDatas:arr
                })       
                var AvatarNum = arr.length
                if(!(this.state.subject.isFill&&this.state.subject.isVerify) || !(this.state.subject.isVerify&&this.state.subject.isConfirm)){
                    DeviceEventEmitter.emit('dataChange',AvatarNum)  
                }  
            })
            
        },(err)=>{
            console.warn(err)
        });
      }
      /**
      * webSocket 停止连接
      */
      disconnect() {
        if (!!this.stompClient) this.stompClient.disconnect();
      }

      /**
       *  转化时间戳
       */
      TimeStamp=(data)=>{
         return new Date((data).replace(new RegExp("-","gm"),"/")).getTime()
        
      }
      TimeChange=(data)=>{
        return data.substring(0,data.length-3).replace(new RegExp("-","gm"),"/")
      }

}

const styles = StyleSheet.create({
    container: {
      flex:1,
      justifyContent: 'flex-start',
      alignItems: 'center',   
      backgroundColor:'#fff',
    },
    message:{
        marginLeft:10,
        marginRight:10,
        width:width-20,
        borderBottomWidth:1/PixelRatio.get(),
        borderColor:'#DBDBDB',
        flexDirection:'row',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:5,
        paddingRight:5,
    },
    messageLeft:{
    },
    messageLeftBox:{
        width:50,
        height:50,
        // borderRadius:50,
        // overflow:'hidden',
    },
    messageLeftImg:{
        width:50,
        height:50,
    },
    messageRight:{
        flex:1,
        paddingLeft:8,
    },
    messageRightTop:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',  
        // paddingTop:3, 
        paddingBottom:5
    },
    messageRightTopL:{
        fontSize:16,
        color:'#333',
    },
    messageRB:{
        color:'#999',
        fontSize:13,
    },
    Badge:{
        position:'absolute',
        left:35,
        top:-6,
        minWidth:18,
        height:18,
        borderRadius:10,
        backgroundColor:'red',
    },
    BadgeText:{
        color:'#fff',  
        // minWidth:18,
        paddingLeft:5,
        paddingRight:5,
        textAlign:'center',
        lineHeight:18
    }
  });
  