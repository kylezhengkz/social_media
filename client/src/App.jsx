import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Home from "./pages/Home"
import Register from "./pages/Register"

function App() {
  return (
    <>
      <Router>
        <Link to="/auth/register">Register</Link>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/auth/register" element={<Register/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
