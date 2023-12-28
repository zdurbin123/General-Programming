import React from 'react';
import './App.css';

function Home() {
  return (
    <div className='card'>
      <div className='card-body'>
        <h5 className='card-title'>Virtual Library Homepage</h5>
        <p className='cap-first-letter:first-letter'>
          This website will allow you to view information about authors and books.
        </p>
        <p>
          It uses Apollo Server as the GraphQL server and Apollo Client and
          React as the client.
        </p>
      </div>
    </div>
  );
}

export default Home;
