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
  TextInput,
  Image
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import Icon from "react-native-vector-icons/Ionicons"
import Storage from '../../utils/Storage'
import {changePassword} from '../../api/Allapi';
import Layer from '../../page/Componet/Layer'
import PasswdEncrypt from '../../utils/passwd_encrypt'
import queryString from 'query-string';

export default class ChangePassword extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:
                {
                    oldPassWord:'',
                    newPassWord:'',
                    againPassWord:'',
                    loginUserName:'',
                    loginUserAccount:''
                },
            Layer:'',
            factor:{},
           
        };
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '修改密码'),
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
    componentDidMount() {

        Storage.get('subject').then(data=>{
            if(data!=null){
                // console.warn(data)
                var data={
                    loginUserName:data.loginUserName,
                    loginUserAccount:data.loginUserAccount
                }
                this.setState({
                    data:data
                })
            }
        })

    }

    foucusNextField = nextField =>{  
        if(this.refs[nextField]){
            this.refs[nextField].focus()
        }     
    }

    render(){
        return(
            <View  style={styles.container} >   

                <View style={styles.From}> 

                        <View style={styles.FromItem} >
                            <Text style={[styles.FromLabel,{color:'#666'}]}>账号</Text>
                            <TextInput 
                                style={[styles.FromInput,{color:'#666'}]}
                                underlineColorAndroid='transparent'
                                // multiline={true}
                                blurOnSubmit={true}
                                returnKeyType="next"
                                ref='0'
                                defaultValue={this.state.data.loginUserAccount}
                                editable={false}
                                onSubmitEditing={()=>{this.foucusNextField('0')}}
                                onChangeText={(text)=>this.onChangeText(text,'oldPassWord')}
                            />
                       </View> 

                       <View style={styles.FromItem} >
                            <Text style={styles.FromLabel}>旧密码</Text>
                            <TextInput 
                                style={styles.FromInput}
                                underlineColorAndroid='transparent'
                                // multiline={true}
                                blurOnSubmit={true}
                                returnKeyType="next"
                                ref='1'
                                placeholder='请填写旧密码'
                                secureTextEntry ={true}
                                onSubmitEditing={()=>{this.foucusNextField('2')}}
                                onChangeText={(text)=>this.onChangeText(text,'oldPassWord')}
                            />
                       </View> 

                       <View style={styles.FromItem} >
                            <Text  style={styles.FromLabel}>新密码</Text>
                            <TextInput 
                                style={styles.FromInput}
                                underlineColorAndroid='transparent'
                                // multiline={true}
                                blurOnSubmit={true}
                                returnKeyType="next"
                                ref='2'
                                placeholder='请填写新密码'
                                secureTextEntry ={true}
                                onSubmitEditing={()=>{this.foucusNextField('3')}}
                                onChangeText={(text)=>this.onChangeText(text,'newPassWord')}
                            />
                       </View> 

                       <View style={styles.FromItem} >
                            <Text style={styles.FromLabel}>确认密码</Text>
                            <TextInput 
                                style={styles.FromInput}
                                underlineColorAndroid='transparent'
                                // multiline={true}
                                blurOnSubmit={true}
                                returnKeyType="next"
                                ref='3'
                                placeholder='请再次填写新密码'
                                secureTextEntry ={true}
                                onSubmitEditing={()=>{this.foucusNextField('3')}}
                                onChangeText={(text)=>this.onChangeText(text,'againPassWord')}
                            />
                       </View> 
                    

                </View>
                
                <TouchableOpacity activeOpacity={0.8} style={styles.Button} onPress={()=>{this.ChangePassword()}}> 
                    <Text style={styles.btxt}>确认修改</Text>
                </TouchableOpacity>

                <Layer content={this.state.layer} ref="layer" delay={2000}/>

            </View>
        )
    }

    ChangePassword=()=>{
        var oldP = this.state.data.oldPassWord,
            newP = this.state.data.newPassWord,
            againP = this.state.data.againPassWord;

        if(!oldP||!newP||!againP){
            this.refs.layer.show()
            this.setState({
                layer:'请全部填写后在提交'
            })
            return false;
        }

        if(newP != againP){
            this.refs.layer.show()
            this.setState({
                layer:'两次密码输入不一致'
            })
            return false;
        }

   

        Storage.get('factor')
        .then((factor)=>{
            if(factor!=null){
                this.setState({
                    factor:factor
                })
            }
        })
        .then(()=>{
            Storage.get('vtoken')
            .then(data=>{         

                var oldPassword = this.state.data.oldPassWord,
                    newPassword = this.state.data.newPassWord,
                    passWdEncrypt = new PasswdEncrypt( this.state.factor.n ,this.state.factor.e );
                    oldPassword = passWdEncrypt.encrypt(oldPassword, this.state.factor.random );
                    newPassword = passWdEncrypt.encrypt(newPassword, this.state.factor.random );

                    var form = new FormData();
                    form.append('_method','put')
                    form.append('oldPassword',oldPassword)
                    form.append('newPassword',newPassword)
                    form.append('vtoken',data)

                    
                fetch(changePassword,
                    {
                        method:'POST',
                        body:form,
                        headers:{
                            // 'Accept': 'application/json',
                            'Content-Type':'multipart/form-data',
                            // "Content-type": "application/x-www-form-urlencoded;" 
                            // "Content-type": "application/json"
                        },
                    }
                )
                .then((response) =>{
                    if(response.headers.get('vtoken')!=null){
                        var vtoken = response.headers.get('vtoken')
                        Storage.save('vtoken',vtoken)
                    }
                    return response.json()
                })
                .then((response)=>{
                
                    if(response.statusCode == 200){    
                        // this.setState({
                        //     layer:'修改成功'
                        // })
                        // this.refs.layer.show()  
                        this.props.navigation.pop();
                    }else{                                 
                        this.setState({
                            layer:'修改失败'
                        })
                        this.refs.layer.show()
                    }
                })
            })
        })
        }




    onChangeText = (Text,data) =>{
        var From = this.state.data
        From[data] = Text          
        this.setState({
            data:From
        })

    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start', 
    },
    From:{
        backgroundColor:'#fff',
        paddingLeft:10,
        width:width,
        marginTop:20
    },
    FromItem:{
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1/PixelRatio.get(),
        borderColor:'#ddd'
    },
    FromLabel:{
        width:90,
        fontSize:16,
        color:'#000'
    },
    FromInput:{
        flex:1,
    },
    Button:{
        width:width-40,
        backgroundColor:'#4395ff',
        height:48,
        justifyContent:'center',
        borderRadius:30,
        marginTop:25,
        alignSelf:'center',
        marginTop:30
    },
    btxt:{
        fontSize:18,
        color:'#fff',
        textAlign:'center',
    },
});
  

