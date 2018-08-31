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
  WebView,
  Alert
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import Storage from '../../utils/Storage';
import {operateAll} from '../../api/Allapi'

export default class TodoDetail extends Component{
    constructor(props){
        super(props)
        this.state ={
            data:[],
            subject:{},
            cancelArr:[],
            submitArr:[],
            passArr:[],
            confirmArr:[],
        }
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title', '待办详细'),
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
            // headerLeft:(
            //     <TouchableOpacity  onPress={()=>{
            //         navigation.navigate('TodoList',
            //             { transition: 'forVertical'}
            //         )
            //      }}>
            //         <Text style={{color:'#fff',padding:10}}>取消</Text>                
            //     </TouchableOpacity>
            // )
          };
    };

    render(){
        return(
            <View style={styles.container}>

                {this.state.subject.isFill?
                <View style={styles.center}>
                    {/* <Text style={styles.TitleHeader}>您一共有{this.state.cancelArr.length}条待办可撤回</Text> */}
                    <Text style={styles.TitleHeader}>您一共有{this.state.submitArr.length}条待办可提交</Text>
                    <View style={styles.ButtonGroup}>
                        {/* <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonRed]} 
                            onPress={()=>{
                                this.NoDoublePress.onPress(()=>{
                                    this.operateAll(this.state.cancelArr,'cancel')
                                })
                            }}
                        >
                            <Text style={styles.ButtonRedText} >全部撤回</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonBule]}
                            onPress={()=>{
                                this.NoDoublePress.onPress(()=>{
                                    this.operateAll(this.state.submitArr,'submit')
                                })
                            }}
                        >
                            <Text  style={styles.ButtonBuleText}>全部提交</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>222</Text> */}
                </View>
                :null}
                
                {this.state.subject.isVerify?
                <View style={styles.center}>
                    <Text style={styles.TitleHeader}>您一共有{this.state.passArr.length}条待办可拒绝/同意</Text>
                    <View  style={styles.ButtonGroup}>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonRed]}
                            onPress={()=>{
                                this.NoDoublePress.onPress(()=>{
                                    this.operateAll(this.state.passArr,'unpass')
                                })
                            }}
                        >
                            <Text style={styles.ButtonRedText}>全部拒绝</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonBule]}
                            onPress={()=>{
                                this.NoDoublePress.onPress(()=>{
                                    this.operateAll(this.state.passArr,'pass')
                                })
                            }}
                        >
                            <Text style={styles.ButtonBuleText}>全部同意</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>111</Text> */}
                </View>
                :null}

                {this.state.subject.isConfirm?
                <View style={styles.center}>
                    <Text style={styles.TitleHeader}>您一共有{this.state.confirmArr.length}条待办可驳回/归档</Text>
                    <View  style={styles.ButtonGroup}>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonRed]}
                            onPress={()=>{
                                this.NoDoublePress.onPress(()=>{
                                    this.operateAll(this.state.confirmArr,'reject')
                                })
                            }}
                        >
                            <Text style={styles.ButtonRedText}>全部驳回</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonBule]}
                             onPress={()=>{
                                this.NoDoublePress.onPress(()=>{
                                    this.operateAll(this.state.confirmArr,'confirm')
                                })
                            }}
                        >
                            <Text style={styles.ButtonBuleText}>全部归档</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>111</Text> */}
                </View>
                :null}

            </View>
        )
    }

    operateAll = (ids,type) =>{
        if(ids.length == 0){
            Alert.alert('','0条可处理')
            return;
        }
        Storage.get('vtoken').then((data)=>{
           
            let formdata =  new FormData()
            formdata.append('vtoken',data)
            formdata.append('ids', JSON.stringify(ids))
            formdata.append('type',type)

            fetch(operateAll,{
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
                console.warn(response.data)
                var 
                    submitArr = this.state.submitArr,
                    submitArrLen =  this.state.submitArr.length,
                    passArrLen =  this.state.passArr.length,
                    passArr = this.state.passArr,
                    confirmArr =  this.state.confirmArr,
                    confirmArrLen =  this.state.confirmArr.length;
                    
                    response.data.success =  response.data.success.concat(response.data.overdue);

                switch(type){
                    case 'submit':                                              
                        for(var i = 0;i<submitArrLen;i++){
                            for(var j=0;j<response.data.success.length;j++){
                                if(this.state.submitArr[i] == response.data.success[j]){
                                    passArr.push(this.state.submitArr[i])/*添加到待审数组*/
                                    submitArr.splice(i, 1) /*删除可提交数组*/
                                    i--;
                                }
                            }
                        }       
                        this.setState({
                            submitArr,
                            passArr
                        })                                                        
                    break;
                    case 'pass':
                        for(var i = 0;i<passArrLen;i++){
                            for(var j=0;j<response.data.success.length;j++){
                                if(this.state.passArr[i] == response.data.success[j]){
                                    confirmArr.push(this.state.passArr[i])/*添加到可提交数组*/
                                    passArr.splice(i, 1) /*删除归档数组*/
                                    i--;
                                }
                            }
                        }       
                        this.setState({
                            confirmArr,
                            passArr
                        }) 
                    break;
                    case 'unpass':
                        for(var i = 0;i<passArrLen;i++){
                            for(var j=0;j<response.data.success.length;j++){
                                if(this.state.passArr[i] == response.data.success[j]){
                                    submitArr.push(this.state.passArr[i])/*添加到待办数组*/
                                    passArr.splice(i, 1) /*删除可提交数组*/
                                    i--;
                                }
                            }
                        }       
                        this.setState({
                            submitArr,
                            passArr
                        }) 
                    break;
                    case 'confirm':
                        for(var i = 0;i<confirmArrLen;i++){
                            for(var j=0;j<response.data.success.length;j++){
                                if(this.state.confirmArr[i] == response.data.success[j]){
                                    confirmArr.splice(i, 1) /*删除可提交数组*/
                                    i--;
                                }
                            }
                        }       
                        this.setState({
                            confirmArr,
                        }) 
                    break;
                    case 'reject':
                        for(var i = 0;i<confirmArrLen;i++){
                            for(var j=0;j<response.data.success.length;j++){
                                if(this.state.confirmArr[i] == response.data.success[j]){
                                    submitArr.push(this.state.confirmArr[i])/*添加到待办数组*/
                                    confirmArr.splice(i, 1) /*删除可提交数组*/
                                    i--;
                                }
                            }
                        }       
                        this.setState({
                            submitArr,
                            confirmArr
                        }) 
                    break;

                }

                var messageAlert = '您一共处理成功'+response.data.success.length +'条,'+'失败'+response.data.fail.length+'条'

                Alert.alert('',messageAlert)
            })
        })
    }
    
    
    /**
     * 延迟点击
     */
    NoDoublePress = {
        lastPressTime: 1,
        onPress(callback){
            let curTime = new Date().getTime();
            if (curTime - this.lastPressTime > 1000) {
                this.lastPressTime = curTime;
                callback();
            }
        },
    };
    
    /**
     * 加载数据
     */
     componentDidMount(){
        Storage.get('subject').then((data)=>{
            if(data!=null){
                // console.warn(data)
                this.setState({
                    subject:data
                })
            }
        })
        
        var verifyDatas = this.props.navigation.getParam('verifyDatas');

        var submitArr = [],
            cancelArr = [],
            passArr = [],
            confirmArr = [];

        verifyDatas.map((item)=>{
            switch(item.status){
                case 0: 
                    if(item.prevStatus == 1){                               
                        if(item.prevOperation==0){
                            //0 // statusName = '未通过';
                            submitArr.push(item.id)
                        }else if(item.prevOperation== -1){
                             //撤销 -1 显示是保存
                             submitArr.push(item.id)
                        }
                        break;
                    }else if(item.prevStatus == 2){
                        // statusName = '驳回';
                        submitArr.push(item.id)
                        break;
                    }else if(item.prevStatus == 0){
                        // statusName = '已保存';
                        submitArr.push(item.id)
                        break;
                    };
                break;    
                case 1:
                   // statusName = '撤销';
                    if(item.prevStatus == -1){ 
                        // cancelArr.push(item.id)                             
                        break;
                    }else if(item.prevStatus == 1){
                        // statusName = '审核通过';
                        passArr.push(item.id)
                        break;
                    }else if(item.prevStatus == 0){
                        // statusName = '审核不通过';
                        passArr.push(item.id)
                        break;
                    };
                case 2:
                // statusName = '已通过';
                confirmArr.push(item.id)
                break;
            }

        })

        this.setState({
            submitArr:submitArr,
            cancelArr:cancelArr,
            passArr:passArr,
            confirmArr:confirmArr
        })

     }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    center:{
        padding:10,
        marginTop:15
    },
    TitleHeader:{
        marginBottom:10,
        color:'#666'
    },
    ButtonGroup:{
        flexDirection:'row',
    },
    Button:{
        width:(width/2)-20,
        borderWidth:1/PixelRatio.get(),
        borderColor:'#ddd',
        padding:15,
        // margin:10,
        // borderRadius:10
    },
    // ButtonRed:{
    //     backgroundColor:'#FF2C03'
    // },
    // ButtonBule:{
    //     backgroundColor:'#4788FF'
    // },
    ButtonRedText:{
        color:'#FF2C03',
        textAlign:'center',
    },
    ButtonBuleText:{
        color:'#4788FF',
        textAlign:'center',
        borderLeftWidth:0,
    },
  });
  