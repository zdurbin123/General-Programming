import React, {useState, useEffect} from 'react';
import axios from 'axios';
import actions from '../../actions/index.js';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

const Collections = () => {

  const dispatch = useDispatch();
  const allState = useSelector((state) => state.collection);
  const [formData, setFormData] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };
  const addSubCollection = () => {
    dispatch(actions.addSubCollection(formData.sc));
   
  };  

  
const showComic = (comic) => {
    return (
        <div>
            <dl>
              <p>
                <dt className='title'>Comic Title:</dt>
                {comic && comic.title ? (
                  <dd>
                   {comic.title}
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
            </dl>
        <div>
        <Link to={`/marvel-comics/${comic.id}`}>Click here for individual comic page</Link> 
        </div>
        <div>
            <button onClick={() =>dispatch(actions.deleteComic(comic))}>
            Give Up
            </button>
            </div>
        </div>)
    }

    let collections =
    allState &&
    allState.map((collection) => {
        return <div><h1>{collection.name}</h1>
        <div>{collection.comics.map((comic) => {
            return showComic(comic)
        })}</div>
         <div>
            <button onClick={() =>dispatch(actions.selectSubCollection(collection.name))}>
            Select
            </button>
            <button onClick={() =>dispatch(actions.deleteSubCollection(collection.name))}>
            Delete
            </button>
            </div>
    </div>})

    return (<div><div>{collections}</div>
    <label>
          Add Subcollection:
          <input
            onChange={(e) => handleChange(e)}
            id='sc'
            name='sc'
            placeholder='Subcollection name...'
          />
        </label>
        <button onClick={addSubCollection}>Add Subcollection</button>
        
         <Link to={`/marvel-comics/page/1`}>Comics Page</Link>
         </div>
    )
};

export default Collections;