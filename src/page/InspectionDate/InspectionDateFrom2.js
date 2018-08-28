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
  ScrollView
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Storage from '../../utils/Storage'
import  json  from  '../../page/From/data'

class From2Input extends Component{

    constructor(props){
        super(props)
        this.onChangeText=(text,name)=>{
            this.props.onChangeText(text,name)
        }

        this.getCount = (count) =>{
            this.props.getCount(count)
        }

        this.saveS = this.props.saveS
        this.salt = this.props.salt
        this.code =  this.salt.split('-')[2]
        this.master = json['table' + this.code].master

        this.state ={
            data:{
                master:this.master     
            },
            from:{}
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
        count = 0,
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
                {item.num&&item.num==10  ?
                    new Array(2).fill('').map(()=>{
                        return(
                            <View style={styles.smallInputBox}> 
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
                                            <View style={styles.smallInputBox}> 
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
        this.getCount(count)
          return(
            <View>  
                {arr}
            </View>  
          )
      }
}

export default class InspectionDateFrom2 extends Component{

    constructor(props){
        super(props)
        this.state ={
            data:[
            ],
            from:{},
        }
        navigation = this.props.navigation
        this.from1 = navigation.getParam('from1');
        this.salt = this.props.navigation.getParam('salt');
        this.status = navigation.getParam('status');
        this.saveS = navigation.getParam('saveS')
        this.count = 0
        this.code =  this.salt.split('-')[2]

        // console.warn(this.salt)
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
        //   headerTitle: navigation.getParam('title', '验收表单') +'(' + '2/3' +')',
          headerTitle:'主控项目评定记录',
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

    onChangeText = (Text,data) =>{
        var from = this.state.from
        from[data] = Text
            
        this.setState({
            from
        })

        setTimeout(()=>{
            Storage.save(this.saveS,this.state.from)
        },0)
    }

    foucusNextField = nextField =>{       
        this.refs[nextField].focus()
    }

    getCount = (count) =>{
        this.count = count;
        return count
    }

    render(){
        return(
            
         <View style={styles.container}>
            <ScrollView>
                <KeyboardAwareScrollView extraScrollHeight={20} >

                   <View style={styles.headerTitlebox}>
                        <Text style={styles.headerTitle}> 检查评定标准名称及编号</Text>
                        <Text style={styles.SubTitle}>《高速铁路隧道工程施工质量验收标准》</Text>
                        <Text style={styles.SubTitle}>（TB10753-2010）</Text>
                   </View>

                   <View style={styles.main} >
                        <Text style={styles.mainTitle}> 主控项目检查评定记录：</Text>
                        <From2Input    getCount={ (count) =>{ this.getCount(count) } }  salt={this.salt}  saveS={this.saveS} onChangeText={(Text,data)=>{this.onChangeText(Text,data)}}/>  
                    </View>

                    <TouchableOpacity style={styles.button} onPress={()=>{

                            Storage.save(this.saveS+'count',this.count)
                            var jump = json['table' + this.code].ordinary.length>0?'InspectionDateFrom3':'InspectionDateFrom4'
                            this.props.navigation.navigate(jump,{
                                from1:this.from1,
                                from2:this.state.from,
                                salt:this.salt,
                                status:this.status,
                                count:this.count,
                                saveS:this.saveS
                            })
                        }}>
                            <Text style={styles.buttontext}>下一步</Text>
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
                </ScrollView>
            </View>
      
            
        )
    }

    /**
     * 加载数据
     */

     componentDidMount(){
        // Storage.clear()
        Storage.get(this.saveS).then(data=>{
            // console.warn(data);
            if(data!=null){
                this.setState({
                    from:data
                })
            }
        })

     }

}


const styles = StyleSheet.create({

    container: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',   
        backgroundColor:'#fff',
    },
    headerTitlebox:{
        padding:10,
        marginBottom:10,
        borderColor:'#ddd',
        borderBottomWidth:1/PixelRatio.get(),
    },
    headerTitle:{
        textAlign:'left',
        color:'#333',
        fontSize:16,
    },
    main:{
        padding:10,
        paddingTop:0,
    },
    mainTitle:{
        fontSize:16,
        color:'#333',
        marginBottom:10,
    },
    box:{
        flex:1,
        marginBottom:15,
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
        marginBottom:5,
     },
    smallInput:{
        width:(width-40)/5,
        minHeight:40,
        marginRight:5,
        borderWidth:2/PixelRatio.get(),
        borderColor:'#ddd',
        // alignSelf:'center',
        padding:2
    },
    boxBottom:{
        width:width-20,
        fontSize:16,
        minHeight:70,
        padding:10,
        borderWidth:2/PixelRatio.get(),
        borderColor:'#ddd',
        alignSelf:'flex-start',
    },
    button:{
        width:width-20,
        height:40,
        marginTop:5,
        alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',  
        backgroundColor:'#2196F3',
        borderRadius:4,
        marginBottom:30
    },
    buttontext:{
        color:'#fff'
    },
  });
  