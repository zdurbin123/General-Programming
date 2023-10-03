import {Router} from 'express';
import {donationData} from '../data/index.js';
import {charityData} from '../data/index.js';
import {giftData} from '../data/index.js';
import {ObjectId} from 'mongodb';
import * as helper from '../helpers.js';
import validation from "../validation.js";



const router = Router();



router.route('/').get(async (req, res) => {
    try {
        const donationList = await donationData.getAllDonations();
        const charityList = await charityData.getAll();
        return res.render('donate', {donations: donationList, charities: charityList})      
    } 
        catch (e) {
        res.status(500).json({error: e});
      }
})
.post(async (req, res) => {
    const donation = req.body;

    if (!donation || Object.keys(donation).length === 0) {
      return res.status(400).json({error: 'There are no fields in the request body'});
    }

    try {
        if (donation.charityName) {
            donation.charityName = helper.checkString(donation.charityName, 'charity name');
            if(donation.charityName.toLowerCase() !== 'all')
                await charityData.getCharityByName(donation.charityName);
            else 
                donation.charityName = 'All';
            
            var charityName = donation.charityName;
        }
        if (donation.giftName) {
            donation.giftName = helper.checkString(donation.giftName, 'gift name');
            var giftName = donation.giftName;
        }

        if (donation.amount)
            donation.amount = helper.checkAmount(parseInt(donation.amount));
        
        if (!donation.giftNote)
            donation.giftNote = 'N/A';

        donation.giftNote = helper.checkString(donation.giftNote, 'gift note');

        if (donation.charityId) {
            const charity = await charityData.get(donation.charityId);
            var charityName = charity.charityName;
        }
        if (donation.giftId) {
            const gift = await giftData.get(donation.giftId);
            var giftName = gift.giftName;
        }

        if (!req.session.user)
            throw `cannot donate without being logged in`;

        await donationData.createDonation(req.session.user.userName, charityName, giftName, donation.giftNote
        );

        res.status(200).render('thankyou');

    } catch (e) {
        res.status(500).json({ error: e });
    }
});



router
  .route('/donationId/:donationId')
  .get(async (req, res) => {
    try {
        req.params.donationId = validation.checkId(req.params.donationId, 'Id URL Param');
        const donation = await donationData.get(req.params.donationId);
        return res.render('donation', { donation: donation });
    } catch (e) {
        res.status(404).json({ error: e });
    }
});


router.route('/userName/:userName')
.get(async (req, res) => {
    try {
        const username = req.params.username;

        const username1 = helper.checkString(username, 'username'); 

        const userDonations = await donationData.getByUserName(username1);
        
        if (userDonations && userDonations.length > 0) {
            return res.render('userDonations', { donations: userDonations });
        } else {
            throw 'No donations found for this username';
        }

    } catch (e) {
        res.status(404).json({ error: e });
    }
});



router.route('/charityName/:charityName')
.get(async (req, res) => {
    try {
        const charityName = req.params.charityName;

        const charityName1 = helper.checkString(charityName, 'charityName'); 

        const charityDonations = await donationData.getByCharityname(charityName1);
        
        if (charityDonations && charityDonations.length > 0) {
            return res.render('donate', { donations: charityDonations });
        } 
        //else {
        //     throw 'No donations found for this charityName';
        // }

        return res.render('donate', { donations: charityDonations });

    } catch (e) {
        res.status(404).json({ error: e });
    }
});






export default router;

