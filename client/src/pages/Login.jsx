import { useForm } from "react-hook-form"
import axios from "axios"

function Login() {
  const { register, formState: { errors }, handleSubmit } = useForm()
  const onSubmit = newUser => {
    console.log(newUser)
    axios.post("http://localhost:3000/auth/login", newUser, { withCredentials: true }).then((res) => {
      console.log(res.data.invalidUsername)
      if (res.data.invalidUsername) {
        window.alert(`Username "${newUser.username}" cannot be found`)
      } else if (res.data.invalidPassword) {
        window.alert(`Username found but password is incorrect`)
      } else {
        window.location = "/home"
      }
    })
  }
   
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Username" {...register("username", { required: "Required field", maxLength: {value: 30, message: "Password cannot exceed length 30"} })} />
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

export default Login
