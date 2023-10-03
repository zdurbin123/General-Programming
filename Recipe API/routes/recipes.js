// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import {Router} from 'express';
import {recipeData} from '../data/index.js';
import {reviewData} from '../data/index.js';
import  helpers from '../helpers.js';

const router = Router();

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      let page = req.query.page;
      const recipeList = await recipeData.getPage(page);
      res.json(recipeList);
    } catch (e) {
      res.status(404).json({error: e});
    }
  })
  .post(async (req, res) => {
    //code here for POST
   const recipe = req.body;

    if (!recipe || Object.keys(recipe).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }

    try {
      recipe.title = helpers.checkString(recipe.title, 'title');
      recipe.title = helpers.checkTitle(recipe.title);
      recipe.ingredients = helpers.checkStringArray(recipe.ingredients, 'ingredients');
      recipe.ingredients = helpers.checkIngredients(recipe.ingredients);
      recipe.steps = helpers.checkStringArray(recipe.steps, 'steps');
      recipe.steps = helpers.checkSteps(recipe.steps);
      recipe.skillLevel = helpers.checkString(recipe.skillLevel, 'skillLevel');
      recipe.skillLevel = helpers.checkSkillLevel(recipe.skillLevel);
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      const newRecipe = await recipeData.create(recipe.title, recipe.ingredients, recipe.steps, recipe.skillLevel, {_id: req.session.user._id, username: req.session.user.username});
      res.status(200).json(newRecipe);
    } catch (e) {
      res.status(500).json({error: e});
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = helpers.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const recipe = await recipeData.get(req.params.id);
      res.status(200).json(recipe);
    } catch (e) {
      res.status(404).json({error: e});
    }

  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.productId = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      await productData.remove(req.params.productId);
      res.status(200).json({_id: req.params.productId, deleted: true});
    } catch (e) {
      res.status(404);
    }
  })
  .patch(async (req, res) => {
    //code here for PATCH
    const recipeToUpdate = req.body;

    if (!recipeToUpdate || Object.keys(recipeToUpdate).length === 0) {
    return res
      .status(400)
      .json({error: 'There are no fields in the request body'});
    }

    //throw error if a field is one that should not be updated
    if (Object.keys(recipeToUpdate).includes('reviews') || Object.keys(recipeToUpdate).includes('likes') || Object.keys(recipeToUpdate).includes('user')) {return res
      .status(400)
      .json({error: 'Cannot update reviews, likes, or user'});}

    if (!req.session.user) {
    return res
    .status(400)
    .json({error: 'Must be logged in to update a recipe!'});
    }

    req.params.id = helpers.checkId(req.params.id, 'Id URL Param');
    const recipe = await recipeData.get(req.params.id);

    if (req.session.user._id !== recipe.user._id) {
      return res
    .status(400)
    .json({error: 'Can only update your own recipe!'});
    }

    try {
    let updatedRecipe = await recipeData.update(recipeToUpdate, req.params.id);   
    res.status(200).json(updatedRecipe)
    } catch (e) {
      res.status(404).json({error: e});
    }
  });

router
.route('/:id/reviews')
.post(async (req, res) => {
  //code here for POST
    const revData = req.body;

    try {
      revData.rating = helpers.checkRating(revData.rating);
      revData.review = helpers.checkReview(revData.review);

      req.params.id = helpers.checkId(req.params.id, 'Id URL Param');
      
      if (!req.session.user) {
          throw 'Must be logged in to update a recipe!';
      }

      const recipe = await recipeData.get(req.params.id);

      for (let u of recipe.reviews) {
          if (u._id = req.session.user._id)
              throw 'cannot review a recipe more than once';
      }
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
      const updatedRecipe = await reviewData.createReview(req.params.id, revData.rating, revData.review, req.session.user);

      res.status(200).json(updatedRecipe);
    } catch (e) {
        res.status(500).json({ error: e });
    }

});

router
.route('/:recipeId/:reviewId')
.delete(async (req, res) => {
  //code here for DELETE
    try {
        req.params.reviewId = helpers.checkId(req.params.reviewId, 'Id URL Param');
        req.params.recipeId = helpers.checkId(req.params.recipeId, 'Id URL Param');

        if (!req.session.user) {
          throw 'Must be logged in to delete a recipe!';
        }

    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try { 
        const recipe = await reviewData.removeReview(req.params.reviewId, req.params.recipeId);
        res.status(200).json(recipe);
    } catch (e) {
        res.status(404);
    }

});

router
.route('/:id/likes')
.post(async (req, res) => {
//code here for POST

  try {
  req.params.id = helpers.checkId(req.params.id, 'Id URL Param');
  
  if (!req.session.user) {
      throw 'Must be logged in to like a recipe!';
  }
  } catch (e) {
      return res.status(400).json({ error: e });
  }

  try {
  const likedRecipe = await recipeData.addLike(req.params.id, req.session.user);

  res.status(200).json(likedRecipe);
  } catch (e) {
      res.status(500).json({ error: e });
  }

});

export default router;