import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import Navigator from './routes';

export * from './routes';
export const REDUCER_NAME = 'navigation';

const initialState = Navigator.router.getStateForAction(NavigationActions.init());

export const reducer = (state = initialState, action) => {
  const nextState = Navigator.router.getStateForAction(action, state);

  return nextState || state;
};

export const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state[REDUCER_NAME],
);

const addListener = createReduxBoundAddListener("root");

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
          addListener,
        })}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  navigation: state[REDUCER_NAME]
});

export default connect(mapStateToProps)(AppNavigator);
