import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const useAuthStatusTwo = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [loggedInUser, setLoggedInUser] = useState(true)
  const [claims, setClaims] = useState(null)

  useEffect(() => {
    const auth = getAuth()

    // auth status 2 get the claims
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true)
        setLoggedInUser(user)
        user.getIdTokenResult(true).then((data) => {
          setClaims(data.claims)
        })
      }
      setCheckingStatus(false)
    })
  }, [])

  return { loggedIn, checkingStatus, loggedInUser, claims }
}
