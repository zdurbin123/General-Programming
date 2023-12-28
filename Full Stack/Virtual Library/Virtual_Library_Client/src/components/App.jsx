import React from 'react';
import './App.css';
import {NavLink, Route, Routes} from 'react-router-dom';
import Home from './Home';
import Authors from './Authors';
import Author from './Author';
import Book from './Book';
import Books from './books';
import Search from './Search';
import Error from './Error';


function App() {
  return (
    <div>
      <header className='App-header'>
        <h1 className='App-title center'>
          Virtual Library
        </h1>
        <nav className='center'>
          <NavLink className='navlink' to='/'>
            Home
          </NavLink>
          <NavLink className='navlink' to='/authors'>
            Authors
          </NavLink>

          <NavLink className='navlink' to='/books'>
            Books
          </NavLink>

          <NavLink className='navlink' to='/search'>
            Search
          </NavLink>
        </nav>
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/authors/' element={<Authors />} />
        <Route path='/authors/:id/' element={<Author />} />
        <Route path='/books/' element={<Books />} />
        <Route path='/books/:id/' element={<Book />} />
        <Route path='/search/' element={<Search />} />
        <Route path='/error/' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
