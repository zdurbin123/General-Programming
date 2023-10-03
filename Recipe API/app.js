// This file should set up the express server as shown in the lecture code

import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { ObjectId } from 'mongodb';
import session from "express-session";

var pathArr = [];
var pathOnlyArr = [];

app.use(express.json());

app.use(
    session({
      name: "AuthCookie",
      secret: "This is a secret.. shhh don't tell anyone",
      resave: false,
      saveUninitialized: false,
    })
  );

app.use((req, res, next) => {

let requestFields = Object.keys(req.body);

for (let key in req.body)
    if (key !== 'password')
        console.log(`${key}: ${req.body[key]}`);

console.log(req.path);
console.log(req.method);

for (let el of pathArr) {
    if (req.path === el[0]) {
        el[1]++;
        console.log(`${req.path} has been accessed ${el[1]} times`);
    }
}

if(!pathOnlyArr.includes(req.path)) {
    let newArrElement = [req.path, 0];
    pathArr.push(newArrElement);
    pathOnlyArr.push(req.path)
    console.log(`This is the first time ${req.path} is being accessed`);
}
next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
