// note service
import { storageService } from "../../../services/async-storage.service.js";
import { utilService } from "../../../services/util.service.js";
import { eventBusService } from "../../../services/event-bus.service.js";
import { notes as defaultNotes } from "../data/notes.js"

const NOTES_KEY = 'notes'
const gCache = utilService.loadFromStorage(NOTES_KEY) || {}
_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getEmptyNote
}

function query(filterBy = {}) {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            if (!Array.isArray(notes) || !notes.length) {
                // console.log(`notes: ${notes}`)
                notes = [...defaultNotes]
                utilService.saveToStorage(NOTES_KEY, notes)
            }
            return books
            // return _filterNotes(books, filterBy)
        })
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
        .then(_setNextPrevNoteId)
}

function remove(noteId) {
    return storageService.remove(NOTES_KEY, noteId)
}

function save(note) {
    if (note.id) {
        return storageService.put(NOTES_KEY, note)
    } else {
        return storageService.post(NOTES_KEY, note)
    }
}

function getDefaultFilter() {
    return filterBy = {
        id,
        createdAt: null,
        type: '',
        isPinned: false,
        info: {
            title: ''
        },
    }
}


function getEmptyNote(id = '', createdAt = '', type = '', isPinned = false ) {
    return note = {
        id,
        createdAt,
        type,
        isPinned,
        info: {
            title: ''
        }
    }
}

// ~~~~~~~~~~~~~~~~ LOCAL FUNCTIONS ~~~~~~~~~~~~~~~~~~~ //


function _createNotes() {
    const notes = utilService.loadFromStorage(NOTES_KEY)
    if (!notes || !notes.length) _createDemoNotes()
}

// function _filterNotes(notes, filterBy) {
//     if (filterBy.type) {
//         notes = notes.filter(note => note.createdAt > filterBy.createdAt)
//     }

//     if (filterBy.title) {
//         const regExp = new RegExp(filterBy.title, 'i')
//         notes = notes.filter(note => regExp.test(note.info.title))
//     }

//     if (filterBy.createdAt) {
//         notes = notes.filter(note => note.createdAt > filterBy.createdAt)
//     }

//     return notes
// }