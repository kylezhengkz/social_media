import React from 'react'
import { useLocation } from 'react-router-dom'

function DirectLogin() {
  const location = useLocation()
  const { pageName } = location.state || {}
  var message
  if (!pageName) {
    message = "What are you doing here?"
  } else {
    message = `Access ${pageName} by logging in`
  }

  return (
    <>
      <h1>Access Denied</h1>
      <p>{message}</p>
    </>
  )
}

export default DirectLogin
