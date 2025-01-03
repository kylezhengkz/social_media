import { useForm } from "react-hook-form"
import axios from "axios"
axios.defaults.withCredentials = true
import { useNavigate } from 'react-router-dom'

function CreatePost() {
  const { register, formState: { errors }, handleSubmit } = useForm()
  const navigate = useNavigate()
  const onSubmit = newPost => {
    console.log(newPost)
    axios.post("http://localhost:3000/post/create", newPost).then(() =>
      navigate("/home/browse")
    )
  }
  return (
    <>
      <h1>Create a post</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Title" {...register("postTitle", { required: "Required field", maxLength: {value: 100, message: "Title cannot exceed character length 100"} })} />
        {<span>{errors.postTitle?.message}</span>}
        <br></br>
        <input placeholder="Body" {...register("postBody", { required: "Required field", maxLength: {value: 2200, message: "Body cannot exceed character length 2200"} })} />
        {<span>{errors.postBody?.message}</span>}
        <br></br>
        <input type="submit"/>
      </form>
    </>
  )
}

export default CreatePost
