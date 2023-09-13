import { UserMsg } from './UserMsg.jsx'
import { userService } from '../services/user.service.js'
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'

const { NavLink, Link } = ReactRouterDOM
const { useState, useEffect } = React
const { useNavigate } = ReactRouter

export function AppHeader() {

  const navigate = useNavigate()

  const [user, setUser] = useState(userService.getLoggedinUser())

  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  function onLogout() {
    userService.logout()
      .then(() => {
        onSetUser(null)
      })
      .catch((err) => {
        showErrorMsg('OOPs try again')
      })
  }

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }

  return (
    <header>
      <UserMsg />
      <nav>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
      {user ? (
        < section >
          <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
          <button onClick={onLogout}>Logout</button>
        </ section >
      ) : (
        <section>
          <LoginSignup onSetUser={onSetUser} />
        </section>
      )}
      <h1>Bugs are Forever</h1>
    </header>
  )
}
