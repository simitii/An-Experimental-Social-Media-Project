/**
 * ProjectDelta App
 * https://bitbucket.org/exteremecoders/project-delta-app/
 * @simitii
 * @kaandura
 *
 * Android App
 */

 import React, { Component } from 'react';
 import {
   AppRegistry
 } from 'react-native';

let App = require('./js/App');

 export default class ProjectDelta extends Component {
   render(){
     return <App/>;
   }
}

AppRegistry.registerComponent('ProjectDelta', () => ProjectDelta);
