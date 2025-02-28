const { useState, useEffect, useRef } = React

export function MailDetails({ onSetcmpType, openMail, onRemoveMail, onGoingBack }) {

    console.log(openMail.details);


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
                    <div className='mail-header flex'>
                        <span className='mail-from'>{from}</span>
                        <span className='mail-sentat'>{new Date(sentAt).toLocaleDateString()}</span>
                    </div>
                    <div className='mail-to'>{to}</div>
                    <div className='mail-body'><pre>{body}</pre></div>
                </div>
                <div className='details-footer'></div>
            </div>
        </section >
    )
}