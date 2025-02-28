

export function MailFolderList({ onSetcmpType, onSetStatusInFilterBy, filterBy, unreadEmailsCount }) {

    const { status } = filterBy
    return (
        <section className='mail-folder '>
            <button className='add-email-btn' onClick={() => onSetcmpType('compose')}>
                <span className='fa pen'></span> new email</button>

            <ul className='clean-list'>

                <li className={status === 'inbox' ? 'active' : ''}
                    style={unreadEmailsCount && unreadEmailsCount.inbox > 0 ? { fontWeight: 'bold' } : {}}
                    onClick={() => { onSetStatusInFilterBy('inbox'); onSetcmpType('list') }} >
                    <span className={status === 'inbox' ? 'fa envelope-open-text' : ' fa envelope-open'}></span>
                    <button>inbox</button>
                    <span className='unread-emails'>
                        {unreadEmailsCount && unreadEmailsCount.inbox > 0 ? unreadEmailsCount.inbox : ''}
                    </span>
                </li>
                <li className={status === 'star' ? 'active' : ''}
                    onClick={() => { onSetStatusInFilterBy('star'); onSetcmpType('list') }} >
                    <span className={status === 'star' ? 'fa star-full' : 'fare star'}></span>
                    <button>star</button>
                    <span className='unread-emails'>
                    </span>
                </li>
                <li className={status === 'sent' ? 'active' : ''}
                    style={unreadEmailsCount && unreadEmailsCount.sent > 0 ? { fontWeight: 'bold' } : {}}
                    onClick={() => { onSetStatusInFilterBy('sent'); onSetcmpType('list') }}>
                    <span className={status === 'sent' ? 'fa paper-plane' : 'fare paper-plane'}></span>
                    <button>sent</button>
                    <span className='unread-emails'>
                        {unreadEmailsCount && unreadEmailsCount.sent > 0 ? unreadEmailsCount.sent : ''}
                    </span>
                </li>
                <li className={status === 'trash' ? 'active' : ''}
                    style={unreadEmailsCount && unreadEmailsCount.trash > 0 ? { fontWeight: 'bold' } : {}}
                    onClick={() => { onSetStatusInFilterBy('trash'); onSetcmpType('list') }} >
                    <span className={status === 'trash' ? 'fa trash-can' : 'fare trash-can'}></span>
                    <button>trash</button>
                    <span className='unread-emails'>
                        {unreadEmailsCount && unreadEmailsCount.trash > 0 ? unreadEmailsCount.trash : ''}
                    </span>
                </li>
                <li className={status === 'draft' ? 'active' : ''}
                    style={unreadEmailsCount && unreadEmailsCount.draft > 0 ? { fontWeight: 'bold' } : {}}
                    onClick={() => { onSetStatusInFilterBy('draft'); onSetcmpType('list') }} >
                    <span className={status === 'draft' ? 'fa file' : 'fare file'}></span>
                    <button>draft</button>
                    <span className='unread-emails'>
                        {unreadEmailsCount && unreadEmailsCount.draft > 0 ? unreadEmailsCount.draft : ''}
                    </span>
                </li>
            </ul>
        </section>
    )
}