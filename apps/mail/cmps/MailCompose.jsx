
import { mailService } from "../services/mail.service.js";
const { useState, useEffect, useRef } = React
const { useLocation } = ReactRouterDOM

export function MailCompose({ onSetcmpType, onSaveMail, autoSave, openMail, onGoingBack, searchParams }) {

    const [newMail, setNewMail] = useState({ ...mailService.getEmptyMail(), createdAt: Date.now() })
    console.log(newMail);

    const location = useLocation()

    const formRef = useRef()

    useEffect(() => {
        if (location.state) {
            if (Object.hasOwn(location.state, 'noteToMail')) {
                const { noteToMail } = location.state
                onNoteToMail(noteToMail)
            }
        }
    }, [location.state])

    function onNoteToMail(note) {
        console.log(note);
        const { title, content } = note.info
        console.log(title, content);
        setNewMail(prev => ({ ...prev, subject: title, body: content }))
    }

    useEffect(() => {
        if (openMail.edit) {
            setEditDraft(openMail.edit)
        }
        return (() => {
            onGoingBack('edit')
        })
    }, [openMail.edit])

    function setEditDraft(openMail) {
        setNewMail(prev => ({ ...openMail }))
    }

    const autoSaveRef = useRef()

    useEffect(() => {
        autoSaveRef.current = setInterval(onAutoSave, 5000)

        return (() => {
            clearInterval(autoSaveRef.current)
        })
    }, [newMail])

    function onAutoSave() {
        console.log('auto save');
        autoSave(newMail)
            .then(mail => {
                console.log(newMail);
                if (!newMail.id) {
                    setNewMail(prev => ({ ...prev, id: mail.id }))
                }
            })
    }

    function handleChange({ target }) {
        const { name, value } = target

        setNewMail(prev => ({ ...prev, [name]: value }))
    }

    function onSubmit(ev, isDraft) {
        ev.preventDefault()

        const updatedMail = isDraft ? { ...newMail } : { ...newMail, sentAt: Date.now() }

        onSaveMail(updatedMail)
    }

    const { to, subject, body } = newMail

    return (
        <section className='new-email'>
            <div className='new-email-titel flex space-between'>
                <span>new message</span>
                <button className='close-btn fa x' onClick={() => onSetcmpType('list')}></button>
            </div>
            <form ref={formRef} onSubmit={onSubmit} className='new-message-form flex column'>
                <input type="email" id="email" name='to' placeholder='to' value={to} onChange={handleChange} required />
                <input type="text" id='subject' name='subject' placeholder='subject' value={subject} onChange={handleChange} required />
                <textarea name="body" id="body" placeholder='body' rows="10" value={body} onChange={handleChange} required></textarea>
                <div className='mail-compose-btns flex space-between'>
                    <button className='send-btn'>send</button>
                    <button type='button' className='save-draft-btn' onClick={(event) => { onSubmit(event, true) }}>save draft</button>
                </div>
            </form>
        </section>
    )

}