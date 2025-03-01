import { utilService } from "../../../services/util.service.js";

const { useState, useEffect, useRef } = React

export function MailFolderList({ onSetcmpType, onSetStatusInFilterBy, filterBy, unreadEmailsCount }) {

    const [isMoreLabelsOpen, setIsMoreLabelsOpen] = useState(null)

    function toggleMoreLabels() {
        setIsMoreLabelsOpen(prev => prev = !isMoreLabelsOpen)
    }

    const { status } = filterBy
    return (
        <section className='mail-folder '>
            <button className='add-email-btn' onClick={() => onSetcmpType('compose')}>
                <span className='fa pen'></span> new email</button>

            <ul className='clean-list'>

                {['inbox', 'star', 'sent', 'trash', 'draft'].map(label => {
                    return <li key={label} className={status === label ? 'active' : ''}
                        onClick={() => { onSetStatusInFilterBy(label); onSetcmpType('list') }}
                        style={unreadEmailsCount && unreadEmailsCount[label] > 0 ? { fontWeight: 'bold' } : {}}>
                        <span className={status === label ? `fa ${label}` : ` fare ${label}`}></span>
                        <button>{label}</button>
                        <span className='unread-emails'>
                            {unreadEmailsCount && unreadEmailsCount[label] > 0 ? unreadEmailsCount[label] : ''}
                        </span>
                    </li>
                })}

                <li className={isMoreLabelsOpen ? 'active' : ''}
                    onClick={() => { toggleMoreLabels(); onSetcmpType('list') }}
                >
                    <span className={isMoreLabelsOpen ? `fa tag` : ` fa tag`}></span>
                    <button>labels</button>
                    <span className='unread-emails'>
                        <span className='arrow fa caret-right'></span>
                    </span>
                </li>

                <div className={`more-labels ${isMoreLabelsOpen ? 'open' : ''}`}>
                    <ul className='clean-list'>
                        {utilService.getLabels().map(label => {
                            return <li key={label} className={status === label ? 'active' : ''}
                                onClick={() => { onSetStatusInFilterBy(label); onSetcmpType('list') }}
                                style={unreadEmailsCount && unreadEmailsCount[label] > 0 ? { fontWeight: 'bold' } : {}}>
                                <span className={status === label ? `fa ${label}` : ` fare ${label}`}></span>
                                <button>{label}</button>
                                <span className='unread-emails'>
                                    {unreadEmailsCount && unreadEmailsCount[label] > 0 ? unreadEmailsCount[label] : ''}
                                </span>
                            </li>
                        })}
                    </ul>
                </div>

            </ul>
        </section >
    )
}