const { useState, useEffect, useRef } = React

export function MoreFilters({ editFilterBy, onSetEditFilterBy, onOpenMoreFilters }) {

    const filterBoxRef = useRef()

    useEffect(() => {

        setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 100)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    function handleClickOutside({ target }) {
        if (target !== filterBoxRef.current) {
            onOpenMoreFilters()
        }
    }


    const { isRead, isStared, from, subject, date } = editFilterBy
    return (
        <div className='more-filtes-box' ref={filterBoxRef} onClick={(event) => { event.stopPropagation() }}>

            <label htmlFor="from">From:</label>
            <input type="input" id="from" name="from" value={from || ''} onChange={onSetEditFilterBy} />

            <label htmlFor="subject">Subject:</label>
            <input type="input" id="subject" name="subject" value={subject || ''} onChange={onSetEditFilterBy} />

            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" value={date ? new Date(+date).toISOString().slice(0, 10) : ''} onChange={onSetEditFilterBy} />

            <input type="checkbox" id="isRead" name="isRead" checked={isRead} onChange={onSetEditFilterBy} />
            <label htmlFor="isRead">is Read</label>

            <input type="checkbox" id="isStared" name="isStared" checked={isStared} onChange={onSetEditFilterBy} />
            <label htmlFor="isStared">is Stared</label>

        </div>
    )
}