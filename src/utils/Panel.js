import React, { Component, PropTypes } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableHighlight,
	TouchableOpacity,
	Animated,
	Dimensions
} from 'react-native'

import Icon from "react-native-vector-icons/Ionicons"
var {height,width} =  Dimensions.get('window');

const ICONS = {
	// up: require('./images/arrow-up.png'),
	// down: require('./images/arrow-down.png')
	up:'ios-arrow-dropup',
	down:'ios-arrow-dropdown'
}

export default class extends Component {
	// static propTypes = {
	// 	expanded: PropTypes.bool,
	// 	title: PropTypes.string,
	// 	onToggle: PropTypes.func
	// }
	static defaultProps = {
		expanded: true
	}

	constructor (props) {
	  super(props)

	  this.state = {
	  	expanded: props.expanded,
	  	animation: new Animated.Value()
	  }
	}

	toggle = () => {
		// const { onToggle } = this.props
		const { expanded, maxHeight, minHeight, animation } = this.state
		const initialValue = expanded ? minHeight + maxHeight : minHeight
		const finalValue = expanded ? minHeight : minHeight + maxHeight

		this.setState({expanded: !expanded})
		animation.setValue(initialValue)

		Animated.timing(animation, {
			toValue: finalValue,
			duration: 200,
		}).start()

		// onToggle()
	}

	render () {
		const { expanded, animation, maxHeight } = this.state
		const icon = expanded ? 'up' : 'down'

		return (
			<Animated.View style={[styles.container, {height: animation}]}>
			<TouchableOpacity  activeOpacity={1}	onPress={this.toggle}>
				<View style={expanded?styles.titleContainer:styles.titleContainer1}
					onLayout={event => this.setState({minHeight: event.nativeEvent.layout.height})}>
					<Text style={expanded?styles.title:[styles.title,styles.title1]}>{this.props.title}</Text>
					<Icon name={ICONS[icon]} size={24} style={{color:expanded?'#fff':'#4788FF'}}/>
							{/*<TouchableHighlight
							style={styles.button}
							onPress={this.toggle}
							underlayColor="#f1f1f1">
						<Image style={styles.buttonImage} source={ICONS[icon]} /> 
						</TouchableHighlight>*/}
				</View>
				</TouchableOpacity>
				{/*fixed bug in recent version of react-native that maxHeight will be changed when body is collapsed*/}
				<View style={styles.body}
					onLayout={event => !maxHeight && this.setState({maxHeight: event.nativeEvent.layout.height})}>
					{this.props.children}
				</View>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: 'transparent', 
    margin:10, 
    overflow:'hidden' 
	}, 
	titleContainer:{
		backgroundColor:'#528FFF',
		width:width-20,
		alignSelf:'center',
		borderTopLeftRadius:6,
		borderTopRightRadius:6,
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingRight:15
	},
  titleContainer1: { 
		backgroundColor:'#FFF',
		width:width-20,
		alignSelf:'center',
		borderRadius:6,
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingRight:15
	}, 
  title: { 
    flex: 1, 
    padding: 10,  
		fontSize:16,
		color:'#fff',
	}, 
	title1:{
		color:'#4788FF'
	},
  button: {
  	justifyContent: 'center',
  	alignItems: 'center'
  }, 
  buttonImage: { 
    width: 25, 
    height: 20 
  }, 
  body: { 
    // padding: 10, 
		// paddingTop: 0 ,
		// width:width-20,
		// backgroundColor:'#fff'
  }
});