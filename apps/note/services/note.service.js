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
    // console.log('filterBy', filterBy)
    return storageService.query(NOTES_KEY)
        .then(notes => {
            notes = _filterNotes(notes, filterBy)

            // console.log('Filtered notes:', notes)
            return notes
        })
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
}

function remove(noteId) {
    return storageService.remove(NOTES_KEY, noteId)
}

function save(note) {
    // Note video validation
    if (note.type === 'NoteVideo') {
        const videoId = _getYouTubeVideoId(note.info.content)
        if (!videoId) {
            return Promise.reject('Invalid YouTube video URL')
        }
        note.info.videoId = videoId
    }

    // Note image validation
    if (note.type === 'NoteImg' && !note.info.image) {
        console.error('Note image saved without an image')
    }

    return note.id
        ? storageService.put(NOTES_KEY, note)
        : storageService.post(NOTES_KEY, { ...note, createdAt: Date.now() })
}

function getDefaultFilter() {
    return {
        status: 'notes',
        txt: '',
        color: '',
        labels: '',
        type: '',
    }
}

function getEmptyNote(id = '', createdAt = Date.now(), type = 'NoteTxt', isPinned = false) {
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
            content: '',
            image: '',
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
            const allLabels = notes.flatMap(note => note.labels || [])
            return allLabels.reduce((uniqueLabels, label) => {
                if (!uniqueLabels.includes(label)) {
                    uniqueLabels.push(label)
                }
                return uniqueLabels
            }, [])
        })
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

    if (filterBy.status !== 'notes') {
        filteredNotes = filteredNotes.filter(note => String(note.labels).toLowerCase().includes(filterBy.status))
    }

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

    if (filterBy.type) {
        filteredNotes = filteredNotes.filter(note => note.type === filterBy.type)
    }

    return filteredNotes
}

function _getYouTubeVideoId(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regExp)
    return match ? match[1] : null
}