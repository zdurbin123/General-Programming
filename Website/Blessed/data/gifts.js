import {gifts} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helper from "../helpers.js" 
import validation from "../validation.js" 

const createGift = async (
    giftName,
    category,
    price,
    reviewText
  ) => {

//input validation
giftName = helper.checkString(giftName);
category = helper.checkString(category);
reviewText = helper.checkString(reviewText);
price = helper.checkAmount(price);

let newGift = {
    giftName: giftName,
    category: category,
    price: price,
    reviewText: reviewText
  }

const giftCollection = await gifts();
const insertInfo = await giftCollection.insertOne(newGift);
if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add gift';
} else {
    return {insertedUser: true};
}

};

const getAll = async () => {
    const giftCollection = await gifts();
    let giftList = await giftCollection.find({}).toArray();
    if (!giftList) throw 'Could not get all gifts';
    giftList = giftList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return giftList;
  };

  const get = async (id) => {
    validation.checkId(id, 'Gift Id')
    const giftCollection = await gifts();
    const gift = await giftCollection.findOne({_id: new ObjectId(id)});
    if (gift === null) throw 'No gift with that id';
    gift._id = gift._id.toString();
    return gift;
  };

  const getGiftbyName = async (giftName) => {
   
  };

  export default {createGift, getAll, get};
