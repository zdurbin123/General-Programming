import express from 'express';
const app = express();
import {Router} from 'express';
//const store = require('../store');
//const actions = require('../actions');
const router = Router();
import axios from 'axios';
import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => {});

import md5 from 'blueimp-md5';
const publickey = '99a5152e828e7de8c3ae1d40aded4d65';
const privatekey = '2dc2f10203d71c8c63a57e5287510eb298a0fe41';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;


router.get('/page/:pagenum', async (req, res) => {
  
try {
  
  let exists = await client.exists(req.params.pagenum);
  
  if(exists) {
    let comics = await client.get(req.params.pagenum);
    var data = JSON.parse(comics);

    return res.status(200).json(data);
  }
  else {
    let lowerLim = (parseInt(req.params.pagenum) * 20) - 20;
    var {data} = await axios.get(url + '&offset=' + lowerLim);

    let newComicData = JSON.stringify(data);
    await client.set(req.params.pagenum, newComicData);

    if (data) {
      return res.status(200).json(data)
    }
    else 
      return res.status(404).json({message: 'No more Comics'});
  }
}
catch (e)
{
 res.status(500);
}
});

router.get('/:id', async (req, res) => {

  let comicUrl = baseUrl + '/' + req.params.id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

  let exists = await client.exists(req.params.id);
  
  if(exists) {
    let comic = await client.get(req.params.id);
    var data = JSON.parse(comic);

    return res.json(data);
  }
  else {
    var {data} = await axios.get(comicUrl);

    let newComicData = JSON.stringify(data);
    await client.set(req.params.id, newComicData);

    if (data) {
      console.log('got data', data)
      return res.json(data);
    }
    else
      console.log('did not get data');
      return res.status(404).json({error: 'No comic found'});
  }

});


export default router;