import { MailCompose } from '../cmps/MailCompose.jsx';
import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailFolderList } from '../cmps/MailFolderList.jsx';
import { MailList } from '../cmps/MailList.jsx';
import { mailService } from '../services/mail.service.js'

const { useState, useEffect, useRef } = React

export function MailIndex() {

    const [emails, setEmails] = useState(null)
    const [cmpType, setCmpType] = useState('list')
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

    function onSaveMail(mail) {
        mailService.save(mail)
            .then(mail => {
                console.log('mail send')
                if (filterBy.status === 'sent') {
                    setEmails(prev => ([mail, ...prev]))
                }
                setUnreadEmailsNum(prev => ({
                    ...prev, sent: unreadEmailsNum.sent + 1
                }))
                return
            })
            .catch(error => console.log(error))
            .finally(() => {
                onSetcmpType('list')
            })
    }

    function onGoingBack() {
        setOpenMail(null)
    }

    function onSetStatusInFilterBy(statusTyep) {
        setFilterBy(prev => ({ ...prev, status: statusTyep }))
    }

    function onSetcmpType(cmpType) {
        setCmpType(cmpType)
    }


    if (!emails) return 'loading...'
    return (
        <section className="mail-index main-layout">
            <MailFolderList
                onSetcmpType={onSetcmpType}
                onSetStatusInFilterBy={onSetStatusInFilterBy}
                filterBy={filterBy}
                unreadEmailsNum={unreadEmailsNum}
            />

            <DynamicCmp
                cmpType={cmpType}
                onSetcmpType={onSetcmpType}
                emails={emails}
                onOpenMailDetails={onOpenMailDetails}
                onToggleIsRead={onToggleIsRead}
                openMail={openMail}
                onGoingBack={onGoingBack}
                onSaveMail={onSaveMail}
            />

        </section>
    )
}

function DynamicCmp({ cmpType, ...prop }) {
    switch (cmpType) {
        case 'list':
            return <MailList {...prop} />
        case 'compose':
            return <MailCompose {...prop} />
        case 'details':
            return <MailDetails  {...prop} />
        default:
            null;
    }
}
