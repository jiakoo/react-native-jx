import { AppRegistry,YellowBox } from 'react-native';
import App from './App';

AppRegistry.registerComponent('Mytest', () => App);

// ignore Specific warning of bug caused by react native itsel
YellowBox.ignoreWarnings([
    // 'Warning: isMounted(...) is deprecated',
    // 'Module RCTImageLoader',
    // 'Class RCTCxxModule',
    // 'Setting a timer',
    // 'RCTBridge required dispatch_sync to load',
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
  ]);