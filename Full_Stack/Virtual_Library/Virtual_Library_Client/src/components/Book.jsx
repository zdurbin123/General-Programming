import React, {useState} from 'react';
import './App.css';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
//import Add from './Add';
import EditBookModal from './EditBookModal';
import { useParams, useNavigate} from 'react-router-dom';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@mui/material';

function Book() {
  //const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteBook, setDeleteBook] = useState({_id: null});
  //const [editBook, setEditBook] = useState(null);

  const navigate = useNavigate();
  let {id} = useParams();
  
  const {loading, error, data} = useQuery(queries.GET_BOOK, {
    variables: {id: id},
    fetchPolicy: 'cache-and-network'
  });

  const [removeBook] = useMutation(queries.DELETE_BOOK, {
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
  });

  console.log(data);

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
  };

  const handleDeleteButton = (book) => {

    setDeleteBook(book);

    removeBook({
      variables: {
        id: book._id
      }
    });

    alert('Book deleted');

    navigate('/books');
  };

  //MAY NEED THIS
  /*const {loading, error, data} = useQuery(
    queries.GET_Book,
    {
      fetchPolicy: 'cache-and-network'
    }
  );*/

  if (error) {
    console.log(error.message);
  }
  else if(loading) {
    return (
      <h1>Loading</h1>
    )
  }
  else
  {
  let book = data.getBookById;

  let genreList =
  book.genres.map((genre) => {
    return <div>
      <dd>
        {genre}
      </dd>
    </div>
  });

  let formatList =
  book.format.map((form) => {
    return <div>
      <dd>
        {form}
      </dd>
    </div>
  });

    return (
      <div>
        <Card
        variant='outlined'
        sx={{
          maxWidth: 550,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '1px solid #1e8678',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardContent>
          <Typography
            variant='body2'
            color='textSecondary'
            component='span'
            sx={{
              borderBottom: '1px solid #1e8678',
              fontWeight: 'bold'
            }}
          >
            <dl>
              <p>
                {book && book.title ? (
                  <dd>
                  {book.title}
                  </dd>
                ) : (
                  <dd>Book title not available</dd>
                )}
              </p>
              <p>
                <p>{console.log(genreList)}</p>
              <dt className='title'>Genres:</dt>
                   {genreList}
              </p>
              <p>
              <dt className='title'>Publication Date:</dt>
                {book && book.publicationDate ? (
                  <dd>
                   {book.publicationDate}
                  </dd>
                ) : (
                  <dd>No publication date available</dd>
                )}
              </p> 
              <p>
              <dt className='title'>Publisher:</dt>
                {book && book.publisher ? (
                  <dd>
                   {book.publisher}
                  </dd>
                ) : (
                  <dd>Publisher not available</dd>
                )}
              </p> 
              <p>
              <dt className='title'>Summary:</dt>
                {book && book.summary ? (
                  <dd>
                   {book.summary}
                  </dd>
                ) : (
                  <dd>Publisher not available</dd>
                )}
              </p> 
              <p>
              <dt className='title'>Publisher:</dt>
                {book && book.isbn ? (
                  <dd>
                   {book.isbn}
                  </dd>
                ) : (
                  <dd>ISBN not available</dd>
                )}
              </p> 
              <p>
              <dt className='title'>Language:</dt>
                {book && book.language ? (
                  <dd>
                   {book.language}
                  </dd>
                ) : (
                  <dd>Language not available</dd>
                )}
              </p> 
              <p>
              <dt className='title'>Page Count:</dt>
                {book && book.pageCount ? (
                  <dd>
                   {book.pageCount}
                  </dd>
                ) : (
                  <dd>Page count not available</dd>
                )}
              </p> 
              <p>
              <dt className='title'>Price:</dt>
                {book && book.price ? (
                  <dd>
                   {book.price}
                  </dd>
                ) : (
                  <dd>Price not available</dd>
                )}
              </p> 
              <p>
              <dt className='title'>Formats:</dt>
                {formatList}
            </p>
            <p>
              <dt className='title'>Author:</dt>
                {book && book.author.first_name && book.author.last_name ? (
                  <dd>
                   {book.author.first_name} {book.author.last_name}
                  </dd>
                ) : (
                  <dd>Author not available</dd>
                )}
              </p> 
            </dl>
            </Typography>
        </CardContent>
      </Card>
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
      {showEditModal && (
        <EditBookModal
          isOpen={showEditModal}
          book={book}
          handleClose={handleCloseModals}
        />
      )}
  </div>
  );
}

}

export default Book;
