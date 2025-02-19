import { useEffect, useState, useContext } from 'react'
import { ReactComponent as Profile } from '../icons/profile.svg'
import { ReactComponent as Logo } from '../icons/logo.svg'
import NavItem from './NavItem'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import DarkMode from '../DarkMode'
function Navbar({ setToggleNav, toggleNav }) {
  const [userUid, setUserUid] = useState('')
  const [userObj, setUserObj] = useState({
    loggedInUser: '',
    loggedInUserId: '',
  })
  const navigate = useNavigate()
  const { loggedInUser, loggedInUserId } = userObj

  const auth = getAuth()
  const params = useParams()

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // leave in for testing purpouse
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          // console.log(idTokenResult)
        })
        setUserUid(user.uid)
        setUserObj((prevState) => ({
          ...prevState,
          loggedInUser: user.displayName,
          loggedInUserId: user.uid,
        }))
      } else {
        setUserObj((prevState) => ({
          ...prevState,
          loggedInUser: '',
        }))
      }
    })
  }, []) /// if button does not changen then use auth here?

  // prettier-ignore
  const handleOutsideClick = (event) => {
    // console.log(event.target)
    const isDropdownOpen = toggleNav
    const clickedElement = event.target
    const isDropdownElement =
      clickedElement.closest('.dropdown') ||
      clickedElement.closest('.nav-caret-container')
    // const isDropdownLink = clickedElement.closest('.dropdown-text'); // another way to select
    // If the dropdown is open AND the click isn't inside these elements, it closes the dropdown by setting toggleNav to false
    if (isDropdownOpen && !isDropdownElement) {
      setToggleNav(false)
    }
  };
  // prettier-ignore-end

  useEffect(() => {
    // only run if toggleNav is open
    if (toggleNav) {
      document.addEventListener('click', handleOutsideClick)
    } else {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [toggleNav])

  const navButtons = [
    { id: crypto.randomUUID(), text: 'home', url: '/' },
    { id: crypto.randomUUID(), text: 'my data', url: `/data/${userUid}` },
    { id: crypto.randomUUID(), text: 'team data', url: `/all-data/${userUid}` },
    { id: crypto.randomUUID(), text: 'stats', url: `/stats/${userUid}` },
    { id: crypto.randomUUID(), text: 'dashboard', url: `/dash/${userUid}` },
  ]

  const handleSignOut = (e) => {
    // console.log('click')
    setToggleNav(false)
    navigate('/')
    auth.signOut()
  }
  // prettier-ignore
  return (
    <nav className="nav-bar">
      <div className="nav-bar-container">
        <div className="logo-box testing">
          <Link to="/">
            <Logo className="logo" />
          </Link>
        </div>
        <div className="nav-signup-div">
          <Link to="/sign-up-acc" className="sign-up-btn">
            sign up
          </Link>
          <DarkMode/>
        </div>
        <ul className="nav-ul">
          <NavItem setToggleNav={setToggleNav} toggleNav={toggleNav} />
        </ul>
      </div>
      {toggleNav && (
        <div className="dropdown">
          <div className="profile-info">
            <Profile style={{ width: '60px', height: '60px' }} />
            <div className="nav-header">
              <span className="nav-name-span">{loggedInUser}</span>
              <span onClick={handleSignOut} className="nav-sign-out">
                sign out
              </span>
            </div>
          </div>
          <ul className="toggle-nav-ul">
            {navButtons.map((item) => (
              <Link key={item.id} to={`${item.url}`} className="dropdown-text">
                {/* {console.log(item)}  // for testing */}
                <li className="toggle-nav-list" onClick={() => setToggleNav(false)}>
                  {item.text.toUpperCase()}{' '}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
