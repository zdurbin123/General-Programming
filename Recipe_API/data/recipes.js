// This data file should export all functions using the ES6 standard as shown in the lecture code
import {ObjectId} from 'mongodb';
import {recipes} from '../config/mongoCollections.js';
import { recipeData  } from './index.js';
import  helpers from '../helpers.js';


const exportedMethods = {  async create(
  title,
  ingredients,
  steps,
  skillLevel, 
  user
) {

    title = helpers.checkString(title, 'title');
    title = helpers.checkTitle(title);
    ingredients = helpers.checkStringArray(ingredients, 'ingredients');
    ingredients = helpers.checkIngredients(ingredients);
    steps = helpers.checkStringArray(steps, 'steps');
    steps = helpers.checkSteps(steps);
    skillLevel = helpers.checkString(skillLevel, 'skillLevel');
    skillLevel = helpers.checkSkillLevel(skillLevel);

    let newRecipe = {title: title, ingredients: ingredients, steps: steps, skillLevel: skillLevel, user: user, reviews: [], likes: []};

    const recipeCollection = await recipes();
    const insertInfo = await recipeCollection.insertOne(newRecipe);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add recipe';

    const newId = insertInfo.insertedId.toString();
    const recipe = await recipeCollection.findOne({ _id: new ObjectId(newId)});

    return recipe;
},

async getPage(page) {

 const recipeCollection = await recipes();

 let recipeList = await recipeCollection.find({}).skip(50 * (page-1)).limit(50).toArray();
 if (!recipeList) throw `No more recipes on page ${page}`;

 return recipeList;
},

async get(recipeId) {

    recipeId = helpers.checkId(recipeId, 'recipe ID');

    const recipeCollection = await recipes();

    const rec = await recipeCollection.findOne({ _id: new ObjectId(recipeId)});
    if (!rec) throw 'No recipe with that id';

    return rec;
},

async addLike(recipeId, user) {

    recipeId = helpers.checkId(recipeId, 'recipe ID');

    const recipeCollection = await recipes();
    const recipe = await this.get(recipeId);

    let alreadyLiked = false;

    for (let l of recipe.likes) {
        if (l === user._id)
            alreadyLiked = true;
    } 

    if (alreadyLiked) {
        var updateResult = await recipeCollection.updateOne({_id: new ObjectId(recipeId)}, {$pull: {likes: user._id}});
    }
    else {
        var updateResult = await recipeCollection.updateOne({_id: new ObjectId(recipeId)}, {$push: {likes: user._id}});
    }
    
    if (updateResult.modifiedCount === 0) {
        throw 'Failed to add like to the recipe';
    }

    const returnRecipe = await this.get(recipeId);

    return returnRecipe;
},

async update(updatedRecipe, recipeId) {

if (!updatedRecipe) 
     throw 'An attribute to update needs to be provided';

let recipe = await this.get(recipeId);

let recipeFields = Object.keys(updatedRecipe);

if (Object.keys(updatedRecipe).includes('reviews') || Object.keys(updatedRecipe).includes('likes') || Object.keys(updatedRecipe).includes('username') || Object.keys(updatedRecipe).includes('name') || Object.keys(updatedRecipe).includes('password')) {throw 'Cannot update reviews, likes, or user'};

let allSame = false;
//update whichever fields were provided
for (let key of recipeFields) {
    if (key === 'title')
    {
        updatedRecipe.title = helpers.checkString(updatedRecipe.title, 'title');
        updatedRecipe.title = helpers.checkTitle(updatedRecipe.title);

        if(recipe.title === updatedRecipe.title) 
            throw 'field being updated must be different than the current field';

        recipe.title = updatedRecipe.title;
    }
    if (key === 'ingredients')
    {
        updatedRecipe.ingredients = helpers.checkStringArray(updatedRecipe.ingredients, 'ingredients');
        updatedRecipe.ingredients = helpers.checkIngredients(updatedRecipe.ingredients, 'ingredients');

        //throw error if every element of ingredients array in existing recipe matches the updated ingredients
        allSame = true;
        for (let i of recipe.ingredients) {
            if (!updatedRecipe.ingredients.includes(i))
                allSame = false;
        }
        if (allSame && (recipe.length === updatedRecipe.length)) {
            throw 'field being updated must be different than the current field';
        }

        recipe.ingredients = updatedRecipe.ingredients;
    }
    if (key === 'steps')
    {
        updatedRecipe.steps = helpers.checkStringArray(updatedRecipe.steps, 'steps');
        updatedRecipe.steps = helpers.checkSteps(updatedRecipe.steps, 'steps');

       //throw error if every element of ingredients array in existing recipe matches the updated ingredients
       allSame = true;
       for (let i of recipe.steps) {
           if (!updatedRecipe.steps.includes(i))
               allSame = false;
       }
       if (allSame && (recipe.length === updatedRecipe.length)) {
           throw 'field being updated must be different than the current field';
       }

       recipe.steps = updatedRecipe.steps;
    }
    if (key === 'skillLevel')
    {
        updatedRecipe.skillLevel = helpers.checkString(updatedRecipe.skillLevel, 'skillLevel');
        updatedRecipe.skillLevel = helpers.checkSkillLevel(updatedRecipe.skillLevel, 'skillLevel');

        if(recipe.skillLevel === updatedRecipe.skillLevel) 
            throw 'field being updated must be different than the current field';

        recipe.skillLevel = updatedRecipe.skillLevel;
    }
};

//replace existing rcipe with the one with the updates
const recipeCollection = await recipes();
const updateInfo = await recipeCollection.findOneAndReplace(
    {_id: new ObjectId(recipeId)},
    recipe,
    {returnDocument: 'after'});

if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Error: Update failed! Could not update recipe with id ${recipeId}`];
    
let returnRecipe = await this.get(recipeId);

return returnRecipe;
}
};

export default exportedMethods;

