import { dbConnection, closeConnection, dropCollection } from './config/mongoConnection.js';
import { charityData } from './data/index.js';
import { reviewData } from './data/index.js';
import { donationData } from './data/index.js';
import { commentData } from './data/index.js';
import { userData } from './data/index.js';
import { giftData } from './data/index.js';


export const createCharities = async () => {


console.log("-------------------Dropping Database-------------------------------");
const db = await dbConnection();
await db.dropDatabase();
// await dropCollection("charities");
// await dropCollection("donations");
// await dropCollection("users");
console.log("-------------------COMPLETE-------------------------------");



  //charity data
  //variables' name: charityName, category, creationDate, isCharity, location, age,  picture, details

  console.log("-------------------Seeding Charities-------------------------------");

  
let charity1 = await charityData.createCharity('Make a Wish', 'Children', '04/05/1998', true, 'america', 5, 'N/A', 'Together, we create life-changing wishes for children with critical illnesses – but you can make a childs wish possible.');
let charity2 = await charityData.createCharity('Salvation Army', 'Religion', '02/11/1996', true, 'europe', 7, 'N/A', 'The Salvation Army, an international movement, is an evangelical part of the universal Christian Church. Its message is based on the Bible. Its ministry is motivated by the love of God. Its mission is to preach the gospel of Jesus Christ and to meet human needs in His name without discrimination.');
let charity3 = await charityData.createCharity('Walk Across America', 'Cancer', '02/11/2019', true, 'america', 4, 'N/A', 'Walk Across America. 8181 likes. I walked across America for veteran suicide awareness and now I have my nonprofit to benefit Veterans.');
let charity4 = await charityData.createCharity('John Doe', 'Children', '02/11/2016', false, 'europe', 7, '/public/john.png', 'Donate to Johns cause to keep a smile on his face!');
let charity5 = await charityData.createCharity('Jane Doe', 'Children', '02/11/2017', false, 'america', 6, '/public/amy.jpeg', 'Please help Jane on her journey to recovery!');
let charity6 = await charityData.createCharity('The Nature Conservancy', 'Nature', '02/11/2012', true, 'europe', 11, 'N/A', 'When you make a tax-deductible donation to The Nature Conservancy, youre supporting the most effective solutions to the biggest threats facing our lands, waters and wildlife. As a leading global environmental nonprofit, The Nature Conservancy is working to advance conservation in all 50 states and U.S. territories and in 70 countries around the world. Thats why your contribution is so much more than charity; its an investment in the future of our planet.');
let charity7 = await charityData.createCharity('Feeding America', 'Food', '02/11/2009', true, 'america', 13, 'N/A', 'Feeding America is a United States–based nonprofit organization that is a nationwide network of more than 200 food banks that feed more than 46 million people through food pantries, soup kitchens, shelters, and other community-based agencies. Forbes ranks it as the largest U.S. charity by revenue');
let charity8 = await charityData.createCharity('Childrens Education Foundation', 'Books', '02/11/2009', true, 'america', 13, 'N/A', 'We strongly support and promote The Virtues Education for all schools and orphanages in the world. It is a global grassroots initiative with the aim to inspire the practice of virtues in all aspects of life.');
let charity9 = await charityData.createCharity('Animal Rescue League', 'Pet Foods', '02/11/2007', true, 'america', 16, 'N/A', 'We strongly support and promote The Virtues Education for all schools and orphanages in the world. It is a global grassroots initiative with the aim to inspire the practice of virtues in all aspects of life.');
console.log("-------------------COMPLETE-------------------------------");


console.log("-------------------Seeding User Data-------------------------------");

//user data
//variables' name: firstName, lastName, userName, emailAddress, password, role
// let user1 = await userData.createUser('Peter','Anderson','pAndds', 'pandy1243@gmail.com', 'pF5\\3Oo\\f4/T~\\)g', 'user');
 let user2 = await userData.createUser('Heidie','Fernehough','hfernehough6', 'hfernehough6@arstechnica.com', 'sK1|2zq,GaL+MRs', 'user');
// let user3 = await userData.createUser('Horten','Askin','hasking', 'hasking@prnewswire.com', 'wI2!cY0TjAX,E', 'user');  
// let user4 = await userData.createUser('Tybi','Pardew','tpardewe', 'tpardewe@berkeley.edu', 'nT0)spb3u8' , 'user'); 
// let user5 = await userData.createUser('Case','Guppy','cguppy8', 'cguppy8@newyorker.com', 'dI1.t\"2Q`', 'user');   
// let user6 = await userData.createUser('Marge', 'Bewshire', 'mbewshire0', 'mbewshire0@va.gov', 'uT5\"E1xM', 'user');
// let user7 = await userData.createUser('Bastien', 'Cess', 'bcess1', 'bcess1@fc2.com', 'jO4\'_0uJ0s)>', 'user');
// let user8 = await userData.createUser('Phillipe', 'Olligan', 'polligan2', 'polligan2@intel.com', 'nP0{hqG\\1m', 'user');
// let user9 = await userData.createUser('Norbert', 'Manes', 'nmanes3', 'nmanes3@bravesites.com', 'eM1_*mK}fpd@#\"', 'user');
let user1 = await userData.createUser('Peter','Stirpe','Peetey', 'peterstirpe@gmail.com', '$Pecial1', 'admin');


console.log("-------------------COMPLETE-------------------------------");



console.log("-------------------Seeding Reviews Data-------------------------------");

  //reviews data
  //variables' name: charityId, userId, reviewText, rating(max 5)
  // userId might be  objectId instead of below ones. the below ones are username we did not include in the review function.
await reviewData.createReview(charity1._id.toString(), 'pAndds', 'this is a great charity!', 5);
await reviewData.createReview(charity1._id.toString(), 'hfernehough6', 'this is a bad charity!', 1);
await reviewData.createReview(charity2._id.toString(), 'hasking', 'this is an ok charity', 3);
await reviewData.createReview(charity2._id.toString(), 'tpardewe', 'Good charity, could do better', 3);

  //I will assume the charity variable name to be charity6,charity7, etc. If anyone create other variable name, please change the variable names below, thanks.
  // one person is only allow to leave one comment and one review for each charity, also, the username variable is not created in review.js
 // BTW, I think in review.js or comment.js, we didn't limit the number into 1.
  
await reviewData.createReview(charity6._id.toString(), 'Peetey', 'This charity stands out for its transparency, ensuring donors know exactly where their contributions are going.', 5);
await reviewData.createReview(charity6._id.toString(), 'Peetey', 'Their dedication to on-ground work has made a tangible difference in communities, showcasing true commitment.', 5);
await reviewData.createReview(charity7._id.toString(), 'Peetey', 'The organizations volunteer programs are well-structured, allowing individuals from all walks of life to contribute meaningfully.', 4); 
await reviewData.createReview(charity7._id.toString(), 'Peetey', 'With a focus on sustainability, this charitys projects are not just a quick fix but offer long-term solutions to pressing issues.', 4); 
await reviewData.createReview(charity1._id.toString(), 'Peetey', 'With an impressive track record, this organization has continuously delivered on its promises, making it a trustworthy choice for donors.', 5); 
await reviewData.createReview(charity1._id.toString(), 'Peetey', 'Their grassroots approach ensures that the needs of the local communities are always at the forefront of their initiatives.', 4); 
await reviewData.createReview(charity2._id.toString(), 'Peetey', 'The organizations emphasis on collaboration means they regularly partner with other groups, amplifying their impact.', 3); 
await reviewData.createReview(charity2._id.toString(), 'Peetey', 'This charitys continuous pursuit of feedback and self-improvement is commendable, reflecting a genuine desire to serve better.', 5); 

console.log("-------------------COMPLETE-------------------------------");



console.log("-------------------Seeding Donations Data-------------------------------");

//donation data  
//variables' name: userName, charityName, giftName, giftNote, comments
await donationData.createDonation('pAndds', 'Make a Wish', 'Mountain Bike', 'I hope you like the new bike!', 'Bikes are awesome');
await donationData.createDonation('hasking', 'Make a Wish', 'Blankets', 'Hope everyone enjoy the new blankets!', 'Keep warm');
await donationData.createDonation('Peetey', 'Childrens Education Foundation', 'Books', 'A little help can light up a childs future. Enjoy these educational tools!', 'Looking forward to seeing these supplies make a difference!');
await donationData.createDonation('hfernehough6', 'Save the Oceans', 'Reusable Water Bottles', 'Reduce single-use plastic with these bottles!', 'Every little bit counts for our planet');
await donationData.createDonation('tpardewe', 'Animal Rescue League', 'Pet Foods', 'For our furry friends in need.', 'Remember to adopt, not shop!');
//await donationData.createDonation('Peetey', 'Habitat for Humanity', 'Bricks', 'Building homes and futures.', 'Everyone deserves a roof over their head');

console.log("-------------------COMPLETE-------------------------------");


console.log("-------------------Seeding Gift Catalog-------------------------------");

//gifts data
//variables' name: giftName,category,price,reviewText
// please double check with Kalpana if we are going to set the category as just monthly or one-time, or like these categories below.
await giftData.createGift('Frisbee', 'Sports', 5.32, 'A yellow frisbee for a great time!');
await giftData.createGift('Soccer Ball', 'Sports', 30.00, 'A Quality Soccer Ball!');
await giftData.createGift('Mountain Bike', 'Sports', 5.32, 'Bicycles help deliver critical care');
await giftData.createGift('Shampoo', 'Heatlh', 3.50, 'Natuaral Calia Shampoo!');
await giftData.createGift('Toothpaste', 'Health', 2.50, 'Colgate Toothpaste');
await giftData.createGift('Food Bundle', 'Food', 25.00, 'An essential food bundle');

console.log("-------------------COMPLETE-------------------------------");

  

// console.log("-------------------Seeding Comment Data-------------------------------");
  
//comments data
//variables' name: userId, donationId, commentText
// await commentData.createComment('64db0c47fc13ae504608a05c', '64db0c47fc13ae504608a069', 'Hope this could help you a bit!');
// await commentData.createComment('64db0c47fc13ae504608a05d', '64db0c47fc13ae504608a06a', 'Sending love and support through this donation.');
// await commentData.createComment('64db0c47fc13ae504608a05e', '64db0c47fc13ae504608a06b', 'Every bit counts. Glad to be a part of this cause!');
// await commentData.createComment('64db0c47fc13ae504608a05f', '64db0c47fc13ae504608a06c', 'Together, we can make a difference.');
// await commentData.createComment('64db0c47fc13ae504608a060', '64db0c47fc13ae504608a06d', 'Happy to contribute. Let's change lives together!');
// await commentData.createComment('64db0c47fc13ae504608a061', '64db0c47fc13ae504608a06e', 'Believing in the cause and happy to support.');

  
// console.log("-------------------COMPLETE-------------------------------");


};
