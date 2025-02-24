
import { mailService } from "../services/mail.service.js";
const { useState, useEffect, useRef } = React

export function MailCompose({ onSetcmpType }) {

    const [newMail, setNewMail] = useState({ ...mailService.getEmptyMail(), createdAt: Date.now() })
    console.log(newMail);

    const formRef = useRef()

    // useEffect(() => {
    //     setNewMail(prev => ({ ...prev, createdAt: Date.now() }))
    // }, [])

    function handleChange({ target }) {
        const { name, value } = target

        setNewMail(prev => ({ ...prev, [name]: value }))
    }

    function onSend(ev) {
        ev.preventDefault()
        const updatedMail = { ...newMail, sentAt: Date.now() }
        mailService.save(updatedMail)
            .then(res => {
                console.log('mail send')
                formRef.current.reset()
            })
            .catch(error => console.log(error))
    }

    const { to, subject, body } = newMail

    return (
        <section className='new-email'>
            <div className='new-email-titel flex space-between'>
                <span>new message</span>
                <button className='close-btn fa x' onClick={() => onSetcmpType('list')}></button>
            </div>
            <form ref={formRef} onSubmit={onSend} className='new-message-form flex column'>
                <input type="email" id="email" name='to' placeholder='to' value={to} onChange={handleChange} required />
                <input type="text" id='subject' name='subject' placeholder='subject' value={subject} onChange={handleChange} required />
                <textarea name="body" id="body" placeholder='body' rows="10" value={body} onChange={handleChange} required></textarea>
                <button className='send-btn'>send</button>
            </form>
        </section>
    )

}