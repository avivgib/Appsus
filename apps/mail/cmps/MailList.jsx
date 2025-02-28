import { MailPreview } from "./MailPreview.jsx"

const { useNavigate } = ReactRouterDOM

export function MailList({ emails, saveChanges, onSetcmpType, onOpenMail, onRemoveMail, children }) {

    const navigate = useNavigate()

    function onMailToNote(ev, mail) {
        ev.stopPropagation()
        const { subject, body } = mail
        navigate(`/note?subject=${subject}&body=${body}`)
    }

    return (
        <section className='emails-wrapper'>

            <div className='emails-bar flex align-center'>
                {children}
            </div>

            <ul className='emails-list clean-list'>
                {emails.length > 0
                    ? (
                        emails.map(mail => {
                            return <li
                                key={mail.id} className='mail-preview'
                                onClick={() => {
                                    onOpenMail(mail.id, (mail.sentAt) ? 'details' : 'edit')
                                    mail.sentAt ? onSetcmpType('details') : onSetcmpType('compose')
                                }}>

                                <MailPreview currMail={mail} saveChanges={saveChanges} />

                                <div className='more-list-btns'>

                                    <span className='fare note-sticky'
                                        onClick={(event) => onMailToNote(event, mail)}
                                    ></span>

                                    <span className='fare trash-can'
                                        onClick={(event) => { onRemoveMail(event, mail.id) }}></span>

                                    <span className='fare folder-open'></span>
                                </div>
                            </li>
                        })
                    )
                    : <li className='no-mail'>No emails found</li>
                }
                <li className='emails-footer'></li>
            </ul >
        </section>
    )
}
