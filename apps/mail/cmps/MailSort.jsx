const { useState, useEffect, useRef } = React

export function MailSort({ sortBy, onSetSortBy, filterBy }) {

    const [editSortBy, setEditSortBy] = useState({ ...sortBy })

    // rest the editFilterBy if filterBy get status
    useEffect(() => {
        setEditSortBy(prev => ({ ...sortBy }))
    }, [filterBy.status])

    useEffect(() => {
        onSetSortBy(editSortBy)
    }, [editSortBy])


    function onSetEditSortBy(ev) {
        var { value, type, name } = ev.target

        value = (value === '') ? '' : +value

        setEditSortBy(prev => ({ [name]: value }))
    }

    const { title, date } = editSortBy
    return (
        <section className='mail-sort flex align-center '>
            <select name="title" id='title' value={title || ''} onChange={onSetEditSortBy} >
                <option value=''>By Title</option>
                <option value={1}>A to Z</option>
                <option value={-1}>Z to A</option>
            </select>

            <select name="date" id='date' value={date || ''} onChange={onSetEditSortBy} >
                <option value=''>By Date</option>
                <option value={-1}>Newest First</option>
                <option value={1}>Oldest First</option>

            </select>
        </section>
    )
}