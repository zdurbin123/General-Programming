const addSubCollection = (name) => ({
  type: 'ADD_SUBCOLLECTION',
  payload: {name: name}
});

const deleteSubCollection = (name) => ({
  type: 'DELETE_SUBCOLLECTION',
  payload: {name: name}
});

const selectSubCollection = (name) => ({
  type: 'SELECT_SUBCOLLECTION',
  payload: {name: name}
});

const addComic = (comic) => ({
  type: 'ADD_COMIC',
  payload: {comic: comic}
});
const deleteComic = (comic) => ({
  type: 'DELETE_COMIC',
  payload: {comic: comic}
});


export default {addSubCollection, deleteSubCollection, selectSubCollection, addComic, deleteComic};
