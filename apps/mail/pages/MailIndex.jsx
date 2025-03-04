import { MailCompose } from '../cmps/MailCompose.jsx';
import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailFilter } from '../cmps/MailFilter.jsx';
import { MailFolderList } from '../cmps/MailFolderList.jsx';
import { MailList } from '../cmps/MailList.jsx';
import { MailSideNav } from '../cmps/MailSideNav.jsx';
import { MailSort } from '../cmps/MailSort.jsx';
import { mailService } from '../services/mail.service.js'

const { useState, useEffect, useRef } = React
const { useSearchParams } = ReactRouterDOM

export function MailIndex() {

    const [emails, setEmails] = useState(null)

    const [unreadEmailsCount, setUnreadEmailsCount] = useState(null)

    const [filterBy, setFilterBy] = useState({ ...mailService.getDefaultFilterBy() })
    const [sortBy, setSortBy] = useState({ ...mailService.getDefaultSortBy() })

    const [openMail, setOpenMail] = useState({ details: null, edit: null })

    const [cmpType, setCmpType] = useState('list')
    const [searchParams, setSearchParams] = useSearchParams()

    const defaultFilterByRef = useRef({ ...filterBy })
    const defaultSortByRef = useRef({ ...sortBy })


    useEffect(() => {
        loadEmails()
    }, [filterBy, sortBy])

    useEffect(() => {
        loadUnreadStats()
    }, [])

    useEffect(() => {
        if (searchParams.size > 0) {
            setCmpType('compose')
        }
    }, [searchParams])

    function loadEmails() { // LIST
        mailService.query(filterBy, sortBy)
            .then(emails => setEmails(emails))
            .catch(error => console.error(error))
    }

    function loadUnreadStats() { // LIST
        mailService.calculateUnreadMails()
            .then(res => setUnreadEmailsCount(res))
    }

    function onSaveMail(mail) {  // CREATE 
        mailService.save(mail)
            .then(currMail => {
                if (currMail.sentAt && filterBy.status === 'sent') {
                    setEmails(prev => ([currMail, ...prev]))
                }

                if (!currMail.sentAt && !filterBy.status !== 'sent' || currMail.id && !filterBy.status !== 'inbox') {
                    setEmails(prev => {
                        return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                    })
                }

                if (!currMail.isRead) {
                    updateunreadEmailsCount(1, false, currMail)
                }

                onSetcmpType('list')
                return
            })
            .catch(error => console.log(error))
    }

    function autoSave(mail) {
        return mailService.save(mail)
            .then(currMail => {


                if (currMail.id && !filterBy.status !== 'sent' || currMail.id && !filterBy.status !== 'inbox') {
                    setEmails(prev => {
                        return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                    })
                }

                if (!currMail.isRead) {
                    updateunreadEmailsCount(1, false, mail)
                }


                return currMail
            })
            .catch(error => console.log(error))
    }

    function onRemoveMail(ev, mailId) { // DELETE
        ev.stopPropagation()
        const mail = emails.find(mail => mail.id === mailId)

        if (mail.removedAt) {
            mailService.remove(mailId)
                .then(res => {
                    setEmails(prev => prev.filter(mail => mail.id !== mailId))

                    if (!mail.isRead) {
                        updateunreadEmailsCount(-1, false, mail)
                    }

                    return onSetcmpType('list')
                })
                .catch(error => console.error(error))
        } else {
            mailToTrash(mail)
        }
    }


    function mailToTrash(mail) {
        const updateMail = { ...mail, removedAt: Date.now() }

        mailService.save(updateMail)
            .then(updateMail => {
                setEmails(prev => {
                    return prev.map(mail => (mail.id === updateMail.id) ? updateMail : mail)
                })
                setEmails(prev => prev.filter(mail => mail.id !== updateMail.id))

                if (!mail.isRead) {
                    updateunreadEmailsCount(-1, true, mail)
                }

                return onSetcmpType('list')
            })
    }

    function saveChanges(mail, isReadUpdate) {  /// UPDATE
        console.log(mail);

        if (isReadUpdate) {
            updateunreadEmailsCount(mail.isRead ? -1 : 1, false, mail)
        }

        mailService.save(mail)
            .then(currMail => {
                setEmails(prev => {
                    return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                })
            })
            .catch(error => console.error(error))
    }

    /// open and close mail fnc

    function onOpenMail(mailId, type) { //READ
        const mail = emails.find(mail => mail.id === mailId)

        const mailUpdate = (mail.isRead) ? { ...mail } : { ...mail, isRead: true }

        console.log(mailUpdate.isRead);

        saveChanges(mailUpdate, mailUpdate.isRead) // UPDATE
        setOpenMail(prev => ({ ...prev, [type]: mailUpdate }))
    }

    function onGoingBack(type) {
        setOpenMail(prev => ({ ...prev, [type]: null }))
    }

    /// update the read unread mail stats

    function updateunreadEmailsCount(dif, isToTrash, mail) {
        const status = getMailStatus(mail)

        // console.log(mail);
        // console.log(unreadEmailsCount[status]);

        if (unreadEmailsCount[status] + dif > emails.length ||
            unreadEmailsCount[status] + dif < 0) return

        if (isToTrash) {
            setUnreadEmailsCount(prev => ({
                ...prev,
                [status]: unreadEmailsCount[status] + dif,
                trash: unreadEmailsCount.trash + 1
            }))
        } else {
            setUnreadEmailsCount(prev => ({
                ...prev,
                [status]: unreadEmailsCount[status] + dif
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

    /// filter & sort fnc

    function onSetFilterBy(filterBy) {
        setFilterBy(prev => ({ ...filterBy }))
    }

    function onSetSortBy(sortBy) {
        setSortBy(prev => ({ ...sortBy }))
    }

    // When a folder is selected, an action updates the status but resets the filter and sort
    function onSetStatusInFilterBy(statusType) {
        setFilterBy(prev => ({ ...defaultFilterByRef.current, status: statusType }))
        setSortBy(prev => ({ ...defaultSortByRef.current }))
    }

    // set the DynamicCmp type

    function onSetcmpType(cmpType) {
        setCmpType(cmpType)
    }


    return (
        <section className="mail-index main-gmail-layout">

            <MailFolderList
                onSetcmpType={onSetcmpType}
                onSetStatusInFilterBy={onSetStatusInFilterBy}
                filterBy={filterBy}
                unreadEmailsCount={unreadEmailsCount}
            />


            {emails && <DynamicCmp
                cmpType={cmpType}
                onSetcmpType={onSetcmpType}
                emails={emails}

                onOpenMail={onOpenMail}
                openMail={openMail}
                onGoingBack={onGoingBack}

                onSaveMail={onSaveMail}
                autoSave={autoSave}
                onRemoveMail={onRemoveMail}

                searchParams={searchParams}
                saveChanges={saveChanges}
            >
                <MailFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <MailSort sortBy={sortBy} onSetSortBy={onSetSortBy} filterBy={filterBy} />

            </DynamicCmp>}


            {!emails && <img className='loader' src="assets/images/loading.gif" alt="load" />}

            <MailSideNav />

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

