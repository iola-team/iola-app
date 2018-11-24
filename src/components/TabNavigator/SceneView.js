import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its container

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
  },
  attached: {
    flex: 1,
  },
  detached: {
    flex: 1,
    left: FAR_FAR_AWAY,
  },
});

export default class SceneView extends PureComponent {
  render() {
    const { isFocused, renderScene, route } = this.props;

    return (
      <View
        style={styles.container}
        collapsable={false}
        removeClippedSubviews
        pointerEvents={isFocused ? 'auto' : 'none'}
      >
        <View style={isFocused ? styles.attached : styles.detached}>
          {renderScene({ route })}
        </View>
      </View>
    );
  }
}