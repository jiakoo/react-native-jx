import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  DeviceEventEmitter
} from 'react-native';
var {height,width} =  Dimensions.get('window');
import Echarts from 'native-echarts'
import Storage from '../../utils/Storage'
import {PostionList} from '../../api/Allapi';


export default class Chart extends Component{
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            flag:false
        }
    }

    render(){
        
        if(this.state.flag){

            var fillOk = 0;
            this.state.data.data.positions.map(item=>{ 
                fillOk +=  parseInt(item.verified)  
            })


            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {c} ({d}%)"
                },
                // legend: {
                //     orient: 'vertical',
                //     x: 'left',
                //     data:['仰拱','仰拱填充','衬砌','防水和排水']
                // },
                series: [
                    {
                        name:'',
                        type:'pie',
                        selectedMode: 'single',
                        radius: [0, '30%'],
            
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:(1290-fillOk), name:'未完成', selected:true},
                            {value:fillOk, name:'完成'}
                        ]
                    },
                    {
                        name:'',
                        type:'pie',
                        radius: ['40%', '55%'],
                        label: {
                            normal: {
                                formatter: '{b}',
                                backgroundColor: '#eee',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                borderRadius: 4,
                                rich: {
                                    a: {
                                        color: '#999',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    hr: {
                                        borderColor: '#aaa',
                                        width: '100%',
                                        borderWidth: 0.5,
                                        height: 0
                                    },
                                    b: {
                                        fontSize: 16,
                                        lineHeight: 33
                                    },
                                    per: {
                                        color: '#eee',
                                        backgroundColor: '#334455',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }
                            }
                        },
                        data:[
                            {value:335, name:'仰拱'},
                            {value:310, name:'仰拱填充'},
                            {value:234, name:'衬砌'},
                            {value:135, name:'防水和排水'},
                            {value:1048, name:'仰拱'},
                            {value:251, name:'仰拱填充'},
                            {value:147, name:'衬砌'},
                            {value:102, name:'防水和排水'}
                        ]
                    }
                ]
            }

      
          return (
              <View style={styles.Chart}>
                    <Echarts option={option} height={280/360*width} width={width} />
              </View>       
          )
        }else{
            return null
        }

    }

    componentDidMount(){
        this.lister = DeviceEventEmitter.addListener('chart',(json)=>{
            this.setState({
                data:json,
                flag:true
            })
        })
    }
    
    componentWillUnmount(){
        this.lister.remove()
    }

}

const styles = StyleSheet.create({
    Chart:{
        width:width,
        // margin:10, 
        // padding:10,
        height:250/360*width,
        backgroundColor:'#f2f2f2',
    }
});
  

