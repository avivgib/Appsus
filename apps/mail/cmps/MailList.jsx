import { LabelPicker } from "../../../cmps/LabelPicker.jsx"
import { MailPreview } from "./MailPreview.jsx"

const { useNavigate } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function MailList({ saveChanges, onSetcmpType, emails, onOpenMail, onRemoveMail, updateMailLabels, children }) {

    const [openLabelPicker, setOpenLabelPicker] = useState(null)
    // console.log(openLabelPicker);

    const navigate = useNavigate()

    function onMailToNote(ev, mail) {
        ev.stopPropagation()
        const { subject, body } = mail
        navigate(`/note?subject=${subject}&body=${body}`)
    }


    function onSaveLabels(ev, labels) {
        ev.stopPropagation()
        console.log(labels);
        updateMailLabels(openLabelPicker, labels)
        setOpenLabelPicker('')
    }


    function onTogglLabelPikcer(ev, mailId) {

        if (ev) {
            ev.stopPropagation()
        }
        setOpenLabelPicker(mailId)
    }


    return (
        <section className='emails-wrapper'>
            <div className='emails-bar flex align-center'>
                {children}
            </div>
            <ul className='emails-list clean-list'>
                {emails.length > 0
                    ? (
                        emails.map(mail => {
                            return <li key={mail.id} className='mail-preview'
                                onClick={() => {
                                    onOpenMail(mail.id, (mail.sentAt) ? 'details' : 'edit')
                                    mail.sentAt ? onSetcmpType('details') : onSetcmpType('compose')
                                }}>
                                {/* <div className='grip'><span className='fa grip-vertical'></span></div>
                                <div className='mail-envelope'>
                                    <span className={`fare ${mail.isRead ? 'envelope-open' : 'envelope'}`}
                                        onClick={(event) => onToggleIsRead(event, mail.id)}></span>
                                </div>
                                <div className={`mail-remove ${openLabelPicker === mail.id ? 'open' : ''} `}>
                                    <span className='fa tag' onClick={(event) => { onTogglLabelPikcer(event, mail.id) }}>
                                        {openLabelPicker === mail.id &&
                                            <LabelPicker
                                                onTogglLabelPikcer={onTogglLabelPikcer}
                                                onSaveLabels={onSaveLabels}
                                            />}
                                    </span>
                                </div>
                                <div className='mail-star'>
                                    <span className={`${mail.isStared ? 'fa star-full' : 'fare star'}`}
                                        onClick={(event) => { onToggleIsStared(event, mail.id) }}></span>
                                </div> */}
                                <MailPreview currMail={mail} saveChanges={saveChanges} />
                                <div className='more-list-btns'>
                                    <span className='fare note-sticky'
                                        onClick={(event) => onMailToNote(event, mail)}
                                    ></span>
                                    <span className='fare trash-can' onClick={(event) => { onRemoveMail(event, mail.id) }}></span>
                                    <span className='fare folder-open'></span>
                                </div>
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
