import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailList } from '../cmps/MailList.jsx';
import { mailService } from '../services/mail.service.js'

const { useState, useEffect, useRef } = React

export function MailIndex() {

    const [emails, setEamils] = useState(null)
    const [openMail, setOpenMail] = useState(null)

    useEffect(() => {
        loadEmails()
    }, [])

    function loadEmails() {
        mailService.query()
            .then(emails => setEamils(emails))
            .catch(error => console.error(error))
    }

    function onOpenMailDetails(mailId) {
        const mail = emails.find(mail => mail.id === mailId)
        setOpenMail(mail)
    }

    function onGoingBack() {
        setOpenMail(null)
    }

    if (!emails) return 'loading...'
    return (
        <section className="gmail">
            <MailList emails={emails} onOpenMailDetails={onOpenMailDetails} />
            {openMail && <MailDetails openMail={openMail} onGoingBack={onGoingBack} />}
        </section>
    )
}

