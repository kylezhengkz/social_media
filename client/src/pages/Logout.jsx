import axios from "axios"
axios.defaults.withCredentials = true

function Logout() {
  axios.post("http://localhost:3000/auth/logout").then((res) => {
    console.log("Logged out")
    window.location = "/"
  })
}

export default Logout
