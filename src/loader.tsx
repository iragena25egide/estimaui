import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const TopLoader = () => {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()

    const timer = setTimeout(() => {
      NProgress.done()
    }, 400)

    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [location])

  return null
}

export default TopLoader