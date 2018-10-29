import getPayload from './get-payload';

let cache = {};

export default function(cases, initValue){
  let reducer = function(state, action){
    let camelName = camel(action.type, cache);
    let f = cases[camelName];
    if(f===undefined){
      if(state===undefined){
        state = initValue; // default
      }
      return state;
    }
    else{
      action.get = getPayload.bind(action);
      return f(state, action);
    }
  }
  return reducer;
};

function camel(name, cache){
  if(name[0]==='@'){
    return;
  }
  else if(cache[name]!==undefined){
    return cache[name];
  }
  else if(name.indexOf('_')===-1){ // one word
    return name.toLowerCase();
  }
  else{
    let out = '';
    let words = name.split('_');
    for(let i=0; i<words.length; i++){
      let word = words[i].toLowerCase()
      if(i>0){
        word = word[0].toUpperCase() + word.substr(1);
      }
      out+=word
    }
    cache[name] = out;
    return out;
  }
}
