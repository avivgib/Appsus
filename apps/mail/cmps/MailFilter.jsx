const { useState, useEffect, useRef } = React

export function MailFilter({ filterBy, onSetFilterBy }) {
    const [editFilterBy, setEditFilterBy] = useState({ ...filterBy })

    // rest the editFilterBy if filterBy get status
    useEffect(() => {
        setEditFilterBy(prev => ({ ...filterBy }))
    }, [filterBy.status])

    useEffect(() => {
        onSetFilterBy(editFilterBy)
    }, [editFilterBy])


    function onSetEditFilterBy(ev) {
        var { value, type, name, checked } = ev.target


        if (type === 'number') value = +value
        if (type === 'checkbox') value = checked

        if (name === 'isRead') {
            switch (value) {
                case 'true':
                    value = true
                    break
                case 'false':
                    value = false
                    break
                case '':
                    value = ''
                    break
            }
        }

        setEditFilterBy(prev => ({ ...prev, [name]: value }))

        if (filterBy.status) {
            setEditFilterBy(prev => ({ ...prev, status: '' }))
        }
    }

    const { txt, isRead } = editFilterBy
    return (
        <section className='mail-filter flex align-center '>
            <input type="search" name='txt' placeholder='Email search' value={txt} onChange={onSetEditFilterBy} />

            <select name="isRead" id='isRead' value={isRead} onChange={onSetEditFilterBy} >
                <option value=''>All Mails</option>
                <option value='true'>Read</option>
                <option value='false'>Unread</option>
            </select>
        </section>
    )
}