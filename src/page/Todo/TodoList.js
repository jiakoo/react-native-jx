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
  ProgressBarAndroid
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import Icon from "react-native-vector-icons/Ionicons"

export default class TodoList extends Component{

    constructor(props){
        super(props)
        this.state ={
            data:[
                {"id":"DK52+461~DK52+470","ga_prefix":"17:30","title":"模拟检验批质量验收记录"},
                {"id":"DK52+461~DK52+470","ga_prefix":"09/12/2017","title":"钢筋检验批质量验收记录表"},
                {"id":"DK52+461~DK52+470","ga_prefix":"17:30","title":"混凝土（原材料）检验批质量验收记录"},
                {"id":"DK52+461~DK52+470","ga_prefix":"17:30","title":"混凝土（配合比和施工）检验批质量验收记录"},
                {"id":"DK52+461~DK52+470","ga_prefix":"09/12/2017","title":"混凝土（配合比和施工）检验批质量验收记录"},
                {"id":"DK52+461~DK52+470","ga_prefix":"17:30","title":"混凝土（结构外观和尺寸）检验批质量验收记录"},
                {"id":"DK52+461~DK52+470","ga_prefix":"17:30","title":"模拟检验批质量验收记录"},
                {"id":"DK52+461~DK52+470","ga_prefix":"09/12/2017","title":"模拟检验批质量验收记录"},
                {"id":"DK52+461~DK52+470","ga_prefix":"17:30","title":"模拟检验批质量验收记录"},
                {"id":"DK52+461~DK52+470","ga_prefix":"17:30","title":"模拟检验批质量验收记录"},
            ],
            refreshing:false,
        }
        navigation = this.props.navigation
    }

    /**
     *  标题
     */

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: navigation.getParam('title', '待办'),
          headerStyle: {
            backgroundColor: '#4788FF',
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
            <TouchableOpacity  onPress={()=>{alert(1)}}>
                <Text style={{color:'#fff',padding:10}}>全部处理</Text>                
            </TouchableOpacity>
          ),
        //   headerLeft:(
        //       <View/>
        //   )
        };
    };


    render(){
        return(
            <View style={styles.container}>
                <FlatList 
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}

                    /**
                     *  头尾布局
                     */
                    // ListHeaderComponent={this.header}
                    ListFooterComponent={this.footer}
                    // initialNumToRender={0}

                    //下拉刷新，必须设置refreshing状态
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}

                    //上拉加载
                    onEndReachedThreshold={0.1}
                    onEndReached={()=>{this.onEndReached()}}
                 />
                 <View style={[styles.layout,{backgroundColor:'#0000004a',width:width}]}><Text style={{fontSize:26,color:'#fff'}}>开发中</Text></View>
            </View>
        )
    }

    renderItem({item,index}){   
        return(
            <TouchableOpacity  style={[styles.box, index==0&&styles.box0]} onPress={()=>{navigation.navigate('TodoDetail',{
                // title:item.name,
                // header:item.creation
            })}}
            >

                <Icon name={'ios-list-box'} size={20} style={{color:'#4788FF'}}/>
                <View style ={styles.right}>
                    <Text style={styles.boxTitle} numberOfLines={2} >{item.title}</Text>
                    <View style={styles.boxBody}>
                        <Text style={styles.gray} numberOfLines={1} >{item.id}</Text>
                        <Text style={styles.gray} numberOfLines={1} >{item.ga_prefix}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    keyExtractor = (item,index) =>  item + index

    /**
     * 头布局
     */
    header = () => {
        return (
            <Text style={{
                backgroundColor: '#4398ff',
                color: 'white',
                fontSize: 18,
                textAlign: 'center',
                textAlignVertical: 'center',
                height: 30,
            }}>我是头布局</Text>
        )
    };
    /**
     * 尾布局
     */
    footer = () => {
        return (
            <Text style={{
                // marginTop: 10,
                // backgroundColor: '#F2F2F2',
                color: '#666',
                fontSize: 12,
                textAlign: 'center',
                textAlignVertical: 'center',
                height: 30,
            }}>--我是底线--</Text>
        )
    };

    /**
     * 下拉属性
     */
    count = 0;
    onRefresh = () => {
        //设置刷新状态为正在刷新
        this.setState({
            refreshing: true,
        });
        //延时加载
        const timer = setTimeout(() => {
            clearTimeout(timer);
            //往数组的第一位插入数据，模拟数据新增 , unshift()会返回数组的长度
            // this.state.data.unshift(
            //     {
            //         name:'加载成功',
            //         creation:this.count,
            //     }
            //  );
            //  this.count++;
            this.setState({
                refreshing: false,
            });
        }, 1500);
    };

    /**
     * 上拉加载
     */
    onEndReached = () => {
        if(false){
            ToastAndroid.show('正在加载中...', ToastAndroid.SHORT,ToastAndroid.CENTER);
        }
            //  this.state.data.push(
            //     {
            //         name:'加载成功',
            //         creation:this.count,
            //     }
            //  );
            //  this.count++;
    };


    /**
     * 加载数据
     */

     componentDidMount(){
        // var url = 'http://news-at.zhihu.com/api/4/news/latest';
        // fetch(url)
        // .then((response) => response.json())
        // .then((responseJson) => {
        //     var json = responseJson['stories'];
        //     json = json.concat(json);
        //     this.setState({
        //         data:json,
        //     })
        // })
     }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    //   justifyContent: 'flex-start',
    //   alignItems: 'flex-start',   
      justifyContent: 'center',
      alignItems: 'center', 
      backgroundColor:'#fff',
    },
    box:{
        width:width-10,
        marginLeft:10,
        paddingTop:10,
        paddingBottom:10,
        paddingRight:10,
        borderBottomWidth:1/PixelRatio.get(),
        borderColor:'#DBDBDB',
        flexDirection:'row',
    },
    box0:{
        marginTop:5
    },
    right:{
        flex:1,
        marginLeft:5
    },
    boxTitle:{
        color:'#333',
        fontSize:16,
    },
    boxBody:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:10,
    },
    gray:{
        color:'#666666',
        fontSize:13,
    },
    layout:{
        position: 'absolute',
        zIndex:999,
        backgroundColor:'#fff',
        width:width,
        height:height,
        justifyContent:'center',
        alignItems:'center'
    }
  });
  