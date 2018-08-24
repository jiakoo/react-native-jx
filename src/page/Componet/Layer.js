import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity
} from 'react-native';

var {height,width} =  Dimensions.get('window');
import Icon from "react-native-vector-icons/Ionicons"

export default class Layer extends Component{
    constructor(props) {
        super(props);
        this.state = {     
            isShow:props.isShow 
        };
        this.timer;
    }
	static defaultProps = {
		isShow: false
	}

    hide =()=>{
        clearTimeout(this.timer)
        this.setState({isShow:false})
    }

    show = () =>{
        this.setState({isShow:true})
        if(this.props.delay){
           clearTimeout(this.timer)
           this.timer= setTimeout(()=>{
                this.setState({isShow:false})
            },this.props.delay)
        }

    }
    
    render(){
        if(this.state.isShow){
            return(
                <TouchableOpacity style={styles.container} activeOpacity={1}  onPress={()=>{this.hide()}}>                
                    <View style={styles.main}>
                        <Text style={styles.Text}>{this.props.content}</Text>
                    </View>
              </TouchableOpacity> 
            )
        }else{
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top:0,
      left:0,
      width:width,
      height:height,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    main:{
        backgroundColor:'#fff',
        padding:30,
        marginTop:-105,
        width:width-30,
        minHeight:150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10,
    },
    Text:{
        color:'#000',
        fontSize:16
    }
});
  

