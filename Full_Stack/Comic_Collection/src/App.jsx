import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Provider} from 'react-redux';
import store from '../store/index.js';
import Home from './components/Home';
import Error404 from './components/Error404';
import ComicList from './components/ComicList';
import Comic from './components/Comic';
import Collections from './components/Collections';
import './App.css'
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <Provider store={store}>
    <Router>
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/marvel-comics/page/:pagenum' element={<ComicList/>} />
            <Route path='/marvel-comics/:id' element={<Comic/>} />
            <Route path='/marvel-comics/collections' element={<Collections/>} />
            <Route path='/error404' element={<Error404/>} />
          </Routes>
        </div>
    </Router>
    </Provider>
  )
}

export default App
