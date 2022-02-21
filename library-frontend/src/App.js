
import React, { useEffect, useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import { useApolloClient, useLazyQuery, useSubscription } from '@apollo/client'
import Recommend from './components/Recommend'
import { ALL_BOOKS, ME,BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [currentUser,setCurrentUser]=useState(null)
  const [books,setBooks]=useState(null)
  const client = useApolloClient()

  const [getUser,user] = useLazyQuery(ME,{ onCompleted: (d) => {
    setCurrentUser(d.me);
  }})

  const [getRecommendedBooks,recommendedBooks] = useLazyQuery(ALL_BOOKS,{onCompleted:(d)=> {
    setBooks(d.allBooks)
  }})


  useEffect(() => {
    getUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  useEffect(()=>{
    if(currentUser){
      getRecommendedBooks({variables:{genre:currentUser.favoriteGenre}})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentUser,getRecommendedBooks])


  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map(b => b.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS,variables:{genre:null} })
    if(!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        variables:{genre:null},
        data: { allBooks: dataInStore.allBooks.concat(addedBook) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert(`${subscriptionData.data.bookAdded.title} added!`)
      const addedBook = subscriptionData.data.bookAdded
      updateCacheWith(addedBook)
    }
  })


  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const ShowLoginOrLogout= ()=> {
    const logout = () => {
      setToken(null)
      setCurrentUser(null)
      setBooks(null)
      localStorage.clear()
      client.resetStore()
      setPage('authors')
     
    }
    if(!token){
      return (
        <button onClick={() => setPage('login')}>login</button>
      )
    }

    return (
      <span>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
        <button onClick={logout}>logout</button>
      </span>
    )
  }
  

  return (
    <div>
      < Notification errorMessage ={errorMessage}/>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {ShowLoginOrLogout()}
      </div>

      <Authors
        show={page === 'authors'}
        notify={notify}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        notify={notify}
        currentUser={currentUser}
      />

      <LoginForm
        show={page === 'login'}
        notify={notify}
        setToken={setToken}
        setPage={setPage}
      />

      <Recommend
        show = {page === 'recommended'}
        user={user}
        recommendedBooks={recommendedBooks}
        currentUser={currentUser}
        books={books}
      />

    </div>
  )
}

export default App