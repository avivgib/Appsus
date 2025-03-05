const { useState, useEffect, useRef } = React

export function MailDetails({ onSetcmpType, openMail, onRemoveMail, onGoingBack }) {

    console.log(openMail.details);

    const dateOption = { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }

    useEffect(() => {
        return (() => { onGoingBack('details') })
    }, [])

    const { id, subject, body, sentAt, from, to } = openMail.details

    return (
        <section className='mail-details'>
            <div className='details-header-bar flex space-between align-center '>
                <span className='fa arrow-left' onClick={() => { onSetcmpType('list') }}></span>
                <span className='fare trash' onClick={(event) => { onRemoveMail(event, id) }}></span>
            </div>
            <div className='mail-wrapper'>
                <div className='mail-subject'>{subject}</div>
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