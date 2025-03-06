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
    getFilterFromSearchParams,
    getMailLabels,
}

const EMAILS_KEY = 'emails_key'
_createEmails()

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


            if (getMailLabels().includes(filterBy.status)) {
                return emails = emails.filter(mail => mail.labels.includes(filterBy.status))
            }


            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                emails = emails.filter(mail => regex.test(mail.subject) || regex.test(mail.body))
            }

            if (filterBy.from) {
                const regex = new RegExp(filterBy.from, 'i')
                emails = emails.filter(mail => regex.test(mail.from))
            }

            if (filterBy.subject) {
                const regex = new RegExp(filterBy.subject, 'i')
                emails = emails.filter(mail => regex.test(mail.subject))
            }

            if (filterBy.isRead) {
                emails = emails.filter(mail => mail.isRead)
            }

            if (filterBy.isStared) {
                emails = emails.filter(mail => mail.isStared)
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
        isRead: false,
        isStared: false,
        from: '',
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


function getFilterFromSearchParams(searchParams) {

    const defaultFilterBy = { ...getDefaultFilterBy() }
    const filterBy = {}

    for (const field in defaultFilterBy) {
        if (field === 'status') {
            filterBy[field] = searchParams.get(`${field}`) || defaultFilterBy[field]
        } else if (field === 'isRead' || field === 'isStared') {
            const res = (searchParams.get(`${field}`) === 'true') ? true : defaultFilterBy[field]
            filterBy[field] = res
        } else {
            filterBy[field] = searchParams.get(`${field}`) || defaultFilterBy[field]
        }

    }

    return filterBy
}

function getMailLabels() {
    return ['family', 'work', 'spam', 'friends']
}

function _createEmails() {
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
            labels: ['spam'],
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
            isStared: false,
            labels: ['work'],
            from: 'hr@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '3',
            createdAt: 1708172800000,
            subject: 'Invoice #12345',
            body: 'Please find attached the invoice for your recent purchase. Let us know if you have any questions.',
            isRead: false,
            labels: ['family'],
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
            isStared: false,
            labels: ['work'],
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
            isStared: false,
            labels: ['friends'],
            from: 'user@appsus.com',
            to: 'manager@example.com'
        }, {
            id: '6',
            createdAt: 1708000000000,
            subject: 'Weekly Report',
            body: 'The weekly sales report is attached. Let me know if you need any clarifications.',
            isRead: true,
            sentAt: 1708000000000,
            removedAt: null,
            isStared: false,
            labels: [],
            from: 'sales@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '7',
            createdAt: 1707920000000,
            subject: 'New Job Opportunity',
            body: 'We have an exciting job opportunity that matches your profile. Check out the details inside!',
            isRead: false,
            sentAt: 1707920000000,
            removedAt: null,
            isStared: true,
            labels: ['work'],
            from: 'careers@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '8',
            createdAt: 1707840000000,
            subject: 'Password Reset Request',
            body: 'You have requested a password reset. Click the link below to change your password.',
            isRead: false,
            sentAt: 1707840000000,
            removedAt: null,
            isStared: false,
            labels: ['work'],
            from: 'security@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '9',
            createdAt: 1707760000000,
            subject: 'Your Order Has Shipped!',
            body: 'Great news! Your order has been shipped and is on its way.',
            isRead: true,
            sentAt: 1736899200000,
            removedAt: null,
            isStared: false,
            labels: ['friends'],
            from: 'store@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '10',
            createdAt: 1707680000000,
            subject: 'Upcoming Event: Don\'t Miss Out!',
            body: 'Join us for an exciting event this weekend! RSVP now to reserve your spot.',
            isRead: false,
            sentAt: 1707680000000,
            removedAt: null,
            isStared: true,
            labels: ['friends'],
            from: 'events@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '11',
            createdAt: 1707600000000,
            subject: 'Important Security Alert',
            body: 'We noticed a login attempt from an unknown device. Please review your account security settings.',
            isRead: false,
            sentAt: 1707600000000,
            removedAt: null,
            isStared: false,
            labels: ['family', 'work', 'spam', 'friends'],
            from: 'alerts@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '12',
            createdAt: 1707520000000,
            subject: 'Flash Sale - 50% Off!',
            body: 'Hurry! Our biggest sale of the year is happening now. Get 50% off on all items!',
            isRead: false,
            sentAt: 1707520000000,
            removedAt: null,
            isStared: true,
            labels: ['family'],
            from: 'store@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '13',
            createdAt: 1707440000000,
            subject: 'Vacation Request Approved',
            body: 'Your vacation request has been approved. Enjoy your time off!',
            isRead: true,
            sentAt: 1707440000000,
            removedAt: null,
            isStared: false,
            labels: [],
            from: 'hr@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '14',
            createdAt: 1707360000000,
            subject: 'Important Tax Information',
            body: 'Please review the attached tax documents for your records.',
            isRead: false,
            sentAt: 1707360000000,
            removedAt: null,
            isStared: false,
            labels: ['friends'],
            from: 'taxes@example.com',
            to: 'user@appsus.com'
        },
        {
            id: '15',
            createdAt: 1707280000000,
            subject: 'Happy Birthday!',
            body: 'Wishing you a fantastic birthday filled with joy and surprises!',
            isRead: false,
            sentAt: 1673740800000,
            removedAt: null,
            isStared: true,
            labels: ['family', 'friends'],
            from: 'friends@example.com',
            to: 'user@appsus.com'
        }
    ]
}