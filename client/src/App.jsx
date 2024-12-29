import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import LandingPage from "./pages/LandingPage"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import DirectLogin from "./pages/DirectLogin"
import CreatePost from "./pages/CreatePost"
import Browse from "./pages/Browse"
import { useState, useEffect } from "react"
import axios from "axios"

function App() {
  const [isAuth, setAuth] = useState(false)
  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await axios.get("http://localhost:3000/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        axios.get("http://localhost:3000/auth/register").then((res) => {
          setAuth(true)
        })
      }
    }
    conditionalRender()
  }, [])
  return (
    <>
      <Router>
        <div className="link-container">
          <Link to="/">Landing Page</Link>
          <Link to="/home">Home</Link>
          <Link to="/home/browse">Browse</Link>
          <Link to="/auth/register">Register</Link>
          <Link to="/auth/login">Login</Link>
          {isAuth && <Link to="/auth/logout">Logout</Link>}
          <Link to="/post/createPost">Create Post</Link>
        </div>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/auth/register" element={<Register setAuth={setAuth}/>}/>
          <Route path="/auth/login" element={<Login setAuth={setAuth}/>}/>
          <Route path="/auth/logout" element={<Logout setAuth={setAuth}/>}/>
          <Route path="/auth/directLogin" element={<DirectLogin/>}/>
          <Route path="/post/createPost" element={<CreatePost/>}/>
          <Route path="/home/browse" element={<Browse/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
