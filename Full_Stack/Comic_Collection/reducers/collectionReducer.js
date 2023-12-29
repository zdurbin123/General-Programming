//import {v4 as uuid} from 'uuid';
const initalState = [{
  name: 'Initial SubCollection',
  comics: [],
  selected: true
}];

let copyState = null;
let index = 0;

const collectionReducer = (state = initalState, action) => {
  const {type, payload} = action;

  switch (type) {
    case 'ADD_SUBCOLLECTION':
      return [
        ...state,
        {
          name: payload.name,
          comics: [],
          selected: false
        }
      ];
    case 'DELETE_SUBCOLLECTION':
      copyState = [...state];
      index = copyState.findIndex((x) => x.name === payload.name);
      copyState.splice(index, 1);
      return [...copyState];
    case 'SELECT_SUBCOLLECTION':

      return state.map(sc => {
        if (sc.name === payload.name) {
          return {...sc, selected: true}
        }
        else  {
          return {...sc, selected: false}
        };
      });
    case 'ADD_COMIC': 
      return state.map(sc => {
        if (sc.selected === true && sc.comics.length < 20 && !(sc.comics.includes(payload.comic))) {
          return {...sc, comics: [...sc.comics, payload.comic]}
        }
        else {
          return sc
        }
      });

    case 'DELETE_COMIC': 
      return state.map(sc => {
        if (sc.selected === true && sc.comics.includes(payload.comic)) {
          return {...sc, comics: sc.comics.filter(comic => comic.id !== payload.comic.id)}
        }
        else {
          return sc
        }
      });

      copyState = [...state];
      index = copyState.findIndex((x) => x.selected === true);
      comicIndex = copyState.findIndex((x) => x.id === payload.id);
      copyState[index].comics.splice(index, 1);
      return [...copyState]; 
    default:
      return state;
  }
};

export default collectionReducer;
