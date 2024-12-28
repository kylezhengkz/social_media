import axios from "axios"
axios.defaults.withCredentials = true
import { useNavigate } from 'react-router-dom'

function Logout() {
  const navigate = useNavigate()
  axios.post("http://localhost:3000/auth/logout").then((res) => {
    console.log("Logged out")
    navigate("/")
  })
}

export default Logout
