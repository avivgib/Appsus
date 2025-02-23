import { MailPreview } from "./MailPreview.jsx"

export function MailList({ emails, onOpenMailDetails, onToggleIsRead, unreadEmailsNum }) {


    return (
        <section className='emails-wrapper'>
            <div className='emails-bar flex align-center'>
                <div>unread emails: {unreadEmailsNum}/{emails.length}</div>
            </div>
            <ul className='emails-list clean-list'>
                {emails.map(mail => {
                    return <li key={mail.id} className={`mail-preview ${mail.isRead ? '' : 'unread'}`} onClick={() => { onOpenMailDetails(mail.id) }}>
                        <div className='grip'><span className='fa grip-vertical'></span></div>
                        <div className='mail-envelope'>
                            <span className={`fare ${mail.isRead ? 'envelope-open' : 'envelope'}`}
                                onClick={(event) => onToggleIsRead(event, mail.id)}></span>
                        </div>
                        <div className='mail-star'><span className='fare star'></span></div>
                        <div className='mail-important'><span className='fare book-mark'></span></div>
                        <MailPreview mail={mail} />
                    </li>
                })}

            </ul >
        </section>
    )
}
