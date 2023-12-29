import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';


const Home = () => {
  return (
    <div>
      <p>
        This website will allow you to create collections of comics. To begin, select the collections page below to create a subcollection. You can then select a subcollection that will have comics added and removed from them at your choosing.
      </p>
      <Link to={`/marvel-comics/page/1`} style={{ marginRight: '50px' }}>Comics Page</Link>
      <Link to={`/marvel-comics/collections`}>Collections Page</Link>
    </div>
  );
};

export default Home;