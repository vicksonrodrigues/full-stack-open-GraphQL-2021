  
import React, { useState }  from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS,EDIT_AUTHOR } from '../queries'
import Select from 'react-select'




const Authors = (props) => {
  
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  
  const authorsResult = useQuery(ALL_AUTHORS)

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS}],
    onError: (error) => {
      props.notify(error.graphQLErrors[0].message)
    }
  })

  const submit = e => {
    e.preventDefault()
    editAuthor({ variables: { name: name.value, setBornTo: Number(born) } })

    setName('')
    setBorn('')
  }

  
  

  if (!props.show ) {
    return null
  }
  else if (authorsResult.loading)
  {
    return <div>loading...</div>
  }
  else{
    const authors = authorsResult.data.allAuthor
    const options = authors?.map(a => ({value:a.name,label:a.name}))
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            defaultValue={name}
            onChange={setName}
            options={options}
          />
        </div>
        <div>
          born:
          <input 
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)} />
        </div>
        <div>
          <button type="submit">update author</button>
        </div>
      </form>

    </div>
  )

  }
  
}

export default Authors
