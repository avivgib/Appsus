const { useState, useEffect, useRef } = React

export function MailFilter({ filterBy, onSetFilterBy }) {
    const [editFilterBy, setEditFilterBy] = useState({ ...filterBy })

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
                    value = null
                    break
            }
        }

        setEditFilterBy(prev => ({ ...prev, [name]: value }))
        if (filterBy.status) {
            setEditFilterBy(prev => ({ ...prev, status: '' }))
        }
    }

    return (
        <section className='mail-filter flex align-center '>
            <input type="search" name='txt' placeholder='Email search' onChange={onSetEditFilterBy} />

            <select name="isRead" id='isRead' onChange={onSetEditFilterBy} >
                <option value=''>All Mails</option>
                <option value='true'>Read</option>
                <option value='false'>Unread</option>
            </select>
        </section>
    )
}