import { Provider } from 'react-redux';
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';

class ProviderApp extends React.Component {
  render(){

    let middleware = [];

    if(this.props.middleware!==undefined){
      middleware = this.props.middleware;
    }

    let store = createStore(
      combineReducers(this.props.reducers),
      composeWithDevTools(applyMiddleware.apply(null, middleware))
    );

    return (
      React.createElement(Provider, { store: store },
        React.createElement(this.props.root)
      )
    );
  }
}

export default function(App, reducers, middleware){

  if(App===undefined){
    throw(new Error("init - missing root component"))
  }

  if(typeof reducers!=='object'){
    throw(new Error("init - missing reducers"))
  }

  for(let key in reducers) {
    if (reducers.hasOwnProperty(key)) {
      let r = reducers[key];
      if(typeof r === 'object'){
        reducers[key] = reducer(r);
      }
    }
  }

  let props = {
    root: App,
    reducers: reducers,
    middleware: middleware
  };

  return React.createElement(ProviderApp, props);
};
