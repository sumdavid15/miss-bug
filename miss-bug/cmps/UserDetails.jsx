import { userService } from "../services/user.service.js"
import { BugList } from "./BugList.jsx"
import { showSuccessMsg } from "../services/event-bus.service.js"
import { bugService } from "../services/bug.service.js"
import { UserList } from "./UserList.jsx"

const { useState, useEffect } = React

export function UserDetails() {
    const [bugs, setBugs] = useState(null)
    const [user, setUser] = useState(null)
    const loggedInUser = userService.getLoggedinUser()

    useEffect(() => {
        userService.getUserById(loggedInUser._id)
            .then((user) => {
                setUser(user)
            })
            .catch(err => console.log('err:', err))
    }, [])

    useEffect(() => {
        userService.getUserCreatedBug()
            .then(bugs => {
                setBugs(bugs)
                console.log('bugs:', bugs)
            })
            .catch(err => console.log('err:', err))
    }, [])

    if (!user) return <div>Loading...</div>
    return (
        <section>
            <img className="user-img" src="https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg" alt="" />
            <h1>Full name: {user.fullname}</h1>
            <p>Score: {user.score}</p>
            {user.isAdmin && <UserList />}
            <BugList bugs={bugs} />
        </section>
    )
}