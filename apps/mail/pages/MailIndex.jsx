import { MailCompose } from '../cmps/MailCompose.jsx';
import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailFilter } from '../cmps/MailFilter.jsx';
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

    console.log(filterBy);


    const defaultFilterByRef = useRef({ ...filterBy })

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
        if (!mail.isRead) onToggleIsRead(null, mailId)
        setOpenMail(mail)
    }

    function onToggleIsRead(ev, mailId) {
        if (ev) {
            ev.stopPropagation()
        }
        const currMail = emails.find(mail => mail.id === mailId)

        mailService.save({ ...currMail, isRead: !currMail.isRead })
            .then(currMail => {
                setEmails(prev => {
                    return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                })

                updateUnreadEmailsNum(currMail.isRead ? -1 : 1, false, currMail)
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

    function onSetStatusInFilterBy(statusType) {
        setFilterBy(prev => ({ ...defaultFilterByRef.current, status: statusType }))
    }

    function onSetcmpType(cmpType) {
        setCmpType(cmpType)
    }


    function onRemoveMail(ev, mailId) {
        ev.stopPropagation()
        const mail = emails.find(mail => mail.id === mailId)
        if (mail.removedAt) {
            mailService.remove(mailId)
                .then(res => {
                    setEmails(prev => prev.filter(mail => mail.id !== mailId))

                    if (!mail.isRead) {
                        updateUnreadEmailsNum(-1, false, mail)
                    }

                    return onSetcmpType('list')
                })
                .catch(error => console.error(error))
        } else {
            const updateMail = { ...mail, removedAt: Date.now() }
            mailService.save(updateMail)
                .then(updateMail => {
                    setEmails(prev => {
                        return prev.map(mail => (mail.id === updateMail.id) ? updateMail : mail)
                    })
                    setEmails(prev => prev.filter(mail => mail.id !== mailId))

                    if (!mail.isRead) {
                        updateUnreadEmailsNum(-1, true, mail)
                    }

                    return onSetcmpType('list')
                })
        }
    }

    function updateUnreadEmailsNum(dif, isToTrash, mail) {
        const status = (filterBy.status) ? filterBy.status : getMailStatus(mail)
        console.log(mail);
        console.log(unreadEmailsNum[status]);


        if (isToTrash) {
            setUnreadEmailsNum(prev => ({
                ...prev,
                [status]: unreadEmailsNum[status] + dif,
                trash: unreadEmailsNum.trash + 1
            }))
        } else {
            setUnreadEmailsNum(prev => ({
                ...prev,
                [status]: unreadEmailsNum[status] + dif
            }))
        }
    }

    function getMailStatus(mail) {
        var status = ''
        const usrEmail = mailService.getUserMail()
        if (mail.from !== usrEmail && !mail.removedAt) status = 'inbox'
        else if (mail.from === usrEmail && mail.sentAt && !mail.removedAt) status = 'sent'
        else if (!mail.sentAt && !mail.removedAt) status = 'draft'
        else if (mail.removedAt) status = 'trash'
        return status
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prev => ({ ...filterBy }))
    }

    return (
        <section className="mail-index main-layout">

            <MailFolderList
                onSetcmpType={onSetcmpType}
                onSetStatusInFilterBy={onSetStatusInFilterBy}
                filterBy={filterBy}
                unreadEmailsNum={unreadEmailsNum} />


            {emails && <DynamicCmp
                cmpType={cmpType}
                onSetcmpType={onSetcmpType}
                emails={emails}
                onOpenMailDetails={onOpenMailDetails}
                onToggleIsRead={onToggleIsRead}
                openMail={openMail}
                onGoingBack={onGoingBack}
                onSaveMail={onSaveMail}
                onRemoveMail={onRemoveMail}
            >
                <MailFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            </DynamicCmp>}


            {!emails && <img className='loader' src="assets/images/loading.gif" alt="load" />}

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
