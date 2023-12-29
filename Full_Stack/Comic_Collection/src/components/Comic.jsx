import React, {useState, useEffect} from 'react';
import axios from 'axios';
import actions from '../../actions/index.js';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import noImage from '../img/download.jpeg';


import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@mui/material';
import '../App.css';

const Comic = () => {

  const dispatch = useDispatch();
  const allState = useSelector((state) => state.collection);

  const [comicData, setComicData] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  let {id} = useParams();

  useEffect(() => {

    async function fetchData() {
      try {
        const {data} = await axios.get(`http://localhost:3000/api/comics/${id}`);
        console.log(data);

        let comicToShow = data.data.results[0];

        setComicData(comicToShow);
        setLoading(false);
      } catch (e) {
        navigate('/error404');
      }
    }
    if (isNaN(parseInt(id)) || parseInt(id) < 0) {
        navigate('/error400');
    }
    else {
    fetchData();
    }
  }, [id]);

 /* let summary = null;
  const regex = /(<([^>]+)>)/gi;
  if (artData && artData.summary) {
    summary = artData && artData.summary.replace(regex, '');
  } else {
    summary = 'No Summary';
  }
*/
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <Card
        variant='outlined'
        sx={{
          maxWidth: 550,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '1px solid #1e8678',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardHeader
          title={comicData.title}
          sx={{
            borderBottom: '1px solid #1e8678',
            fontWeight: 'bold'
          }}
        />
        <CardMedia
          component='img'
          image={
            comicData.images.length
              ? comicData.images[0].path + '.' + comicData.images[0].extension
              : noImage
          }
          title='comic image'
        />
        <CardContent>
          <Typography
            variant='body2'
            color='textSecondary'
            component='span'
            sx={{
              borderBottom: '1px solid #1e8678',
              fontWeight: 'bold'
            }}
          >
            <dl>
              <p>
                <dt className='title'>Comic Description:</dt>
                {comicData && comicData.description ? (
                  <dd>
                   {comicData.description}
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>On Sale Date:</dt>
                {comicData && comicData.dates[0].date ? (
                  <dd>{comicData.dates[0].date}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Price:</dt>
                {comicData && comicData.prices[0].price ? (
                  <dd>{comicData.prices[0].price}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
            </dl>
            <div>
            <button onClick={() =>
            dispatch(actions.addComic(comicData))}>
            Collect
            </button>
            <button onClick={() =>dispatch(actions.deleteComic(comicData))}>
            Give Up
            </button>
            <Link to={`/marvel-comics/page/1`}>Comics Page</Link>
            </div>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Comic;