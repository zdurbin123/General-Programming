//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.


export function getCurrentDateTime(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}


export function validateNewUser(firstName, lastName,userName, emailDomain, password, role) {

    if(!firstName || !lastName ||!userName|| !emailDomain || !password || !role){
      throw 'Error: all fields must be supplied';
    }
  
    checkString(firstName, "firstName");
    checkString(lastName, "lastName");
    checkString(userName, "userName");
    checkString(role, "role");
  
    // First and Last name check
    if(firstName < 2 || firstName > 25){
      throw 'Error: firstName too short or too long';
    }
    if(lastName < 2 || lastName > 25){
      throw 'Error: lastName too short or too long';
    }

    //userName check
    if(userName < 2 || userName > 25){
      throw 'Error: userName too short or too long';
    }
  
    // Email Check
    if(typeof emailDomain !== 'string'){
        throw 'Error: emailDomain must be of type string';
    }
    if(!emailDomain.includes(".")){
        throw 'Error: emailDomain must contain a dot';
    }
    let checkDots = emailDomain.split(".");
    for(let i = 1; i < checkDots.length; i++){
        if(checkDots[i].length < 2){
            throw 'Error: domain must have at least 2 letters after the dot';
        }
    }
  
    // Passworrd Check
    if(typeof password !== 'string'){
        throw 'Error: password must be of type string';
    }
    // Password check
    // if(!checkPassword(password)){
    //   throw 'Error: Password is missing one of these conditions: ' +
    //   'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character';
    // }
    checkPassword(password);
  
    // Role check
    if(role.toLowerCase() !== "admin" && role.toLowerCase() !== "user"){
      throw 'Error: role must be admin or user';
    }
  
  
  }

export function checkPassword(str) {
    //var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let specialChars = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;

    if(str.length < 8){
        throw 'Error: password must be 8 characters long minimum';
    }

    if(!specialChars.test(str)){
        throw 'Error: password must contain at least 1 special character';
    }

    if(str === str.toLowerCase()){
        throw 'Error: password must have at least 1 upper case';
    }

    if(!/\d/.test(str)){
        throw 'Error: password must have at least 1 number'
    }

}

export function checkString(strVal, varName) {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}

export function checkAmount(val) {
  if (typeof val !== 'number' || val <= 0 || val > 1000000)
    throw 'invalid amount provided';

  return val;
}

export function checkAge(val) {
  if (typeof val !== 'number' || val <= 0 || val > 112)
  throw 'invalid age provided';

  return val;
}
