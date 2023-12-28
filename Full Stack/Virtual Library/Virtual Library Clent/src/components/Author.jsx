import React, {useState} from 'react';
import './App.css';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import EditAuthorModal from './EditAuthorModal';
import {useParams, useNavigate} from 'react-router-dom';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@mui/material';

function Author() {
  //const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteAuthor, setDeleteAuthor] = useState({_id: null});
  //const [editAuthor, setEditAuthor] = useState(null);

  const navigate = useNavigate();
  let {id} = useParams();
  
  const {loading, error, data} = useQuery(queries.GET_AUTHOR, {
    errorPolicy: "all",
    variables: {id: id},
    //fetchPolicy: 'network-only'
  });

  const [removeAuthor] = useMutation(queries.DELETE_AUTHOR, {
    update(cache) {
      cache.modify({
        fields: {
          authors(existingAuthors, { readField }) {
            return existingAuthors.filter(
              authRef => deleteAuthor._id !== readField('_id', authRef),
            );
          },
        },
      });
    },
  });

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
  };

  const handleDeleteButton = (author) => {

    setDeleteAuthor(author);

    removeAuthor({
      variables: {
        id: author._id
      }
    });

    alert('Author deleted');
    navigate('/authors');
   
  };

  //MAY NEED THIS
  /*const {loading, error, data} = useQuery(
    queries.GET_AUTHOR,
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
  let author = data.getAuthorById;

  console.log(author);

  let firstThreeBooks = author.books.slice(0, 3)

  let bookList =
  firstThreeBooks.map((book) => {
    return <div>
      <dd>
        {book.title}
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
                {author && author.first_name && author.last_name ? (
                  <dd>
                   {author.first_name} {author.last_name}
                  </dd>
                ) : (
                  <dd>Author name not available</dd>
                )}
              </p>
              <p>
              <dt className='title'>DOB:</dt>
                {author && author.date_of_birth ? (
                  <dd>
                   {author.date_of_birth}
                  </dd>
                ) : (
                  <dd>Date of birth not available</dd>
                )}
              </p>
              <p>
              <dt className='title'>Hometown City:</dt>
                {author && author.hometownCity ? (
                  <dd>
                   {author.hometownCity}
                  </dd>
                ) : (
                  <dd>Hometown city not available</dd>
                )}
              </p> 
              <p>
              <dt className='title'>Hometown State:</dt>
                {author && author.hometownState ? (
                  <dd>
                   {author.hometownState}
                  </dd>
                ) : (
                  <dd>Hometown state not available</dd>
                )}
              </p> 
            <dt className='title'>Some books by this author:</dt>
            {bookList}
            </dl>
            </Typography>
        </CardContent>
      </Card>
              <button
                className='button'
                onClick={() => {
                  handleOpenEditModal(author);
                }}
              >
                Edit
              </button>
              <button
                className='button'
                onClick={() => {
                  handleDeleteButton(author);
                }}
              >
                Delete
              </button>
      {showEditModal && (
        <EditAuthorModal
          isOpen={showEditModal}
          Author={author}
          handleClose={handleCloseModals}
        />
      )}
  </div>
  );
  }
}

export default Author;
