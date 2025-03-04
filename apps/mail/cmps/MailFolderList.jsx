import { utilService } from "../../../services/util.service.js";

const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouterDOM

export function MailFolderList({ onSetcmpType, onSetStatusInFilterBy, filterBy, unreadEmailsCount }) {

    const navigate = useNavigate();

    function onCloseNav() {
        navigate('/mail', { state: { isFoldersClose: false } })
    }

    const [isMoreLabelsOpen, setIsMoreLabelsOpen] = useState(null)

    function toggleMoreLabels() {
        setIsMoreLabelsOpen(prev => prev = !isMoreLabelsOpen)
    }

    const { status } = filterBy
    return (
        <section className='mail-folder '>

            <div className='folder-title'>Gmail</div>

            <button className='add-email-btn' onClick={() => { onSetcmpType('compose'); onCloseNav() }}>
                <span className='fa pen'></span>
                <span className='add-email-content'>new email</span>
            </button>

            <ul className='clean-list'>

                {['inbox', 'star', 'sent', 'trash', 'draft'].map(label => {
                    return <li key={label} className={status === label ? 'active' : ''}
                        onClick={() => { onSetStatusInFilterBy(label); onSetcmpType('list'); onCloseNav() }}
                        style={unreadEmailsCount && unreadEmailsCount[label] > 0 ? { fontWeight: 'bold' } : {}}>
                        <span className={status === label ? `fa ${label}` : ` fare ${label}`}></span>
                        <button>{label}</button>
                        <span className={`unread-emails 
                         ${unreadEmailsCount && unreadEmailsCount[label] > 0 ? 'unread-num' : ''}`}>
                            {unreadEmailsCount && unreadEmailsCount[label] > 0 ? unreadEmailsCount[label] : ''}
                        </span>
                    </li>
                })}

                <li
                    className={isMoreLabelsOpen ? 'click' : ''}
                    onClick={() => { toggleMoreLabels() }}
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
                                onClick={() => { onSetStatusInFilterBy(label); onSetcmpType('list'); onCloseNav() }}
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