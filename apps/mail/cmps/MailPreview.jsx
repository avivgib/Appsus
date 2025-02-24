
export function MailPreview({ mail, status }) {


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

    function setSentFrom(status) {
        switch (status) {
            case 'inbox': return <span>{from}</span>
            case 'sent': return <span>{`to: ${to}`}</span>
            case 'draft': return <span style={{ color: 'var(--gl-font3)' }}>Draft</span>
            case 'trash': return from
        }
    }

    const { from, to, subject, body, sentAt, createdAt } = mail

    return (
        <React.Fragment>
            <div className='icon'><img src="assets/images/use-icon.jpg" alt="use-icon" className='usr-icon' /></div>
            < div className='sent-from'>{setSentFrom(status)}</div>
            <div className='mail-content'><span className='mail-subject'>{subject}</span> <span>{body}</span> </div>
            <div className='gap'></div>
            <div className='sentat' >
                {status === 'draft' ? setSentAtDateDisplay(createdAt) : setSentAtDateDisplay(sentAt)}
            </div>
        </React.Fragment >
    )
}