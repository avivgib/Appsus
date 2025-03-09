import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React

export function MailPreview({ currMail, saveChanges, children, mailLabels }) {

    const [mail, setMail] = useState({ ...currMail })

    function handleChanges(ev, type) {
        ev.stopPropagation()

        const updateMail = { ...mail, [type]: !mail[type], labels: mailLabels }
        setMail(updateMail)

        const isReadUpdate = (type === 'isRead') ? true : false
        saveChanges(updateMail, isReadUpdate, type)
    }


    function setSentAtDateDisplay(sentAt) {
        const dateNow = Date.now()
        const day = 1000 * 60 * 60 * 24

        if (dateNow - sentAt < day) {
            const time = new Date(sentAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
            return time
        } else if (new Date(dateNow).getFullYear() === new Date(sentAt).getFullYear()) {
            const date = new Date(sentAt).toLocaleString('en-US', { month: 'short', day: 'numeric' })
            return date
        } else {
            return new Date(sentAt).toLocaleDateString()
        }
    }

    function renderMailSentFrom() {
        const usrEmail = mailService.getUserMail()
        if (mail.from !== usrEmail) {
            return <span>{from.split('@')[0]}</span>
        } else if (mail.from === usrEmail && mail.sentAt) {
            return <span>{`to: ${to.split('@')[0]}`}</span>
        } else if (!mail.sentAt) {
            return <span style={{ color: 'var(--gl-font3)' }}>Draft</span>
        }
    }


    const { createdAt, subject, body, isRead, sentAt, isStared, from, to } = mail


    return (
        <React.Fragment>
            <div className='grip'>
                {/* <span className='fa grip-vertical'></span> */}
            </div>

            <div className='mail-envelope'
                data-title={isRead ? `Mark as read` : `Mark as unread`}
            >
                <span
                    className={`fare ${isRead ? 'envelope-open' : 'envelope'}`}
                    onClick={(event) => handleChanges(event, 'isRead')}
                >
                </span>
            </div>

            {children}

            <div className='mail-star'
                data-title={isStared ? `Remove stared` : `Mark as stared`}
            >
                <span
                    className={`${isStared ? 'fa star' : 'fare star'}`}
                    onClick={(event) => { handleChanges(event, 'isStared') }}>
                </span>
            </div>

            <div className='icon'><img src="assets/images/use-icon.jpg" alt="use-icon" className='usr-icon' /></div>
            <div className='sent-from'>{renderMailSentFrom()}</div>
            <div className='mail-content'>
                {mailLabels.length > 0
                    ? mailLabels.map(label => {
                        return <span key={label} className='mail-label'>{label}</span>
                    })
                    : ''}
                <div className='content-line'>
                    <span className='mail-subject'>{subject}</span>
                    <span>{body}</span>
                </div>

            </div>
            <div className='gap'></div>
            <div className='sentat'>
                {sentAt ? setSentAtDateDisplay(sentAt) : setSentAtDateDisplay(createdAt)}
            </div>

        </React.Fragment >
    )
}