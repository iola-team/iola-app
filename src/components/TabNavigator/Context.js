import React, { createContext, Component } from 'react';

const Context = createContext();

export class Provider extends Component {
  listeners = [];

  constructor(props) {
    super(props);

    this.contextValue = this.createContextValue();
  }

  addListener = (listener) => {
    this.listeners.push(listener);
  }

  createContextValue() {
    const { renderHeader, renderTabs } = this.props;

    return {
      addListener: this.addListener,
      renderHeader: (...args) => renderHeader(...args),
      renderTabs: (...args) => renderTabs(...args),
    };
  };

  componentDidUpdate(prevProps) {
    const { isFocused } = this.props;

    if (isFocused !== prevProps.isFocused && isFocused) {
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