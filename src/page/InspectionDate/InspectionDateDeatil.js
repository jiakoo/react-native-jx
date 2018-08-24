import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  WebView,
  Dimensions,
  BackHandler,
  ToastAndroid,
  ScrollView ,
  PixelRatio,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native';

var {height,width} =  Dimensions.get('window');

import ScrollableTabView, {DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view'
import Icon from "react-native-vector-icons/Ionicons"

import {dataList,dataCreate} from '../../api/Allapi'
import  Panel from '../../utils/Panel'
import Storage from '../../utils/Storage'
import  json  from  '../../page/From/data'

class RenderItem extends Component{
    constructor(props){
        super(props)
        this.state= {
            subject:{
                isConfirm:false,
                isVerify:false,
                isFill:false
            }
        }
    }
    render(){

            var data  = this.props.data;
            var navigation = this.props.navigation;
            var status = this.props.status;
            var statusName = (status,prevStatus,prevOperation) =>{
                    var statusName;
                    switch(status){
                        case 0: 
                            if(prevStatus == 1){                               
                                if(prevOperation==0){
                                    //0 // statusName = '未通过';
                                    statusName = require('../../img/unpass.png')   

                                }else if(prevOperation== -1){
                                     //撤销 -1 显示是保存
                                    statusName = require('../../img/save.png') 
                                }
                                break;
                            }else if(prevStatus == 2){
                                // statusName = '驳回';
                                statusName = require('../../img/reject.png') 
                                break;
                            }else if(prevStatus == 0){
                                // statusName = '已保存';
                                statusName = require('../../img/save.png') 
                                break;
                            };
                        break;    
                        case 1:
                        // statusName = '待审核';
                        statusName = require('../../img/pend.png') 
                        break;
                        case 2:
                        // statusName = '已通过';
                        statusName = require('../../img/pass.png') 
                        break;
                        case 3:
                         // statusName = '已归档';
                        statusName = require('../../img/file.png') 
                        break;
                        default:
                        // statusName = '未填写';
                        statusName = require('../../img/unfilled.png') 
                    }
                    return statusName;
            }
            
            var entered = data.entered,
                tables = data.tables;

            for( key in entered){
                tables.map(item =>{
                    item.list.map((item,index,self)=>{
                        if ( item.code == key ){
                            item.id = entered[key].id;
                            item.status = entered[key].status;
                            item.prevStatus = entered[key].prevStatus;
                            item.prevOperation = entered[key].prevOperation;
                        }
                    })
                })
            }

            var newJson = {
                 a:JSON.parse(JSON.stringify(tables)),
                 b:JSON.parse(JSON.stringify(tables)),
                 c:JSON.parse(JSON.stringify(tables)),
            }

            newJson.a.map(item=>{
                for(var i =0;i<item.list.length;i++){
                    if(item.list[i].status==1 ||item.list[i].status==2 ||item.list[i].status==3){
                        item.list.splice(i, 1)
                        i--;
                    }
                }
            })

            newJson.b.map(item=>{
                for(var i =0;i<item.list.length;i++){
                    if(item.list[i].status==0 ||item.list[i].status==2 || item.list[i].status==3 || typeof(item.list[i].status) == 'undefined' ){
                        item.list.splice(i, 1)
                        i--;
                    }
                }
            })

            newJson.c.map(item=>{
                for(var i =0;i<item.list.length;i++){
                    for(var i =0;i<item.list.length;i++){
                        if(item.list[i].status==0 ||item.list[i].status==1 || typeof(item.list[i].status) == 'undefined' ){
                            item.list.splice(i, 1)
                            i--;
                        }
                    }
                }
            })

            var jsondata;
            switch(status){
                case 0 :  jsondata = newJson.a; break;
                case 1 :  jsondata = newJson.b; break;
                case 2 :  jsondata = newJson.c; break;
            }

    
            var arr = [];
            jsondata.map( (item,index,self) =>{
                var  temp =  
                <View style={styles.maimBoxF} key={index}>      
                    {item.list.length>0?                     
                        <Panel title={item.group} >                           
                            {  
                                item.list.length>0?
                                item.list.map((item,index,self)=>{
                                    return(
                                        <TouchableOpacity activeOpacity={0.8} style={styles.maimBox}  key={index}  onPress={()=>{
                                            if((item.status==undefined)&&this.state.subject.isFill==true){
                                                navigation.navigate('InspectionDateFrom',{
                                                    positionId:navigation.getParam('positionId'),
                                                    code:item.code,
                                                    dataId:item.id,
                                                    status:item.status,
                                                    salt:item.id+'-'+navigation.getParam('positionId')+'-'+item.code,
                                                    saveS:navigation.getParam('positionId')+'-'+item.code
                                                })
                                            }else{
                                                if(json['table' + item.code]==undefined){
                                                    alert('暂未开放')
                                                    return;
                                                }
                                                navigation.navigate('InspectionDatePreview',{
                                                    positionId:navigation.getParam('positionId'),
                                                    code:item.code,
                                                    dataId:item.id,
                                                    status:item.status,
                                                    subject:false,
                                                    salt:item.id+'-'+navigation.getParam('positionId')+'-'+item.code,
                                                    saveS:navigation.getParam('positionId')+'-'+item.code
                                                })
                                            }
           
                                        }}
                                        >
                                            <Text style={styles.maimBoxTitle} numberOfLines={2} >{item.name}</Text>
                                            {/* <Text style={styles.maimBoxState} numberOfLines={1} >{statusName(item.status,item.prevStatus)}</Text> */}
                                            <Image style={styles.maimBoxState}  source={statusName(item.status,item.prevStatus,item.prevOperation)}/>
                                        </TouchableOpacity>
                                    )
                                })
                                :null  
                            }
                        </Panel> 
                    :null }  
                  {/*<View style={styles.hold} >
                        <Text>暂无数据</Text>  
                    </View>*/}
                </View>;
                arr.push(temp);
            })
                  
            return (
                <ScrollView style={styles.main} >
                    {arr}
                </ScrollView> 
            )
    }

    componentDidMount(){
        Storage.get('subject')
        .then(data=>{
            if(data!=null){
                this.setState({
                    subject:data
                })
            }
        })
    }

}

export default class InspectionDateDeatil extends Component{
    constructor(props) {
        super(props);
        this.state = {
            chatShow:true,
            delayShowScrollableTabView:false,
            marginLeft:(width/3-82)/2,
            index:0,
            data :{

                tables:[
                    {
                        'group':'仰拱',
                        'code':'1',
                        'list':[
                            // {'name':'模板验收批质量验收记录','code':'1_1'},
                            // {'name':'钢筋验收质量表','code':'1_2'}
                        ]
                    },
                    {
                        'group':'仰拱填充',
                        'code':'2',
                        'list':[
                            // {'name':'模板验收批质量验收记录','code':'2_1'},
                            // {'name':'钢筋验收质量表111','code':'2_2'},
                            // {'name':'钢筋验收质量表222','code':'2_3'},
                            // {'name':'钢筋验收质量表333','code':'2_4'}
                        ]
                    }
                ],
                entered:{
                    // '1_1':{status:0,prevStatus:0},
                    // '2_1':{status:1,prevStatus:2},
                    // '2_2':{status:2,prevStatus:2},
                    // '2_3':{status:0,prevStatus:-1},
                    // '2_4':{status:0,prevStatus:2}
                }
           
            }
        };
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '检验详细'),
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
        };
    };

    // 组件加载完成


    ReqFn =(data) =>{
        data = data || ''
        var positionId = this.props.navigation.getParam('positionId')
        let fromdata = new FormData();
        fromdata.append('positionId', positionId);
        fromdata.append('vtoken',data)

        fetch(dataList,
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
            var json = responseJson["data"];
            // console.warn(json);
            this.setState({
                data:json,
            })
        })
    }

    componentDidMount() {

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

        this.timer = setTimeout(()=> {
            this.setState({
                chatShow: true,
                delayShowScrollableTabView:true,
            });
        }, 0)
    }
    componentWillUnmount() {
        clearTimeout(this.timer)
        this.willFocusSubscription.remove()
    }
    onChangeTab=()=>{
        if(this.state.index >=2){
            this.setState({
                marginLeft:0
            });
        }
        this.setState((prevState, props) => ({
            index: prevState.index+1
          }));
    }

    render(){
            return(
                <View  style={styles.container} >   
                            {this.state.delayShowScrollableTabView?
                            <ScrollableTabView
                                style={{marginTop: 0,flex:1,}}
                                initialPage={0}
                                locked={true}
                                tabBarBackgroundColor='#4584F7'
                                tabBarActiveTextColor='#fff'
                                tabBarInactiveTextColor='#fff'
                                tabBarUnderlineStyle={{
                                    backgroundColor: '#fff',
                                    marginLeft:this.state.marginLeft,
                                    width:82,
                                    height:2
                                }}
                                renderTabBar={() => <ScrollableTabBar/>}
                                onChangeTab={()=>{this.onChangeTab()}}                   
                            >
                                <View tabLabel='未提交' style={[styles.container]}>                                     
                                    <RenderItem  data={this.state.data} navigation={this.props.navigation} status={0} />
                                </View>
                                <View tabLabel='待审批' style={styles.container}>
                                    <RenderItem  data={this.state.data}  navigation={this.props.navigation} status={1}/>
                                </View>
                                
                                <View tabLabel='已审批' style={styles.container}>
                                     <RenderItem  data={this.state.data} navigation={this.props.navigation} status={2} />
                                </View>
                                
                            </ScrollableTabView>                 
                            :<View  style={styles.container} ><Text>加载中...</Text></View>
                            } 
                </View>
        )
 
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    main:{
        width:width
    },
    maimBox:{
        borderColor:'#DDD',
        borderBottomWidth:1/PixelRatio.get(),
        width:width-20,
        backgroundColor:'#fff'
    },
    hold:{
        marginLeft:5,
    },
    maimBoxTitle:{
        fontSize:14,
        color:'#333',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10
    },
    maimBoxState:{
        alignSelf:'flex-end',
    }
  });
  

