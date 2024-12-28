import { useForm } from "react-hook-form"
import axios from "axios"
axios.defaults.withCredentials = true
import { useNavigate } from 'react-router-dom'

function Register({ setAuth }) {
  const { register, formState: { errors }, handleSubmit } = useForm()
  const navigate = useNavigate()
  const onSubmit = newUser => {
    console.log(newUser)
    axios.post("http://localhost:3000/auth/register", newUser).then((res) => {
      console.log(res.data.duplicateUsername)
      if (res.data.duplicateUsername) {
        window.alert(`Username "${newUser.username}" is taken`)
      } else {
        axios.post("http://localhost:3000/auth/login", newUser).then((res) => {
          setAuth(true)
          navigate('/home')
        })
      }
    })
  }
   
  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Username" {...register("username", { required: "Required field", maxLength: {value: 30, message: "Username cannot exceed character length 30"} })} />
        {<span>{errors.username?.message}</span>}
        <br></br>
        <input placeholder="Password" {...register("password", { required: "Required field" })} />
        {<span>{errors.password?.message}</span>}
        <br></br>
        <input type="submit"/>
      </form>
    </>
  )
}

export default Register
