import React, {useState} from 'react';
import './App.css';
import ReactModal from 'react-modal';
import {useQuery, useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';
import  helpers from '../helpers.js';
import { useNavigate } from 'react-router-dom';


//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

function AddBookModal(props) {
  const [showaddModal, setShowAddModal] = useState(props.isOpen);
  //const [Book, setBook] = useState(props.Book);
  //const {loading, error, data} = useQuery(queries.GET_BookS);
  const navigate = useNavigate();

  const [addBook] = useMutation(queries.ADD_BOOK, {
    update(cache, {data: {addBook}}) {
      const {books} = cache.readQuery({
        query: queries.GET_BOOKS
      });
    
      cache.writeQuery({
        query: queries.GET_BOOKS,
        data: {books: [...books, addBook]}
      });
      }
    });

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    props.handleClose();
  };

  let title;
  let genres;
  let publicationDate;
  let publisher;
  let summary;
  let isbn;
  let language;
  let pageCount;
  let price;
  let format;
  let authId;


  /*if (data) {
    var {Books} = data;
  }
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }*/
  return (
    <div>
      {/*add Book Modal - */}
      <ReactModal
        name='addModal'
        isOpen={showaddModal}
        contentLabel='add Book'
        style={customStyles}
      >
        <form
          className='form'
          id='add-Book'
          onSubmit={(e) => {
            console.log(title.value);
            console.log(format.value);
            console.log(genres.value);
            console.log(publicationDate.value);
            console.log(publisher.value);
            console.log(summary.value);
            console.log(isbn.value);
            console.log(language.value);
            console.log(pageCount.value);
            console.log(price.value);
            console.log(authId.value);
            console.log(parseInt(pageCount.value));
            console.log(parseFloat(price.value));

            let noError = true;
            try {
              title.value = helpers.checkString(title.value, 'title');
              //genres.value = helpers.checkStringArray(genres.value, 'genres');
              publicationDate.value = helpers.checkDate(publicationDate.value);
              publisher.value = helpers.checkString(publisher.value, 'publisher');
              summary.value = helpers.checkString(summary.value, 'summary');
              if (!helpers.checkIsbn(isbn.value))
                  throw `invalid isbn provided`;
              language.value = helpers.checkString(language.value, 'language');
              //format.value = helpers.checkStringArray(format.value, 'format');
              price.value = helpers.checkPrice(parseFloat(price.value));
              pageCount.value = helpers.checkLimit(parseInt(pageCount.value));
              }
              catch (e){
                noError = false;
                alert(`Error: ${e}`);
                //navigate('/error');
              }

            if (noError) {

            let formatArr = [];
            let genreArr = [];

            formatArr.push(format.value);
            genreArr.push(genres.value);
            //console.log(parseInt(employerId.value));
            e.preventDefault();
            try {
            let page = parseInt(pageCount.value)
            let pri = parseFloat(price.value)

            addBook({
              variables: {
                title: title.value,
                genres: genres.value,
                publicationDate: publicationDate.value,
                publisher: publisher.value,
                summary: summary.value,
                isbn: isbn.value,
                language: language.value,
                pageCount: page,
                price: pri,
                format: format.value,
                authorId: authId.value
              }
            
            });
          }
          catch (e)
          {
            console.log(e);
          }
            /*let title;
            let genres;
            let publicationDate;
            let publisher;
            let summary;
            let isbn;
            let language;
            let pageCount;
            let price;
            let format;*/

            title.value = '';
            genres.value = '';
            publicationDate.value = '';
            publisher.value = '';
            summary.value = '';
            isbn.value = '';
            language.value = '';
            pageCount.value = '';
            price.value = '';
            format.value = '';
            authId.value = '';
            
            setShowAddModal(false);

            alert('Book Added');
            props.handleClose();
          }
          }}
        >
          <div className='form-group'>
            <label>
              Title:
              <br />
              <input
                ref={(node) => {
                  title = node;
                }}
                defaultValue={''}
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Genre:
              <br />
              <input
                ref={(node) => {
                  genres = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Publication Date:
              <input
                ref={(node) => {
                  publicationDate = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Publisher:
              <input
                ref={(node) => {
                  publisher = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Summary:
              <input
                ref={(node) => {
                  summary = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              ISBN:
              <br />
              <input
                ref={(node) => {
                  isbn = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Language:
              <input
                ref={(node) => {
                  language = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Page Count:
              <input
                ref={(node) => {
                  pageCount = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Price:
              <input
                ref={(node) => {
                  price = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Format:
              <input
                ref={(node) => {
                  format = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Author ID:
              <input
                ref={(node) => {
                  authId = node;
                }}
                defaultValue={''}
              />
            </label>
          </div>
          <br />
          <br />
          <button className='button add-button' type='submit'>
            Add Book
          </button>
        </form>

        <button className='button cancel-button' onClick={handleCloseAddModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default AddBookModal;
