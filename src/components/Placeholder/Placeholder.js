import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { createAnimatableComponent } from 'react-native-animatable';

const Gradient = createAnimatableComponent(LinearGradient);

export default class Placeholder extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    isActive: true,
  };

  state = {
    animation: null,
  };

  onLayout = ({ nativeEvent: { layout } }) => {
    this.setState({
      animation: {
        from: {
          transform: [
            { translateX: -layout.width },
          ],
        },
        to: {
          transform: [
            { translateX: layout.width },
          ],
        },
      },
    });
  };

  render() {
    const { style, children, isActive, ...props } = this.props;
    const { animation } = this.state;

    return (
      <View 
        {...props}
        style={[style, { overflow: 'hidden' }]} 
        onLayout={this.onLayout}
      >
        {children}

        {animation && isActive && (
          <Gradient
            useNativeDriver
            iterationDelay={400}
            duration={700}
            animation={animation}
            iterationCount="infinite"
            style={StyleSheet.absoluteFill} 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}}
            colors={[
              'rgba(255, 255, 255, 0)', 
              'rgba(255, 255, 255, 0.8)',
              'rgba(255, 255, 255, 0)',
            ]}
          />
        )}
      </View>
    );
  }
}
