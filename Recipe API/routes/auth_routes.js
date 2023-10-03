//import express, express router as shown in lecture code
import {Router} from 'express';
import {userData} from '../data/index.js';
import helpers from '../helpers.js';

const router = Router();


router
  .route("/signup")
  .post(async (req, res) => {
    //code here for POST
    const data = req.body;
    //make sure there is something in the req.body
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
    data.name = helpers.checkString(data.name, 'name');
    data.username = helpers.checkString(data.username, 'username');
    data.password = helpers.checkString(data.password, 'password');

    data.username = helpers.checkusername(data.username);
    data.password = helpers.checkPassword(data.password);

    }
    catch (e) {
        return res.status(400).json({ error: e });
    }
    
    try {
      const user = await userData.createUser(data.name, data.username, data.password);
      return res.status(200).json(user);
      }
     catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router
  .route("/login")
  .post(async (req, res) => {
    //code here for POST

    try {
      let username = req.body.username;
      let password = req.body.password;

      let userCheck = await userData.checkUser(username, password);
      
      req.session.user = {
        name: userCheck.name,
        username: userCheck.username,
        _id: userCheck._id
      };

      if (userCheck)
        res.json({success: true, user: userCheck.name});

    } catch (e) {
        return res.status(400).json({ error: e });
    }
  });

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  //res.send('Logged out');
  return res.status(200).json({message: "You have succesully logged out"});
});


//export router
export default router;