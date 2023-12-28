import {gql} from '@apollo/client';

const GET_AUTHORS = gql`
query Authors {
  authors {
    _id
    first_name
    last_name
    date_of_birth
    hometownCity
    hometownState
    numOfBooks
  }
}
`;

const GET_AUTHOR = gql`
query Author($id: String!) {
  getAuthorById(_id: $id) { 
    _id
    books {
      title
    }
    date_of_birth
    first_name
    hometownCity
    hometownState
    last_name
    }
  }
`;

const GET_BOOKS = gql`
query Query {
  books {
    _id
    author {
      first_name
      last_name
      _id
    }
    format
    genres
    isbn
    language
    pageCount
    price
    publicationDate
    publisher
    summary
    title
  }
}
`;

const EDIT_BOOK = gql`
mutation EditBook($id: String!, $title: String, $genres: [String], $publicationDate: String, $publisher: String, $summary: String, $isbn: String, $language: String, $pageCount: Int, $price: Float, $format: [String], $authorId: String)
  {
  editBook(_id: $id, title: $title, genres: $genres, publicationDate: $publicationDate, publisher: $publisher, summary: $summary, isbn: $isbn, language: $language, pageCount: $pageCount, price: $price, format: $format, authorId: $authorId) {
    _id
    author {
      _id
      first_name
      last_name
    }
    format
    genres
    isbn
    language
    pageCount
    price
    publicationDate
    publisher
    summary
    title
  }
}
`;

const ADD_BOOK = gql`
mutation AddBook($title: String!, $genres: [String!]!, $publicationDate: String!, $publisher: String!, $summary: String!, $isbn: String!, $language: String!, $pageCount: Int!, $price: Float!, $format: [String!]!, $authorId: String!) {
  addBook(title: $title, genres: $genres, publicationDate: $publicationDate, publisher: $publisher, summary: $summary, isbn: $isbn, language: $language, pageCount: $pageCount, price: $price, format: $format, authorId: $authorId) {
    author {
      first_name
      last_name
    }
    format
    genres
    isbn
    language
    pageCount
    price
    publicationDate
    publisher
    summary
    title
  }
}
`;

const ADD_AUTHOR = gql`
mutation CreateAuthor($firstName: String!, $lastName: String!, $dateOfBirth: String!, $hometownCity: String!, $hometownState: String!) {
  addAuthor(first_name: $firstName, last_name: $lastName, date_of_birth: $dateOfBirth, hometownCity: $hometownCity, hometownState: $hometownState) {
    first_name
    last_name
    date_of_birth
    hometownCity
    hometownState
  }
}
`;

const DELETE_AUTHOR = gql`
mutation DeleteAuthor($id: String!) {
  removeAuthor(_id: $id) {
    _id
    first_name
    last_name
    hometownCity
    hometownState
  }
}
`;

const DELETE_BOOK = gql`
mutation RemoveBook($id: String!) {
  removeBook(_id: $id) {
    _id
  }
}
`;

const EDIT_AUTHOR = gql`
mutation EditAuthor($id: String!, $firstName: String, $lastName: String, $dateOfBirth: String, $hometownCity: String, $hometownState: String) {
  editAuthor(_id: $id, first_name: $firstName, last_name: $lastName, date_of_birth: $dateOfBirth, hometownCity: $hometownCity, hometownState: $hometownState) {
    _id
    first_name
    last_name
    date_of_birth
    hometownCity
    hometownState
  }
}
`;

const GET_BOOK = gql`
query Query($id: String!) {
  getBookById(_id: $id) {
    _id
    author {
      first_name
      last_name
      _id
    }
    format
    genres
    isbn
    language
    pageCount
    price
    publicationDate
    publisher
    summary
    title
  }
}
`;

const BOOKS_BY_GENRE = gql`
query BooksByGenre($genre: String!) {
  booksByGenre(genre: $genre) {
    _id
    author {
      first_name
      last_name
    }
    format
    genres
    isbn
    language
    pageCount
    price
    publicationDate
    publisher
    summary
    title
  }
}`;

const BOOKS_BY_PRICE_RANGE = gql`
query BooksByPriceRange($min: Float!, $max: Float!) {
  booksByPriceRange(min: $min, max: $max) {
    _id
    author {
      first_name
      last_name
    }
    format
    genres
    isbn
    language
    pageCount
    price
    publicationDate
    publisher
    summary
    title
  }
}`;

const AUTH_BY_NAME = gql`
query SearchAuthorsByName($searchTerm: String!) {
  searchAuthorsByName(searchTerm: $searchTerm) {
    _id
    books {
      title
    }
    date_of_birth
    first_name
    hometownCity
    hometownState
    last_name
    numOfBooks
  }
}`;


let exported = {
  ADD_BOOK,
  DELETE_BOOK,
  GET_AUTHORS,
  GET_AUTHOR,
  DELETE_AUTHOR,
  GET_BOOKS,
  ADD_AUTHOR,
  EDIT_AUTHOR,
  EDIT_BOOK,
  GET_BOOK,
  BOOKS_BY_GENRE,
  BOOKS_BY_PRICE_RANGE,
  AUTH_BY_NAME
};

export default exported;
