import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter
} from 'react-native';

import { createStackNavigator,createBottomTabNavigator,createSwitchNavigator} from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons"
import Storage from './src/utils/Storage'

import Login from './src/page/Login/Login'

import Message from './src/page/Todo/Message'
import TodoList from './src/page/Todo/TodoList'
import TodoDetail from './src/page/Todo/TodoDetail'

import InspectionDateList from './src/page/InspectionDate/InspectionDateList'
import InspectionDateDeatil from './src/page/InspectionDate/InspectionDateDeatil'

import InspectionDateFrom from './src/page/InspectionDate/InspectionDateFrom'
import InspectionDateFrom2 from './src/page/InspectionDate/InspectionDateFrom2'
import InspectionDateFrom3 from './src/page/InspectionDate/InspectionDateFrom3'
import InspectionDateFrom4 from './src/page/InspectionDate/InspectionDateFrom4'
import InspectionDateFrom5 from './src/page/InspectionDate/InspectionDateFrom5'
import InspectionDatePreview from './src/page/InspectionDate/InspectionDatePreview'

import Me from './src/page/Me/Me'
import ChangePassword from './src/page/Me/ChangePassword'

import {perm} from './src/api/Allapi'

import SplashScreen from 'react-native-splash-screen'

export default class App extends Component {

 constructor(props){
     super(props)
     this.state={
         isLogin:true
     }
 }

  render() {
      if(this.state.isLogin){
            return (
                <SnavMain/>
            )
      }else{
            return (
                <SnavLgoin/>
            )
      }
  }


  /**
   *  请求
   */


  permFn = (data) =>{

    data = data ||''
    let fromdata = new FormData()
    fromdata.append('vtoken',data)

    fetch(perm,
        {
            method:'POST',
            body:fromdata,
            headers:{
                'Content-Type':'multipart/form-data',
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
        if(responseJson.statusCode == 200){
            this.setState({
                isLogin:true
            })
            // var subject = responseJson.data
            // Storage.save('subject',subject)
        }else if(responseJson.statusCode == 301){
            this.setState({
                isLogin:false
             })

            var factor = responseJson.data.factor,
                next =  responseJson.data.next;
            console.warn(responseJson)
            Storage.save('factor',factor)
            Storage.save('next',next)

        }
    })

  }

  componentDidMount(){

    setTimeout(()=>{ SplashScreen.hide()},500)
    
    Storage.get('vtoken').then(data=>{
        if(data!=null){
            this.permFn(data)
        }else{
            this.permFn()
        }
    })

  }

}


class Numbar extends Component{
    constructor(props){
        super(props)
        this.state={
            num:9
        }
    }
    render() {
        return (
           <View>
                <Icon 
                name={'ios-notifications'}
                size={26}
                style={{color:this.props.tintColor}}
                />
                 {this.state.num?
                <View style={styles.Badge}>
                    <Text style={styles.BadgeText}>{this.state.num}</Text>
                </View>
                :<View></View>
                }
           </View>
        );
      }
    
      componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('dataChange',(num)=>{
            this.setState({
                num:num
            })
        });
      }
      
}



/**
 *  创建路由
 */

const Message1 = createStackNavigator({
    Message:{
        screen:Message,
        navigationOptions:{
            title:'消息'
        }
    },
},{
    navigationOptions:{
        headerStyle: {
            backgroundColor: '#0077e6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center'
        },
    }
})
const InspectionDateList1 = createStackNavigator({
    InspectionDateList:{
        screen:InspectionDateList,
        navigationOptions:{
            title:'检验数据'
        }
    }
},{
    navigationOptions:{
        headerStyle: {
            backgroundColor: '#0077e6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center'
        },
    }
})
const Me1 = createStackNavigator({
    Me:{
        screen:Me,
        navigationOptions:{
            title:'我的'
        }
    }
},{
    navigationOptions:{
        headerStyle: {
            backgroundColor: '#0077e6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center'
        },
    }
})

const Bottomtab = createBottomTabNavigator({
    Message:{
        screen:Message1,
        navigationOptions :{
            tabBarLabel:'消息',
            tabBarIcon:({focused,tintColor})=>(
                <Numbar tintColor={tintColor}/>  
            ), 
        }
   },
   InspectionDateList:{
        screen:InspectionDateList1,
        navigationOptions:{
            tabBarLabel:'检验数据',
            tabBarIcon:({focused,tintColor})=>(
                <Icon 
                  name={'ios-pulse'}
                  size={26}
                  style={{color:tintColor}}
                />
            )
        }
   },
   Me:{
       screen:Me1,
        navigationOptions:{
            tabBarLabel:'我的',
            tabBarIcon:({focused,tintColor})=>(
                <Icon 
                name={'md-person'}
                size={26}
                style={{color:tintColor}}
                />
            )
        }
   }
},{
    // tabBarPosition:'bottom',
    // initialRouteName:'InspectionDateList',
    swipeEnabled : false,
    animationEnabled: false,
    // backBehavior: "none",
    tabBarOptions :{          
        showIcon :true,
        showLabel:true,
    },
    labelStyle:{
        fontSize:13,
    },
    indicatorStyle: {//标签指示器的样式对象（选项卡底部的行）。安卓底部会多出一条线，可以将height设置为0来暂时解决这个问题
        height: 0,
    }
})


const Cnav = createStackNavigator({
    Bottomtab:{
        screen:Bottomtab,
        navigationOptions:{
            header:null,
        }
    },
    TodoList:{
        screen:TodoList
    },
    TodoDetail:{
        screen:TodoDetail
    },
    InspectionDateDeatil:{
        screen:InspectionDateDeatil
    },
    InspectionDateFrom:{
        screen:InspectionDateFrom
    },
    InspectionDateFrom4:{
        screen:InspectionDateFrom4
    },
    InspectionDateFrom5:{
        screen:InspectionDateFrom5
    },
    InspectionDateFrom2:{
        screen:InspectionDateFrom2
    },
    InspectionDateFrom3:{
        screen:InspectionDateFrom3
    },
    InspectionDatePreview:{
        screen:InspectionDatePreview
    },
    ChangePassword:{
        screen:ChangePassword
    }
},{
    // initialRouteName:'Bottomtab',
    // initialRouteName:'InspectionDatePreview',
    mode:'modal',
    navigationOptions: {
        headerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.21)',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
          flex:1,
          textAlign:'center'
        },
      },
})

/**
 * 判断是否登录
 */


const SnavLgoin = createSwitchNavigator ({
    Cnav:Cnav,
    Login:Login
},{
    initialRouteName: 'Login',
})

const SnavMain = createSwitchNavigator ({
    Cnav:Cnav,
    Login:Login
},{
    initialRouteName: 'Cnav',
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  Badge:{
    position:'absolute',
    left:15,
    top:-2,
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
