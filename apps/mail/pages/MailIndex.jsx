import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailList } from '../cmps/MailList.jsx';
import { mailService } from '../services/mail.service.js'

const { useState, useEffect, useRef } = React

export function MailIndex() {

    const [emails, setEamils] = useState(null)
    const [openMail, setOpenMail] = useState(null)
    const [unreadEmailsNum, setUnreadEmailsNum] = useState(null)
    console.log(unreadEmailsNum);


    useEffect(() => {
        loadEmails()
    }, [])

    useEffect(() => {
        if (emails) {
            calculateUnreadMails(emails)
        }
    }, [emails])

    function loadEmails() {
        mailService.query()
            .then(emails => setEamils(emails))
            .catch(error => console.error(error))
    }

    function onOpenMailDetails(mailId) {
        const mail = emails.find(mail => mail.id === mailId)
        if (!mail.isRead) setReadMail(mail)
        setOpenMail(mail)
    }

    function setReadMail(currMail) {

        mailService.save({ ...currMail, isRead: true })
            .then(currMail => {
                setEamils(prev => {
                    return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                })
            })
    }


    function onToggleIsRead(ev, mailId) {
        ev.stopPropagation()
        const currMail = emails.find(mail => mail.id === mailId)

        mailService.save({ ...currMail, isRead: !currMail.isRead })
            .then(currMail => {
                setEamils(prev => {
                    return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                })
            })
            .catch(erroe => console.error(erroe))
    }


    function onGoingBack() {
        setOpenMail(null)
    }

    function calculateUnreadMails(emails) {
        const unreadMails = emails.reduce((acc, mail) => {
            if (!mail.isRead) acc++
            return acc
        }, 0)
        setUnreadEmailsNum(unreadMails)
    }

    if (!emails) return 'loading...'
    return (
        <section className="gmail">
            <MailList
                emails={emails}
                onOpenMailDetails={onOpenMailDetails}
                onToggleIsRead={onToggleIsRead}
                unreadEmailsNum={unreadEmailsNum} />
            {openMail && <MailDetails openMail={openMail} onGoingBack={onGoingBack} />}
        </section>
    )
}

