import React from 'react';
import './App.css';

import {useQuery, useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';

function Add(props) {

  const [addAuthor] = useMutation(queries.ADD_AUTHOR, {
    update(cache, {data: {addauthor}}) {
      const {authors} = cache.readQuery({
        query: queries.GET_AUTHORS
      });
      cache.writeQuery({
        query: queries.GET_AUTHORS,
        data: {authors: [...authors, addauthor]}
      });
    }
  });

  //BELOW WILL BE ADDBOOK
  /*const [addEmployer] = useMutation(queries.ADD_EMPLOYER, {
    update(cache, {data: {addEmployer}}) {
      const {employers} = cache.readQuery({
        query: queries.GET_EMPLOYERS_WITH_authorS
      });
      cache.writeQuery({
        query: queries.GET_EMPLOYERS_WITH_authorS,
        data: {employers: [...employers, addEmployer]}
      });
    }
  });*/

  const onSubmitAuthor = (e) => {
    e.preventDefault();

    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let dob = document.getElementById('date_of_birth');
    let hc = document.getElementById('hometown_city');
    let hs = document.getElementById('hometown_state');

    addAuthor({
      variables: {
        id: props.Author._id,
        firstName: firstName.value,
        lastName: lastName.value,
        dateOfBirth: dob.value,
        hometownCity: hc.value,
        hometownState: hs.value
      }
    });

    //employerId.value = '1';
    document.getElementById('add-author').reset();
    alert('author added');
    props.closeAddFormState();
  };

  //WILL BE FOR BOOKS
  /*const onSubmitEmployer = (e) => {
    e.preventDefault();
    let employer = document.getElementById('employerName');
    addEmployer({
      variables: {
        name: employer.value
      }
    });
    document.getElementById('add-employer').reset();
    alert('Employer Added');
    props.closeAddFormState();
  };
  */

  //  MAY BE FOR BOOKS
  //const {data} = useQuery(queries.GET_EMPLOYERS);

  if (data) {
    var {employers} = data;
  }
  let body = null;
  if (props.type === 'author') {
    body = (
      <div className='card'>
        <form className='form' id='add-author' onSubmit={onSubmitAuthor}>
          <div className='form-group'>
            <label>
              First Name:
              <br />
              <input id='firstName' required autoFocus={true} />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Last Name:
              <br />
              <input id='lastName' required />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Date of Birth:
              <br />
              <input id='date_of_birth' required />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Hometown City:
              <br />
              <input id='hometown_city' required />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Hometown State:
              <br />
              <input id='hometown_state' required />
            </label>
          </div>
          <br />
          <button className='button add-button' type='submit'>
            Add author
          </button>
          <button
            type='button'
            className='button cancel-button'
            onClick={() => {
              document.getElementById('add-author').reset();
              props.closeAddFormState();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
    /*
  } else if (props.type === 'employer') {
    let name;
    body = (
      <div className='card'>
        <form className='form' id='add-employer' onSubmit={onSubmitEmployer}>
          <div className='form-group'>
            <label>
              Employer Name:
              <br />
              <input id='employerName' required autoFocus={true} />
            </label>
          </div>
          <br />

          <br />
          <br />
          <button className='button' type='submit'>
            Add Employer
          </button>
          <button
            type='button'
            className='button'
            onClick={() => {
              document.getElementById('add-employer').reset();
              props.closeAddFormState();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );*/
  }
  return <div>{body}</div>;
}


export default Add;
