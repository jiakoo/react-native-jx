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
  WebView
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import Storage from '../../utils/Storage';

export default class TodoDetail extends Component{
    constructor(props){
        super(props)
        this.state ={
            data:[],
            subject:{}
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
                    <Text style={styles.TitleHeader}>111</Text>
                    <View style={styles.ButtonGroup}>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonRed]}>
                            <Text style={styles.ButtonRedText} >全部撤回</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonBule]}>
                            <Text  style={styles.ButtonBuleText}>全部提交</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>222</Text> */}
                </View>
                :null}
                
                {this.state.isVerify?
                <View style={styles.center}>
                    <Text style={styles.TitleHeader}>111</Text>
                    <View  style={styles.ButtonGroup}>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonRed]}>
                            <Text style={styles.ButtonRedText}>全部拒绝</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonBule]}>
                            <Text style={styles.ButtonBuleText}>全部同意</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>111</Text> */}
                </View>
                :null}

                {this.state.isConfirm?
                <View style={styles.center}>
                    <Text style={styles.TitleHeader}>111</Text>
                    <View  style={styles.ButtonGroup}>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonRed]}>
                            <Text style={styles.ButtonRedText}>全部驳回</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.75} style={[styles.Button,styles.ButtonBule]}>
                            <Text style={styles.ButtonBuleText}>全部归档</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>111</Text> */}
                </View>
                :null}

            </View>
        )
    }

    
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
  