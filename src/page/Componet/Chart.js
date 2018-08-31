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

            var fillOk = 0,
                filltotal = 0,
                group1ok=0,
                group1total=0,
                group2ok=0,
                group2total=0,
                group3ok=0,
                group3total=0,
                group4ok=0,
                group4total=0;
                

            this.state.data.data.count.map((item)=>{ 
                fillOk +=  parseInt(item.verified)  
                filltotal += parseInt(item.total)
                switch(item.code){
                    case '1': group1ok = item.verified;group1total = item.total; break;
                    case '2': group2ok = item.verified;group2total = item.total; break;
                    case '3': group3ok = item.verified;group3total = item.total; break;
                    case '4': group4ok = item.verified;group4total = item.total; break;
                }
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
                            {value:(filltotal-fillOk), name:'未完成', selected:true},
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
                            {value:group1ok, name:'仰拱'},
                            {value:group2ok, name:'仰拱填充'},
                            {value:group3ok, name:'衬砌'},
                            {value:group4ok, name:'防水和排水'},
                            {value:(group1total-group1ok), name:'仰拱'},
                            {value:(group2total-group2ok), name:'仰拱填充'},
                            {value:(group3total-group3ok), name:'衬砌'},
                            {value:(group4total-group4ok), name:'防水和排水'}
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
  

