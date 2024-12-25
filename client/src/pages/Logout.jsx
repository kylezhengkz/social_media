import axios from "axios"

function Logout() {
  axios.post("http://localhost:3000/auth/logout", { withCredentials: true }).then((res) => {
    console.log("Logged out")
    window.location = "/"
  })
}

export default Logout
