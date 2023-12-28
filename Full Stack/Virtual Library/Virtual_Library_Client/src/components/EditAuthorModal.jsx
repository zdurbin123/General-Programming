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

function EditAuthorModal(props) {
  const [showEditModal, setShowEditModal] = useState(props.isOpen);
  const [author, setAuthor] = useState(props.Author);

  const navigate = useNavigate();
  //const {loading, error, data} = useQuery(queries.GET_AUTHORS);
  const [editAuthor] = useMutation(queries.EDIT_AUTHOR);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setAuthor(null);

    props.handleClose();
  };

  console.log(props);

  let firstName;
  let lastName;
  let dob;
  let hc;
  let hs;

  //let authorId;

  /*if (data) {
    var {authors} = data;
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
      {/*Edit author Modal - NOT DONE YET */}
      <ReactModal
        name='editModal'
        isOpen={showEditModal}
        contentLabel='Edit author'
        style={customStyles}
      >
        <form
          className='form'
          id='add-author'
          onSubmit={(e) => {
            console.log(props.Author._id);
            console.log(firstName.value);
            console.log(lastName.value);
            console.log(dob.value);
            console.log(hc.value);
            console.log(hs.value);

            let noError = true
            try {
              firstName.value = helpers.checkString(firstName.value, 'first_name');
              lastName.value = helpers.checkString(lastName.value, 'last_name');
              dob.value = helpers.checkDate(dob.value);
              hc.value = helpers.checkString(hc.value, 'hometownCity');
              hs.value = helpers.checkString(hs.value, 'hometownState');
              hs.value = helpers.checkState(hs.value);
              }
              catch (e) {
                noError = false;
                alert(`Error: ${e}`);
                //navigate('/error');
              }
              //console.log(parseInt(employerId.value));
              e.preventDefault();
            if (noError) {
            editAuthor({
              variables: {
                id: props.Author._id,
                firstName: firstName.value,
                lastName: lastName.value,
                dateOfBirth: dob.value,
                hometownCity: hc.value,
                hometownState: hs.value
              }
            });
            firstName.value = '';
            lastName.value = '';
            dob.value = '';
            hc.value = '';
            hs.value = '';
            setShowEditModal(false);

            alert('Author Updated');
            props.handleClose();
          }
          }}
        >
          <div className='form-group'>
            <label>
              First Name:
              <br />
              <input
                ref={(node) => {
                  firstName = node;
                }}
                defaultValue={author.first_name}
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Last Name:
              <br />
              <input
                ref={(node) => {
                  lastName = node;
                }}
                defaultValue={author.last_name}
              />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Date of Birth:
              <input
                ref={(node) => {
                  dob = node;
                }}
                defaultValue={author.date_of_birth}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Hometown City:
              <input
                ref={(node) => {
                  hc = node;
                }}
                defaultValue={author.hometownCity}
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Hometown State:
              <input
                ref={(node) => {
                  hs = node;
                }}
                defaultValue={author.hometownState}
              />
            </label>
          </div>
          <br />
          <br />
          <button className='button add-button' type='submit'>
            Update author
          </button>
        </form>

        <button className='button cancel-button' onClick={handleCloseEditModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default EditAuthorModal;
