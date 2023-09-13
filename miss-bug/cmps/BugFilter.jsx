import { BugSort } from "./BugSort.jsx"

const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;
            case 'checkbox':
                value = target.checked
                break
            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { title, severity } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter bugs</h2>
            <div>
                <form onSubmit={onSubmitFilter}>
                    <label htmlFor="title">Title: </label>
                    <input value={title} onChange={handleChange} type="text" placeholder="By Title" id="title" name="title" />

                    <label htmlFor="severity">severity: </label>
                    <input value={severity} onChange={handleChange} type="number" placeholder="By severity" id="severity" name="severity" />
                </form>
                <select onChange={handleChange} name="label" id="label">
                    <option value="">select-label</option>
                    <option value="critical">critical</option>
                    <option value="need-CR">need-CR</option>
                    <option value="dev-branch">dev-branch</option>
                </select>
                <BugSort onChange={handleChange} />
                Dir
                <input type="checkbox" name="dir" onChange={handleChange} />
            </div>
        </section>
    )
}