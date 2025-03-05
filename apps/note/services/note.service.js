// note service
import { storageService } from "../../../services/async-storage.service.js"
import { utilService } from "../../../services/util.service.js"
import { notes as defaultNotes } from "../data/notes.js"

const NOTES_KEY = 'notes'
_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getEmptyNote,
    getNotesColorStats,
    getNotesLabelStats
}

function query(filterBy) {
    console.log('filterBy', filterBy);
    return storageService.query(NOTES_KEY)
        .then(notes => {
            notes = _filterNotes(notes, filterBy);

            console.log('Filtered notes:', notes);
            return notes;
        })
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
        txt: '',
        color: '',
        labels: '',
    }
}

function getEmptyNote(id = '', createdAt = '', type = '', isPinned = false) {
    return {
        id,
        createdAt,
        type,
        isPinned,
        style: {
            backgroundColor: '#ffffff'
        },
        info: {
            title: '',
            content: ''
        },
        labels: [],
    }
}

function getNotesColorStats() {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            console.log('notes:', notes)
            return notes.reduce((acc, note) => {
                const { backgroundColor } = note.style
                if (!acc.includes(backgroundColor)) acc.push(backgroundColor)
                return acc
            }, [])
        })
}

function getNotesLabelStats() {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            const allLabels = notes.flatMap(note => note.labels || []);
            return allLabels.reduce((uniqueLabels, label) => {
                if (!uniqueLabels.includes(label)) {
                    uniqueLabels.push(label);
                }
                return uniqueLabels;
            }, []);
        });
}
// ~~~~~~~~~~~~~~~~ LOCAL FUNCTIONS ~~~~~~~~~~~~~~~~~~~ //


function _createNotes() {
    let notes = utilService.loadFromStorage(NOTES_KEY)
    if (!notes || !notes.length) {
        utilService.saveToStorage(NOTES_KEY, defaultNotes)
    }
}

function _filterNotes(notes, filterBy) {
    let filteredNotes = [...notes]

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        filteredNotes = filteredNotes.filter(note => regex.test(note.info.title) || regex.test(note.info.content))
    }

    if (filterBy.color) {
        filteredNotes = filteredNotes.filter(note => filterBy.color === note.style.backgroundColor)
    }

    if (filterBy.labels) {
        filteredNotes = filteredNotes.filter(note =>
            note.labels.some(label =>
                label.toLowerCase() === filterBy.labels.toLowerCase()
            )
        )
    }

    // if (filterBy.type) {
    //     filteredNotes = filteredNotes.filter(note => note.createdAt > filterBy.createdAt)
    // }

    // if (filterBy.title) {
    //     const regExp = new RegExp(filterBy.title, 'i')
    //     filteredNotes = filteredNotes.filter(note => regExp.test(note.info.title))
    // }

    // if (filterBy.createdAt) {
    //     filteredNotes = filteredNotes.filter(note => note.createdAt > filterBy.createdAt)
    // }

    return filteredNotes
}

