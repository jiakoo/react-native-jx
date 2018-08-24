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

export default class InspectionDateFrom4 extends Component{

    constructor(props){
        super(props)
        this.state ={
            data:[
            ],
            from:{}
        }
        navigation = this.props.navigation
        this.from = navigation.getParam('from')||{}
        this.salt = navigation.getParam('salt')
        this.saveS = navigation.getParam('saveS')
        this.status = navigation.getParam('status');
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '责任登记'),
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


    render(){
        return(
            <ScrollView>
            <View style={styles.container}>
                <KeyboardAwareScrollView extraScrollHeight={20} >
                   <View style={styles.main} >
                        <View style={styles.headerTitlebox}>
                            <Text style={styles.headerTitle}>施工作业人员质量责任登记</Text>
                        </View>
                        <View style={styles.box}>
                        <TextInput 
                                style={styles.boxR}
                                underlineColorAndroid='transparent'
                                multiline={true}
                                textAlignVertical='top'
                                blurOnSubmit={true}
                                // returnKeyType="next"
                                // placeholder="请输入单位工程名称"
                                ref="0"
                                defaultValue={this.state.from.f1}
                                onChangeText={(text)=>this.onChangeText(text,'f1')}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={()=>{
                           var from = Object.assign(this.from,this.state.from)
                        //    console.warn(this.from);
                            this.props.navigation.navigate('InspectionDateFrom5',{
                                from:from,
                                salt:this.salt,
                                status:this.status,
                                saveS:this.saveS
                            })
                        }}>
                            <Text style={styles.buttontext}>下一步</Text>
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
                </View>
            </ScrollView>
            
        )
    }

    /**
     * 加载数据
     */

     componentDidMount(){

        Storage.get(this.saveS).then(data=>{
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
      flexDirection:'row',
      paddingBottom:30,
    },
    headerTitlebox:{
        backgroundColor:'#fff',
        marginBottom:10,
    },
    headerTitle:{
        textAlign:'left',
        fontWeight:"400",
        color:'#333',
        fontSize:16,
        padding:10,
        borderBottomWidth:1/PixelRatio.get(),
        borderColor:'#ddd'
    },
    main:{
        backgroundColor:'#fff',
        paddingBottom:20,
    },
    box:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:10,
    },
    boxR:{
        width:width-20,
        fontSize:16,
        minHeight:70,
        padding:10,
        borderWidth:2/PixelRatio.get(),
        borderColor:'#ccc',
        alignSelf:'flex-start',
    },
    button:{
        width:width-20,
        height:40,
        marginTop:30,
        alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',  
        backgroundColor:'#2196F3',
        borderRadius:4
    },
    buttontext:{
        color:'#fff'
    },
  });
  