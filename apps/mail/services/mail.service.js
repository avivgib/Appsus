import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

export const mailService = {
    query,
    get,
    remove,
    save,
    getDefaultFilterBy,
    getEmptyMail,
    getUserMail,
    calculateUnreadMails,
    getDefaultSortBy,
}

const EMAILS_KEY = 'emails_key'
_createBooks()

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

function query(filterBy, sortBy) {
    return storageService.query(EMAILS_KEY)
        .then(emails => {

            if (filterBy.status === 'inbox') {
                emails = emails.filter(mail => {
                    return mail.from !== loggedinUser.email && !mail.removedAt && mail.sentAt
                })
            }

            if (filterBy.status === 'star') {
                emails = emails.filter(mail => mail.isStared)
            }

            if (filterBy.status === 'sent') {
                emails = emails.filter(mail => {
                    return mail.from === loggedinUser.email && mail.sentAt && !mail.removedAt
                })
            }

            if (filterBy.status === 'trash') {
                emails = emails.filter(mail => mail.removedAt)
            }

            if (filterBy.status === 'draft') {
                emails = emails.filter(mail => !mail.sentAt && !mail.removedAt)
            }


            if (utilService.getLabels().includes(filterBy.status)) {
                return emails = emails.filter(mail => mail.labels.includes(filterBy.status))
            }



            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                emails = emails.filter(mail => regex.test(mail.subject) || regex.test(mail.body))
            }

            if (filterBy.isRead !== '') {
                if (filterBy.isRead) {
                    emails = emails.filter(mail => mail.isRead)
                } else {
                    emails = emails.filter(mail => !mail.isRead)
                }
            }


            if (sortBy.date) {
                emails = emails.sort((e1, e2) => {
                    const e1Date = (e1.sentAt) ? e1.sentAt : e1.createdAt
                    const e2Date = (e2.sentAt) ? e2.sentAt : e2.createdAt
                    return (e1Date - e2Date) * sortBy.date
                })
            }

            if (sortBy.title) {
                emails = emails.sort((e1, e2) => e1.subject.localeCompare(e2.subject) * sortBy.title)
            }

            return emails
        })
}

function getUserMail() {
    return loggedinUser.email
}

function get(mailId) {
    return storageService.get(EMAILS_KEY, mailId)
}

function remove(mailId) {
    return storageService.remove(EMAILS_KEY, mailId)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(EMAILS_KEY, mail)
    } else {
        return storageService.post(EMAILS_KEY, mail)
    }
}

function getDefaultFilterBy() {
    return {
        status: 'inbox',
        txt: '',
        isRead: '',
        isStared: null,
        labels: [],
    }
}

function getDefaultSortBy() {
    return {
        date: -1,
    }
}


function getEmptyMail() {
    return {
        createdAt: null,
        subject: '',
        body: '',
        isRead: true,
        sentAt: null,
        removedAt: null,
        isStared: null,
        labels: [],
        from: loggedinUser.email,
        to: ''
    }
}

function _createBooks() {
    const emails = utilService.loadFromStorage(EMAILS_KEY)
    if (!emails || !emails.length) _creatDemoEmails()
}

function _creatDemoEmails() {
    const emails = _getEmailsDemoData()
    utilService.saveToStorage(EMAILS_KEY, emails)
}


function calculateUnreadMails() {
    return storageService.query(EMAILS_KEY)
        .then(emails => {
            return emails.reduce((acc, mail) => {
                if (mail.from !== loggedinUser.email && !mail.removedAt && !mail.isRead) acc.inbox++
                else if (mail.from === loggedinUser.email && mail.sentAt && !mail.removedAt && !mail.isRead) acc.sent++
                else if (!mail.sentAt && !mail.removedAt && !mail.isRead) acc.draft++
                else if (mail.removedAt && !mail.isRead) acc.trash++

                return acc
            }, { inbox: 0, sent: 0, trash: 0, draft: 0 })
        })
}

function _getEmailsDemoData() {
    return [
        {
            id: '1',
            createdAt: 1708345600000,
            subject: 'Welcome to Our Newsletter!',
            body: 'Thank you for subscribing to our newsletter. Stay tuned for exciting updates and offers!',
            isRead: false,
            sentAt: Date.now(),
            removedAt: null,
            isStared: true,
            labels: [],
            from: 'newsletter@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '2',
            createdAt: 1708259200000,
            subject: 'Meeting Reminder',
            body: 'Don\'t forget about our meeting scheduled for tomorrow at 10:00 AM.',
            isRead: true,
            sentAt: 1738368000000,
            removedAt: null,
            isStared: null,
            labels: [],
            from: 'hr@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '3',
            createdAt: 1708172800000,
            subject: 'Invoice #12345',
            body: 'Please find attached the invoice for your recent purchase. Let us know if you have any questions.',
            isRead: false,
            labels: [],
            sentAt: 1708172800000,
            removedAt: 1708172800000,
            isStared: true,
            from: 'billing@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '4',
            createdAt: 1708086400000,
            subject: 'Project Update',
            body: 'The latest project updates have been uploaded to the shared drive. Please review them before our next call.',
            isRead: true,
            sentAt: null,
            removedAt: null,
            isStared: null,
            labels: [],
            from: 'user@appsus.com',
            to: 'manager@example.com'
        }, {
            id: '5',
            createdAt: 1708086400000,
            subject: 'where is the money?',
            body: 'Bring me all your money!!',
            isRead: false,
            sentAt: 1708086400000,
            removedAt: null,
            isStared: null,
            labels: [],
            from: 'user@appsus.com',
            to: 'manager@example.com'
        }
    ]
}