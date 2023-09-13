
export function BugSort({ onChange }) {

    return (
        <select onChange={onChange} name="sort" id="sort">
            <option value="">Sort-by</option>
            <option value="title">Title</option>
            <option value="severity">Severity</option>
            <option value="created">Created-at</option>
        </select>
    )
}