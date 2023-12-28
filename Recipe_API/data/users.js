//import mongo collections, bcrypt and implement the following data functions
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcrypt';
import  helpers from '../helpers.js';

const createUser = async (
  name,
  username,
  password,
) => {

  // Do input validation
  name = helpers.checkString(name, 'name');
  username = helpers.checkString(username, 'username');
  password = helpers.checkString(password, 'password');

  username = helpers.checkusername(username);
  password = helpers.checkPassword(password);

  // Hash the password
  const saltRounds = 16;
  const hash = await bcrypt.hash(password, saltRounds);

  let newUser = {
    name: name,
    username: username,
    password: hash,
  }

  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);

  const user = await userCollection.findOne({ username: newUser.username})
  //figure out how to return user here
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add user';
  } else {
    return {_id: user._id, name: user.name, username: user.username};
  }

};

const checkUser = async (username, password) => {

    username = helpers.checkString(username, 'username');
    password = helpers.checkString(password, 'password');

    username = helpers.checkusername(username);
    password = helpers.checkPassword(password);

    let user = await getUser(username);
    if (user === undefined) {
        throw 'user with the supplied username does not exist';
    } else {
    let match = await bcrypt.compare(password, user.password);
    if (match){
        return {name: user.name, username: user.username, _id: user._id};
    } else {
        throw 'password is invalid';
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

const getUser = async (username) => {
  
    username = helpers.checkString(username, 'username');

    username = helpers.checkusername(username);

  const users = await getAll();
  let returnUser = undefined;
  for(let i = 0; i < users.length; i++){
    if(users[i].username.toLowerCase() === username.toLowerCase()){
      returnUser = users[i];
    }
  }
  return returnUser;
};

export default {createUser, checkUser, getAll, getUser};