import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';


const Error404 = () => {

  return (
    <div>
      <p>
        Error: 404 - no comic available
      </p>
      <Link to={`/marvel-comics/page/1`}>Back to first page of comics</Link>
    </div>
  );
};

export default Error404;