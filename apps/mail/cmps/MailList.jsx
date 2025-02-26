import { MailPreview } from "./MailPreview.jsx"

export function MailList({ onSetcmpType, emails, onOpenMail, onToggleIsRead, onRemoveMail, onToggleIsStared, children }) {
    return (
        <section className='emails-wrapper'>
            <div className='emails-bar flex align-center'>
                {children}
            </div>
            <ul className='emails-list clean-list'>
                {emails.length > 0
                    ? (
                        emails.map(mail => {
                            return <li key={mail.id} className={`mail-preview ${mail.isRead ? '' : 'unread'}`}
                                onClick={() => {
                                    onOpenMail(mail.id, (mail.sentAt) ? 'details' : 'edit')
                                    mail.sentAt ? onSetcmpType('details') : onSetcmpType('compose')
                                }}>
                                <div className='grip'><span className='fa grip-vertical'></span></div>
                                <div className='mail-envelope'>
                                    <span className={`fare ${mail.isRead ? 'envelope-open' : 'envelope'}`}
                                        onClick={(event) => onToggleIsRead(event, mail.id)}></span>
                                </div>
                                <div className='mail-remove'>
                                    <span className='fare trash-can' onClick={(event) => { onRemoveMail(event, mail.id) }}></span>
                                </div>
                                <div className='mail-star'>
                                    <span className={`${mail.isStared ? 'fa star-full' : 'fare star'}`}
                                        onClick={(event) => { onToggleIsStared(event, mail.id) }}></span>
                                </div>
                                <MailPreview mail={mail}
                                />
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
