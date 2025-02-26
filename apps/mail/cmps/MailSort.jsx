const { useState, useEffect, useRef } = React

export function MailSort({ sortBy, onSetSortBy, filterBy }) {

    const [editSortBy, setEditSortBy] = useState({ ...sortBy })
    const [ischecked, setIschecked] = useState(-1)

    // rest the editFilterBy if filterBy get status
    useEffect(() => {
        if (filterBy.status !== '') {
            setIschecked(-1)
            setEditSortBy(prev => ({ ...sortBy }))
        }
    }, [filterBy.status])

    useEffect(() => {
        onSetSortBy(editSortBy)
    }, [editSortBy])


    function onSetEditSortBy(ev) {
        var { value, type, name } = ev.target

        value = (value === '') ? '' : +value
        setIschecked(value)

        setEditSortBy(prev => ({ [name]: value }))
    }

    const { title, date } = editSortBy
    return (
        <section className='mail-sort flex align-center '>
            <select name="title" id='title' className={title ? 'selected' : ''} value={title || ''} onChange={onSetEditSortBy} >
                <option value=''>By Title</option>
                <option value={1}>{ischecked === 1 && title ? ' ✓ ' : ''} A to Z</option>
                <option value={-1}>{ischecked === -1 && title ? ' ✓ ' : ''} Z to A</option>
            </select>

            <select name="date" id='date' className={date ? 'selected' : ''} value={date || ''} onChange={onSetEditSortBy} >
                <option value=''>By Date</option>
                <option value={-1}>{ischecked === -1 && date ? ' ✓ ' : ''}Newest First</option>
                <option value={1}>{ischecked === 1 && date ? ' ✓ ' : ''}Oldest First</option>
            </select>
        </section>
    )
}