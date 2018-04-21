import React, { Component } from 'react';
import { Circle, CircleSnail } from 'react-native-progress';

export default class CircularProgress extends Component {
  render() {
    const { progress, loading } = this.props;
    const unknownProgress = progress === undefined || progress === null;

    console.log(progress);

    return (
      <Circle
        size={100}
        thickness={5}
        progress={progress || 0}
        indeterminate={unknownProgress}
      />
    );
  }
}
