
import { userService } from "../services/user.service.js"
const { useState, useEffect } = React

export function UserList() {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        userService.getUsers()
            .then((users) => {
                setUsers(users)

                console.log('users223:', users)
            })
            .catch(err => console.log('err:', err))
    }, [])

    function deleteUser(userId) {
        userService
            .remove(userId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const usersToUpdate = users.filter((user) => user._id !== userId)
                setUsers(usersToUpdate)
            })
            .catch((err) => {
                console.log('Error from deleteUser ->', err)
                showErrorMsg('Cannot remove user')
            })
    }

    if (!users) return <div>Loading...</div>
    return (
        <section>
            <h1>Users</h1>
            {users && users.map(user => {
                if (user._id === loggedInUser._id) return
                return (<section className="admin-user-list" key={user._id}>
                    <div>{user.username}</div>
                    <button onClick={() => deleteUser(user._id)}>X</button>
                </section>
                )
            }
            )}
        </section>
    )
}