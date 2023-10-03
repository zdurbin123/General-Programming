//import express, express router as shown in lecture code
import { Router } from "express";
import { charityData,  userData,  donationData,  giftData, reviewData} from "../data/index.js";
import * as helper from "../helpers.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import validation from "../validation.js";
import charities from "../data/charities.js";
import xss from "xss";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.route("/").get(async (req, res) => {
  return res.sendFile(path.join(__dirname, "../static", "homepage.html"));
});

router
  .route("/register")
  .get(async (req, res) => {
    try {
      res.render("register");
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    //code here for POST

    const data = req.body;
    //make sure there is something in the req.body
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    // Add input checking for all fields
    let firstName = data.firstNameInput;
    let lastName = data.lastNameInput;
    let userName = data.userNameInput;
    let emailAddress = data.emailAddressInput;
    let password = data.passwordInput;
    let confirmPassword = data.confirmPasswordInput;
    let role = data.roleInput;

    if (confirmPassword !== password) {
      return res.status(400).json({ error: "Passwords do NOT match" });
    }

    try {
      helper.validateNewUser(firstName,lastName,userName,emailAddress,password,role);
      const allUsers = await userData.getAll();
      for (let i = 0; i < allUsers.length; i++) {
        if (
          allUsers[i].emailAddress.toLowerCase() === emailAddress.toLowerCase()
        ) {
          throw "Error: there is already a user with this Email Address";
        }
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      let newUser = await userData.createUser(
        firstName,
        lastName,
        userName,
        emailAddress,
        password,
        role
      );
      if (newUser.insertedUser) {
        res.redirect("/login");
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (e) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET'
    try {
      return res.render("login");
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    //code here for POST

    /*get req.body username and password
    const { username, password } = req.body;
    here, you would get the user from the db based on the username, then you would read the hashed pw
    and then compare it to the pw in the req.body
    let match = bcrypt.compare(password, 'HASHED_PW_FROM DB');
    if they match then set req.session.user and then redirect them to the private page
    I will just do that here */
    // get password
    try {
      let emailAddress = xss(req.body.emailAddressInput);
      let password = xss(req.body.passwordInput);

      let userCheck = await userData.checkUser(emailAddress, password);
      req.session.user = {
        firstName: userCheck.firstName,
        lastName: userCheck.lastName,
        userName: userCheck.userName,
        emailAddress: userCheck.emailAddress,
        role: userCheck.role,
        userId: userCheck._id
      };

      if (userCheck)
        res.json({success: true, user: userCheck.firstName, role: userCheck.role});
      else
        res.json({success: false, error: 'Could not validate user'});
     /* if (userCheck.role === "admin") {
        //res.render('admin', {userName: userCheck.firstName, currentTime: helper.getCurrentDateTime()});
        return res.redirect("admin");
      } else {
        //res.render('protected', {isAdmin: userCheck.role === 'admin', firstName: userCheck.firstName, currentTime: helper.getCurrentDateTime(), role: userCheck.role});
        return res.redirect("protected");
      }*/
    } catch (e) {
      // If the user does not provide a valid login, you will render the login screen once again, and this
      //time show an error message (along with an HTTP 400 status code) to the user explaining that they
      //did not provide a valid username and/or password.
      //res.render('login');
      res.json({success: false, error: e});
    }
  });

router.route("/protected").get(async (req, res) => {
  //code here for GET
  try {
    let user = req.session.user;
    res.render("protected", {
      isAdmin: user.role === "admin",
      firstName: user.firstName,
      currentTime: helper.getCurrentDateTime(),
      role: user.role,
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/admin").get(async (req, res) => {
  //code here for GET
  try {
    let user = req.session.user;
    return res.render("admin", {
      userName: user.firstName,
      currentTime: helper.getCurrentDateTime(),
    });
  } catch (e) {
    return res.status(400).json(e);
  }
});

router
  .route('/comment')
  .post(async (req, res) => {
    //code here for POST

    try {
      let comment = req.body.comment;
      let donationId = req.body.donationId;

      comment = helper.checkString(comment, 'comment');
      donationId = validation.checkId(donationId, 'charity id');

      await donationData.addComment(donationId, comment);

      return res.redirect('/donate');
      } catch (e) {
      
      res.status(500).json({error: e});
    }
  });

  router
  .route('/report')
  .get(async (req, res) => {
    //code here for POST

    try {
      let charityId = req.query.charityId;
      const charity = await charityData.get(charityId);

      return res.render('report', {charityId: charityId, charityName: charity.charityName});
      } catch (e) {
      
      res.status(500).json({error: e});
    }
  }).post(async (req, res) => {
    //code here for POST

    try {
      let charityId = req.body.charityId;
      let reportText = req.body.reportText;

      const returnObj = await charityData.addReport(charityId, reportText);

      return res.render('reportSubmission', {message: returnObj});
      } catch (e) {
      
      res.status(500).json({error: e});
    }
  });

  router
  .route('/review')
  .get(async (req, res) => {
    //code here for POST

    try {
      let charityId = req.query.charityId;
      const charity = await charityData.get(charityId);

      return res.render('review', {charityId: charityId, charityName: charity.charityName});
      } catch (e) {
      
      res.status(500).json({error: e});
    }
  }).post(async (req, res) => {
    //code here for POST

    try {
      let charityId = req.body.charityId;
      let reviewText = req.body.reviewText;
      let rating = parseInt(req.body.reviewRating);

      if (!req.session.user)
        throw `must be logged in to create a review`;

      const returnObj = await reviewData.createReview(charityId, req.session.user.userName, reviewText, rating);

      return res.render('reviewSubmission', {message: returnObj});
      } catch (e) {
      
      res.status(500).json({error: e});
    }
  });

router.route("/giftCatalog").get(async (req, res) => {
  //code here for GET
  try {
    let gifts = await giftData.getAll();
    let charities = await charityData.getAll();
    charities = charities.filter((charity) => charity.isCharity === true);
    res.render("giftCatalog", {
      currentTime: helper.getCurrentDateTime(),
      gifts: gifts,
      charities: charities,
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/giftDonation").get(async (req, res) => {
  //code here for GET
  try {
    let charityId = req.query.charityId[0];
    let giftId = req.query.giftId;

    const charity = await charityData.get(charityId);
    const gift = await giftData.get(giftId);

   
    res.render("giftDonation", {
      charityId: charityId,
      giftId: giftId,
      charityName: charity.charityName,
      giftName: gift.giftName
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/profile").get(async (req, res) => {
  //code here for GET
  try {
    let user = req.session.user.userName;

    //get all review per user
    //Get all donations per user
    let charities = await charityData.getAll();
    let donations = await donationData.getByUsername(user);
    let reviews = [];
    let charityNamesForReviews = [];

    for (let i = 0; i < charities.length; i++) {
      let reviewTemp = charities[i].reviews;
      let charityname = charities[i].charityName;
      for (let j = 0; j < reviewTemp.length; j++) {
        if (reviewTemp[j].userId === user) {
          reviewTemp[j].charityName = charityname;
          reviews.push(reviewTemp[j]);
        }
      }
    }

    res.render("userProfile", {
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      emailAddress: req.session.user.emailAddress,
      userName: user,
      currentTime: helper.getCurrentDateTime(),
      donations: donations,
      reviews: reviews,
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/error").get(async (req, res) => {
  //code here for GET

  res.status(403).render("error");
  //res.render('error');
  // res.status(403).json();
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  //res.send('Logged out');
  res.render("logout");
});

// Display the signin page
router.route("/signin").get(async (req, res) => {
  return res.render("login");
});

// Display the aboutus page
router.route("/aboutus").get(async (req, res) => {
  return res.render("aboutus");
});

// Display the Charities page
/*router.route("/charity").get(async (req, res) => {
  return res.render("charities");
});

// Display the Gift Catalog page
router.route("/gifts").get(async (req, res) => {
  return res.render("giftCatalog");
});

// Display the Individual Sponsorship page
router.route("/individualsponsorship").get(async (req, res) => {
  return res.render("individualSponsor");
});

// Display the Donate page
router.route("/donate").get(async (req, res) => {
  return res.render("donate");
});*/

//export router
export default router;
