// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
import {ObjectId} from 'mongodb';

const exportedMethods = {
  checkId(id, varName) {
    id = id.trim();
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
    if (!arr || !Array.isArray(arr) || arr.length === 0)
      throw `You must provide an array of ${varName}`;

    return arr;
  },

  checkIngredients(arr) {

    if (arr.length < 4)
      throw 'must have at least 4 elements in the ingredients array';

    for (let i in arr) {
      if (arr[i].length < 4 || arr[i].length > 50) {
        throw `One of the ingredients is less than 4 characters long or greater than 50 characters long`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkTitle (title) {
    if (title.length < 5)
      throw 'title is too short';

    return title;
  },

  checkSteps(arr) {

    if (arr.length < 5)
      throw 'must have at least 5 elements in the steps array';

    for (let i in arr) {
      if (arr[i].length < 20) {
        throw `Steps must be at least 20 characters each`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkSkillLevel (level) {
    level = level.toLowerCase();

    if (level !== 'novice' && level !== 'intermediate' && level !== 'advanced')
      throw 'invalid skill level provided';

    return level;
  },

  checkRating(rating) {
    if (!rating) throw `Error: You must supply a rating`;
  
    if (typeof rating !== 'number' || rating < 1 || rating > 5)
          throw 'invalid rating provided';
  
    return rating;
    }, 

  checkReview(review) {
    if (review.length < 25)
      throw 'review is too short';

    return review;
  },

  checkusername(username) {
    if (username.length < 5)
      throw 'username is too short';

    if (!username.match(/^[0-9a-z]+$/))
      throw 'username must be alphanumeric';

    return username;
  },

  checkPassword(str) {
      let specialChars = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;
  
      if(str.length < 8){
          throw 'password must be 8 characters long minimum';
      }
  
      if(!specialChars.test(str)){
          throw 'password must contain at least 1 special character';
      }
  
      if(str === str.toLowerCase()){
          throw 'password must have at least 1 upper case';
      }
  
      if(!/\d/.test(str)){
          throw 'password must have at least 1 number'
      }

      return str;
  }

};

export default exportedMethods;