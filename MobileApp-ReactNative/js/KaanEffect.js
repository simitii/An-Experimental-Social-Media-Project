import React, { PropTypes, Component } from 'react';
import {
  Animated,
  Easing,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';

import BaseInput from './BaseInput';

const PADDING = 16;
let window = Dimensions.get('window');
let width = window.width;
let height = window.height;
export default class KaanEffect extends BaseInput {


  static defaultProps = {
    easing: Easing.bezier(0.2, 1, 0.3, 1),
  };

  render() {
    const {


      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
    } = this.props;
    const { focusedAnim, value } = this.state;

    return (
      <View style={[styles.container, containerStyle]} onLayout={this._onLayout}>
        <TouchableWithoutFeedback onPress={this._focus}>
          <Animated.View style={{
            justifyContent: 'center',
            alignItems:'center',
            padding: PADDING,
            marginLeft: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-80, 0],
            }),
          }}>
            <Text style={{ color: '#e7e7e7',fontSize:width/15,fontWeight:'bold',alignSelf:'center'}}>
            {this.props.text}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this._focus}>
          <Animated.View style={{
  alignItems:'center',
  padding: PADDING,
            justifyContent: 'center',
            left: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 80],
            }),
            opacity: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}>
            <Text style={{ color: '#e7e7e7',fontSize:width/15,fontWeight:'bold',alignSelf:'center'}}>
              {this.props.text}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <TextInput
          ref="input"
          {...this.props}
          style={[styles.textInput, inputStyle]}
          value={value}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          onChange={this._onChange}
          underlineColorAndroid={'transparent'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  label: {
    fontSize: 18,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#e7e7e7',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: PADDING,
    paddingVertical: 0,
    color: '#e7e7e7',
    fontSize: 18,
  },
});
module.exports=KaanEffect;
