import {ApolloServer, gql} from 'apollo-server';
import {
  books as bookCollection,
  authors as authorCollection
} from './config/mongoCollections.js';
//import express from 'express';
//const app = express();
import redis from 'redis';
import lodash from 'lodash';
import  helpers from './helpers.js';
const client = redis.createClient();
client.connect().then(() => {});

import {v4 as uuid} from 'uuid'; //for generating _id's

//Create the type definitions for the query and our data
const typeDefs = gql`
  type Query {
    authors: [Author]
    books: [Book]
    getAuthorById(_id: String!): Author
    getBookById(_id: String!): Book
    booksByGenre (genre: String!): [Book]
    booksByPriceRange (min: Float!, max: Float!) : [Book] 
    searchAuthorsByName (searchTerm: String!): [Author]
  }

  type Book {
    _id: String,
    title: String,
    genres: [String],
    publicationDate: String,
    publisher: String,
    summary: String,
    isbn: String,
    language: String,
    pageCount: Int,
    price: Float,
    format: [String],
    author: Author #We will need a resolver for this one! //THIS IS THE ENTIRE AUTHOR FOR THE GQL QUERY. IN MONGODB, ONLY 'authorId' IS STORED HERE
  }

  type Author {
    _id: String,
    first_name: String,
    last_name: String,
    date_of_birth: String,
    hometownCity: String,
    hometownState: String,
    numOfBooks: Int #We will need a resolver for this one! This is a computed field that will count the number of books the author has written (see lecture code for numOfEmployees on the employer type)
    books(limit: Int): [Book]  #We will need a resolver for this one! the limit param is optional, if it's supplied, you will limit the results to the number supplied, if no limit parameter is supplied, then you return all the books for that author
  }

  type Mutation {
    addAuthor(first_name: String!, last_name: String!, date_of_birth: String!, hometownCity: String!, hometownState: String!): Author
    editAuthor(_id: String!, first_name: String, last_name: String, date_of_birth: String, hometownCity: String, hometownState: String): Author
    removeAuthor(_id: String!): Author
    addBook(title: String!, genres: [String!]!, publicationDate: String!, publisher: String!, summary: String!, isbn: String!, language: String!, pageCount: Int!, price: Float!, format: [String!]!, authorId: String!): Book  
    editBook(_id: String!, title: String, genres: [String], publicationDate: String, publisher: String, summary: String, isbn: String, language: String, pageCount: Int, price: Float, format: [String], authorId: String): Book
    removeBook(_id: String!): Book
  }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

const resolvers = {
  Query: {
    getAuthorById: async (_, args) => {
      console.log('get author by id called');

      await client.del("All_Authors");
      await client.del(args._id);

      let exists = await client.exists(args._id);

      if (exists) {
        let auth = await client.get(args._id);
        let authObject = JSON.parse(auth);

        return authObject;
      }
      else {
        const authors = await authorCollection();
        const author = await authors.findOne({_id: args._id});

        if (!author)
          throw `could not find an author with that id`;

        //add to redis cache
        client.set(author._id, JSON.stringify(author));

        return author;
      }
    },
    getBookById: async (_, args) => {

      let exists = await client.exists(args._id);

      if (exists) {
        let book = await client.get(args._id);
        let bookObject = JSON.parse(book);

        return bookObject;
      }
      else {

        const books = await bookCollection();
        const book = await books.findOne({_id: args._id});

        if (!book)
          throw `could not find a book with that id`;

        //add to redis cache
        client.set(book._id, JSON.stringify(book));

        return book;
      }
    },
    authors: async () => {

      let authorList = await client.lRange('All_Authors', 0, -1);

      if (authorList.length > 0) {
        let returnArr = [];
        for (let auth of authorList) {
          let authorObject = JSON.parse(auth);
          returnArr.push(authorObject);
        };

        console.log(returnArr);

        return returnArr;
      }
      else {
        const authors = await authorCollection();
        const allAuthors = await authors.find({}).toArray();

        //add to redis cache
        for (let auth of allAuthors) {
          let authorString = JSON.stringify(auth);
          await client.lPush('All_Authors', authorString,  {
            EX: 3600,
            NX: true} );
        };

        return allAuthors;
      }
    },
    books: async () => {

      let bookList = await client.lRange('All_Books', 0, -1);

      if (bookList.length > 0) {
        let returnArr = [];
        for (let book of bookList) {
          let bookObject = JSON.parse(book);
          returnArr.push(bookObject);
        };

        return returnArr;
      }
      else
      {
        const books = await bookCollection();
        const allBooks = await books.find({}).toArray();

        //add to redis cache
        for (let book of allBooks) {
          let bookString = JSON.stringify(book);
          client.lPush('All_Books', bookString, {
            EX: 3600,
            NX: true});
        }

        return allBooks;
      }
    },
    booksByGenre: async (_, args) => {

      args.genre = helpers.checkString(args.genre);

      let bookList = await client.lRange(args.genre.toLowerCase(), 0, -1);

      if (bookList.length > 0) {
        let returnArr = [];
        for (let book of bookList) {
          let bookObject = JSON.parse(book);
          returnArr.push(bookObject);
        };

        return returnArr;
      }
      else {

        const books = await bookCollection();

        await books.createIndex( { genre: 1},
          { collation: { locale: 'en', strength: 2 } } )
  
        const booksWithGenre = await books.find({ genres: args.genre }).collation( { locale: 'en', strength: 2 } ).toArray();

        //add to redis cache
        for (let book of booksWithGenre) {
          let bookString = JSON.stringify(book);
          client.lPush(args.genre.toLowerCase(), bookString, {
            EX: 3600,
            NX: true});
        }

        return booksWithGenre;
      }
    },
    booksByPriceRange: async (_, args) => {

     
      if (args.min === '0')
        args.min = 0;
      else 
        args.min = parseFloat(args.min);


      try {
      args.min = helpers.checkMin(args.min);
      args.max = helpers.checkMax(parseFloat(args.max), args.min);
      }
      catch(e) {
        console.log(e)
      }
    

      let bookList = await client.lRange(args.min.toString() + args.max.toString(), 0, -1);

      if (bookList.length > 0) {
        let returnArr = [];
        for (let book of bookList) {
          let bookObject = JSON.parse(book);
          returnArr.push(bookObject);
        };

        return returnArr;
      }      
      else {
        const books = await bookCollection();
        const booksInRange = await books.find({ $and: [ {price: { $gte: args.min} }, {price: { $lte: parseFloat(args.max)}} ] }).toArray();

        for (let book of booksInRange) {
          let bookString = JSON.stringify(book);
          client.lPush(args.min.toString() + args.max.toString(), bookString, {
            EX: 3600,
            NX: true});
        }
      
        console.log('no errors');

        return booksInRange;
      }
    }, 
    searchAuthorsByName: async (_, args) => {

      args.searchTerm = helpers.checkString(args.searchTerm);

      let authorList = await client.lRange(args.searchTerm.toLowerCase(), 0, -1);

      if (authorList.length > 0) {
        let returnArr = [];
        for (let auth of authorList) {
          let authorObject = JSON.parse(auth);
          returnArr.push(authorObject);
        };

        return returnArr;
      }
      else {

        const authors = await authorCollection();

        await authors.createIndex( { first_name: 1},
          { collation: { locale: 'en', strength: 2 } } )

        const authorsWithFirstName = await authors.find( { first_name: args.searchTerm } ).collation( { locale: 'en', strength: 2 } ).toArray();

        await authors.createIndex( { last_name: 1},
          { collation: { locale: 'en', strength: 2 } } )

        const authorsWithLastName = await authors.find( { last_name: args.searchTerm } ).collation( { locale: 'en', strength: 2 } ).toArray();

        const authorsWithName = authorsWithFirstName.concat(authorsWithLastName);

        for (let auth of authorsWithName) {
          let authorString = JSON.stringify(auth)
          client.lPush(args.searchTerm.toLowerCase(), authorString, {
            EX: 3600,
            NX: true});
        }

        return authorsWithName;
      }
    }
  },
  Book: {
    author: async (parentValue) => {
      const authors = await authorCollection();
      const author = await authors.findOne({_id: parentValue.authorId});

      return author;
    }
  },
  Author: {
    numOfBooks: async (parentValue) => {
      const books = await bookCollection();
      const numOfBooks = await books.count({
        authorId: parentValue._id
      });

      return numOfBooks;
    },
    books: async (parentValue, args) => {
      const books = await bookCollection();

      if (args.limit !== undefined) {
        args.limit = helpers.checkLimit(args.limit);
        var booksFromAuthor = await books.find({authorId: parentValue._id}).limit(parseInt(args.limit)).toArray();
      }
      else {
        var booksFromAuthor = await books.find({authorId: parentValue._id}).toArray();
      }

      return booksFromAuthor;
    }
  },
  Mutation: {
    addAuthor: async (_, args) => {
      //await client.del("All_Authors");

      const authors = await authorCollection();

      args.first_name = helpers.checkString(args.first_name, 'first_name');
      args.last_name = helpers.checkString(args.last_name, 'last_name');
      args.date_of_birth = helpers.checkDate(args.date_of_birth);
      args.hometownCity = helpers.checkString(args.hometownCity, 'hometownCity');
      args.hometownState = helpers.checkString(args.hometownState, 'hometownState');
      args.hometownState = helpers.checkState(args.hometownState);

      const newAuthor = {
        _id: uuid(),
        first_name: args.first_name,
        last_name: args.last_name,
        date_of_birth: args.date_of_birth,
        hometownCity: args.hometownCity,
        hometownState: args.hometownState,
        books: []
      };
      await authors.insertOne(newAuthor);

      //add to redis cache
      client.set(newAuthor._id, JSON.stringify(newAuthor));
      client.lPush('All_Authors', JSON.stringify(newAuthor)); 

      return newAuthor;
    },
    removeAuthor: async (_, args) => {
      //remove author
      console.log('in remove author');
      await client.del("All_Authors");
      const authors = await authorCollection();
      const oldAuthor = await authors.findOne({_id: args._id});
      const deletionInfo = await authors.deleteOne({_id: args._id});

      if (deletionInfo.deletedCount === 0) {
        throw `Could not delete author with id of ${args._id}`;
      }

      let exists = await client.exists(args._id);

      await client.lRem('All_Authors', 0, JSON.stringify(oldAuthor));

      if(exists) {
        await client.del(args._id);
      }

      //remove all books written by author from mongodb
      const books = await bookCollection();
      const booksByAuthor = await books.find({authorId: args._id}).toArray();

      const bookDeletionInfo = await books.deleteMany({authorId: args._id});

      if (bookDeletionInfo.deletedCount === 0 && booksByAuthor.length) {
        throw `Could not delete books with authorId of ${args._id}`;
      }

      //remove all books written by author from cache
      if (booksByAuthor.length > 0) {
        for (let book of booksByAuthor) {
          await client.del(book._id);
          await client.lRem('All_Books', 0, JSON.stringify(book))
        }
      }

      return oldAuthor;
    },
    editAuthor: async (_, args) => {

      console.log('in edit author');
      const authors = await authorCollection();
      let newAuthor = await authors.findOne({_id: args._id});

      if (newAuthor) {
        if (args.first_name) {
          args.first_name = helpers.checkString(args.first_name, 'first_name');
          newAuthor.first_name = args.first_name;
        }
        if (args.last_name) {
          args.last_name = helpers.checkString(args.last_name, 'last_name');
          newAuthor.last_name = args.last_name;
        }
        if (args.date_of_birth) {
          args.date_of_birth = helpers.checkDate(args.date_of_birth);
          newAuthor.date_of_birth = args.date_of_birth;
        }
        if (args.hometownCity) {
          args.hometownCity = helpers.checkString(args.hometownCity, 'hometownCity');
          newAuthor.hometownCity = args.hometownCity;
        }
        if (args.hometownState) {
          args.hometownState = helpers.checkString(args.hometownState, 'hometownState');
          args.hometownState = helpers.checkState(args.hometownState);

          newAuthor.hometownState = args.hometownState;
        }
      }
        await authors.updateOne({_id: args._id}, {$set: newAuthor});

        //update in redis cache
        client.set(newAuthor._id, JSON.stringify(newAuthor));

        return newAuthor;
      },
    addBook: async (_, args) => {
      console.log('in add book');
      //await client.del("All_Books");
      try {

      const books = await bookCollection();
      const authors = await authorCollection();

      args.title = helpers.checkString(args.title, 'title');
      args.genres = helpers.checkStringArray(args.genres, 'genres');
      args.publicationDate = helpers.checkDate(args.publicationDate);
      args.publisher = helpers.checkString(args.publisher, 'publisher');
      args.summary = helpers.checkString(args.summary, 'summary');
      if (!helpers.checkIsbn(args.isbn))
        throw `invalid isbn provided`;
      args.language = helpers.checkString(args.language, 'language');
      args.format = helpers.checkStringArray(args.format, 'format');
      args.price = helpers.checkPrice(args.price);
      args.pageCount = helpers.checkLimit(args.pageCount);

      let authorCheck = await authors.findOne({_id: args.authorId});

      if (authorCheck) {
        const newBook = {
          _id: uuid(),
          title: args.title,
          genres: args.genres,
          publicationDate: args.publicationDate,
          publisher: args.publisher,
          summary: args.summary,
          isbn: args.isbn,
          language: args.language,
          pageCount: args.pageCount,
          price: args.price,
          format: args.format,
          authorId: args.authorId
        };

        await books.insertOne(newBook);
        await client.set(newBook._id, JSON.stringify(newBook));

        return newBook;
      }
    
    else {
      throw 'Author for this book does not exist in the DB';
    }
  }
  catch (e) {
    console.log(e)
  }
  },
  editBook: async (_, args) => {
    console.log('in edit book');
    console.log(args);
    //await client.del("All_Books");
    const books = await bookCollection();
    const authors = await authorCollection();

    if (args.authorId) {
      var authorCheck = await authors.findOne({_id: args.authorId});
    }

    let newBook = await books.findOne({_id: args._id});

    if (newBook) {
      if (args.title) {
        args.title = helpers.checkString(args.title, 'title');
        newBook.title = args.title;
      }
      if (args.genres) {
        args.genres = helpers.checkStringArray(args.genres, 'genre');
        newBook.genres = args.genres;
      }
      if (args.publicationDate) {
        args.publicationDate = helpers.checkDate(args.publicationDate);
        newBook.publicationDate = args.publicationDate;
      }
      if (args.summary) {
        args.summary = helpers.checkString(args.summary, 'summary');
        newBook.summary = args.summary;
      }
      if (args.publisher) {
        args.publisher = helpers.checkString(args.publisher, 'publisher');
        newBook.publisher = args.publisher;
      }
      if (args.isbn) {
        if (!helpers.checkIsbn(args.isbn))
          throw `invalid isbn provided`;        
        newBook.isbn = args.isbn;
      }
      if (args.language) {
        args.language = helpers.checkString(args.language, 'language');
        newBook.language = args.language;
      }
      if (args.pageCount) {
        args.pageCount = helpers.checkLimit(args.pageCount);
        newBook.pageCount = args.pageCount;
      }
      if (args.price) {
        args.price = helpers.checkPrice(args.price);
        newBook.price = args.price;
      }
      if (args.format) {
        args.format = helpers.checkStringArray(args.format, 'format');
        newBook.format = args.format;
      }
      if (authorCheck && (args.authorId !== newBook.authorId)) {
        //remove book from old author's array of books
        let oldAuthor = await authors.findOne({_id: newBook.authorId});
        lodash.remove(oldAuthor.books, (e) => e === newBook._id);
        await authors.updateOne({id: newBook.authorId}, {$set: oldAuthor});

        //add book to new author's array of books
        authorCheck.books.push(newBook._id);
        await authors.updateOne({id: newBook.authorId}, {$set: authorCheck});

        newBook.authorId = args.authorId;
      }
    }

      console.log(newBook);
      await books.updateOne({_id: args._id}, {$set: newBook});
      await client.set(args._id, JSON.stringify(newBook));

      //remove authors from redis cache
      let newAuthExists = await client.exists(newBook.authorId);
      if(newAuthExists) {
        await client.del(newBook.authorId);
      }
      if (args.authorId) {
        let oldAuthExists = await client.exists(args.authorId);
        if(oldAuthExists) {
          await client.del(args.authorId);
        }
      }

      console.log('book updated');

      return newBook;
    },
    removeBook: async (_, args) => {
      await client.del("All_Books");
      const books = await bookCollection();
      const oldBook = await books.findOne({_id: args._id});
      const deletionInfo = await books.deleteOne({_id: args._id});
      if (deletionInfo.deletedCount === 0) {
        throw `Could not delete book with _id of ${args._id}`;
      }

      const authors = await authorCollection();
      let authToEdit = await authors.findOne({_id: oldBook.authorId});

      //remove book from author's books array in mongodb and redis
      lodash.remove(authToEdit.books, (e) => e === oldBook._id);
      await authors.updateOne({id: oldBook.authorId}, {$set: authToEdit});
      await client.set(authToEdit._id, JSON.stringify(authToEdit));

      return oldBook;
    }
  }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
