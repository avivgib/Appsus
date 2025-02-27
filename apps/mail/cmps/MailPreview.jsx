import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React

export function MailPreview({ currMail, saveChanges }) {

    const [mail, setMail] = useState({ ...currMail })


    function handleChanges(ev, type) {
        ev.stopPropagation()

        const updateMail = { ...mail, [type]: !mail[type] }

        setMail(updateMail)

        const isReadUpdate = (type === 'isRead') ? true : false
        saveChanges(updateMail, isReadUpdate)
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
            return <span>{from}</span>
        } else if (mail.from === usrEmail && mail.sentAt) {
            return <span>{`to: ${to}`}</span>
        } else if (!mail.sentAt) {
            return <span style={{ color: 'var(--gl-font3)' }}>Draft</span>
        }
    }

    const { isRead, from, to, subject, body, sentAt, createdAt, isStared } = mail

    return (
        <React.Fragment>
            <div className='grip'><span className='fa grip-vertical'></span></div>
            <div className='mail-envelope'>
                <span
                    className={`fare ${isRead ? 'envelope-open' : 'envelope'}`}
                    onClick={(event) => handleChanges(event, 'isRead')}>
                </span>
            </div>
            {/* <div className={`mail-remove ${openLabelPicker === mail.id ? 'open' : ''} `}>
                <span className='fa tag' onClick={(event) => { onTogglLabelPikcer(event, mail.id) }}>
                    {openLabelPicker === mail.id &&
                        <LabelPicker
                            onTogglLabelPikcer={onTogglLabelPikcer}
                            onSaveLabels={onSaveLabels}
                        />}
                </span>
            </div> */}
            <div className='mail-star'>
                <span
                    className={`${isStared ? 'fa star-full' : 'fare star'}`}
                    onClick={(event) => { handleChanges(event, 'isStared') }}>
                </span>
            </div>
            <div className='icon'><img src="assets/images/use-icon.jpg" alt="use-icon" className='usr-icon' /></div>
            <div className='sent-from'>{renderMailSentFrom()}</div>
            <div className='mail-content'><span className='mail-subject'>{subject}</span> <span>{body}</span> </div>
            <div className='gap'></div>
            <div className='sentat' >
                {sentAt ? setSentAtDateDisplay(sentAt) : setSentAtDateDisplay(createdAt)}
            </div>
        </React.Fragment >
    )
}