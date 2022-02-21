import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_BOOKS } from '../queries'


const Books = (props) => {
  
  const[genre,setGenre]=useState(null)
  const booksResult = useQuery(ALL_BOOKS ,{variables:{genre:genre}})


  if (!props.show) {
    return null
  }
  else if (booksResult.loading)
  {
    return <div>loading...</div>
  }
  else{
    const books = booksResult.data.allBooks
    return (
      <div>
        <h2>books</h2>
        <div>
        <button onClick={() => setGenre(null)}>All Books</button>
        <button onClick={() => setGenre('refactoring')}>refactoring</button>
        <button onClick={() => setGenre('agile')}>agile</button>
        <button onClick={() => setGenre('patterns')}>patterns</button>
        <button onClick={() => setGenre('design')}>design</button>
        <button onClick={() => setGenre('crime')}>crime</button>
        <button onClick={() => setGenre('classic')}>classic</button>
        </div>
        {genre?(<span>in genre <b>{genre}</b></span>):(<span><b>All Books</b>s</span>)}
        
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    )
  }

  }
export default Books