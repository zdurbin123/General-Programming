// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
import {ObjectId} from 'mongodb';
import moment from 'moment';

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

  checkDate(date) {
    if (((!moment(date.trim(), 'MM/DD/YYYY', true).isValid()) && (!moment(date.trim(), 'MM/D/YYYY', true).isValid()) && (!moment(date.trim(), 'M/D/YYYY', true).isValid()) && (!moment(date.trim(), 'M/DD/YYYY', true).isValid())) || moment(date.trim()).isAfter(moment()))
        throw 'invalid date provided';

    return date;
  },

  checkTitle (title) {
    if (title.length < 5)
      throw 'title is too short';

    return title;
  },

  checkLimit(limit) {
    if (!limit) throw `Error: You must supply a number for limit/page count`;
  
    if (typeof limit !== 'number' || limit < 0 || limit.toString().includes('.')) 
          throw 'invalid limit or page count provided';
  
    return limit;
    }, 

  checkMin(min) {
    if (min === undefined) throw `Error: You must supply a minimum price`;
  
    if (typeof min !== 'number' || min < 0)
          throw 'invalid minimum price provided';
  
    return min;
    }, 

    checkPrice(price) {
        if (!price) throw `Error: You must supply a price`;
      
        if (typeof price !== 'number' || price < 0)
              throw 'invalid price provided';
      
        return price;
        }, 
    

    checkMax(max, min) {
        if (!max) throw `Error: You must supply a maximum price`;
        
        if (typeof max !== 'number' || max < min)
                throw 'max price must be higher than minionum';
        
        return max;
    },

    checkIsbn(str) {

        var sum,
            weight,
            digit,
            check,
            i;

        str = str.replace(/[^0-9X]/gi, '');

        if (str.length != 10 && str.length != 13) {
            return false;
        }

        if (str.length == 13) {
            sum = 0;
            for (i = 0; i < 12; i++) {
                digit = parseInt(str[i]);
                if (i % 2 == 1) {
                    sum += 3*digit;
                } else {
                    sum += digit;
                }
            }
            check = (10 - (sum % 10)) % 10;
            return (check == str[str.length-1]);
        }

        if (str.length == 10) {
            weight = 10;
            sum = 0;
            for (i = 0; i < 9; i++) {
                digit = parseInt(str[i]);
                sum += weight*digit;
                weight--;
            }
            check = (11 - (sum % 11)) % 11
            if (check == 10) {
                check = 'X';
            }
            return (check == str[str.length-1].toUpperCase());
        }
    },
    
    checkState (abr) {

        let states = 
        [{
            "name": "Alabama",
            "abbreviation": "AL",
            "capital": "Montgomery"
          },
          {
            "name": "Alaska",
            "abbreviation": "AK",
            "capital": "Juneau"
          },
          {
            "name": "Arizona",
            "abbreviation": "AZ",
            "capital": "Phoenix"
          },
          {
            "name": "Arkansas",
            "abbreviation": "AR",
            "capital": "Little Rock"
          },
          {
            "name": "California",
            "abbreviation": "CA",
            "capital": "Sacramento"
          },
          {
            "name": "Colorado",
            "abbreviation": "CO",
            "capital": "Denver"
          },
          {
            "name": "Connecticut",
            "abbreviation": "CT",
            "capital": "Hartford"
          },
          {
            "name": "Delaware",
            "abbreviation": "DE",
            "capital": "Dover"
          },
          {
            "name": "Florida",
            "abbreviation": "FL",
            "capital": "Tallahassee"
          },
          {
            "name": "Georgia",
            "abbreviation": "GA",
            "capital": "Atlanta"
          },
          {
            "name": "Hawaii",
            "abbreviation": "HI",
            "capital": "Honolulu"
          },
          {
            "name": "Idaho",
            "abbreviation": "ID",
            "capital": "Boise"
          },
          {
            "name": "Illinois",
            "abbreviation": "IL",
            "capital": "Springfield"
          },
          {
            "name": "Indiana",
            "abbreviation": "IN",
            "capital": "Indianapolis"
          },
          {
            "name": "Iowa",
            "abbreviation": "IA",
            "capital": "Des Moines"
          },
          {
            "name": "Kansas",
            "abbreviation": "KS",
            "capital": "Topeka"
          },
          {
            "name": "Kentucky",
            "abbreviation": "KY",
            "capital": "Frankfort"
          },
          {
            "name": "Louisiana",
            "abbreviation": "LA",
            "capital": "Baton Rouge"
          },
          {
            "name": "Maine",
            "abbreviation": "ME",
            "capital": "Augusta"
          },
          {
            "name": "Maryland",
            "abbreviation": "MD",
            "capital": "Annapolis"
          },
          {
            "name": "Massachusetts",
            "abbreviation": "MA",
            "capital": "Boston"
          },
          {
            "name": "Michigan",
            "abbreviation": "MI",
            "capital": "Lansing"
          },
          {
            "name": "Minnesota",
            "abbreviation": "MN",
            "capital": "Saint Paul"
          },
          {
            "name": "Mississippi",
            "abbreviation": "MS",
            "capital": "Jackson"
          },
          {
            "name": "Missouri",
            "abbreviation": "MO",
            "capital": "Jefferson City"
          },
          {
            "name": "Montana",
            "abbreviation": "MT",
            "capital": "Helena"
          },
          {
            "name": "Nebraska",
            "abbreviation": "NE",
            "capital": "Lincoln"
          },
          {
            "name": "Nevada",
            "abbreviation": "NV",
            "capital": "Carson City"
          },
          {
            "name": "New Hampshire",
            "abbreviation": "NH",
            "capital": "Concord"
          },
          {
            "name": "New Jersey",
            "abbreviation": "NJ",
            "capital": "Trenton"
          },
          {
            "name": "New Mexico",
            "abbreviation": "NM",
            "capital": "Santa Fe"
          },
          {
            "name": "New York",
            "abbreviation": "NY",
            "capital": "Albany"
          },
          {
            "name": "North Carolina",
            "abbreviation": "NC",
            "capital": "Raleigh"
          },
          {
            "name": "North Dakota",
            "abbreviation": "ND",
            "capital": "Bismarck"
          },
          {
            "name": "Ohio",
            "abbreviation": "OH",
            "capital": "Columbus"
          },
          {
            "name": "Oklahoma",
            "abbreviation": "OK",
            "capital": "Oklahoma City"
          },
          {
            "name": "Oregon",
            "abbreviation": "OR",
            "capital": "Salem"
          },
          {
            "name": "Pennsylvania",
            "abbreviation": "PA",
            "capital": "Harrisburg"
          },
          {
            "name": "Rhode Island",
            "abbreviation": "RI",
            "capital": "Providence"
          },
          {
            "name": "South Carolina",
            "abbreviation": "SC",
            "capital": "Columbia"
          },
          {
            "name": "South Dakota",
            "abbreviation": "SD",
            "capital": "Pierre"
          },
          {
            "name": "Tennessee",
            "abbreviation": "TN",
            "capital": "Nashville"
          },
          {
            "name": "Texas",
            "abbreviation": "TX",
            "capital": "Austin"
          },
          {
            "name": "Utah",
            "abbreviation": "UT",
            "capital": "Salt Lake City"
          },
          {
            "name": "Vermont",
            "abbreviation": "VT",
            "capital": "Montpelier"
          },
          {
            "name": "Virginia",
            "abbreviation": "VA",
            "capital": "Richmond"
          },
          {
            "name": "Washington",
            "abbreviation": "WA",
            "capital": "Olympia"
          },
          {
            "name": "West Virginia",
            "abbreviation": "WV",
            "capital": "Charleston"
          },
          {
            "name": "Wisconsin",
            "abbreviation": "WI",
            "capital": "Madison"
          },
          {
            "name": "Wyoming",
            "abbreviation": "WY",
            "capital": "Cheyenne"
          }
        ]

        let valid = false;
        for (let state of states) {
            if (state.abbreviation.toLowerCase() === abr.toLowerCase())
                valid = true;
        }

        if (!valid) 
            throw 'invalid state abbreviation provided';

        return abr.toUpperCase();
    }


};

export default exportedMethods;