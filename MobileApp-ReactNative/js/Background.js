/**
 * ProjectDelta App
 * https://bitbucket.org/exteremecoders/project-delta-app/
 * @simitii
 * @kaandura
 *
 * Main App
 */

import React, { Component } from 'react';
import {
  View
} from 'react-native';
export default class Background extends Component {
  render() {
    return (
      <View
          style={{
            height: this.props.height,
            width: this.props.width,
            position: 'absolute',
            top:0,
            left:0,
            backgroundColor:'#0097a7'
          }} />
    );
  }
}

module.exports = Background;
