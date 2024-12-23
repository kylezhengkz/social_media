import { useState, useEffect } from 'react'
import axios from "axios"

function Home() {

  const[listOfUsers, setListOfUsers] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3000/auth/register").then((res) => {
      setListOfUsers(res.data)
    })
  }, [])
  return (
    <>
      <h1>Hello world</h1>
      <div>
        {listOfUsers.map((value, key) => {
          return <li key={key}>{JSON.stringify(value)}</li>
        })}
      </div>
    </>
  )
}

export default Home
