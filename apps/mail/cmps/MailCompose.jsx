
import { mailService } from "../services/mail.service.js";

const { useState, useEffect, useRef } = React
const { useOutletContext, useNavigate, useLocation } = ReactRouterDOM


export function MailCompose() {

    const navigate = useNavigate()
    const location = useLocation()

    const { onSaveMail, autoSave, openMail, onGoingBack } = useOutletContext()

    const [newMail, setNewMail] = useState({ ...mailService.getEmptyMail(), createdAt: Date.now() })
    const [isMinimized, setIsMinimized] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const formRef = useRef()
    const autoSaveRef = useRef()


    useEffect(() => {
        if (location.state) {
            if (Object.hasOwn(location.state, 'noteToMail')) {
                const { noteToMail } = location.state
                onNoteToMail(noteToMail)
            }
        }
    }, [location.state])

    function onNoteToMail(note) {
        const { title, content } = note.info
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
        setNewMail({ ...openMail })
    }



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

    function onCloseComposeAndSave() {
        onSaveMail(newMail)
        navigate('/mail')
    }

    function onMinimize() {
        setIsMinimized(!isMinimized)
        if (isFullScreen) {
            setIsFullScreen(false)
        }
    }
    function onFullScreen() {
        setIsFullScreen(!isFullScreen)
        if (isMinimized) {
            setIsMinimized(false)
        }
    }

    function onBlackWrapper() {
        setIsFullScreen(false)
        setIsMinimized(true)
    }

    const { to, subject, body } = newMail


    return (
        <React.Fragment>
            <section className={`mail-compose ${isMinimized ? 'minimize' : ''} ${isFullScreen ? 'full-screen' : ''}`}>
                <div className="mail-compose-titel flex space-between">
                    <span>New Message</span>
                    <div className='compose-titel-btns'>
                        <button
                            className="fa minus"
                            onClick={onMinimize}
                            data-title={isMinimized ? 'Maximize' : 'Minimize'}
                        ></button>
                        <button
                            className={isFullScreen ? 'fa minimize' : 'fa maximize'}
                            onClick={onFullScreen}
                            data-title={isFullScreen ? 'Exit full screen' : 'Full screen'}
                        ></button>
                        <button
                            className="close-btn fa x"
                            onClick={onCloseComposeAndSave}
                            data-title='close and save'
                        ></button>
                    </div>
                </div>
                <form ref={formRef} onSubmit={onSubmit} className="new-message-form flex column">
                    <input type="email" id="email" name="to" placeholder="To" value={to} onChange={handleChange} required />
                    <input type="text" id="subject" name="subject" placeholder="Subject" value={subject} onChange={handleChange} required />
                    <textarea name="body" id="body" placeholder="Body" rows="10" value={body} onChange={handleChange} required></textarea>
                    <div className="mail-compose-btns flex space-between">
                        <button className="send-btn">send</button>
                        <button type="button" className="save-draft-btn" onClick={(event) => { onSubmit(event, true) }}>save draft</button>
                    </div>
                </form>
            </section >

            <div className="black-wrapper" onClick={onBlackWrapper}></div>

        </React.Fragment>
    )

}