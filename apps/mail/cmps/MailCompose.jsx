
import { utilService } from "../../../services/util.service.js";
import { mailService } from "../services/mail.service.js";


const { useState, useEffect, useRef } = React

export function MailCompose({ onSaveMail, autoSave, openMail, onGoingBack, onToggleCompose, noteToMail, resetNoteToMail, onRemoveDraftMail }) {

    const [newMail, setNewMail] = useState({ ...mailService.getEmptyMail(), createdAt: Date.now() })
    const [isMinimized, setIsMinimized] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const formRef = useRef()
    // const autoSaveDebounce = useRef(utilService.debounce(onAutoSave, 2000))
    const autoSaveRef = useRef()



    ///  note to mail
    useEffect(() => {
        if (noteToMail) {
            onNoteToMail(noteToMail)
        }

        return (() => resetNoteToMail())
    }, [noteToMail])

    function onNoteToMail(note) {
        const { title, content } = note.info
        setNewMail(prev => ({ ...prev, subject: title, body: content }))
    }

    /// edit draft
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

    /// auto save
    useEffect(() => {
        if (newMail.body || newMail.subject) {
            autoSaveRef.current = setInterval(onAutoSave, 4000)
        }

        return (() => {
            clearInterval(autoSaveRef.current)
        })
    }, [newMail])



    // useEffect(() => {
    //     autoSaveDebounce.current(newMail)
    // }, [newMail])


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
        onToggleCompose(false)
    }

    function onCloseComposeAndSave() {
        if (newMail.body || newMail.subject) {
            onSaveMail(newMail)
        }

        onToggleCompose(false)
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

    function onRemoveDraft() {
        if (newMail.id) {
            onRemoveDraftMail(newMail)
        }
        onToggleCompose(false)
    }

    const { to, subject, body } = newMail

    return (
        <React.Fragment>
            <section className={`mail-compose ${isMinimized ? 'minimize' : ''} ${isFullScreen ? 'full-screen' : ''}`}>
                <div className="mail-compose-titel flex space-between">
                    <span>{subject ? subject : 'New Message'}</span>
                    <div className='compose-titel-btns flex'>
                        <button
                            className="fa minus"
                            onClick={onMinimize}
                            data-title={isMinimized ? 'Maximize' : 'Minimize'}
                        ></button>
                        <button
                            className={`full-screen-btn ${isFullScreen ? 'fa minimize' : 'fa maximize'}`}
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
                        <button type="button" className="remove-draft-btn" onClick={onRemoveDraft}>remove draft</button>
                    </div>
                </form>
            </section >

            <div className="black-wrapper" onClick={onBlackWrapper}></div>

        </React.Fragment >
    )

}