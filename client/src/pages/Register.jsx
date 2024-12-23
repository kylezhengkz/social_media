import { useForm } from "react-hook-form"
import axios from "axios"

function Register() {
  const { register, formState: { errors }, handleSubmit } = useForm()
  const onSubmit = newUser => {
    console.log(newUser)
    axios.post("http://localhost:3000/auth/register", newUser).then((res) => {
      console.log(res.data.message)
      console.log(res.data.error)
    })
  }
   
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Username" {...register("username", { required: "Required field", maxLength: {value: 30, message: "Password cannot exceed length 30"} })} />
        {<span>{errors.username?.message}</span>}
        <br></br>
        <input placeholder="Password" {...register("password", { required: "Required field", maxLength: {value: 64, message: "Password cannot exceed length 64"} })} />
        {<span>{errors.password?.message}</span>}
        <br></br>
        <input type="submit"/>
      </form>
    </>
  )
}

export default Register
