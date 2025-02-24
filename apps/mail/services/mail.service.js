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
}

const EMAILS_KEY = 'emails_key'
_createBooks()

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

function query(filterBy) {
    return storageService.query(EMAILS_KEY)
        .then(emails => {

            if (filterBy.status === 'inbox') {
                emails = emails.filter(mail => {
                    return mail.from !== loggedinUser.email && !mail.removedAt
                })
            }

            if (filterBy.status === 'sent') {
                emails = emails.filter(mail => {
                    return mail.from === loggedinUser.email && mail.sentAt
                })
            }

            if (filterBy.status === 'trash') {
                emails = emails.filter(mail => mail.removedAt)
            }

            if (filterBy.status === 'draft') {
                emails = emails.filter(mail => !mail.sentAt)
            }

            emails = emails.sort((e1, e2) => e2.sentAt - e1.sentAt)

            return emails
        })
}

function getUserMail() {
    return loggedinUser.email
}

function get(mailId) {
    return storageService.query(EMAILS_KEY, mailId)
}

function remove(mailId) {
    return storageService.query(EMAILS_KEY, mailId)
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
        isRead: null,
        isStared: null,
        lables: [],
    }
}

function getEmptyMail() {
    return {
        createdAt: null,
        subject: '',
        body: '',
        isRead: false,
        sentAt: null,
        removedAt: null,
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
                else if (mail.from === loggedinUser.email && mail.sentAt && !mail.isRead) acc.sent++
                else if (mail.removedAt && !mail.isRead) acc.trash++
                else if (!mail.sentAt && !mail.isRead) acc.draft++
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
            from: 'hr@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '3',
            createdAt: 1708172800000,
            subject: 'Invoice #12345',
            body: 'Please find attached the invoice for your recent purchase. Let us know if you have any questions.',
            isRead: false,
            sentAt: 1708172800000,
            removedAt: 1708172800000,
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
            from: 'user@appsus.com',
            to: 'manager@example.com'
        }
    ]
}