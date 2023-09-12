import {ObjectId} from 'mongodb';
import moment from 'moment';

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkDate(date) {
    if (!date) throw `Error: You must supply a date`;
    date = date.trim();

    if (!moment(date.trim(), 'MM/DD/YYYY', true).isValid())
        throw 'invalid date provided';
      
    return date;
  },

 checkRating(rating) {
  if (!rating) throw `Error: You must supply a rating`;

  if (typeof rating !== 'number' || rating < 1 || rating > 5)
        throw 'invalid rating provided';

  return rating;
  },

 checkBool(boole) {
  if (typeof(boole) === 'undefined' || boole === null) throw `Error: You must provide the ${boole} field`;

  if (typeof(boole) !== 'boolean')
    throw `${boole} is not a boolean`;

  return boole;
 } 
};

export default exportedMethods;
