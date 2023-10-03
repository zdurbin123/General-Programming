// This data file should export all functions using the ES6 standard as shown in the lecture code
import { recipes } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { recipeData } from './index.js';
import  helpers from '../helpers.js';

const exportedMethods = {async createReview(
  recipeId,
  rating,
  review,
  user
) {

rating = helpers.checkRating(rating);
review = helpers.checkReview(review);

let newReview = {_id: new ObjectId(), user: {_id: user._id, username: user.username}, rating: rating, review: review};
const recipeCollection = await recipes();

await recipeCollection.updateOne({_id: new ObjectId(recipeId)}, {$push: {reviews: newReview}});

const recipe = await recipeData.get(recipeId);

return recipe;
},

async getAllReviews(productId) {

proId = productId.trim();
if (!productId) throw 'You must provide an id to search for';
if (typeof productId !== 'string') throw 'Id must be a string';
if (productId.length === 0)
    throw 'Id cannot be an empty string or just spaces';
if (!ObjectId.isValid(productId)) throw 'invalid object ID';

const product = await productData.get(productId);

return product.reviews;
},

async removeReview(reviewId, recipeId) {

reviewId = helpers.checkId(reviewId, 'review ID');
recipeId = helpers.checkId(recipeId, 'recipe ID');

const recipeCollection = await recipes();

await recipeCollection.updateOne(
    {_id: new ObjectId(recipeId)},
    {$pull: {reviews: {_id: new ObjectId(reviewId)}}});

const returnVal = await recipeData.get(recipeId);

return returnVal;
}
};

export default exportedMethods;



