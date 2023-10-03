import {charities} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helper from "../helpers.js";
import validation from "../validation.js";

const createCharity = async (
    charityName,
    category,
    creationDate,
    isCharity,
    location,
    age,
    picture,
    details
  ) => {

//input validation
charityName = helper.checkString(charityName, 'charity name');
category = helper.checkString(category, 'category');
details = helper.checkString(details, 'details');
creationDate = validation.checkDate(creationDate);
isCharity = validation.checkBool(isCharity);
location = helper.checkString(location, 'location');
age = helper.checkAge(age);
picture = helper.checkString(picture, 'picture link');

if (location.toLowerCase() !== 'america' && location.toLowerCase() !== 'africa' && location.toLowerCase() !== 'europe') {
  throw `location must be europe, africa, or america`;
}

let newCharity = {
    charityName: charityName,
    category: category,
    creationDate: creationDate,
    isCharity: isCharity,
    location: location.toLowerCase(),
    age: age,
    picture: picture,
    details: details,
    reviews: [],
    comments: []
  }

const charityCollection = await charities();
const insertInfo = await charityCollection.insertOne(newCharity);
if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add charity';
} else {
    return newCharity;
}

};

const getAll = async () => {

    const charityCollection = await charities();
    let charityList = await charityCollection.find({}).toArray();
    if (!charityList) throw 'Could not get all charities';
    /*charityList = charityList.map((element) => {
      element._id = element._id.toString();
      return element;
    });*/
    return charityList;
};

const getAllSponsors = async () => {

  const charityCollection = await charities();
  const sponsorList = await charityCollection.find({'isCharity': false}).toArray();
  if (!sponsorList) throw 'Could not get all sponsors';
  
  return sponsorList;
};

const get = async (id) => {
    id = validation.checkId(id, 'Charity Id')
    const charityCollection = await charities();
    const charity = await charityCollection.findOne({_id: new ObjectId(id)});
    if (charity === null) throw 'No charity with that id';
    charity._id = charity._id.toString();
    return charity;
  };

const getCharityByName = async (charityName) => {
    
    charityName = helper.checkString(charityName, 'charity');

    const charities = await getAll();
    let returnCharity = undefined;
    for(let i = 0; i < charities.length; i++){
      if(charities[i].charityName.toLowerCase() === charityName.toLowerCase()){
        returnCharity = charities[i];
      }
    }

    if (returnCharity === undefined) throw 'No charity with that name';

    return returnCharity;
};

const getSponsorByAge = async (age) => {
    
  age = helper.checkAge(age);

  const charityCollection = await charities();
  const sponsorList = await charityCollection.find({'age': age}).toArray();
  if (!sponsorList) throw 'Could not get all sponsors';

  let sponsorMatches = [];
  for(let i = 0; i < sponsorList.length; i++){
    if(!sponsorList[i].isCharity){
      sponsorMatches.push(sponsorList[i]);
    }
  }
  return sponsorMatches;
};

const getSponsorByLocation = async (location) => {
    
  location = helper.checkString(location);

  const charityCollection = await charities();
  const sponsorList = await charityCollection.find({'location': location.toLowerCase()}).toArray();
  if (!sponsorList) throw 'Could not get all sponsors';

  let sponsorMatches = [];
  for(let i = 0; i < sponsorList.length; i++){
    if(!sponsorList[i].isCharity){
      sponsorMatches.push(sponsorList[i]);
    }
  }
  return sponsorMatches;
};

const addReport = async (charityId, reportText) => {

  if(!charityId || !reportText) throw 'ID and text are required.';

  const charityCollection = await charities();

  const updateResult = await charityCollection.updateOne({_id: new ObjectId(charityId)}, {$push: {reports: reportText}});
  
  if (updateResult.modifiedCount === 0) {
      throw 'Failed to update the charity with report.';
  }

  const reportedCharity = await get(charityId);

  if (reportedCharity.reports.length === 3) {
    await remove(charityId)
    return {message: "Charity has been reported 3 times and has been removed from the database"};
  }

  return {message: "Report added successfully."};

};

const addReview = async (charityId, reviewText) => {

  if(!charityId || !reviewText) throw 'ID and text are required.';

  const charityCollection = await charities();

  const reviewedCharity = await get(charityId);

  if (reviewedCharity.reviews.length)
    throw `Cannot add review as there is a limit of 1 per charity`;

  const updateResult = await charityCollection.updateOne({_id: new ObjectId(charityId)}, {$push: {reviews: reviewText}});
  
  if (updateResult.modifiedCount === 0) {
      throw 'Failed to update the charity with review.';
  }

  return {message: "Review added successfully."};
};


const remove = async (id) => {

    validation.checkId(id, 'Charity Id')

    const charityCollection = await charities();
    const deletionInfo = await charityCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });

    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete product with id of ${id}`;
    }
    return `${deletionInfo.value.charityName} has been successfully deleted!`;
};

export default {createCharity, getAll, getAllSponsors, getSponsorByAge, getSponsorByLocation, get, getCharityByName, addReport, addReview, remove};
