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

export default class TodoDetail extends Component{
    constructor(props){
        super(props)
        this.state ={
            data:[

            ],
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
            )
          };
    };

    render(){
        return(
            <View style={styles.container}>
             <Text>暂无数据</Text>
                {/* <WebView
                    style={{
                        // height: 150,
                        width:width,
                        alignItems: 'center',
                    }}
                    source={{uri:'https://www.jianshu.com/p/962893068bb3'}}
                    // javaScriptEnabled={true}
                    // domStorageEnabled={true}
                    scalesPageToFit={true}
                /> */}
            </View>
        )
    }

    
    /**
     * 加载数据
     */

     componentDidMount(){
        // fetch('http://news-at.zhihu.com/api/2/news/latest')
        // fetch('http://news-at.zhihu.com/api/4/news/latest')
        // .then((response) => response.json())
        // .then((responseJson) => {
        //     var json = responseJson['stories'];
        //     this.setState({
        //         data:json,
        //     })
        // })
     }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    }
  });
  