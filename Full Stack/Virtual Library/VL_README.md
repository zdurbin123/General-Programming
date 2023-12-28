## Overview
The Virtual Library is a Full Stack Web Application built using Node.js, React and Apollo Client for the client-side (see Virtual_Library_Client folder), along with a GraphQL server with implementation of CRUD operations against a NoSQL database that stores information about books and authors (see Virtual_Library_Server folder). The server also implements Redis for in-memory caching. The website will allow you to view, add, delete, and change information about books and authors, and it also has a search page for finding specific types of books and authors.

## Setup and Running Application
### Clone the Repo/ Download the zip file from Canvas (Required)
Use this link to clone the Github Repo https://github.com/zdurbin123/SongScout.git
### Install ImageMagick and Redis locally on the computer (Required)
#### Use the following protocol/command to install ImageMagick (Mac/Windows)
- Installation on MacOs:
  1. `brew update && brew install imagemagick`
- Installation on Windows:
  1. Go to the ImageMagick website [https://imagemagick.org/](https://imagemagick.org/script/download.php)
  2. Download the ImageMagick binary release version: ImageMagick-7.1.1-23-Q16-HDRI-x64-dll.exe
  3. Run the executable and follow the installation instructions
  4. Make sure the version is ImageMagick-7.1.1-23 (you can use the command `magick -version` on powershell)
  5. Restart the express server and application if it was already running
     
#### Install Redis locally (Mac/Windows)
- To install Redis, go to the website: https://redis.io/docs/install/install-redis/
### Start the Redis Server (Required)
Run the Redis Server in the terminal locally using the commands: 
1. `redis-server`
2. `redis-cli`
### Run The Express Server Locally (Required)
Execute the command `npm start` in the terminal. This will start the express backend server for the SongScout application. ImageMagick is hosted locally to manipulate images, which are then stored on the cloud with Firebase Storage. Additionally we use Firestore Database to handle user and likes collection

### Running the Application (AWS Amplify or Run Vite Locally)
You can run the application using AWS amplify, or using Vite locally

### AWS Amplify Hosting
The frontend of our application is hosted in the AWS Amplify. You can access the live application at the following URL: https://main.d21q7yklqsarm.amplifyapp.com/
### Running Locally
Alternatively, Our react application can also run locallly using Vite by using the commmand `npm run dev`. 
### Handling Spotify API Limit Exceedance
If you reach the API call limit,(HTTP 429 Too Many Requests response status code) switch the `client_id` and `client_secret` in app.js. To do this one needs to just uncomment the commented code and comment the current credentials to use another app in the spotify api for developers thereby creating a different token.
### FireBase Authentication,Storage and Firestore Database
You can also checkout our Firebase using this url https://console.firebase.google.com/u/0/project/songscout-1ce29/overview (login using stevens credentials).

