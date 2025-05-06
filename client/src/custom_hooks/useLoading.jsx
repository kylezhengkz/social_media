import { useState } from "react"

export default function useLoading() {
  const [isLoading, setLoading] = useState({})
  
  const beginLoading = (id) => {
    setLoading(prev => ({...prev, [id]: true}))
  }

  const finishLoading = (id) => {
    setLoading(prev => ({...prev, [id]: false}))
  }

  return { isLoading, beginLoading, finishLoading }
}
