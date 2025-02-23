// note service
import { storageService } from "../../../services/async-storage.service.js";
import { utilService } from "../../../services/util.service.js";
import { notes as defaultNotes } from "../data/notes.js"

const NOTES_KEY = 'notes'
_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getEmptyNote
}

function query() {
    console.log('Fetching notes from storage...');
    return storageService.query(NOTES_KEY)
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
}

function remove(noteId) {
    return storageService.remove(NOTES_KEY, noteId)
}

function save(note) {
    return note.id
        ? storageService.put(NOTES_KEY, note)
        : storageService.post(NOTES_KEY, note)
}

function getDefaultFilter() {
    return {
        id: '',
        createdAt: null,
        type: '',
        isPinned: false,
        info: { 
            title: '',
            content: '' 
        },
    }
}

function getEmptyNote(id = '', createdAt = '', type = '', isPinned = false) {
    return {
        id,
        createdAt,
        type,
        isPinned,
        info: {
            title: '',
            content: ''
        }
    }
}

// ~~~~~~~~~~~~~~~~ LOCAL FUNCTIONS ~~~~~~~~~~~~~~~~~~~ //


function _createNotes() {
    let notes = utilService.loadFromStorage(NOTES_KEY)
    if (!notes || !notes.length) {
        utilService.saveToStorage(NOTES_KEY, defaultNotes)
    }
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
