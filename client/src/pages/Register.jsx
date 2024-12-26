import { useForm } from "react-hook-form"
import axios from "axios"
axios.defaults.withCredentials = true

function Register() {
  const { register, formState: { errors }, handleSubmit } = useForm()
  const onSubmit = newUser => {
    console.log(newUser)
      axios.post("http://localhost:3000/auth/register", newUser,).then((res) => {
        console.log(res.data.duplicateUsername)
        if (res.data.duplicateUsername) {
          window.alert(`Username "${newUser.username}" is taken`)
        } else {
          window.location = "/home"
        }
    })
  }
   
  return (
    <>
      <h1>Register</h1>
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

export default Register
