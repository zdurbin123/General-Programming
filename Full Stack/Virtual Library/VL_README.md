## Overview
The Virtual Library is a Full Stack Web Application built using Node.js, React and Apollo Client for the client-side (see Virtual_Library_Client folder), along with a GraphQL server with implementation of CRUD operations against a NoSQL database that stores information about books and authors (see Virtual_Library_Server folder). The server also implements Redis for in-memory caching. The website will allow you to view, add, delete, and change information about books and authors, and it also has a search page for finding specific types of books and authors.

## Setup and Running Application
### Clone the Repo/ Download the zip file
Use this link to clone the Github Repo: https://github.com/zdurbin123/Programming-Portfolio.git

## Install Node.js and Node Package Manager
Follow instructions in this link: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-nodejs-and-npm

## Install MongoDB and MongoDB Compass
Follow instructions in this link for MongoDB: https://www.mongodb.com/docs/manual/installation/
Follow instructions in this link for MongoDB Compass: https://www.mongodb.com/docs/compass/current/install/

## Connect to MongoDB Compass
Follow instructions in this link to connect: https://www.mongodb.com/docs/atlas/connect-to-database-deployment/
Note the server URL in 'config/settings.js' file will have to be updated with your connection string:
 - serverUrl: 'mongodb://localhost:27017/'
     
#### Install Redis
- To install Redis, go to the website: https://redis.io/docs/install/install-redis/
### Start the Redis Server (Required)
Run the Redis Server in the terminal locally using the commands: 
1. `redis-server`
2. `redis-cli`

   ### Run The React and Apollo Client front-end Locally 
1. Make sure you are in the directory 'Virtual_Library_Client' 
2. Run the `npm i` command to install all dependencies for the application.
4. Execute the command `npm run dev` in the terminal. This will start the React client
   
### Run The GraphQL Server Locally (Required)
1. Make sure you are in the directory 'Virtual_Library_Server' 
2. Run the 'npm i' command to install all dependencies for the application.
3. Run the 'npm run seed' command to seed the MongoDB database with books and authors.
4. Execute the command `npm start` in the terminal. This will start the GraphQL backend server

Once the above is setup, you should be able to navigate to http://localhost:5173/ and start using the website.




