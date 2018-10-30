![Readapt](/readapt.png)

Readapt helps you to minimize boilerplate code in React/Redux development.

This utility library has 3 main tools: [init](#init), [connect](#connect), [reducer](#reducer)

Readapt also comes with a [props](#props) function for writing cleaner ```propTypes```.

Install
```
npm install --save readapt
```

## init
This bootstrapping function helps you to initialize your React/Redux setup in just one line of code.

Before
```js
let store = createStore(
  combineReducers({ todos, user, form }),
  composeWithDevTools(applyMiddleware.apply(thunk, logger))
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'))
);
```
After
```js
ReactDOM.render(
  init(App, { todos, user, form }, [thunk, logger]),
  document.getElementById('root'))
);
```
It takes care of creating the **store**, setting up the **Redux DevTools Extension** and wrapping the **Provider** element around the root ```App``` component.

#### Getting Started

```js
import App from './App';
import todosRuducer from './reducers/todos';
import userReducer from './reducers/user';
import { init } from 'readapt'; // import

ReactDOM.render(
  init(App, { todos: todosReducer, user: userReducer }),
  document.getElementById('root'))
);
```
The ```init``` function takes two arguments, 1) the root App component of your application, and 2) a set of reducers.

There's a third optional argument, an array of Redux middlewares:
```js
init(App, { todos: todosReducer, user: userReducer }, [ thunk, logger ])
```

## connect
This is a wrapper for the ```connect``` function from the ```react-redux``` module. It helps you to connect a React ```component``` to a Redux ```store``` with a more concise format.

Before - with the ```react-redux connect```
```js
const mapState = (state) => ({
  currentItem: state.currentItem,
  list: state.list
});

const mapDispatch = (dispatch)  => ({
  toggleItem: (params) => dispatch({
    type: 'TOGGLE_CHECK', payload: params
  }),
  addItem: (params) => dispatch({
    type: 'ADD_ITEM', payload: params
  })
});

List = connect(mapState, mapDispatch)(List);
```
After - with the ```readapt connect```
```js
List = connect(['currentItem','list'], ['toggleItem','addItem'], List);
```

Oftentimes for straight-forward use cases, this can keep your code more readable.

#### Added Bonus: Typo-Proof

You don't have to hand-type the all-caps action type (e.g. ```TOGGLE_ITEM```) to dispatch an action.
In the above example, the name ```toggleItem``` will be used to create a dispatch function internally, the camelcase name
will be automatically converted into all-caps kebab-style name ```TOGGLE_ITEM``` for the action type.  Since you don't have to type it yourself, there's no chance of making a typo.


#### Getting Started
In the component file:
```js
import React, { Component } from 'react';
import { connect } from 'readapt'; // import

// no change in the component itself
class List extends Component {

  handleClick(itemId){
    this.props.toggleItem({itemId: itemId});
  }

  render(){
    let currentItem = this.props.currentItem;
    let list = this.props.list;
    return (
      <ul>
        { list.map((item)=>{
          return (
            <li className={currentItem.id===item.id ? 'current':''}
                onClick={()=>{this.handleClick(item.id);}}
                key={item.id}>
              {item.val}
            </li>
          );
        }) }
      </ul>
    );
  }
}

/*
  args:
  1) the connect function
  2) names of state items the component needs
  3) names of actions the component will dispatch
  4) the component itself
*/
List = connect(['list','currentItem'], ['toggleItem'], List);
export default List;
```
All the state items specified will be made available through ```props```.
And action names will be used to create dispatch functions, and these functions will be available as props too.

The dispatched action will still have the all-caps ```type``` property, because the library converts the camel-case names into all-caps for ```dispatch```.

#### Conventions
The ```connect``` function adopts the following conventions:
1. at most one argument will be passed to a prop dispatch function, and it will available as ```action.payload``` inside the reducer.
2. camel case for the dispatch function names (e.g. toggleItem), and all-caps for action types (e.g. TOGGLE_ITEM).

#### Configurations
There are 2 more optional arguments. You can use them to prefix the names of the state props and dispatch props.
```js
List = connect(['list','currentItem'], ['toggleItem'], List,
           'state', 'dispatch'); // optional args
```
Now ```list``` will be available as ```this.props.stateList```, while ```toggleItem``` will be available as ```this.props.dispatchToggleItem```.



## reducer
Write cleaner reducer code with ```object``` instead of ```switch``` statement.

#### Motivation

Once a reducer function gets long, with all the switch cases, it can get difficult to read and manage.

Before:
```js
const list = function(state=[], action){

  switch(action.type){

    case 'INIT_DATA':
      return action.payload;

    case 'TOGGLE_ITEM':
      let itemId = action.payload.itemId;
      return toggleItemInList(itemId, list)

    case 'ADD_ITEM':
      let item = action.payload.item;
      return pushToList(item, state);

    case 'RENAME_LIST':
      let newName = action.payload.name;
      return renameList(newName, state);

    case 'RENAME_ITEM':
      let newName = action.payload.name;
      let itemId = action.payload.itemId;
      return renameItemInList(itemId, newName, state);

    default:
      return state;
  }
}

export default list;

```
We can break up the reducer function into multiple small functions grouped in a plain JavaScript object.

After:

```js
import { reducer } from 'readapt';

let list = {};

list.initData (state, action)=>{
  return action.payload;
}

list.toggleItem = (state, action)=>{
  let itemId = action.payload.itemId;
  return toggleItemInList(itemId, state)
}

list.addItem = (state, action)=>{
  let item = action.payload.item;
  return pushToList(item, state);
}

list.renameList = (state, action)=>{
  let newName = action.payload.name;
  return renameList(newName, state);
}

list.renameItem = (state, action)=>{
  let newName = action.payload.name;
  let itemId = action.payload.itemId;
  return renameItemInList(itemId, newName, state);
}

export default reducer(list, []);

```

#### Getting Started

In the reducer code:
```js
import { reducer } from 'readapt';

// create an empty object
let list = {};

// this will match action.type 'INIT_DATA' automatically
// because the function name 'initData' will be converted
// to 'INIT_DATA' internally
list.initData (state, action)=>{
  return action.payload;
}

// same here, 'addItem' will match actions with type 'ADD_ITEM'
list.addItem = (state, action)=>{
  let item = action.payload.item;
  return pushToList(item, state);
}

// this is where you tie everything together,
// it will return a Redux-compatible reducer function
export default reducer(list, []); // [] will be the default value
```
#### Added Bonus - Guarding against ```undefined``` payload value
The ```action``` object will be loaded with a ```get``` method. It helps you to get your value from the ```action.payload``` object but throws an error when it's ```undefined```.
```js
list.initData (state, action)=>{
  return action.get(); // get action.payload
}

list.addList = (state, action)=>{
  let itemId = action.get('itemId'); // get action.payload.itemId
  return toggleItemInList(itemId, list)
}
```

## props

```props``` is a wrapper for React's ```prop-types``` module. It helps you to write ```propTypes``` code in a more concise fashion:
```js
import { props } from 'readapt';

class MyComponent extends Component {
  // component code
}

// propTypes code
MyComponent.propTypes = props({
  onSubmit: 'function',
  pageId:   'number',
  title:    'string',
  isCurrent:'boolean',
  items:    'array',
  formData: 'object',
  user:     { id: 'number', name: 'string' }
});
```
For more complex array requirements:
```js
MyComponent.propTypes = props({
  names: ['string'],
  items: [{
    id: 'number',
    name: 'string'
  }]
});
```
