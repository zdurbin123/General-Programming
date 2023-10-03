//import express, express router as shown in lecture code
import {Router} from 'express';
import {charityData} from '../data/index.js';
import { donationData } from '../data/index.js';
import {ObjectId} from 'mongodb';
import * as helper from '../helpers.js';
import validation from "../validation.js";

const router = Router();

router.route('/').get(async (req, res) => {
    try {
        const charityList = await charityData.getAll();
        return res.render('charities', {charities: charityList})      
    } 
        catch (e) {
        res.status(500).json({error: e});
      }
})
.post(async (req, res) => {
    const charityData = req.body;

    if (!charityData || Object.keys(charityData).length === 0) {
      return res.status(400).json({error: 'There are no fields in the request body'});
    }

    try {
        charityData.charityName = helper.checkString(charityData.charityName, 'charity name');
        charityData.category = helper.checkString(charityData.category, 'category');
        charityData.details = helper.checkString(charityData.details, 'details');
        charityData.creationDate = validation.checkDate(charityData.creationDate);
        charityData.isCharity = validation.checkBool(charityData.isCharity);
        charityData.location = helper.checkString(charityData.location, 'location');
        charityData.age = helper.checkAge(charityData.age);
        charityData.picture = helper.checkString(charityData.picture, 'picture link');


        if (charityData.location.toLowerCase() !== 'america' && charityData.location.toLowerCase() !== 'africa' && charityData.location.toLowerCase() !== 'europe') {
          throw `location must be europe, africa, or america`;
        }

    }
    catch (e) {
        return res.status(400).json({error: e});
    }

    try {
        const newCharity = await charityData.createCharity(charityData.charityName, charityData.category, charityData.creationDate, charityData.details);
        res.status(200).json(newCharity);
    } catch (e) {
        res.status(500).json({error: e});
    }
});

router
  .route('/:charityId')
  .get(async (req, res) => {
    try {

      //check if there was a search on sponsor page by age
      if (req.query.ageInput) {
        let age = parseInt(req.query.ageInput);
        age = helper.checkAge(age);
      }

      if (req.query.locationInput) {
        helper.checkString(req.query.locationInput);
      }

      if (req.params.charityId !== 'sponsors' && !req.query.ageInput && !req.query.locationInput)
        req.params.charityId = validation.checkId(req.params.charityId, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {

      //get sponsors matching age search parameter
      if (req.query.ageInput) {
        const sponsorList = await charityData.getSponsorByAge(parseInt(req.query.ageInput));
        return res.render('individualSponsor', {sponsors: sponsorList})  
      }

      //get sponsors matching location search parameter
      if (req.query.locationInput) {
        const sponsorList = await charityData.getSponsorByLocation(req.query.locationInput);
        return res.render('individualSponsor', {sponsors: sponsorList})  
      }

      if (req.params.charityId === 'sponsors') {
        const sponsorList = await charityData.getAllSponsors();
        return res.render('individualSponsor', {sponsors: sponsorList})  
      }

      const charity = await charityData.get(req.params.charityId);

      if(charity !== undefined){
        const donations = await donationData.getByCharityname(charity.charityName);
        return res.render('individualCharity', {charity: charity, donations: donations});
      } else {
        return res.render('individualCharity', {charity: charity}); 
      }
    } catch (e) {
      res.status(404).json({error: e});
    }
})
.delete(async (req, res) => {
    try {
      req.params.charityId = validation.checkId(req.params.charityId, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      await charityData.remove(req.params.charityId);
      res.status(200).json({_id: req.params.charityId, deleted: true});
    } catch (e) {
      res.status(404);
    }
});

export default router;
