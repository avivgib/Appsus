import { MailCompose } from '../cmps/MailCompose.jsx';
import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailFolderList } from '../cmps/MailFolderList.jsx';
import { MailList } from '../cmps/MailList.jsx';
import { mailService } from '../services/mail.service.js'

const { useState, useEffect, useRef } = React

export function MailIndex() {

    const [emails, setEmails] = useState(null)
    const [openMail, setOpenMail] = useState(null)
    const [unreadEmailsNum, setUnreadEmailsNum] = useState(null)
    const [filterBy, setFilterBy] = useState({ ...mailService.getDefaultFilterBy() })


    useEffect(() => {
        loadEmails()
    }, [filterBy])

    useEffect(() => {
        loadUnreadStats()
    }, [])


    function loadEmails() {
        mailService.query(filterBy)
            .then(emails => setEmails(emails))
            .catch(error => console.error(error))
    }

    function loadUnreadStats() {
        mailService.calculateUnreadMails()
            .then(res => setUnreadEmailsNum(res))
    }

    function onOpenMailDetails(mailId) {
        const mail = emails.find(mail => mail.id === mailId)
        if (!mail.isRead) setReadMail(mail)
        setOpenMail(mail)
    }

    function setReadMail(currMail) {

        mailService.save({ ...currMail, isRead: true })
            .then(currMail => {
                setEmails(prev => {
                    return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                })
                setUnreadEmailsNum(prev => ({
                    ...prev, [filterBy.status]: unreadEmailsNum[filterBy.status] - 1
                }))
            })
    }


    function onToggleIsRead(ev, mailId) {
        ev.stopPropagation()
        const currMail = emails.find(mail => mail.id === mailId)

        mailService.save({ ...currMail, isRead: !currMail.isRead })
            .then(currMail => {
                setEmails(prev => {
                    return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                })
                setUnreadEmailsNum(prev => ({
                    ...prev, [filterBy.status]: unreadEmailsNum[filterBy.status] + (currMail.isRead ? -1 : 1)
                }))
            })
            .catch(error => console.error(error))
    }


    function onGoingBack() {
        setOpenMail(null)
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
                filterBy={filterBy}
                unreadEmailsNum={unreadEmailsNum}
            />

            {/* <MailCompose />
            {openMail && <MailDetails openMail={openMail} onGoingBack={onGoingBack} />} */}
        </section>
    )
}

