import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TextInput,
  PixelRatio,
  TouchableHighlight,
  TouchableOpacity,
  Image
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Storage from '../../utils/Storage'
import Icon from "react-native-vector-icons/Ionicons"
import PasswdEncrypt from '../../utils/passwd_encrypt'
import {LoginArl} from '../../api/Allapi'

export default class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            user:'',
            password:'',
            factor:'',
            next:''
        }
        this.factor = this.props.navigation.getParam('factor');
        // this.ssid = this.props.navigation.getParam('ssid');
        // console.warn(this.factor);
        this.Logincount =0
    }
    render(){
        const {navigate} = this.props.navigation;

        return(
            <KeyboardAwareScrollView  style={{backgroundColor:'#256AF5'}}> 
                <ImageBackground source={require('../../img/bg.jpg')}  style={{height:height}}>
                    <View style={styles.container}>     
                    
                      
                            {/* <Image source={require('../../img/logo.png')} style={styles.logo} /> */}
                            {/* <Text style={styles.logintitle}>智能化信息施工平台</Text> */}
                            <View style={styles.main}></View>
                            <View style={styles.inputBox}>
                                <View style={styles.iconBox}>
                                    <Icon 
                                        name="md-person"
                                        size={20}
                                        style={styles.icon}
                                    />
                                </View>
                                <TextInput style={styles.input}
                                            placeholder="请输入账号"
                                            selectionColor ='#fff'
                                            placeholderTextColor='#fff'
                                            // autoFocus={true}
                                            underlineColorAndroid='transparent'
                                            onChangeText={(user) => this.setState({user})}/>
                            </View>
                            <View style={styles.inputBox}>
                                <View style={styles.iconBox}>
                                    <Icon 
                                        name="md-lock"
                                        size={20}
                                        style={styles.icon}
                                    />
                                </View>
                                <TextInput style={styles.input}
                                        placeholder="请输入密码"
                                        selectionColor ='#fff'
                                        placeholderTextColor='#fff'
                                        underlineColorAndroid='transparent'
                                        textCursorDrawable='#fff'
                                        secureTextEntry ={true}
                                        onChangeText={(password) => this.setState({password})}/>
                            </View>
                        
                            <TouchableOpacity activeOpacity={0.8} style={styles.Button} onPress={()=>{this.Login()}}> 
                                <Text style={styles.btxt}>登录</Text>
                            </TouchableOpacity>

                         </View>
                </ImageBackground>
            </KeyboardAwareScrollView>
      
        )
    }


    Login(){
        this.Logincount++;
        Storage.get('factor')
        .then( (factor)=>{
            if(factor!=null){
                this.setState({
                    factor:factor
                })
            }
        }).then(()=>{
            Storage.get('next')
            .then( (next)=>{
                if(next!=null){
                    this.setState({
                        next:next
                    })
                }
            })
            .then(()=>{
    
                var  passWdEncrypt = new PasswdEncrypt( this.state.factor.n ,this.state.factor.e )
                var  pwd = passWdEncrypt.encrypt(this.state.password, this.state.factor.random )
                var  body = 'username='+this.state.user+'&password='+encodeURIComponent(pwd)+'&service=jxapp'+'&next='+this.state.next
    
                fetch(LoginArl,
                    {
                        method:'POST',
                        body:body,
                        headers:{
                            // 'Content-Type':'multipart/form-data',
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" ,
                            // 'ssid':this.ssid
                        },
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
                .then((responseJson)=>{
                    // console.warn(responseJson)
                    var factor = responseJson.data.factor,
                        next =  responseJson.data.next;
                    if(responseJson.statusCode == 200){                      
                        var subject = responseJson.data;
                        Storage.save('subject',subject)
                        .then(()=>{
                            this.Logincount = 0
                            this.props.navigation.navigate('Message')
                        })               
                    }else if(responseJson.message.indexOf('过期') == -1){                  
                        alert(responseJson.message)
                        Storage.save('factor',factor)
                        Storage.save('next',next)
                    }else if(responseJson.message.indexOf('过期') != -1){
                        // alert('已过期,请重试')
                        // console.warn(this.Logincount)
                        Storage.save('factor',factor).then(()=>{
                            Storage.save('next',next).then(()=>{    
                                // console.warn('我过期了')                            
                                if(this.Logincount < 10){
                                    this.Login()
                                }else{
                                    alert('程序出错 请重启应用')
                                }
                            })
                        })
                       
                    }
                })
    
            })

        })



    }

    componentDidMount(){

    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   justifyContent:'center',
      alignItems: 'center',
    },
    // logo:{
    //     marginBottom:20,
    //     width:80,
    //     height:80
    // },
    // logintitle:{
    //     fontSize:20,
    //     color:'#fff',
    //     fontWeight:'bold',
    //     marginBottom:25,
    // },
    main:{
        marginTop:(340/853.34)*height,
    },
    inputBox:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:25,
        backgroundColor:'#3B79F7',
        padding:10,
        paddingTop:6,
        paddingBottom:6,
        // borderWidth:1/PixelRatio.get(),
        // borderColor:'#fff',
        borderRadius:50,
    },
    iconBox:{
        width:30,
        height:30,
        borderRadius:30,
        backgroundColor:'#D8E4FD',
        justifyContent:'center',
        alignItems:'center',
    },
    icon:{
        color:'#3B78F7'
    },
    input:{
    //     borderWidth:1/PixelRatio.get(),
    //     borderColor:'#fff',
        width:width-80,
        height:40,
        color:'#fff',
    },
    Button:{
        width:width-40,
        backgroundColor:'#FE8868',
        height:48,
        justifyContent:'center',
        borderRadius:30,
        marginTop:25,
    },
    btxt:{
        fontSize:18,
        color:'#fff',
        textAlign:'center',
    }
  });
    