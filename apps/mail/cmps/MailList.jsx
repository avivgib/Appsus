import { LabelPicker } from "../../../cmps/LabelPicker.jsx"
import { MailPreview } from "./MailPreview.jsx"

const { useState, useEffect, useRef } = React

const { useNavigate } = ReactRouterDOM

export function MailList({ emails, saveChanges, onSetcmpType, onOpenMail, onRemoveMail, children, filterBy }) {
    const [isLabelPickerOpen, setIsLabelPickerOpen] = useState(null)

    const navigate = useNavigate()

    function onMailToNote(ev, mail) {
        ev.stopPropagation()
        navigate('/note', { state: { mailToNote: mail } })
    }

    function onTogglLabelPikcer(ev, mailId) {
        ev.stopPropagation()

        if (isLabelPickerOpen === mailId) {
            setIsLabelPickerOpen(null)
        } else {
            setIsLabelPickerOpen(mailId)
        }
    }

    function handleChanges(ev, type, labels) {
        ev.stopPropagation()

        const mail = emails.find(mail => mail.id === isLabelPickerOpen)
        const updateMail = { ...mail, [type]: labels }

        setIsLabelPickerOpen(null)
        saveChanges(updateMail, false, 'labels')
    }

    return (
        <section className='emails-wrapper'>

            <div className='emails-bar flex align-center'>
                {filterBy.status && <div className='folder-name'>{filterBy.status}</div>}
                {children}
            </div>

            <ul className='emails-list clean-list'>
                {emails.length > 0
                    ? (
                        emails.map(mail => {
                            return <li
                                key={mail.id} className='mail-preview'
                                onClick={() => {
                                    onOpenMail(mail.id, (mail.sentAt) ? 'details' : 'edit')
                                    mail.sentAt ? onSetcmpType('details') : onSetcmpType('compose')
                                }}>

                                <MailPreview currMail={mail} saveChanges={saveChanges} mailLabels={mail.labels} >
                                    <div className={`mail-labels ${isLabelPickerOpen ? 'open' : ''} `}>
                                        <span className='fa tag'
                                            onClick={(event) => { onTogglLabelPikcer(event, mail.id) }}>
                                            {isLabelPickerOpen === mail.id &&
                                                <LabelPicker
                                                    labels={mail.labels}
                                                    handleChanges={handleChanges}
                                                />}
                                        </span>
                                    </div>
                                </MailPreview>

                                <div className='more-list-btns'>

                                    <span className='fare note-sticky'
                                        onClick={(event) => onMailToNote(event, mail)}
                                    ></span>

                                    <span className='fare trash'
                                        onClick={(event) => { onRemoveMail(event, mail.id) }}></span>
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
