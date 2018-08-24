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
  Picker
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {fillers,operate,dataCreate} from '../../api/Allapi'
import Storage from '../../utils/Storage'
import  json  from  '../../page/From/data'

export default class InspectionDateFrom5 extends Component{

    constructor(props){
        super(props)
        this.state ={
            data:[
                {id:1,name:''}
            ],
            person1:"",
            status:undefined
        }
        navigation = this.props.navigation
        this.from = navigation.getParam('from')
        this.salt = navigation.getParam('salt')
        this.saveS = navigation.getParam('saveS')
        this.status = navigation.getParam('status');
        this.code = this.salt.split('-')[2]
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '相关人员信息'),
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
            <ScrollView>
            <View style={styles.container}>
                <KeyboardAwareScrollView extraScrollHeight={20} >

                   <View style={styles.main} >
                        <Text style={styles.headerTitle}> 选择资料相关人员信息</Text>
                        <View style={styles.box}>

                            <Text  style={styles.smallTitle} >专职质量检查员</Text>
                            <View style={styles.pickerBox}>
                                <Picker
                                    selectedValue={this.state.person1}
                                    onValueChange={(lang) => this.setState({person1: lang})}
                                    style={styles.pickerStyle}
                                    mode='dialog'
                                    >                                   
                                    {this.state.data.map((item)=>{
                                        return <Picker.Item  key={item.id}  color='#000' label={item.name} value={item.id} />
                                    })}

                                    {/* <Picker.Item  color='#000' label="桌露露" value="1" />
                                    <Picker.Item color='#000' label="杨广义" value="2" /> */}
                                </Picker>
                            </View>

                            {/* <Text  style={styles.smallTitle} >分项工程技术负责人</Text>
                            <View style={styles.pickerBox}>
                                <Picker
                                    selectedValue={this.state.person2}
                                    onValueChange={(lang) => this.setState({person2: lang})}
                                    style={styles.pickerStyle}
                                    mode='dialog'
                                    >
                                    <Picker.Item  color='#000' label="杨广义" value="1" />
                                    <Picker.Item color='#000' label="桌露露" value="2" />
                                </Picker>
                            </View> */}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={()=>{
                            // this.props.navigation.navigate('InspectionDateDeatil')
                            // this.props.navigation.pop(5)
                            Storage.get('vtoken').then(data=>{
                                this.save(data)
                            })
                            
                        }}>
                            <Text style={styles.buttontext}>保存</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.button} onPress={()=>{
                            // this.props.navigation.navigate('InspectionDateDeatil')
                            // this.props.navigation.pop(5)
                            Storage.get('vtoken').then(data=>{
                                this.save(data,true)
                            })
                        }}>
                            <Text style={styles.buttontext}>提交</Text>
                    </TouchableOpacity>

                    {/* {this.state.status !=undefined?
                    <TouchableOpacity style={styles.button} onPress={()=>{
                            // this.props.navigation.navigate('InspectionDateDeatil')
                            // this.props.navigation.pop(5)
                            var select =  this.state.data.filter((item)=>{
                                if(item.id == this.state.person1 ){
                                    return item
                                }
                            })

                            if(select.length!=0){
                                if(select[0].name){
                                    this.props.navigation.navigate('InspectionDatePreview',{
                                        from:this.from,
                                        salt:this.salt,
                                        saveS:this.saveS,   
                                        person1:select[0].name,   
                                        subject:false,     
                                        status:this.status                   
                                    })
                                }
                            }else{
                                this.props.navigation.navigate('InspectionDatePreview',{
                                    from:this.from,
                                    salt:this.salt,   
                                    saveS:this.saveS,
                                    person1:'',   
                                    subject:false,     
                                    status:this.status                   
                                })
                            }

                        }}>
                            <Text style={styles.buttontext}>预览</Text>
                    </TouchableOpacity>
                    :null} */}

                </KeyboardAwareScrollView>
                </View>
            </ScrollView>
            
        )
    }


    /**
     * 保存 提交 数据
     * isSubmit true 提交  false 保存
     */
    save =(data,isSubmit) =>{
        
        let formData = new FormData();
        var select =  this.state.data.filter((item)=>{
            if(item.id == this.state.person1 ){
                return item
            }
        })
        // console.warn(this.salt)
        var positionId = this.salt.split('-')[1],
            code = this.salt.split('-')[2],
            content =  JSON.stringify(this.from),
            creatorId = select[0].id,
            creatorName = select[0].name,
            isSubmit = isSubmit||false,
            data = data||'';

        formData.append('positionId', positionId);
        formData.append('code', code);
        formData.append('content', content);
        formData.append('creatorId', creatorId);
        formData.append('creatorName', creatorName);
        formData.append('isSubmit', isSubmit);
        formData.append('vtoken', data);
        

        /**
         * 保存
         */
        fetch(dataCreate,
            {
                method:'POST',
                body:formData,
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
        .then((responseJson) => {
            
            // this.setState({
            //     status:0
            // })
            // console.warn(responseJson)
            if(responseJson.statusCode == 200){
                if(json['table'+this.code].master.length>0&&json['table'+this.code].ordinary.length>0){
                    this.props.navigation.pop(5)
                }else{
                    this.props.navigation.pop(4)
                }
            }else{
                alert('请重试')
            }
            // var json = responseJson["data"];
            // this.setState({
            //     data:json,
            // })
        })
    }



    /**
     * 加载数据
     */
    ReqFn =(data) =>{
        data = data || ''
        let fromdata = new FormData();
        fromdata.append('vtoken',data)
        fetch(fillers,
            {
                method:'POST',
                body:fromdata,
                headers:{
                    'Content-Type':'multipart/form-data',
                }
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
        .then((responseJson) => {
            // console.warn(responseJson)
            var json = responseJson["data"]["users"];
            var temp;
            Storage.get('subject')
            .then((data)=>{
                var loginId = data.loginUserId;    
                json.map((item,index,arr)=>{
                    if( item.id == loginId ){
                        temp = item;
                        arr.splice(index,1)
                    }
                })
                json.unshift(temp);
                return json
            })
            .then((json)=>{
                this.setState({
                    data:json,
                    person1:json[0].id
                })
            })
        })
    }

     componentDidMount(){   
         /**
         *  获取质量检查员
         */

        Storage.get('vtoken').then(data=>{
            if(data!=null){
                this.ReqFn(data)
            }else{
                this.ReqFn()
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
        marginBottom:10,
    },
    box:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingLeft:10,
    },
    boxLeft:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'flex-start',
        marginTop:15,
        marginBottom:10,
    },
    boxL:{
        fontSize:16,
        color:'#333',
        marginLeft:6
    },
    boxLIcon:{
        paddingLeft:8,
        paddingRight:8,
        paddingTop:6,
        paddingBottom:6,
        backgroundColor:'#70C0B3',
        alignSelf:'flex-start'
    },
    boxLIconText:{
        color:'#fff',
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
        marginTop:20,
        alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',  
        backgroundColor:'#2196F3',
        borderRadius:4
    },
    buttontext:{
        color:'#fff'
    },
    smallTitle:{
        alignSelf:'flex-start',
        color:'#666',
        fontSize:16,
        marginBottom:10,
        marginTop:15
    },
    smallInputBox:{
        width:width,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        marginBottom:10
    },
    smallInput:{
        width:(width-46)/6,
        height:40,
        margin:3,
        borderWidth:1/PixelRatio.get(),
        borderColor:'#333',
        alignSelf:'flex-start'
    },
    pickerBox:{
        width:width-20,
        borderWidth:1,
        borderColor:'#ddd',
        alignSelf:'flex-start',
    },
    pickerStyle:{
        width:width-22,
        height:40,
        alignSelf:'flex-start',
        justifyContent: 'center',
        alignItems: 'center',  
        backgroundColor:'#fff',
        color:'#000',
    }
  });
  