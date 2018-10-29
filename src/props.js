import PropTypes from 'prop-types';

// main
let props = function(spec){
  let out = {};
  for(let key in spec) {
    if (spec.hasOwnProperty(key)) {
      let req = spec[key];
      out[key] = prop(key, req);
    }
  }
  return out;
};

let prop = function(key, req){
  if(typeof req === 'string'){
    return getType(key, req);
  }
  else{
    if(isTypeArrayEmpty(req)){
      return type_array();
    }
    else if(isTypeArray(req)){
      return type_array_of(prop(key+'[]', req[0]));// recursion this
    }
    else if(isTypeObject(req)){
      return type_shape(props(req)); // recursion main
    }
  }
  throw(errorUnknowType(key, req));
}


// HELPER


let isTypeArrayEmpty = function(req){
  return Array.isArray(req) && req.length === 0;
}

let isTypeArray = function(req){
  return Array.isArray(req) && req.length > 0;
};

let isTypeObject = function(req){
  return typeof req === 'object';
}

let getType = function(key, req){
  switch(req){
    case 'number':   return type_number();
    case 'boolean':  return type_boolean();
    case 'string':   return type_string();
    case 'object':   return type_object();
    case 'array':    return type_array();
    case 'function': return type_function();
    case 'symbol':   return type_symbol();
  }
  throw(errorUnknowType(key, req));
};

let errorUnknowType = function(key, req){
  return new Error('unknow prop type - ', req);
};

let type_number   = ()=>(PropTypes.number.isRequired);
let type_boolean  = ()=>(PropTypes.bool.isRequired);
let type_string   = ()=>(PropTypes.string.isRequired);
let type_object   = ()=>(PropTypes.object.isRequired);
let type_array    = ()=>(PropTypes.array.isRequired);
let type_function = ()=>(PropTypes.func.isRequired);
let type_symbol   = ()=>(PropTypes.symbol.isRequired);
let type_array_of = (_type) => (PropTypes.arrayOf(_type).isRequired);
let type_shape = (_typeObj)=>(PropTypes.shape(_typeObj).isRequired);

export default props;
