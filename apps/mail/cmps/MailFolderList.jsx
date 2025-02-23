

export function MailFolderList({ onSetStatusInFilterBy, filterBy, unreadEmailsNum }) {

    const { status } = filterBy
    return (
        <section className='mail-folder '>
            <button className='add-email-btn'><span className='fa pen'></span> new email</button>

            <ul className='clean-list'>

                <li className={status === 'inbox' ? 'active' : ''}
                    onClick={() => onSetStatusInFilterBy('inbox')} >
                    <span className='fa envelope-open-text'></span>
                    <button> inbox</button>
                    <span className='unread-emails'>
                        {unreadEmailsNum.inbox > 0 ? unreadEmailsNum.inbox : ''}
                    </span>
                </li>
                <li className={status === 'sent' ? 'active' : ''}
                    onClick={() => onSetStatusInFilterBy('sent')} >
                    <span className='fare paper-plane'></span>
                    <button>sent</button>
                    <span className='unread-emails'>
                        {unreadEmailsNum.sent > 0 ? unreadEmailsNum.sent : ''}
                    </span>
                </li>
                <li className={status === 'trash' ? 'active' : ''}
                    onClick={() => onSetStatusInFilterBy('trash')} >
                    <span className='fare trash-can'>
                    </span><button>trash</button>
                    <span className='unread-emails'>
                        {unreadEmailsNum.trash > 0 ? unreadEmailsNum.trash : ''}
                    </span>
                </li>
                <li className={status === 'draft' ? 'active' : ''}
                    onClick={() => onSetStatusInFilterBy('draft')} >
                    <span className='fare note-sticky'>
                    </span><button>draft</button>
                    <span className='unread-emails'>
                        {unreadEmailsNum.draft > 0 ? unreadEmailsNum.draft : ''}
                    </span>
                </li>
            </ul>
        </section>
    )
}