import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import LandingPage from "./pages/LandingPage"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Logout from "./pages/Logout"

function App() {
  return (
    <>
      <Router>
        <Link to="/">Landing Page</Link>
        <br/>
        <Link to="/home">Home</Link>
        <br/>
        <Link to="/auth/register">Register</Link>
        <br/>
        <Link to="/auth/login">Login</Link>
        <br/>
        <Link to="/auth/logout">Logout</Link>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/auth/register" element={<Register/>}/>
          <Route path="/auth/login" element={<Login/>}/>
          <Route path="/auth/logout" element={<Logout/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
