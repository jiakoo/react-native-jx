import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
var {height,width} =  Dimensions.get('window');
import Echarts from 'native-echarts'


export default class Chart extends Component{
    constructor(props) {
        super(props)
    }

    render(){
        const option = {
            title: {
                text: 'ECharts demo'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子1"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
          };
          return (
              <View style={styles.Chart}>
                    <Echarts option={option} height={300} width={width} />
              </View>       
          );
    }
}

const styles = StyleSheet.create({
    Chart:{
        width:width-30,
        margin:15, 
        height:300,
        backgroundColor:'#fff',
    }
});
  

