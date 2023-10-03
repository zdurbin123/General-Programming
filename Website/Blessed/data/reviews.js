import {charities} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helper from "../helpers.js";
import validation from "../validation.js";

const createReview = async (
    charityId,
    userId,
    reviewText,
    rating
) => {

//input validation
reviewText = helper.checkString(reviewText, 'review');
rating = validation.checkRating(rating);
// userId = validation.checkId(userId, 'User Id'); //this might need to be check string depending on how the id is supplied
userId = validation.checkString(userId, 'User Name'); //this might need to be check string depending on how the id is supplied
charityId = validation.checkId(charityId, 'Charity Id'); //this might need to be check string depending on how the id is supplied


let newReview = {_id: new ObjectId(), charityId: charityId, userId: userId, reviewText: reviewText, rating: rating};

const charityCollection = await charities();
await charityCollection.updateOne({_id: new ObjectId(charityId)}, {$push: {reviews: newReview}});

return {message: "Review added successfully."};
}

const getAllReviews = async (charityId) => {

    charityId = validation.checkId(charityId, 'Charity Id');
    const charityCollection = await charities();
    const charity = await charityCollection.get(charityId);
    if (!charity) throw 'Could not get charity';
    
    return charity.reviews;
};

const get = async (id) => {
    id = validation.checkId(id, 'Review Id')
    const charityCollection = await charities();
   
    const charity = await charityCollection.find({'reviews._id': new ObjectId(id)}).toArray();

    if (!charity) throw 'No review with that id';

    for (let r of charity[0].reviews) {
        if (r._id.toString() === id)
            return r;
    }
};

const removeReview = async (reviewId) => {
    reviewId = validation.checkId(reviewId, 'review Id')

    await get(reviewId);
    
    const charityCollection = await charities();
    
    charity = await charityCollection
        .find({'reviews._id': reviewId});
    
    await charityCollection.updateOne(
        { _id: charity._id },
        { $pull: {reviews: { _id: reviewId } } });
    
    return charityCollection.get(charity._id);
};

export default {createReview, getAllReviews, get, removeReview};



