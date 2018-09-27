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
  ProgressBarAndroid,
  DeviceEventEmitter
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import Icon from "react-native-vector-icons/Ionicons"
import Storage from '../../utils/Storage';
import {DoubleUrl,notice} from '../../api/Allapi'

export default class TodoList extends Component{

    constructor(props){
        super(props)
        this.state ={
            data:[],
            refreshing:false,
            verifyDatas:[
 
            ],
            AvatarNum:0,
            maxHeight:0,
            minHeight:0
        }
        navigation = this.props.navigation
    }

    /**
     *  标题
     */


    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '待办'),
          headerStyle: {
            backgroundColor: '#4788FF',
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
            <TouchableOpacity  onPress={()=>{
                if(navigation.getParam('verifyDatas')){
                    navigation.navigate('TodoDetail',{
                        transition: 'forVertical',
                        verifyDatas:navigation.getParam('verifyDatas'),
                    })
                }else{
                    alert('暂无')
                    return;
                }
             }}>
                <Text style={{color:'#fff',padding:10}}>全部处理</Text>                
            </TouchableOpacity>
          ),
        //   headerLeft:(
        //       <View/>
        //   )
        };
    };


    render(){
        return(
            <View style={styles.container} onLayout={(event) =>{this.setState({minHeight:event.nativeEvent.layout.height})}}>
                <FlatList 
                    data={this.state.verifyDatas}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this.keyExtractor}
                    //列表为空
                    // ListEmptyComponent={this.ListEmptyComponent}
                    /**
                     *  头尾布局
                     */
                    // ListHeaderComponent={this.header}
                    ListFooterComponent={this.footer}
                    // initialNumToRender={0}
                    //下拉刷新，必须设置refreshing状态
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    //上拉加载
                    onEndReachedThreshold={0.1}
                    onEndReached={()=>{this.onEndReached()}}
              
                 />
                 {/* <View style={[styles.layout,{backgroundColor:'#0000004a',width:width}]}><Text style={{fontSize:26,color:'#fff'}}>开发中</Text></View> */}
            </View>
        )
    }

    renderItem({item,index}){  

        TimeChange=(data)=>{
            return data.substring(0,data.length-3).replace(new RegExp("-","gm"),"/")
        }
        var color = 'gray';
        var maxHeight = this.state.maxHeight ;
        var statusName='';
        switch(item.status){
            case 0: 
                if(item.prevStatus == 1){                               
                    if(item.prevOperation==0){
                        //0 // statusName = '未通过';
                        statusName = '未通过'  
                        color = 'red'

                    }else if(item.prevOperation== -1){
                         //撤销 -1 显示是保存
                        statusName = '保存'
                        color = 'blue'
                    }
                    break;
                }else if(item.prevStatus == 2){
                    // statusName = '驳回';
                    statusName='驳回'
                    color='red'
                    break;
                }else if(item.prevStatus == 0){
                    // statusName = '已保存';
                    statusName='保存'
                    color = 'blue'
                    break;
                };
            break;    
            case 1:
            // statusName = '待审核';
            statusName='待审核'
            color='yellow'
            break;
            case 2:
            // statusName = '已通过';
            statusName='已通过'
            color = 'green'
            break;
        }



        return(
            <TouchableOpacity  activeOpacity={0.65}  style={[styles.box, index==0&&styles.box0]} onPress={()=>{navigation.navigate('InspectionDatePreview',{
                    positionId:item.positionId,
                    code:item.code,
                    dataId:item.id,
                    status:item.status,
                    salt:item.id+'-'+item.positionId+'-'+item.code,
                    saveS:item.positionId+'-'+item.code,
                    title:'待办详细'
            })}}
            >

                <Icon name={'ios-list-box'} size={20} style={{color:'#4788FF'}}/>
                <View style ={styles.right}  onLayout={(event) =>{maxHeight+=event.nativeEvent.layout.height;this.setState({maxHeight})}}>
                    <Text style={styles.boxTitle} numberOfLines={2} >{item.name}</Text>
                    <Text style={[styles.boxStatus,styles[color]]} >{statusName}</Text>
                    <View style={styles.boxBody}>
                        <Text style={styles.gray} numberOfLines={1} >{item.positionName}</Text>
                        <Text style={styles.gray} numberOfLines={1} >{TimeChange(item.prevOperateTime)}</Text>
                    </View>
                </View>

            </TouchableOpacity>
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
        if(this.state.verifyDatas.length != 0&&this.state.maxHeight>this.state.minHeight-80){
            return (
                <Text style={{
                    // marginTop: 10,
                    // backgroundColor: '#F2F2F2',
                    color: '#666',
                    fontSize: 12,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    height: 30,
                }}>--我是底线--</Text>
            )
        }else{
            return null
        }
    };
    /**
     * 列表为空
     */
    ListEmptyComponent = () =>{
        return (
            <Text style={{
                color: '#666',
                fontSize: 12,
                textAlign: 'center',
                height: 30,
            }}>暂无数据</Text>
        )
    }
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
            this.notice();
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
     */
    notice=()=>{
        Storage.get('vtoken').then((data)=>{
            let formdata =  new FormData()
            formdata.append('vtoken',data)
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

                verifyDatas.sort((a,b)=>{
                    return  this.TimeStamp(b.prevOperateTime) -  this.TimeStamp(a.prevOperateTime) 
                })

                // console.warn(verifyDatas)

                this.setState({
                    verifyDatas:verifyDatas,
                    AvatarNum:AvatarNum,
                })
                this.props.navigation.setParams({verifyDatas: verifyDatas})
                // DeviceEventEmitter.emit('dataChange',AvatarNum)
            })
        })

     }
     
     TimeStamp=(data)=>{
        return new Date((data).replace(new RegExp("-","gm"),"/")).getTime()
     }
     componentDidMount(){
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',()=>{
                this.notice();     
            }
        )
     }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    //   justifyContent: 'flex-start',
    //   alignItems: 'flex-start',   
      justifyContent: 'center',
      alignItems: 'center', 
      backgroundColor:'#fff',
    },
    box:{
        width:width-10,
        marginLeft:10,
        paddingTop:10,
        paddingBottom:10,
        paddingRight:10,
        borderBottomWidth:1/PixelRatio.get(),
        borderColor:'#DBDBDB',
        flexDirection:'row',
    },
    box0:{
        marginTop:5
    },
    right:{
        flex:1,
        marginLeft:5
    },
    boxTitle:{
        color:'#333',
        fontSize:16,
    },
    boxStatus:{
        marginTop:6,
        fontSize:13,
        marginTop:6,
    },
    boxBody:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:6,
    },
    gray:{
        color:'#666666',
        fontSize:13,
    },
    layout:{
        position: 'absolute',
        zIndex:999,
        backgroundColor:'#fff',
        width:width,
        height:height,
        justifyContent:'center',
        alignItems:'center'
    },
    red:{
        color:'#FE7257'
    },
    blue:{
        color:'#4788FF'
    },
    green:{
        color:'#19C147'
    },
    yellow:{
        color:'#FFB71C'
    }
  });
  