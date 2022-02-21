
import React from 'react'


const Recommend =({show,user,recommendedBooks,currentUser,books}) => {
 

  console.log('User',user.data)
  console.log('Current User',currentUser)
  console.log('Recommended Books',books)
  if(!show){
    return null
  }
  else if (recommendedBooks.loading||user.loading)
  {
    return(
    <div>loading...</div>
    )
  }
  else{
    return(
      <div>
        <h2>Recommended</h2>
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
    </table></div>
      )
  }

}

export default Recommend