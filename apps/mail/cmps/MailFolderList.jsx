

export function MailFolderList({ onSetcmpType, onSetStatusInFilterBy, filterBy, unreadEmailsNum }) {

    const { status } = filterBy
    return (
        <section className='mail-folder '>
            <button className='add-email-btn' onClick={() => onSetcmpType('compose')}>
                <span className='fa pen'></span> new email</button>

            <ul className='clean-list'>

                <li className={status === 'inbox' ? 'active' : ''}
                    style={unreadEmailsNum && unreadEmailsNum.inbox > 0 ? { fontWeight: 'bold' } : {}}
                    onClick={() => { onSetStatusInFilterBy('inbox'); onSetcmpType('list') }} >
                    <span className='fa envelope-open-text'></span>
                    <button>inbox</button>
                    <span className='unread-emails'>
                        {unreadEmailsNum && unreadEmailsNum.inbox > 0 ? unreadEmailsNum.inbox : ''}
                    </span>
                </li>
                <li className={status === 'sent' ? 'active' : ''}
                    style={unreadEmailsNum && unreadEmailsNum.sent > 0 ? { fontWeight: 'bold' } : {}}
                    onClick={() => { onSetStatusInFilterBy('sent'); onSetcmpType('list') }}>
                    <span className='fare paper-plane'></span>
                    <button>sent</button>
                    <span className='unread-emails'>
                        {unreadEmailsNum && unreadEmailsNum.sent > 0 ? unreadEmailsNum.sent : ''}
                    </span>
                </li>
                <li className={status === 'trash' ? 'active' : ''}
                    style={unreadEmailsNum && unreadEmailsNum.trash > 0 ? { fontWeight: 'bold' } : {}}
                    onClick={() => { onSetStatusInFilterBy('trash'); onSetcmpType('list') }} >
                    <span className='fare trash-can'>
                    </span><button>trash</button>
                    <span className='unread-emails'>
                        {unreadEmailsNum && unreadEmailsNum.trash > 0 ? unreadEmailsNum.trash : ''}
                    </span>
                </li>
                <li className={status === 'draft' ? 'active' : ''}
                    style={unreadEmailsNum && unreadEmailsNum.draft > 0 ? { fontWeight: 'bold' } : {}}
                    onClick={() => { onSetStatusInFilterBy('draft'); onSetcmpType('list') }} >
                    <span className='fare note-sticky'>
                    </span><button>draft</button>
                    <span className='unread-emails'>
                        {unreadEmailsNum && unreadEmailsNum.draft > 0 ? unreadEmailsNum.draft : ''}
                    </span>
                </li>
            </ul>
        </section>
    )
}