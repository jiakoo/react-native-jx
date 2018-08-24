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
import {Logout,changePasswordTo} from '../../api/Allapi';

export default class InspectionDateDeatil extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:
                {
                    name:'',
                    acc:''
                }
            
        };
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '我的'),
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


    // 组件加载完成
    componentDidMount() {
        Storage.get('subject').then(data=>{
            if(data!=null){
                // console.warn(data)
                var data={
                    name:data.loginUserName,
                    acc:data.loginUserAccount
                }
                this.setState({
                    data:data
                })
            }
        })

    }

    render(){
        return(
            <View  style={styles.container} >   
                <TouchableOpacity  activeOpacity={1} style={styles.mecontent}  onPress={()=>{}}>
                    <View style={styles.meLeft} >
                            <View style={styles.meavge}>
                                <Image  resizeMode="cover" style={styles.meavgeImg} source={require('../../img/av.png')}/>
                            </View>
                            <View style={styles.meLeftB}>
                                <Text style={styles.meLeftBname}>{this.state.data.name}</Text>
                                <Text style={styles.meLeftBacc}>账号：{this.state.data.acc}</Text>
                            </View>
                    </View>

                    <View style={styles.meRight} >
                        <Icon 
                            name={'ios-arrow-forward'}
                            size={26}
                            // style={}
                        />
                    </View>

                </TouchableOpacity>
                
                <TouchableOpacity activeOpacity={0.8} style={[styles.Button,styles.ButtonChage]} onPress={()=>{
                        this.reloadP()
                }}> 
                    <Text style={styles.btxt}>修改密码</Text>
                </TouchableOpacity>
               
                <TouchableOpacity activeOpacity={0.8} style={styles.Button} onPress={()=>{this.Logout()}}> 
                    <Text style={styles.btxt}>退出</Text>
                </TouchableOpacity>

            </View>
        )
    }

    Logout=()=>{
        fetch(Logout)
        .then((response)=> response.text())
        .then((response)=>{
            Storage.delete('vtoken').then(()=>{})
            // console.warn(response)
            this.props.navigation.navigate('Login')
        })
    }

    reloadP =() =>{
        Storage.get('vtoken').then((data)=>{

            let formdata =  new FormData()
            formdata.append('vtoken'.data)

            fetch(changePasswordTo,{
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
                if(response.statusCode == 200){
                    // console.warn(response)
                    var factor = response.data.factor;
                    Storage.save('factor',factor).then(()=>{
                        this.props.navigation.navigate("ChangePassword")
                    })  
                }else if(response.statusCode == 301){
                    alert("您还没登录")
                    Storage.save('factor',factor).then(()=>{
                        this.props.navigation.navigate('Login')
                    })  
                }else{
                    alert("服务器崩溃了，请重启")
                }
            })

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
    mecontent:{
        width:width-20,
        marginLeft:10,
        marginRight:10,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:5,
        paddingRight:5,
        borderBottomWidth:2/PixelRatio.get(),
        borderColor:'#ddd',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center', 
    },
    meLeft:{
        flexDirection:'row',
    },
    meavge:{
        width:70,
        height:70,
        borderRadius:70,
        overflow:'hidden',
    },
    meavgeImg:{
        width:70,
        height:70,
    },
    meLeftB:{
        marginLeft:10,
    },
    meLeftBname:{
        paddingTop:10,
        paddingBottom:10,
        fontSize:16,
        color:'#000'
    },
    Button:{
        width:width-40,
        backgroundColor:'#FE8868',
        height:48,
        justifyContent:'center',
        borderRadius:30,
        marginTop:25,
        alignSelf:'center',
        marginTop:30
        // marginTop:200
    },
    btxt:{
        fontSize:18,
        color:'#fff',
        textAlign:'center',
    },
    ButtonChage:{
        backgroundColor:'#4395ff',
        marginTop:100
    }
});
  

