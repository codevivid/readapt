
// getPayload
export default function(name){
  let action = this;
  if(action['payload']===undefined){
    throw(errorPayloadMissing(action));
  }
  if(name===undefined){
    return action.payload;
  }
  if(typeof action['payload']!=='object'){
    throw(errorPayloadNotObject(action, name));
  }
  if(action.payload[name]===undefined){
    throw(errorPayloadPropertyMissing(action, name));
  }
  return action.payload[name];
}

function errorPayloadMissing(action){
  return new Error('The dispatched action with type "'+action.type+'" is missing a payload property.');
}

function errorPayloadNotObject(action, name){
  return new Error('The dispatched action with type "'+action.type+'" is missing a payload object with property "' + name + '"');
}

function errorPayloadPropertyMissing(action, name){
  return new Error('The dispatched action with type "'+action.type+'" has no payload property named "' + name +'"');
}
