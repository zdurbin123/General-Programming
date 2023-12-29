import {combineReducers} from '@reduxjs/toolkit';
import collectionReducer from './collectionReducer';
//import subCollectionReducer from './subCollectionReducer';

const reducers = combineReducers({
  collection: collectionReducer
  //subCollection: subCollectionReducer
});

export default reducers;