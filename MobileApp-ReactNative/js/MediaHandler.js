import React, { Component } from 'react';
import {
  Platform
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

exports.selectPhoto = function(callback) {
const options = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true
  }
};

ImagePicker.showImagePicker(options, (response) => {
  console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled photo picker');
  }
  else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  }
  else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  }
  else {
    var source;

    // You can display the image using either:
    //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

    //Or:
    if (Platform.OS === 'android') {
      source = response.uri;
    } else {
      source = response.uri.replace('file://', '');
    }
  }
  callback(source);
});
}

exports.selectVideo = function(callback){
  //TODO implement video selection
}
