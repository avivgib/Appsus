
export function MailPreview({ mail }) {

    const { from, subject, body, sentAt } = mail

    return (
        <React.Fragment>
            <div className='icon'><img src="assets/images/use-icon.jpg" alt="use-icon" className='usr-icon' /></div>
            <div className='sent-from'>{from}</div>
            <div className='mail-content'><span className='mail-subject'>{subject}</span> <span>{body}</span> </div>
            <div className='gap'></div>
            <div className='sentat' >{new Date(sentAt).toDateString()}</div>
        </React.Fragment>
    )
}