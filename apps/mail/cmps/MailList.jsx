import { MailPreview } from "./MailPreview.jsx"

export function MailList({ status, onSetcmpType, emails, onOpenMailDetails, onToggleIsRead }) {


    return (
        <section className='emails-wrapper'>
            <div className='emails-bar flex align-center'>
            </div>
            <ul className='emails-list clean-list'>
                {emails.map(mail => {
                    return <li key={mail.id} className={`mail-preview ${mail.isRead ? '' : 'unread'}`}
                        onClick={() => { onOpenMailDetails(mail.id); onSetcmpType('details') }}>
                        <div className='grip'><span className='fa grip-vertical'></span></div>
                        <div className='mail-envelope'>
                            <span className={`fare ${mail.isRead ? 'envelope-open' : 'envelope'}`}
                                onClick={(event) => onToggleIsRead(event, mail.id)}></span>
                        </div>
                        <div className='mail-star'><span className='fare star'></span></div>
                        <div className='mail-important'><span className='fare book-mark'></span></div>
                        <MailPreview mail={mail} status={status} />
                    </li>
                })}

            </ul >
        </section>
    )
}
