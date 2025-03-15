import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js';
import { MailCompose } from '../cmps/MailCompose.jsx';
import { MailDetails } from '../cmps/MailDetails.jsx';
import { MailFolderList } from '../cmps/MailFolderList.jsx';
import { MailHeader } from '../cmps/MailHeader.jsx';
import { MailList } from '../cmps/MailList.jsx';
import { MailSideNav } from '../cmps/MailSideNav.jsx';
import { MailSort } from '../cmps/MailSort.jsx';
import { mailService } from '../services/mail.service.js'


const { useState, useEffect, useRef } = React
const { useSearchParams, useLocation, useNavigate } = ReactRouterDOM

export function MailIndex() {

    const navigate = useNavigate()

    const [emails, setEmails] = useState(null)
    const [unreadEmailsCount, setUnreadEmailsCount] = useState(null)

    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [openMail, setOpenMail] = useState({ details: null, edit: null })
    const [noteToMail, setNoteToMail] = useState(null)

    const [isFoldersClose, setIsFoldersClose] = useState(false)
    const [cmpType, setCmpType] = useState('list')

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState({ ...mailService.getFilterFromSearchParams(searchParams) })
    const [sortBy, setSortBy] = useState({ ...mailService.getDefaultSortBy() })

    const defaultFilterByRef = useRef({ ...mailService.getDefaultFilterBy() })
    const defaultSortByRef = useRef({ ...sortBy })

    const location = useLocation()

    useEffect(() => {
        setSearchParams(filterBy)
        loadEmails()
    }, [filterBy, sortBy])

    useEffect(() => {
        loadUnreadStats()
    }, [])

    useEffect(() => {
        if (location.state) {
            if (Object.hasOwn(location.state, 'noteToMail')) {
                const { noteToMail } = location.state
                setNoteToMail(noteToMail)
            }
        }
    }, [location.state])


    function loadEmails() { // LIST
        mailService.query(filterBy, sortBy)
            .then(emails => setEmails(emails))
            .catch(error => console.error(error))
            .finally(() => { if (noteToMail) onToggleCompose(true) })
    }

    function loadUnreadStats() { // LIST
        mailService.calculateUnreadMails()
            .then(res => setUnreadEmailsCount(res))
    }

    function onSaveMail(mail) {  // CREATE 
        mailService.save(mail)
            .then(currMail => {
                setEmails(prev => {

                    if (currMail.sentAt && filterBy.status === 'sent') {
                        return [currMail, ...prev]
                    } else if (currMail.sentAt && filterBy.status !== 'sent') {
                        return prev.filter(mail => mail.id !== currMail.id)
                    }

                    if (!currMail.sentAt && filterBy.status !== 'sent' || currMail.id && filterBy.status !== 'inbox') {
                        const isMailExists = prev.some(mail => mail.id === currMail.id)

                        if (isMailExists) {
                            return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                        } else if (!isMailExists && filterBy.status === 'draft') {
                            return [currMail, ...prev]
                        }
                    }

                    return prev
                })


                if (!currMail.isRead) {
                    updateunreadEmailsCount(1, false, currMail)
                }

                if (currMail.sentAt) {
                    showSuccessMsg('The mail has been sent')
                } else {
                    showSuccessMsg('The mail has been saved')
                }

                return
            })
            .catch(error => {
                console.log(error)
                showErrorMsg(`couldn't sent mail`)
            })
    }

    function autoSave(savedMail) {
        return mailService.save(savedMail)
            .then(currMail => {

                setEmails(prev => {
                    const isMailExists = prev.some(mail => mail.id === currMail.id)

                    if (isMailExists) {
                        return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                    } else if (!isMailExists && filterBy.status === 'draft') {
                        return [currMail, ...prev]
                    }

                    return prev

                })


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
                    showSuccessMsg('The mail has been removed')

                    return onSetcmpType('list')
                })
                .catch(error => {
                    console.error(error)
                    showErrorMsg(`couldn't remove mail`)
                })
        } else {
            mailToTrash(mail)
        }
    }

    function mailToTrash(mail) {
        const updateMail = { ...mail, removedAt: Date.now() }

        mailService.save(updateMail)
            .then(updateMail => {
                setEmails(prev => prev.filter(mail => mail.id !== updateMail.id))

                if (!mail.isRead) {
                    updateunreadEmailsCount(-1, true, mail)
                }

                showSuccessMsg('The mail has been moved to the trash')

                return onSetcmpType('list')
            })
            .catch(error => {
                console.error(error)
                showErrorMsg(`couldn't remove mail`)
            })
    }

    function onRemoveDraftMail(draftMail) {
        mailService.remove(draftMail.id)
            .then(res => {
                setEmails(prev => prev.filter(mail => mail.id !== draftMail.id))


                if (!draftMail.isRead) {
                    updateunreadEmailsCount(-1, false, draftMail)
                }

                showSuccessMsg('The draft has been removed')

                return onSetcmpType('list')
            })
            .catch(error => {
                console.error(error)
                showErrorMsg(`couldn't remove draft`)
            })
    }

    function saveChanges(mail, isReadUpdate, type) {  /// UPDATE

        if (isReadUpdate) {
            updateunreadEmailsCount(mail.isRead ? -1 : 1, false, mail)
        }

        mailService.save(mail)
            .then(currMail => {
                if (filterBy.status === 'star' && !currMail.isStared) {
                    setEmails(prev => prev.filter(mail => mail.id !== currMail.id))

                } else {
                    setEmails(prev => {
                        return prev.map(mail => (mail.id === currMail.id) ? currMail : mail)
                    })
                }

                if (type === 'labels') {
                    showSuccessMsg('The mail labels have been saved')
                } else if (type === 'isRead') {
                    const msg = (mail.isRead) ? 'The email has been marked as read' : 'The email has been marked as unread'
                    showSuccessMsg(msg)
                }

            })
            .catch(error => {
                console.error(error)

                if (type === 'labels') {
                    showSuccessMsg(`couldn't save labels`)
                } else if (type === 'isRead') {
                    showSuccessMsg(`couldn't save read stats`)
                }
            })
    }

    /// open and close mail fnc

    function onOpenMail(mailId, type) { //READ
        const mail = emails.find(mail => mail.id === mailId)

        const mailUpdate = (mail.isRead) ? { ...mail } : { ...mail, isRead: true }


        if (mail.isRead === false) {
            saveChanges(mailUpdate, mailUpdate.isRead)  // UPDATE
        }

        setOpenMail(prev => ({ ...prev, [type]: mailUpdate }))

        if (type === 'edit') {
            setIsComposeOpen(true)
        }
    }

    function onToggleCompose(isOpen) {
        setIsComposeOpen(isOpen)
    }

    function onGoingBack(type) {
        setOpenMail(prev => ({ ...prev, [type]: null }))

        if (type === 'edit') {
            setIsComposeOpen(false)
        }
    }

    function onNavigateBetweenEmails(mailId, dif) {
        const Idx = emails.findIndex(mail => mail.id === mailId)
        var currIdx = Idx + dif
        if (currIdx < 0) currIdx = emails.length - 1
        else if (currIdx > emails.length - 1) currIdx = 0
        const currMailId = emails[currIdx].id
        onOpenMail(currMailId, 'details')
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

        if (window.innerWidth < 850) {
            navigate('/mail')
        }
    }

    // set the DynamicCmp type

    function onSetcmpType(cmpType) {
        setCmpType(cmpType)
        if (window.innerWidth < 850) {
            setIsFoldersClose(false)
        }
    }

    // open and close folders

    function onToggleFolders() {
        setIsFoldersClose(prev => prev = !isFoldersClose)
    }

    function onClosefolders() {
        if (window.innerWidth < 850) {
            setIsFoldersClose(false)
        }
    }

    //  rest note to mail
    function resetNoteToMail() {
        setNoteToMail(null)
    }


    return (
        <section className="mail-index main-gmail-layout">

            <MailHeader
                isFoldersClose={isFoldersClose}
                onToggleFolders={onToggleFolders}
                filterBy={filterBy}
                onSetFilterBy={onSetFilterBy}
                defaultFilterByRef={defaultFilterByRef}
            />

            <MailFolderList
                onSetcmpType={onSetcmpType}
                onSetStatusInFilterBy={onSetStatusInFilterBy}
                filterBy={filterBy}
                unreadEmailsCount={unreadEmailsCount}
                onClosefolders={onClosefolders}
                onToggleCompose={onToggleCompose}
            />


            {emails && <DynamicCmp
                cmpType={cmpType}
                onSetcmpType={onSetcmpType}
                emails={emails}

                onOpenMail={onOpenMail}
                openMail={openMail}
                onGoingBack={onGoingBack}
                onNavigateBetweenEmails={onNavigateBetweenEmails}
                onRemoveMail={onRemoveMail}

                searchParams={searchParams}
                saveChanges={saveChanges}

                filterBy={filterBy}
            >
                <MailSort sortBy={sortBy} onSetSortBy={onSetSortBy} filterBy={filterBy} />

            </DynamicCmp>}


            {!emails && <img className='loader' src="assets/images/loading.gif" alt="load" />}

            <MailSideNav />


            {isComposeOpen && <MailCompose
                onSaveMail={onSaveMail}
                autoSave={autoSave}
                openMail={openMail}
                onGoingBack={onGoingBack}
                onToggleCompose={onToggleCompose}
                noteToMail={noteToMail}
                resetNoteToMail={resetNoteToMail}
                onRemoveDraftMail={onRemoveDraftMail}
            />}

        </section>
    )
}

function DynamicCmp({ cmpType, ...prop }) {
    switch (cmpType) {
        case 'list':
            return <MailList {...prop} />
        // case 'compose':
        //     return <MailCompose {...prop} />
        case 'details':
            return <MailDetails  {...prop} />
        default:
            null;
    }
}

