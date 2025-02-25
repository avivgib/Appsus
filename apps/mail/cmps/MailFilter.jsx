const { useState, useEffect, useRef } = React

export function MailFilter({ filterBy, onSetFilterBy }) {
    const [editFilterBy, setEditFilterBy] = useState({ ...filterBy })
    const [ischecked, setIschecked] = useState('')

    // rest the editFilterBy if filterBy get status
    useEffect(() => {
        if (filterBy.status !== '') {
            setEditFilterBy(prev => ({ ...filterBy }))
            setIschecked('')
        }
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
                    setIschecked('true')
                    value = true
                    break
                case 'false':
                    setIschecked('false')
                    value = false
                    break
                case '':
                    setIschecked('')
                    value = ''
                    break
            }
        }

        setEditFilterBy(prev => ({ ...prev, [name]: value }))

        if (filterBy.status) {
            setEditFilterBy(prev => ({ ...prev, status: '' }))
        }
    }

    function onRestTxt() {
        setEditFilterBy(prev => ({ ...prev, txt: '' }))
    }

    const { txt, isRead } = editFilterBy
    return (
        <section className='mail-filter flex align-center'>
            <div className='main-search flex align-center'>
                <span className='fa magnifying-glass'></span>
                <input type="search" name='txt' placeholder='Email search' value={txt} onChange={onSetEditFilterBy} />
                <span
                    className={`rest-btn fa x ${editFilterBy.txt ? 'show' : ''}`}
                    onClick={onRestTxt}></span>
            </div>

            <select name="isRead" id='isRead' value={isRead} onChange={onSetEditFilterBy} >
                <option value=''>All Mails</option>
                <option value='true'>{ischecked === 'true' ? ' ✓ ' : ''}  Read</option>
                <option value='false'>{ischecked === 'false' ? ' ✓ ' : ''} Unread</option>
            </select>
        </section>
    )
}