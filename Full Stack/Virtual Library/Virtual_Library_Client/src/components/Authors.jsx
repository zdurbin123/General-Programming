import React, {useState}from 'react';
import './App.css';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
//import Add from './Add';
//import DeleteAuthorModal from './DeleteAuthorModal';
import EditAuthorModal from './EditAuthorModal';
import AddAuthorModal from './AddAuthorModal';
import DeleteAuthorModal from './DeleteAuthorModal';
import { Link } from 'react-router-dom';

function Authors() {
  //const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAuthor, setEditAuthor] = useState(null);
  const [deleteAuthor, setDeleteAuthor] = useState(null);

  const {loading, error, data} = useQuery(queries.GET_AUTHORS, {
    fetchPolicy: 'cache-and-network'
  });

  console.log(data);



  /*const [removeAuthor] = useMutation(queries.DELETE_AUTHOR, {
    update(cache) {
      cache.modify({
        fields: {
          authors(existingAuthors, { readField }) {
            return existingAuthors.filter(
              authRef => deleteAuthor !== readField('_id', authRef),
            );
          },
        },
      });
    },
  });*/

  const handleOpenEditModal = (author) => {
    setShowEditModal(true);
    setEditAuthor(author);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    //setEditAuthor(author);
  };

  const handleDeleteButton = (author) => {

    console.log('in handle delete button');

    setShowDeleteModal(true);
    setDeleteAuthor(author);
    
    /*removeAuthor({
      variables: {
        id: author._id
      }
    });

    alert('Author deleted');*/
   
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
  };

  if (data) {
    const {authors} = data;
    return (
      <div>
        <button className='button' onClick={() => handleOpenAddModal()}>
          Add Author
        </button>
        <br />
        <br />

        {authors.map((author) => {
          return (
            <div className='card' key={author._id}>
              <div className='card-body'>
              <Link to={{pathname: `/authors/${author._id}`, state: author}}>
                  {author.first_name} {author.last_name}
              </Link>
              <br>
              </br>
                Number of Books: {author.numOfBooks}
                <br />
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
                <br/>
              </div>
            </div>
          );
        })}
        {showEditModal && (
          <EditAuthorModal
            isOpen={showEditModal}
            Author={editAuthor}
            handleClose={handleCloseModals}
          />
        )}
        {showAddModal && (
          <AddAuthorModal
            isOpen={showAddModal}
            //Author={editAuthor}
            handleClose={handleCloseModals}
          />
        )}
         {showDeleteModal && (
          <DeleteAuthorModal
            isOpen={showDeleteModal}
            handleClose={handleCloseModals}
            deleteAuthor={deleteAuthor}
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

export default Authors;
