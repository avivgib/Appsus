import { LabelPicker } from "../../../cmps/LabelPicker.jsx"

const { useState, useEffect, useRef } = React

export function MailDetails({ onSetcmpType, openMail, onRemoveMail, onGoingBack, saveChanges }) {

    const [mailDetails, setMailDetails] = useState({ ...openMail.details })
    const [isLabelPickerOpen, setIsLabelPickerOpen] = useState(false)


    function handleChanges(ev, type, labels) {
        ev.stopPropagation()

        var updateMail = {}

        if (type === 'labels') {
            updateMail = { ...mailDetails, labels: labels }
            setIsLabelPickerOpen(!isLabelPickerOpen)
        } else {
            updateMail = { ...mailDetails, [type]: !mailDetails[type] }
        }
        setMailDetails(updateMail)

        const isReadUpdate = (type === 'isRead') ? true : false
        saveChanges(updateMail, isReadUpdate, type)
    }

    function onTogglLabelPikcer(ev) {
        ev.stopPropagation()

        setIsLabelPickerOpen(!isLabelPickerOpen)
    }


    const dateOption = { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }

    useEffect(() => {
        return (() => { onGoingBack('details') })
    }, [])

    const { id, subject, body, sentAt, from, to, isRead, isStared, labels } = mailDetails

    return (
        <section className='mail-details'>
            <div className='details-header-bar flex space-between align-center '>
                <div className='details-btn'>
                    <span className='fa arrow-left' onClick={() => { onSetcmpType('list') }}></span>

                    <span className='fa tag'
                        onClick={onTogglLabelPikcer}>
                        {isLabelPickerOpen &&
                            <LabelPicker
                                labels={labels}
                                handleChanges={handleChanges}
                            />}
                    </span>

                    <span
                        className={`${isStared ? 'fa star' : 'fare star'}`}
                        onClick={(event) => { handleChanges(event, 'isStared') }}>
                    </span>

                    <span
                        className={`fare ${isRead ? 'envelope-open' : 'envelope'}`}
                        onClick={(event) => handleChanges(event, 'isRead')}>
                    </span>

                    <span className='fare trash' onClick={(event) => { onRemoveMail(event, id) }}></span>

                </div>
            </div>
            <div className='mail-wrapper'>
                <div className='mail-subject'>
                    {subject}
                    {labels.length > 0
                        ? labels.map(label => {
                            return <span key={label} className='mail-label'>{label}</span>
                        })
                        : ''}
                </div>
                <div className='mail-content'>
                    <div className='icon'><img src="assets/images/use-icon.jpg" alt="use-icon" className='usr-icon' /></div>
                    <div className='mail-head flex'>
                        <span className='mail-from'>{from}</span>
                        <span className='mail-sentat'>
                            <span className='sentat-site'>{new Date(sentAt).toLocaleString('en-US', dateOption)}</span>
                            <span className='sentat-mobile'>{new Date(sentAt).toLocaleDateString()}</span>
                        </span>
                    </div>
                    <div className='mail-to'>{to}</div>
                    <div className='mail-body'><pre>{body}</pre></div>
                </div>
                <div className='details-footer'></div>
            </div>
        </section >
    )
}