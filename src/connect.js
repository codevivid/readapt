import { connect } from 'react-redux';

let upcaseNamesCache = {};

export default function(stateSpec, dispatchSpec, comp, _prefix1, _prefix2){
  let prefix1 = '';
  let prefix2 = '';
  let isPrefix1Char = false;
  let isPrefix2Char = false;

  let hasPrefix1 = typeof _prefix1==='string' && _prefix1!=='';
  let hasPrefix2 = typeof _prefix2==='string' && _prefix2!=='';

  if(hasPrefix1){
    prefix1 = _prefix1;
    isPrefix1Char = isChar(prefix1.split('').pop());
  }

  if(hasPrefix2){
    prefix2 = _prefix2;
    isPrefix2Char = isChar(prefix2.split('').pop());
  }

  if(hasPrefix1 && !hasPrefix2){
    prefix2 = prefix1;
    isPrefix2Char = isPrefix1Char;
  }

  const mapState = function(state, ownProps){
    let map = {};
    for(let i=0; i<stateSpec.length;i++){
      let stateName = stateSpec[i];
      let propName = stateName;
      if(prefix1!==''){
        if(isPrefix1Char){
          propName = stateName[0].toUpperCase() + stateName.substr(1);
        }
        propName = prefix1 + propName;
      }
      map[propName] = state[stateName];
    }
    return map;
  };

  const mapDispatch = function(dispatch){
    let map = {};
    for(let i=0; i<dispatchSpec.length;i++){
      let dispatchName = dispatchSpec[i];
      let propName = dispatchName;
      if(prefix2!==''){
        if(isPrefix2Char){
          propName = dispatchName[0].toUpperCase() + dispatchName.substr(1);
        }
        propName = prefix2 + propName;
      }
      let actionName = '';
      if(upcaseNamesCache[dispatchName]===undefined){
        actionName = upcaseKebab(dispatchName);
        upcaseNamesCache[dispatchName] = actionName;
      }
      else{
        actionName = upcaseNamesCache[dispatchName];
      }
      map[propName] = function(param){
        dispatch({ type:actionName, payload: param });
      }
    }
    return map;
  };

  return connect(mapState, mapDispatch)(comp);
}

function upcaseKebab(name){
  if(/[A-Z]/.test(name)===false){
    // one word
    return name.toUpperCase();
  }
  let out = [];
  let chars = name.split('');
  for(let i=0;i<chars.length;i++){
    let char = chars[i];
    if(isCap(char)){ // upcase
      out.push('_'+char);
    }
    else{
      out.push(char.toUpperCase());
    }
  }
  return out.join('');
}

function isCap(char){
  if(char===undefined){ return false; }
  return /[A-Z]/.test(char);
}

function isChar(char){
  if(char===undefined){ return false; }
  return /[A-Za-z]/.test(char);
}
