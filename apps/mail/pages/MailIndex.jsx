import { mailService } from '../services/mail.service.js'
const { useState, useEffect, useRef } = React

export function MailIndex() {

    const [emails, setEamils] = useState(null)
    console.log(emails);

    useEffect(() => {
        loadEmails()
    }, [])

    function loadEmails() {
        mailService.query()
            .then(emails => setEamils(emails))
            .catch(error => console.error(error))
    }

    if (!emails) return 'loading...'
    return (
        <section className="container">
            Emails
        </section>
    )
}

