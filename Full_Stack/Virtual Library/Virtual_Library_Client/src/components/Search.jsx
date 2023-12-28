import React, {useState}from 'react';
import './App.css';
import {useLazyQuery} from '@apollo/client';
import queries from '../queries';
import { Link } from 'react-router-dom';

function Search() {
  const [showOneInput, setShowOneInput] = useState(false);
  const [showTwoInputs, setShowTwoInputs] = useState(false);
  const [searchType, setSearchType] = useState(null)
  const [showBooks, setShowBooks] = useState(false);
  const [showAuthors, setShowAuthors] = useState(false);
  const [queryData, setQueryData] = useState([]);

  const [booksByGenre, {loading: loadingGenre, error: errorGenre, data: genreData}] = useLazyQuery(queries.BOOKS_BY_GENRE);
  const [booksByPriceRange, {loading: loadingRange, error: errorRange, data: rangeData}] = useLazyQuery(queries.BOOKS_BY_PRICE_RANGE);
  const [searchAuthorsByName, {loading: loadingAuthor, error: errorAuthor, data: authorData}] = useLazyQuery(queries.AUTH_BY_NAME);


  const handleSelectOption = (e) => {
    try {
    console.log(e.target.value);
    setSearchType(e.target.value);
    
    if (e.target.value === "books-by-genre" || e.target.value === "auth-by-name") {
        setShowOneInput(true);
        setShowTwoInputs(false);
    }
    else if (e.target.value === "books-by-price-range") {
        setShowTwoInputs(true);
        setShowOneInput(false);
    }}
    catch (e) {
        console.log(e);
    }
  }

  let searchVal1;
  let searchVal2;

  const showForm = () => {
    return (
        <div>
            <form
      className='form'
      id='add-book'
      onSubmit={(e) => {
        console.log(searchVal1.value);
        e.preventDefault();

        if (searchType == "books-by-genre") {
            setShowBooks(true);
            setShowAuthors(false);
            booksByGenre({
                variables: {
                  genre: searchVal1.value
                }
              });

            console.log(booksByGenre);

            //setQueryData(data);
            
            searchVal1.value = '';
            console.log(genreData);
        }
        else if (searchType == "auth-by-name")
        {
            setShowAuthors(true);
            setShowBooks(false);
            searchAuthorsByName({
                variables: {
                  searchTerm: searchVal1.value
                }
              });

            console.log(authorData);
            
            searchVal1.value = '';
        }
        else if (searchType == "books-by-price-range")
        {
            if (searchVal1.value === '0') {
                var searchVal = 0;
            }
            else if (searchVal1.value === '')
                searchVal = 0;
            else {
                var searchVal = parseInt(searchVal1.value)
            }

            console.log(searchVal);

            setShowBooks(true);
            setShowAuthors(false);
            booksByPriceRange({
                variables: {
                  min: searchVal,
                  max: parseInt(searchVal2.value)
                }
              });
            
            searchVal1.value = '';
            searchVal2.value = '';

            console.log(rangeData);
        }
        else {
            alert('You must select a search type');
        }
      }
    }   
    >
    <select value={searchType} defaultValue={"placeholder"} onChange={handleSelectOption} >
    <option value={"placeholder"}>Select a search type</option>
    <option value={"books-by-genre"}>Books By Genre</option>
    <option value={"books-by-price-range"}>Books By Price Range</option>
    <option value={"auth-by-name"}>Search Authors By Name</option>
    </select>
    {showOneInput && (
    <div className='form-group'>
        <label>
          Enter Search Value:
          <input
            ref={(node) => {
              searchVal1 = node;
            }}
          />
        </label>
      </div>
    )}
    {showTwoInputs && (
    <div className='form-group'>
        <label>
          Enter Minimum Price :
          <input
            ref={(node) => {
              searchVal1 = node;
            }}
            defaultValue={0}
          />
        </label>
        <label>
          Enter Maximum Price :
          <input
            ref={(node) => {
              searchVal2 = node;
            }}
          />
        </label>
      </div>
    )}
     <button className='button add-button' type='submit'>
        Search
      </button>
        </form>
    </div>
    )
}

  //if (!showOneInput && !showTwoInputs) {
if (rangeData && showBooks && searchType === 'books-by-price-range') {
    var books;
    
    books = rangeData.booksByPriceRange;

    console.log(showBooks);
    if (books.length) {
    return (
    <div>
    {showForm()}
    {books.map((book) => {
        return (<div className='card' key={book._id}>
        <div className='card-body'>
        <Link to={{pathname: `/books/${book._id}`}}>
            {book.title}
        </Link>
        <br>
        </br>
          <p>Price: {book.price}</p>
        </div>
        </div>
    )
    
})}
</div>) }
else {
    return ( <div> <h1>No books available. Please search again.</h1>
    {showForm()}
    </div>)
}
}
else if (genreData && showBooks && searchType === 'books-by-genre') {
    var books;
    
    books = genreData.booksByGenre;

    console.log(showBooks);
    if (books.length) {
    return (
    <div>
    {showForm()}
    {books.map((book) => {
        return (<div className='card' key={book._id}>
        <div className='card-body'>
        <Link to={{pathname: `/books/${book._id}`}}>
            {book.title}
        </Link>
        <br>
        </br>
          <p>Price: {book.price}</p>
        </div>
        </div>
    )
    
})}
</div>) }
else {
    return ( <div> <h1>No books available. Please search again.</h1>
    {showForm()}
    </div>)
}
}
else if (authorData && showAuthors) {

    var authors = authorData.searchAuthorsByName;
    console.log(authorData);

    if (authors.length) {
    return (
    <div>
    {showForm()}
    {authors.map((author) => {
        return (
            <div className='card' key={author._id}>
            <div className='card-body'>
            <Link to={{pathname: `/authors/${author._id}`}}>
                {author.first_name} {author.last_name}
            </Link>
            <br>
            </br>
              Number of Books: {author.numOfBooks}
              <br />
              </div>
              </div>
        )}
        )
    }
    </div>)
    }
    else {
        return ( <div> <h1>No authors with that name. Please try again.</h1>
        {showForm()}
        </div>)
    }
  }
  else {
    return <div>   
         {showForm()}
    </div>
  }
}

export default Search;