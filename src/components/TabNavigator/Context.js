import React, { createContext, Component } from 'react';

const Context = createContext();

export class Provider extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.navigation !== state.navigation) {
      return {
        ...state,
        navigation: props.navigation,
      };
    }

    return null;
  }

  state = {
    navigation: null,
  };

  listeners = [];

  constructor(props) {
    super(props);

    this.contextValue = this.createContextValue();
  }

  addListener = (listener) => {
    this.listeners.push(listener);
  }

  getNavigation = () => {
    const { navigation } = this.state;

    return navigation;
  }

  createContextValue() {
    const { renderHeader, renderTabs } = this.props;

    return {
      addListener: this.addListener,
      getNavigation: this.getNavigation,
      renderHeader: (...args) => renderHeader(...args),
      renderTabs: (...args) => renderTabs(...args),
    };
  };

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;

    if (navigation !== prevProps.navigation) {
      this.listeners.map(listener => listener());
    }
  }

  render() {
    const { children } = this.props;

    return (
      <Context.Provider value={this.contextValue}>
        {children}
      </Context.Provider>
    );
  }
}

export class Consumer extends Component {
  static contextType = Context;

  componentDidMount() {
    const { addListener } = this.context;

    addListener(() => this.forceUpdate());
  }

  render() {
    const { children } = this.props;

    return children(this.context);
  }
}