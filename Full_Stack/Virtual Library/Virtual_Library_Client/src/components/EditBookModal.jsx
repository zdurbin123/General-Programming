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

function EditBookModal(props) {
  const [showEditModal, setShowEditModal] = useState(props.isOpen);
  const [book, setBook] = useState(props.book);
  //const {loading, error, data} = useQuery(queries.GET_bookS);
  const [editBook] = useMutation(queries.EDIT_BOOK);
  const navigate = useNavigate();

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setBook(null);

    props.handleClose();
  };

  console.log(book);

  let t;
  let pd;
  let pub;
  let summ;
  let i;
  let lang;
  let pc;
  let p;
  let ai;

  //let bookId;

  /*if (data) {
    var {books} = data;
  }
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  */
  return (
    <div>
      {/*Edit book Modal - NOT DONE YET */}
      <ReactModal
        name='editModal'
        isOpen={showEditModal}
        contentLabel='Edit book'
        style={customStyles}
      >
        <form
          className='form'
          id='add-book'
          onSubmit={(e) => {

            //console.log(parseInt(employerId.value));
            e.preventDefault();
            let noError = true;
            try {
              t.value = helpers.checkString(t.value, 'title');
              //genres.value = helpers.checkStringArray(genres.value, 'genres');
              pd.value = helpers.checkDate(pd.value);
              pub.value = helpers.checkString(pub.value, 'publisher');
              summ.value = helpers.checkString(summ.value, 'summary');
              if (!helpers.checkIsbn(i.value))
                  throw `invalid isbn provided`;
              lang.value = helpers.checkString(lang.value, 'language');
              //format.value = helpers.checkStringArray(format.value, 'format');
              p.value = helpers.checkPrice(parseFloat(p.value));
              pc.value = helpers.checkLimit(parseInt(pc.value));
              }
              catch (e){
                noError = false;
                alert(`Error: ${e}`);
                //navigate('/error');
              }

            if (noError) {
            editBook({
              variables: {
                id: book._id,
                title: t.value,
                publicationDate: pd.value,
                publisher: pub.value,
                summary: summ.value,
                isbn: i.value,
                language: lang.value,
                pageCount: parseInt(pc.value),
                price: parseFloat(p.value),
                authorId: ai.value
              }
            });

            t.value = '';
            pd.value = '';
            pub.value = '';
            summ.value = '';
            i.value = '';
            lang.value = '';
            pc.value = '';
            p.value = '';
            ai.value = '';
            setShowEditModal(false);

            alert('book updated');
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
                  t = node;
                }}
                defaultValue={book.title}
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <br />
          <div className='form-group'>
            <label>
              Publication Date:
              <input
                ref={(node) => {
                  pd = node;
                }}
                defaultValue={book.publicationDate}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Publisher:
              <input
                ref={(node) => {
                  pub = node;
                }}
                defaultValue={book.publisher}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Summary:
              <input
                ref={(node) => {
                  summ = node;
                }}
                defaultValue={book.summary}
              />
            </label>
          </div>
        
          <div className='form-group'>
            <label>
              ISBN:
              <input
                ref={(node) => {
                  i = node;
                }}
                defaultValue={book.isbn}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Language:
              <input
                ref={(node) => {
                  lang = node;
                }}
                defaultValue={book.language}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Page Count:
              <input
                ref={(node) => {
                  pc = node;
                }}
                defaultValue={book.pageCount}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Price:
              <input
                ref={(node) => {
                  p = node;
                }}
                defaultValue={book.price}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Author ID:
              <input
                ref={(node) => {
                  ai = node;
                }}
                defaultValue={book.author._id}
              />
            </label>
          </div>
          <br />
          <br />
          <button className='button add-button' type='submit'>
            Update book
          </button>
        </form>

        <button className='button cancel-button' onClick={handleCloseEditModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default EditBookModal;
