import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';

import Navigator from './routes';

export const REDUCER_NAME = 'navigation';
export * from '../screens';

const initialState = Navigator.router.getStateForAction(NavigationActions.init());

export const reducer = (state = initialState, action) => {
  const nextState = Navigator.router.getStateForAction(action, state);

  return nextState || state;
};

const getCurrentScreenState = (state) => {
  if (!state) {
    return null;
  }

  const route = state.routes[state.index];

  if (route.routes) {
    return getCurrentScreenState(route);
  }

  return route;
};

class AppNavigator extends Component {
  render() {
    const { dispatch, navigation: state } = this.props;

    const currentState = getCurrentScreenState(state);

    return (
      <Navigator
        screenProps={{
          currentState,
        }}

        navigation={addNavigationHelpers({
          dispatch,
          state,
        })}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  navigation: state[REDUCER_NAME]
});

export default connect(mapStateToProps)(AppNavigator);
