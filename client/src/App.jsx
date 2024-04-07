import Web from "./views/Web";
import Mobile from "./views/Mobile";
import { useEffect, useState } from "react";
import lodash from 'lodash'

export default function App() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const debouncedHandleResize = lodash.throttle((size) => {
    setWindowWidth(size)
  }, 250)

  useEffect(() => {
    window.addEventListener('resize', () => {
      debouncedHandleResize(window.innerWidth)
    })

    return () => {
      window.removeEventListener('resize', () => {
        debouncedHandleResize(window.innerWidth)
      });
    }
  }, [])

  return (
    <>
      {windowWidth > 768 ? <Web /> : <Mobile />}
    </>
  )
}
