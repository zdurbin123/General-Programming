import {donations} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helper from "../helpers.js";
import * as validation from "../validation.js";

const createComment = async (
    userId,
    donationId,
    commentText
) => {

//input validation
userId = validation.checkId(userId, 'User Id'); //this might need to be check string depending on how the id is supplied
donationId = validation.checkId(userId, 'Donation Id'); //this might need to be check string depending on how the id is supplied
commentText = helper.checkString(commentText, 'comment text');

let newComment = {_id: new ObjectId(), userId: userId, donationId: donationId, commentText: commentText};

const donationCollection = await donations();
await donationCollection.updateOne({_id: new ObjectId(donationId)}, {$push: {comments: newComment}});

return newComment;
}

const getAllComments = async (donationId) => {

    donationId = validation.checkId(donationId, 'Donation Id');
    const donationCollection = await donations();
    const donation = await donationCollection.get(donationId);
    if (!donation) throw 'Could not get donation';
    
    return donation.comments;
};

const get = async (id) => {
    id = validation.checkId(id, 'Dontion Id')
    const donationCollection = await donations();
    
    const donation = await donationCollection.find({'comments._id': new ObjectId(id)}).toArray();

    if (!donation) throw 'No comment with that id';

    for (let c of donation[0].comments) {
        if (c._id.toString() === id)
            return c;
    }
};

const removeComment = async (commentId) => {
    commentId = validation.checkId(commentId, 'Comment Id')

    await get(commentId);
    
    const donationCollection = await donations();
    
    donation = await donationCollection
        .find({ 'comments._id': commentId });
    
    await prodCollection.updateOne(
        { _id: donation._id },
        { $pull: {comments: { _id: commentId } } });
    
    return donations.get(donation._id);
};

export default {createComment, getAllComments, get, removeComment};
