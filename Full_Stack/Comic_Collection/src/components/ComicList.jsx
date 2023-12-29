import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../../actions/index.js';
import {Link, useParams, useNavigate, useSearchParams} from 'react-router-dom';
import '../App.css';

import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardActionArea
} from '@mui/material';
import '../App.css';

const ComicList = () => {

  const dispatch = useDispatch();
  const allState = useSelector((state) => state.collection);

  let {pagenum} = useParams();
  const [loading, setLoading] = useState(true);
  const [comicData, setComicData] = useState(undefined);
  const [pageNum, setPageNum] = useState(parseInt(pagenum));
  let comicCard = null;
  const navigate = useNavigate();

  useEffect(() => {

    async function fetchData() {
      try {
        const {data} = await axios.get(`http://localhost:3000/api/comics/page/${String(pageNum)}`);

        setComicData(data.data.results);
      
        setLoading(false);
      } catch (e) {
        navigate('/error404');
      }
    }
    fetchData();
  }, [pageNum]);

  const buildCard = (comic) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={comic.id}>
        <Card
          variant='outlined'
          sx={{
            width: '400px',
            height: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '32px',
            borderRadius: 5,
            border: '1px solid #1e8678',
            boxShadow:
              '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
          }}
        >
          <CardActionArea>
            <Link to={`/marvel-comics/${comic.id}`}>
              <CardContent>
                <Typography
                  sx={{
                    borderBottom: '1px solid #1e8678',
                    fontWeight: 'bold'
                  }}
                  gutterBottom
                  variant='h6'
                  component='h3'
                >
                  {comic.title}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
          
        </Card>
      </Grid>
    );
  };

  comicCard =
    comicData &&
    comicData.map((individualComic) => {
      return <div> {buildCard(individualComic)}
      <button onClick={() =>
          dispatch(actions.addComic(individualComic))
        }>
      Collect
      </button>
      <button onClick={() =>dispatch(actions.deleteComic(individualComic))
      }>
      Give Up
      </button>
      </div>
    });

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (pageNum == 1) {
    return (
      <div>
        <Grid
          container
          spacing={8}
          sx={{
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >
          {comicCard}
        </Grid>
      <Link to={`/marvel-comics/page/${pageNum + 1}`} onClick={() => {setPageNum((pageNum) => pageNum + 1);
      setLoading(true);}} style={{ marginRight: '50px' }}>Next Page</Link>
      <Link to={`/marvel-comics/collections`}>Collections Page</Link>
      </div>
    );
  }
  else if ((pageNum === 1165)) {
    return (
      <div>
        <Grid
          container
          spacing={8}
          sx={{
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >
          {comicCard}
        </Grid>
      <Link to={`/marvel-comics/page/${pageNum - 1}`} style={{ marginRight: '50px' }}>Previous Page</Link>
      <Link to={`/marvel-comics/collections`}>Collections Page</Link>
      </div>
    );
  }
  else {
    return (
      <div>
      <Grid
        container
        spacing={8}
        sx={{
          flexGrow: 1,
          flexDirection: 'row'
        }}
      >
        {comicCard}
      </Grid>
      
      <Link to={`/marvel-comics/page/${pageNum - 1}`} onClick={() => {setPageNum((pageNum) => pageNum -1);
      setLoading(true);}} style={{ marginRight: '50px' }}>Previous Page</Link>
      <Link to={`/marvel-comics/page/${pageNum + 1}`} onClick={() => {setPageNum((pageNum) => pageNum + 1);
      setLoading(true);}} style={{ marginRight: '50px' }}>Next Page</Link>
      <Link to={`/marvel-comics/collections`}>Collections Page</Link>
      </div>
    );
  }
};

export default ComicList;