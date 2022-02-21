import { gql  } from '@apollo/client'

export const ALL_AUTHORS =gql`
  query allAuthor{
   allAuthor{
    name
    born
    bookCount
    }
  }
`

export const ALL_BOOKS= gql`
 query allBooks($genre:String) {
  allBooks(genre:$genre) {
    title
    published
    author{
      name
    }
  }  
}
`

export const CREATE_BOOK =gql`
  mutation addBook($title: String!,$published: Int!,$author: String!,$genres: [String!]!){
    addBook(
      title: $title,
      published: $published
      author: $author
      genres: $genres
    ){
     title
     published
     author  {
     name
     }
    }
  }
`
export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!){
    editAuthor(
      name:$name ,
      setBornTo:$setBornTo
      ){
        name
        born
        bookCount
      }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
 query  currentUser{
  me {
    username
    favoriteGenre
  }
  }
`

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
    id
    title
    author {
      name
      born
    }
    published
    genres
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`