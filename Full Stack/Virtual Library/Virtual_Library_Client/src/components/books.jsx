import React, {useState}from 'react';
import './App.css';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
//import DeletebookModal from './DeletebookModal';
import EditBookModal from './EditBookModal';
import AddBookModal from './AddBookModal.jsx';
import DeleteBookModal from './DeleteBookModal.jsx';
import { Link } from 'react-router-dom';

function Books() {
  //const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState({_id: null});

  const {loading, error, data} = useQuery(queries.GET_BOOKS, {
    fetchPolicy: 'cache-and-network'
  });

  console.log(data);

  /*const [removeBook] = useMutation(queries.DELETE_BOOK, {
    update(cache) {
      cache.modify({
        fields: {
          books(existingBooks, { readField }) {
            return existingBooks.filter(
              bookRef => deleteBook._id !== readField('_id', bookRef),
            );
          },
        },
      });
    },
  });*/

  const handleOpenEditModal = (book) => {
    setShowEditModal(true);
    setEditBook(book);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    //setEditbook(book);
  };

  const handleDeleteButton = (book) => {

    console.log(book);
    
    setShowDeleteModal(true);
    setDeleteBook(book);   
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
  };


  if (data) {
    const {books} = data;
    return (
      <div>
        <button className='button' onClick={() => handleOpenAddModal()}>
          Add Book
        </button>
        <br />
        <br />

        {books.map((book) => {

           let genreList = book.genres.map((genre) => {
                return (
                    <li>{genre}</li>
                )
            })

          return (
            <div className='card' key={book._id}>
              <div className='card-body'>
              <Link to={{pathname: `/books/${book._id}`, state: book}}>
                  {book.title}
              </Link>
              <br>
              </br>
                <p> Genres:</p>
                <ul>
                {genreList}
                </ul>
                <br />
                <br />
                <p>Price: {book.price}</p>
                <button
                  className='button'
                  onClick={() => {
                    handleOpenEditModal(book);
                  }}
                >
                  Edit
                </button>
                <button
                  className='button'
                  onClick={() => {
                    handleDeleteButton(book);
                  }}
                >
                  Delete
                </button>
                <br/>
              </div>
            </div>
          );
        })}
        {showEditModal && (
          <EditBookModal
            isOpen={showEditModal}
            book={editBook}
            handleClose={handleCloseModals}
          />
        )}
        {showAddModal && (
          <AddBookModal
            isOpen={showAddModal}
            //book={editbook}
            handleClose={handleCloseModals}
          />
        )}
         {showDeleteModal && (
          <DeleteBookModal
            isOpen={showDeleteModal}
            handleClose={handleCloseModals}
            deleteBook={deleteBook}
          />
        )}
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default Books;
