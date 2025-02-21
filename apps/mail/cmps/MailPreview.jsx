
export function MailPreview({ mail }) {

    const { from, subject, body, sentAt } = mail

    return (
        <React.Fragment>
            <div className='sent-from'>{from}</div>
            <div className='mail-subject'>{subject} - <span>{body}</span> </div>
            <div className='gap'></div>
            <div className='sentat' >{new Date(sentAt).toDateString()}</div>
        </React.Fragment>
    )
}