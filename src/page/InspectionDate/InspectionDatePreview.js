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
  TextInput,
  ScrollView,
  Picker,
  Alert
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Panel from '../../utils/Panel'
import Storage from '../../utils/Storage'
import {preview,operate} from '../../api/Allapi'
import  json  from  '../../page/From/data'

class From2Input extends Component{

    constructor(props){
        super(props)

        this.salt = this.props.salt
        this.flag = this.props.flag
        this.saveS = this.props.saveS
        this.code = this.salt.split('-')[2]

        this.onChangeText=(text,name)=>{
            this.props.onChangeText(text,name)
        }
        
        var master = this.flag == 2? json['table'+this.code].ordinary:json['table' + this.code].master

        this.state ={
            data:{
                master:master
            },
            from:{},
            count:json['table'+this.code].count
        }
    
    }

    foucusNextField = nextField =>{  
        if(this.refs[nextField]){
            this.refs[nextField].focus()
        }     
    }

    componentWillMount(){
        Storage.get(this.saveS).then(data=>{
            if(data!=null){
                this.setState({
                    from:data
                })
            }
        })
    }

    render(){
        var arr=[];
        // 第一个循环
        count = this.flag==2? this.state.count:0 
        this.state.data.master.map((item,index)=>{       
            var temp = 
            <View style={styles.box} key={index}>  
                <View style={styles.boxTop}>
                    <View style={styles.boxLIcon}>
                        <Text style={styles.boxLIconText} >规定{index+1}</Text>
                    </View>  
                    <Text style={styles.boxTopTxt}> 
                        {item.title} {item.num?'评定记录：':''}
                    </Text>
                </View>         

                {item.num==10?
                    new Array(2).fill('').map((index)=>{
                        return(
                            <View style={styles.smallInputBox} key={index+''+count}> 
                                {item.num ? new Array(5).fill('').map((item,index,arr)=>{
                                    var num = ++count;
                                    return (
                                        <TextInput 
                                        key={index+'i1'}
                                        style={arr.length==5?styles.smallInput:styles.boxBottom}
                                        underlineColorAndroid='transparent'
                                        multiline={true}
                                        textAlignVertical={arr.length==5?'center':'top'}
                                        returnKeyType="next"
                                        blurOnSubmit={true}
                                        defaultValue={this.state.from['d'+num]} 
                                        onSubmitEditing={()=>{this.foucusNextField(num+1)}}
                                        onChangeText={(text)=>this.onChangeText(text,'d'+num)}
                                        ref={num}
                                    />
                                    )
                                }):null}
                            </View>
                        )
                    })   
                :null}      

                {item.num && item.num!=10?
                    new Array(item.num).fill('').map( (item,index,arr)=>{
                        var num = ++count;
                        return(
                            <TextInput 
                                key={index+'i1'}
                                style={arr.length==5?styles.smallInput:styles.boxBottom}
                                underlineColorAndroid='transparent'
                                multiline={true}
                                textAlignVertical='top'
                                returnKeyType="next"
                                blurOnSubmit={true}
                                defaultValue={this.state.from['d'+num]} 
                                onSubmitEditing={()=>{this.foucusNextField(num+1)}}
                                onChangeText={(text)=>this.onChangeText(text,'d'+num)}
                                ref={num}
                                editable={false}
                            />
                        )
                    })
                 :!item.subTitle?null
                     // 第二个循环
                    :item.subTitle.map((item,index)=>{      
                       return(
                        <View  key={index+'_2'}>   
                            <Text style={styles.mainSubTitle} key={index+'_1'}> 
                               （{index+1}） {item.title} 评定记录:
                            </Text>
                            <View>
                            {item.num && item.num!=10?
                                <View style={styles.smallInputBox}> 
                                    {item.num ? new Array(item.num).fill('').map((item,index,arr)=>{
                                        var num = ++count;
                                        return (
                                            <TextInput 
                                            key={index+'i1'}
                                            style={arr.length==5?styles.smallInput:styles.boxBottom}
                                            underlineColorAndroid='transparent'
                                            multiline={true}
                                            textAlignVertical={arr.length==5?'center':'top'}
                                            returnKeyType="next"
                                            blurOnSubmit={true}
                                            defaultValue={this.state.from['d'+num]} 
                                            onSubmitEditing={()=>{this.foucusNextField(num+1)}}
                                            onChangeText={(text)=>this.onChangeText(text,'d'+num)}
                                            ref={num}
                                        />
                                        )
                                    }):null}
                                </View>
                                :
                               <View>
                                {item.num==10?
                                    new Array(2).fill('').map(()=>{
                                        return(
                                            <View style={styles.smallInputBox} key={index+''+count}> 
                                                {item.num ? new Array(5).fill('').map((item,index,arr)=>{
                                                    var num = ++count;
                                                    return (
                                                        <TextInput 
                                                        key={index+'i1'}
                                                        style={arr.length==5?styles.smallInput:styles.boxBottom}
                                                        underlineColorAndroid='transparent'
                                                        multiline={true}
                                                        textAlignVertical={arr.length==5?'center':'top'}
                                                        returnKeyType="next"
                                                        blurOnSubmit={true}
                                                        defaultValue={this.state.from['d'+num]} 
                                                        onSubmitEditing={()=>{this.foucusNextField(num+1)}}
                                                        onChangeText={(text)=>this.onChangeText(text,'d'+num)}
                                                        ref={num}
                                                    />
                                                    )
                                                }):null}
                                            </View>
                                        )
                                    })   
                                :null}
                               </View> 
                            }
                            </View>
                        <View> 
                                {/*第三个循环*/}
                                {!item.subTitle?null:
                                    item.subTitle.map((item,index)=>{
                                        return(
                                            <View  key={index+'_3'}>   
                                            <Text style={styles.smallInputBoxTitle} key={index+'_1'}> 
                                                {index+1}、{item.title}  
                                            </Text>
                                            <View style={styles.smallInputBox}> 
                                             {item.num ? new Array(item.num).fill('').map((item,index,arr)=>{
                                                 var num = ++count;
                                                return (
                                                    <TextInput 
                                                    key={index+'i1'}
                                                    style={arr.length==5?styles.smallInput:styles.boxBottom}
                                                    underlineColorAndroid='transparent'
                                                    multiline={true}
                                                    textAlignVertical={arr.length==5?'center':'top'}
                                                    returnKeyType="next"
                                                    blurOnSubmit={true}
                                                    defaultValue={this.state.from['d'+num]}  
                                                    onSubmitEditing={()=>{this.foucusNextField(num+1)}}
                                                    onChangeText={(text)=>this.onChangeText(text,'d'+num)}
                                                    ref={num}
                                                    editable={false}
                                                />
                                                )
                                            }):null}
                                            </View>
                                            </View> 
                                        )
                                    })
                                }
                            </View>   
                        </View> 
                        )
                    })    
                }
            </View>
            arr.push(temp)
        })
          return(
            <View>  
                {arr}
            </View>  
          )
      }
}



export default class InspectionDatePreview extends Component{

    constructor(props){
        super(props)
        this.state ={
            data:[],
            from:{
            },
            verifyDate:{},
            count:0,
            subject:{
                isConfirm:false,
                isVerify:false,
                isFill:false
            },
            dataId:false,
            waiting:false
        }
        navigation = this.props.navigation;
        this.from = navigation.getParam('from')
        this.salt = navigation.getParam('salt')
        this.saveS = navigation.getParam('saveS')
        this.status = navigation.getParam('status')
        this.code = this.salt.split('-')[2]
        // console.warn(this.status)
        // this.subject = navigation.getParam('subject')
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '预览') ,
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
          )
        };
    };


    foucusNextField = nextField =>{       
        this.refs[nextField].focus()
    }

    render(){
        return(
            <View>   
            <ScrollView>
            <View style={[styles.container, {paddingBottom: 200}]}>
                <KeyboardAwareScrollView extraScrollHeight={20} >

                   {/*第一部分*/}
                   <Panel title="单位相关信息" >
                    <View style={styles.from}>
                            <View style={styles.box}>
                                <Text style={styles.boxL}>单位工程名称</Text>
                                <TextInput 
                                    style={styles.boxR}
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    blurOnSubmit={true}
                                    returnKeyType="next"
                                    // keyboardType="numeric"
                                    // placeholder="请输入分部工程名称"
                                    defaultValue={this.state.from.h1}
                                    ref='1'
                                    onSubmitEditing={()=>{this.foucusNextField('2')}}
                                    onChangeText={(text)=>this.onChangeText(text,'h1')}
                                    editable={false}
                                />
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.boxL}>分部工程名称</Text>
                                <TextInput 
                                    style={styles.boxR}
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    blurOnSubmit={true}
                                    returnKeyType="next"
                                    // keyboardType="numeric"
                                    // placeholder="请输入分部工程名称"
                                    defaultValue={this.state.from.h2}
                                    ref='2'
                                    onSubmitEditing={()=>{this.foucusNextField('3')}}
                                    onChangeText={(text)=>this.onChangeText(text,'h2')}
                                    editable={false}
                                />
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.boxL}>分项工程名称</Text>
                                <TextInput 
                                    style={styles.boxR}
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    blurOnSubmit={true}
                                    returnKeyType="next"
                                    // placeholder="请输入分项工程名称"
                                    defaultValue={this.state.from.h3}
                                    ref="3"
                                    onSubmitEditing={()=>{this.foucusNextField('4')}}
                                    onChangeText={(text)=>this.onChangeText(text,'h3')}
                                    editable={false}

                                />
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.boxL}>验收部门</Text>
                                <TextInput 
                                    style={styles.boxR}
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    blurOnSubmit={true}
                                    returnKeyType="next"
                                    ref="4"
                                    // placeholder="请输入验收部门"
                                    defaultValue={this.state.from.h4}
                                    onSubmitEditing={()=>{this.foucusNextField('5')}}
                                    onChangeText={(text)=>this.onChangeText(text,'h4')}
                                    editable={false}
                                />
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.boxL}>施工单位</Text>
                                <TextInput 
                                    style={styles.boxR}
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    blurOnSubmit={true}
                                    returnKeyType="next"
                                    // placeholder="请输入施工单位"
                                    defaultValue={this.state.from.h5}
                                    ref="5"
                                    onSubmitEditing={()=>{this.foucusNextField('6')}}
                                    onChangeText={(text)=>this.onChangeText(text,'h5')}
                                    editable={false}
                                />
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.boxL}>项目负责人</Text>
                                <TextInput 
                                    style={styles.boxR}
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    blurOnSubmit={true}
                                    // placeholder="请输入项目负责人"
                                    defaultValue={this.state.from.h6}
                                    ref="6"
                                    onChangeText={(text)=>this.onChangeText(text,'h6')}
                                    editable={false}
                                />
                            </View>
                        </View> 
                     </Panel>
                    {/*第二部分*/}
                    {json['table'+this.code].master.length>0?
                    <Panel title="主控项目检查评定记录" >
                     <View style={styles.from}>  
                        <From2Input   flag={1}  salt={this.salt}  saveS={this.saveS} />
                     </View>  
                    </Panel>
                    :null}
                    {/*第三部分*/}
                    {json['table'+this.code].ordinary.length>0?
                    <Panel title="一般项目检查评定记录" >
                        <View style={styles.from}>                                              
                            <From2Input  flag={2}  salt={this.salt} saveS={this.saveS} />  
                        </View>
                    </Panel> 
                    :null}         
                     {/*第四部分*/}    
                     <Panel title="施工作业人员质量责任登记" >
                        <View style={styles.from}>                                              
                            <View style={styles.box}>
                                <TouchableOpacity activeOpacity={1} onPress={()=>{  
                                    if( typeof this.state.from.f1.checked == 'undefined'){
                                    }                           
                                }}>
                                <TextInput 
                                        style={[styles.boxR]}
                                        underlineColorAndroid='transparent'
                                        multiline={true}
                                        textAlignVertical='top'
                                        blurOnSubmit={true}
                                        // returnKeyType="next"
                                        // placeholder="请输入单位工程名称"
                                        ref="0"
                                        defaultValue={this.state.from.f1}
                                        onChangeText={(text)=>this.onChangeText(text,'f1')}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Panel>               
                   
                     {/*第五部分*/}    
                     <View style={styles.mainFour}>
                         <View style={styles.meavgeBox}>
                            <View style={styles.meavge}>
                                <Image  resizeMode="cover" style={styles.meavgeImg} source={require('../../img/av.png')}/>
                            </View>
                         </View>
                         <View style={styles.meavgeRight}>
                            <Text style={styles.meavgeTitle} >专职质量检查员：{this.state.verifyDate.creatorName}</Text>
                            <Text style={styles.meavgeTime} >{this.state.verifyDate.createTime}</Text>
                        </View>
                     </View>      
                    
                     {this.state.verifyDate.verifierName?
                      <View style={styles.mainFour}>
                         <View style={styles.meavgeBox}>
                            <View style={styles.meavge}>
                                <Image  resizeMode="cover" style={styles.meavgeImg} source={require('../../img/av.png')}/>
                            </View>
                         </View>
                         <View style={styles.meavgeRight}>
                            <Text style={styles.meavgeTitle} >分项工程技术负责人：{this.state.verifyDate.verifierName}</Text>
                            <Text style={styles.meavgeTime} >{this.state.verifyDate.verifyTime}</Text>
                        </View>
                     </View> 
                     :null}
                    
                    {this.state.verifyDate.confirmerName?
                      <View style={styles.mainFour}>
                         <View style={styles.meavgeBox}>
                            <View style={styles.meavge}>
                                <Image  resizeMode="cover" style={styles.meavgeImg} source={require('../../img/av.png')}/>
                            </View>
                         </View>
                         <View style={styles.meavgeRight}>
                            <Text style={styles.meavgeTitle} >分项工程负责人：{this.state.verifyDate.confirmerName}</Text>
                            <Text style={styles.meavgeTime} >{this.state.verifyDate.confirmTime}</Text>
                        </View>
                     </View> 
                     :null}

                </KeyboardAwareScrollView>
                </View>
            </ScrollView>
           

             {/*审批*/}
            <View  style={styles.subject}>
                {  (this.status == 0 && this.state.subject.isFill)||
                   (this.status == 1 && this.state.subject.isFill)||
                   (this.status==1 && this.state.subject.isVerify)||
                   (this.status == 2 && this.state.subject.isConfirm)
                   ? 
                    <View  style={styles.subjectText}>
                        <Text  style={styles.subjectTextt}>操作</Text>
                    </View>
                    :null
                }    

                {/* 提交 */}
                    {this.status == 0 && this.state.subject.isFill ? 

                        <View style={styles.subjectBGB}>
                           <TouchableOpacity style={[styles.subjectBtn,styles.subjectBlue,]}
                                onPress={()=>{      
                                    this.props.navigation.replace('InspectionDateFrom',{
                                        positionId:this.salt.split('-')[1],
                                        code:this.salt.split('-')[2],
                                        dataId:this.salt.split('-')[0],
                                        status:this.status,
                                        salt:this.salt,
                                        saveS:this.saveS,
                                    })                               
                                }}
                            >
                                <Text style={styles.subjectBlueT} >修改</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.subjectBtn,styles.subjectBlue,]}
                                onPress={()=>{ 
                                    this._repeatClick(1)
                                }}
                                disabled={this.state.waiting}
                            >
                                <Text style={styles.subjectBlueT} >提交</Text>
                            </TouchableOpacity>
                        </View>                      
                    :null}
                    
                    {this.status == 1 && this.state.subject.isFill ? 
                    <View style={styles.subjectBGB}>
                        <TouchableOpacity style={[styles.subjectBtn,styles.subjectRed,{width:width}]}
                            onPress={()=>{  
                                this._repeatClick(-1)
                            }}
                            disabled={this.state.waiting}
                        >
                            <Text style={styles.subjectRedT} >撤回</Text>
                        </TouchableOpacity>
                    </View> 
                    :null} 

                {/* 一审 */}

                    {this.status==1 && this.state.subject.isVerify ?
                    <View style={styles.subjectBGB}>
                        <TouchableOpacity style={[styles.subjectBtn,styles.subjectRed]}
                            onPress={()=>{  
                                this._repeatClick(0)
                            }}
                            disabled={this.state.waiting}
                        >
                            <Text style={styles.subjectRedT} >拒绝</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.subjectBtn,styles.subjectBlue]}
                              onPress={()=>{  
                                this._repeatClick(1)
                             }}
                             disabled={this.state.waiting}
                        >
                            <Text style={styles.subjectBlueT}>同意</Text>
                        </TouchableOpacity>
                    </View>
                    :null}

                {/* 二审 */}
                     {this.status == 2 && this.state.subject.isConfirm ?
                    <View style={styles.subjectBGB}>
                        <TouchableOpacity style={[styles.subjectBtn,styles.subjectRed]}
                              onPress={()=>{  
                                this._repeatClick(0)}}
                            disabled={this.state.waiting}
                        >
                            <Text style={styles.subjectRedT} >驳回</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.subjectBtn,styles.subjectBlue]}
                              onPress={()=>{  
                                this._repeatClick(1)
                              }}
                            disabled={this.state.waiting}
                        >
                            <Text style={styles.subjectBlueT}>归档</Text>
                        </TouchableOpacity>
                    </View>
                    :null}
            </View>                    

        

        </View>
            
        )
    }

    /**
     *  操作
     */

    operation = (num) =>{

        Storage.get('vtoken').then(data=>{

            data = data||''
            var id =navigation.getParam('dataId')||this.salt.split('-')[0]
            // console.warn(id);
            let fromdata = new FormData()
            fromdata.append('id',id)
            fromdata.append('operation',num)
            fromdata.append('vtoken',data)
    
            fetch(operate,{
                method:'POST',
                body:fromdata,
                headers:{
                    'Content-Type':'multipart/form-data',
                },
            })
            .then((response) => {
                // console.warn(response.headers.get('vtoken')) 
                if(response.headers.get('vtoken')!=null){
                    var vtoken = response.headers.get('vtoken')
                    Storage.save('vtoken',vtoken)
                }
                return response.json()
            })
            .then((responseJson) => {
                if(responseJson.statusCode == 200){
                    this.props.navigation.pop()
                }
            })

        })
    }



    /**
     * 加载数据
     */


    ReqFn =(data) =>{
        data = data || ''
        var id =navigation.getParam('dataId')||this.salt.split('-')[0]
        // console.warn(id);
        let fromdata = new FormData()
        fromdata.append('id',id)
        fromdata.append('vtoken',data)
        fetch(preview, {
            method:'POST',
            body:fromdata,
            headers:{
                'Content-Type':'multipart/form-data',
            },
        })
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
            if(responseJson.statusCode ==301){
                return false;
            }else{
                var json = JSON.parse(responseJson.data.verifyData.content),
                    verifyDate = responseJson.data.verifyData;
                this.setState({
                    from:json,
                    verifyDate:verifyDate
                })
            }
        })
    }

    /**
     * 延迟点击
     */

    _repeatClick(method){
        this.setState({waiting: true});
        this.operation(method)//这里写你原本要交互的方法
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);//设置的时间间隔由你决定
    }


     componentDidMount(){

        Storage.get('subject').then((data)=>{
            if(data!=null){
                this.setState({
                    subject:data
                })
            }
        })

        if(!this.salt.split('-')[0]){
            Storage.get(this.saveS).then(data=>{
                if(data!=null){
                    this.setState({
                        from:data,
                        person1:navigation.getParam('person1'),
                    })
                }else{
                    this.setState({
                        person1:navigation.getParam('person1'),
                    })
                }
            })
        }else{
            Storage.get('vtoken').then(data=>{
                if(data!=null){
                    this.ReqFn(data)
                }else{
                    this.ReqFn()
                }
            })
        }

     }


}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',   
        // backgroundColor:'#fff',
        paddingBottom:200,
    },
    headerTitlebox:{
        marginBottom:10,
        borderColor:'#ddd',
        borderBottomWidth:1/PixelRatio.get(),
    },
    headerTitle:{
        textAlign:'left',
        color:'#333',
        fontSize:16,
    },
    from:{
        width:width-20,
        borderWidth:1/PixelRatio.get(),
        borderColor:'#ddd',
        padding:10,
        backgroundColor:'#fff',
        borderBottomLeftRadius:6,
        borderBottomRightRadius:6,
    },
    box:{
        // backgroundColor:'#fff',
        paddingBottom:5,
        paddingTop:5,
    },
    boxL:{
        width:width-40,
        fontSize:14,
        color:'#333',
        marginBottom:5,
    },
    boxTop:{
        flexDirection:'row',
        marginBottom:5,
        flex:1,
        alignItems:'center',
    },
    boxLIcon:{
        paddingLeft:8,
        paddingRight:8,
        paddingTop:6,
        paddingBottom:6,
        // backgroundColor:'#70C0B3',
        backgroundColor:'#FE7257',
        alignSelf:'center',
        borderRadius:4,
    },
    boxLIconText:{
        fontSize:12,
        color:'#fff',
    },
    boxTopTxt:{
        flex:1,
        fontSize:16,
        color:'#333',
        marginLeft:6
    },
    mainSubTitle:{
        alignSelf:'flex-start',
        color:'#666',
        fontSize:14,
        marginBottom:5
    },
    smallInputBox:{
        width:width-20,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom:10
     },
     smallInputBoxTitle:{
        fontSize:13,
        marginRight:5,
        width:150,
     },
    smallInput:{
        width:(width-60)/5,
        minHeight:40,
        marginRight:5,
        borderWidth:2/PixelRatio.get(),
        borderColor:'#ddd',
        // alignSelf:'center',
        padding:2,
        color:'#666'
    },
    boxBottom:{
        width:width-40-2/PixelRatio.get(),
        fontSize:16,
        minHeight:70,
        padding:10,
        borderWidth:2/PixelRatio.get(),
        borderColor:'#ddd',
        alignSelf:'flex-start',
        color:'#666'
    },
    boxR:{
        width:width-40-2/PixelRatio.get(),
        fontSize:16,
        minHeight:26,
        padding:3,
        borderWidth:2/PixelRatio.get(),
        borderColor:'#DDDDDD',
        color:'#666',
    },
    button:{
        width:200,
        height:40,
        marginTop:5,
        alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',  
        backgroundColor:'#2196F3',
        borderRadius:4
    },
    buttontext:{
        color:'#fff'
    },
    mainFour:{
        marginTop:10,
        marginBottom:10,
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:15,
        paddingRight:15,
        alignItems:'center',
        width:width,
    },
    meavge:{
        width:60,
        height:60,
        overflow:'hidden',
        borderRadius:80,
        marginRight:15,
    },
    meavgeImg:{
        width:60,
        height:60,
    },
    meavgeTitle:{
        color:'#333',
        fontSize:16
    },
    meavgeRight:{
        flex:1,
        paddingRight:10
    },
    meavgeTime:{
        fontSize:14,
        color:'#666',
        marginTop:5
    },
    subject:{
        marginTop:10,
        position:'absolute',
        bottom:0,
        width:width,
    },
    subjectText:{
        backgroundColor:'#4788FF',
        width:40,
        minHeight:15,
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        borderRadius:8,
        position:'absolute',
        top:-15,
        zIndex:999,
    },
    subjectTextt:{
        color:'#fff',
        fontSize:12
    },

    subjectBGB:{
        flexDirection:'row',
        backgroundColor:'#fff',
        borderColor:'#ddd',
        borderBottomWidth:1/PixelRatio.get(),
        paddingTop:10,
        paddingBottom:10
    },
    subjectBtn:{
        width:(width-20)/2,
        alignItems:'center',
        alignSelf:'center',
        paddingTop:5,
        paddingBottom:5
    },
    subjectBlueT:{
        color:'#4788FF'
    },
    subjectRedT:{
        color:'#FF2C03'
    }
  });
  