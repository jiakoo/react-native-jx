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
  Picker
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from "react-native-vector-icons/MaterialIcons"
import Storage from '../../utils/Storage'
import json  from  '../../page/From/data'


class From1Input extends Component{

    constructor(props){
        super(props)
        this.onChangeText=(text,name)=>{
            this.props.onChangeText(text,name)
        }
        this.state ={
            from:{}
        }
        this.saveS = this.props.saveS
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
          return(
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
                            />
                        </View>
                </View>     

          )
      }
}

export default class InspectionDateFrom extends Component{
    constructor(props){
        super(props)
        this.state ={
            data:[],
            from:{
            }
        }
        this.navigation = this.props.navigation
        this.salt = this.navigation.getParam('dataId')+'-'+this.navigation.getParam('positionId')+'-'+this.navigation.getParam('code');
        this.saveS = this.navigation.getParam('positionId')+'-'+this.navigation.getParam('code');
        this.status = this.navigation.getParam('status');
        this.code = this.navigation.getParam('code');
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
        //   headerTitle: navigation.getParam('title', '验收表单') +'(' + '1/3' +')',
          headerTitle: '单位信息',
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
            Storage.save( this.saveS,this.state.from)
        },0)
  
    }

    render(){
        return(
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                    <View style={styles.headerTitle}><Icon name={'business'} size={26} style={styles.headerTitleicon}/><Text style={styles.headerTitletxt}>单位信息 </Text></View>
                    <From1Input  saveS={ this.saveS}  onChangeText={(Text,data)=>{this.onChangeText(Text,data)}} />
                    <TouchableOpacity style={styles.button} onPress={()=>{
                            if(json['table' + this.code]==undefined){
                                alert('暂未开放')
                                return;
                            }
                            var jump = json['table' + this.code].master.length>0?'InspectionDateFrom2':'InspectionDateFrom3'
                            this.props.navigation.navigate(jump,{
                                from1:this.state.from,
                                salt:this.salt,
                                status:this.status,
                                saveS:this.saveS
                            })
                        }}>
                            <Text style={styles.buttontext}>下一步</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>               
             </View>
        )
    }

    /**
     * 加载数据
     */

     componentDidMount(){

        // Storage.clear();

        Storage.get( this.saveS).then(data=>{
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
        justifyContent: 'center',
        alignItems: 'center',   
        backgroundColor:'#fff',
    },
    headerTitle:{
        marginTop:10,
        marginBottom:10,
        paddingLeft:10,
        paddingRight:10,
        flexDirection:'row',
    },
    headerTitleicon:{
       color:'#417DEA'
    },
    headerTitletxt:{
        color:'#333',
        fontSize:18,
    },
    from:{
        width:width
    },
    box:{
        backgroundColor:'#fff',
        padding:10,
        paddingBottom:5,
        paddingTop:5,
    },
    boxL:{
        width:width-20,
        fontSize:14,
        color:'#333',
        marginBottom:5,
    },
    boxR:{
        width:width-20,
        fontSize:16,
        minHeight:26,
        padding:3,
        borderWidth:2/PixelRatio.get(),
        borderColor:'#DDDDDD',
    },
    button:{
        width:width-20,
        height:40,
        marginTop:20,
        marginBottom:20,
        alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',  
        backgroundColor:'#2196F3',
        borderRadius:4
    },
    buttontext:{
        color:'#fff'
    }
  });
  