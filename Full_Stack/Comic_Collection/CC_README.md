## Overview
The Comic Collection is a Web Application built using Node.js and React for the client-side, which also leverages the Node.js Redux library for easier tracking of state between pages and changes. The application uses an Express server, another Node.js package, which will make calls to the Marvel Comics API to return comic-related data to be displayed and manipulated on the front-end. The data returned from the API is also stored in an in-memory database for quicker access (Redis).

## Setup and Running Application
### Clone the Repo/Download the zip file
Use this link to clone the Github Repo: https://github.com/zdurbin123/Programming-Portfolio.git

## Install Node.js and Node Package Manager
Follow instructions in this link: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-nodejs-and-npm
     
#### Install Redis
- To install Redis, go to the website: https://redis.io/docs/install/install-redis/
### Start the Redis Server (Required)
Run the Redis Server in the terminal locally using the commands: 
1. `redis-server`
2. `redis-cli`

### Run the Front-end and Back-end together
1. Run the `npm i` command to install all dependencies for the application.
2. Execute the command `npm run dev` in the terminal. This will start the React client
3. Open another terminal in the same directory, and execute the command 'npm start'. This will start the express server.

Once the above is setup, you should be able to navigate to http://localhost:5173/ and start using the website.
