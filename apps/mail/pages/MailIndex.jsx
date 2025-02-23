import { MailCompose } from '../cmps/MailCompose.jsx';
import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailFolderList } from '../cmps/MailFolderList.jsx';
import { MailList } from '../cmps/MailList.jsx';
import { mailService } from '../services/mail.service.js'

const { useState, useEffect, useRef } = React

export function MailIndex() {


    const [emails, setEamils] = useState(null)
    const [openMail, setOpenMail] = useState(null)
    const [unreadEmailsNum, setUnreadEmailsNum] = useState({ inbox: 0, sent: 0, trash: 0, draft: 0 })
    const [filterBy, setFilterBy] = useState({ ...mailService.getDefaultFilterBy() })
    console.log(unreadEmailsNum);


    useEffect(() => {
        loadEmails()
    }, [filterBy])

    useEffect(() => {
        if (emails) {
            calculateUnreadMails(emails)
        }
    }, [emails])

    function loadEmails() {
        mailService.query(filterBy)
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

    // function onSetFilterBy({ target }) {
    //     const { name, value } = target
    // }

    function onSetStatusInFilterBy(statusTyep) {
        setFilterBy(prev => ({ ...prev, status: statusTyep }))
    }



    if (!emails) return 'loading...'
    return (
        <section className="mail-index main-layout">
            <MailList
                emails={emails}
                onOpenMailDetails={onOpenMailDetails}
                onToggleIsRead={onToggleIsRead} />
            <MailFolderList
                onSetStatusInFilterBy={onSetStatusInFilterBy}
                filterBy={filterBy} />

            {/* <MailCompose />
            {openMail && <MailDetails openMail={openMail} onGoingBack={onGoingBack} />} */}
        </section>
    )
}

