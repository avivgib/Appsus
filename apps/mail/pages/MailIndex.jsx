import { MailCompose } from '../cmps/MailCompose.jsx';
import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailFilter } from '../cmps/MailFilter.jsx';
import { MailFolderList } from '../cmps/MailFolderList.jsx';
import { MailList } from '../cmps/MailList.jsx';
import { MailSort } from '../cmps/MailSort.jsx';
import { mailService } from '../services/mail.service.js'

const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

export function MailIndex() {

    const [searchParams, setSearchParams] = useSearchParams()
    const [emails, setEmails] = useState(null)
    const [cmpType, setCmpType] = useState('list')
    const [openMail, setOpenMail] = useState({ details: null, edit: null })
    const [unreadEmailsNum, setUnreadEmailsNum] = useState(null)
    const [filterBy, setFilterBy] = useState({ ...mailService.getDefaultFilterBy() })
    const [sortBy, setSortBy] = useState({ ...mailService.getDefaultSortBy() })

    const defaultFilterByRef = useRef({ ...filterBy })
    const defaultSortByRef = useRef({ ...sortBy })

    console.log(emails);


    useEffect(() => {
        loadEmails()
    }, [filterBy, sortBy])

    useEffect(() => {
        loadUnreadStats()
    }, [])


    useEffect(() => {
        console.log(searchParams);
        if (searchParams.size > 0) {
            setCmpType('compose')
        }
    }, [searchParams])


    function loadEmails() {
        mailService.query(filterBy, sortBy)
            .then(emails => setEmails(emails))
            .catch(error => console.error(error))
    }

    function loadUnreadStats() {
        mailService.calculateUnreadMails()
            .then(res => setUnreadEmailsNum(res))
    }

    function onOpenMail(mailId, type) {
        const mail = emails.find(mail => mail.id === mailId)
        if (!mail.isRead) onToggleIsRead(null, mailId)

        setOpenMail(prev => ({ ...prev, [type]: mail }))
    }

    function onGoingBack(type) {
        setOpenMail(prev => ({ ...prev, [type]: null }))
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
                if (mail.sentAt && filterBy.status === 'sent') {
                    setEmails(prev => ([mail, ...prev]))
                }

                if (!mail.isRead) {
                    updateUnreadEmailsNum(1, false, mail)
                }

                onSetcmpType('list')
                return
            })
            .catch(error => console.log(error))
    }

    function onSetStatusInFilterBy(statusType) {
        setFilterBy(prev => ({ ...defaultFilterByRef.current, status: statusType }))
        setSortBy(prev => ({ ...defaultSortByRef.current }))
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
        const status = getMailStatus(mail)
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

    function onSetSortBy(sortBy) {
        setSortBy(prev => ({ ...sortBy }))
    }

    function onToggleIsStared(ev, mailId) {
        if (ev) {
            ev.stopPropagation()
        }
        const currMail = emails.find(mail => mail.id === mailId)

        mailService.save({ ...currMail, isStared: !currMail.isStared })
            .then(currMail => {
                setEmails(prev => {
                    return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                })
            })
            .catch(error => console.error(error))
    }

    function updateMailLabels(mailId, labels) {
        const mail = emails.find(mail => mail.id === mailId)
        const updatedMail = { ...mail, lables: labels }
        console.log(updatedMail);
        mailService.save(updatedMail)
            .then(updatedMail => setEmails(prev => prev.map(mail => mail.id === updatedMail.id ? updatedMail : mail)))
            .catch(error => console.log(error))
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
                onOpenMail={onOpenMail}
                onToggleIsRead={onToggleIsRead}
                openMail={openMail}
                onGoingBack={onGoingBack}
                onSaveMail={onSaveMail}
                onRemoveMail={onRemoveMail}
                onToggleIsStared={onToggleIsStared}
                searchParams={searchParams}
                updateMailLabels={updateMailLabels}
            >
                <MailFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <MailSort sortBy={sortBy} onSetSortBy={onSetSortBy} filterBy={filterBy} />
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

