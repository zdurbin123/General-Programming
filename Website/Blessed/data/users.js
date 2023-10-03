//import mongo collections, bcrypt and implement the following data functions
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcrypt';
import * as helper from "../helpers.js" 

const createUser = async (
  firstName,
  lastName,
  userName,
  emailAddress,
  password,
  role
) => {

  // Do input validation
  helper.validateNewUser(firstName, lastName, userName, emailAddress, password, role);

  // Check for Duplicate email
  const allUsers = await getAll();
  for(let i = 0; i < allUsers.length; i++){
    if(allUsers[i].emailAddress.toLowerCase() === emailAddress.toLowerCase()){
      throw 'Error: there is already a user with this Email Address';
    }
    if(allUsers[i].userName.toLowerCase() === userName.toLowerCase()){
      throw 'Error: there is already a user with this userName';
    }
  }

  // Hash the password
  const saltRounds = 16;
  const hash = await bcrypt.hash(password.trim(), saltRounds);

  let newUser = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    userName: userName.trim(),
    emailAddress: emailAddress.trim(),
    password: hash,
    role: role.trim()
  }

  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add user';
  } else {
    return {insertedUser: true};
  }

};

const checkUser = async (emailAddress, password) => {

  if(!emailAddress || !password){
    throw 'Error: please supply an email and a password';
  }


  // Email Check
  if(typeof emailAddress !== 'string'){
    throw 'Error: emailAddress must be of type string';
  }
  if(!emailAddress.includes(".")){
      throw 'Error: emailAddress must contain a dot';
  }
  let checkDots = emailAddress.split(".");
  for(let i = 1; i < checkDots.length; i++){
      if(checkDots[i].length < 2){
          throw 'Error: emailAddress must have at least 2 letters after the dot';
      }
}


  helper.checkPassword(password);

  let user = await getUserByEmailAdress(emailAddress);
  if(user === undefined){
    throw 'Either the email address or password is invalid';
  } else {
    let match = await bcrypt.compare(password, user.password);
    if (match){
      return {firstName: user.firstName, lastName: user.lastName, userName: user.userName, emailAddress: user.emailAddress, role: user.role, _id: user._id};
    } else {
      throw 'Error: Either the email address or password is invalid';
    }
  }

};


const getAll = async () => {
  const userCollection = await users();
  let userList = await userCollection.find({}).toArray();
  if (!userList) throw 'Could not get all users';
  userList = userList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return userList;
};

const get = async (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  const userCollection = await users();
  const user = await userCollection.findOne({_id: new ObjectId(id)});
  if (user === null) throw 'No product with that id';
  user._id = producto._id.toString();
  return user;
};


const getUserByEmailAdress = async (emailAddress) => {
  if (!emailAddress) throw 'You must provide an id to search for';
  if (typeof emailAddress !== 'string') throw 'Id must be a string';
  if (emailAddress.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  emailAddress = emailAddress.trim();
  const users = await getAll();
  let returnUser = undefined;
  for(let i = 0; i < users.length; i++){
    if(users[i].emailAddress.toLowerCase() === emailAddress.toLowerCase()){
      returnUser = users[i];
    }
  }
  return returnUser;
};

const getUserByUserName= async (userName) => {
  if (!userName) throw 'You must provide an id to search for';
  if (typeof userName !== 'string') throw 'Id must be a string';
  if (userName.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
    userName = userName.trim();
  const users = await getAll();
  let returnUser = undefined;
  for(let i = 0; i < users.length; i++){
    if(users[i].userName.toLowerCase() === userName.toLowerCase()){
      returnUser = users[i];
    }
  }
  return returnUser;
};





export default {createUser, checkUser, getAll, get, getUserByEmailAdress, getUserByUserName};
