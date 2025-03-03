import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { noteService } from "../services/note.service.js"
import { NoteList } from "../cmps/NoteList.jsx"
import { NoteComposer } from "../cmps/NoteComposer.jsx"
import { EditModal } from "../cmps/EditModal.jsx"
import { NoteFilter } from "../cmps/NoteFilter.jsx"
import { NoteSearchCategory } from "../cmps/NoteSearchCategory.jsx"


const { useState, useEffect, useRef } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [selectedNote, setSelectedNote] = useState(null)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [filterBy, setFilterBy] = useState({ ...noteService.getDefaultFilter() })

    const DefaultFilterRef = useRef({ ...filterBy })

    useEffect(() => {
        loadNotes()
    }, [filterBy])

    function loadNotes() {
        noteService.query(filterBy)
            .then(setNotes)
            .catch(() => setNotes([]))
    }

    function onSaveNote(newNote) {
        if (!newNote.info.title.trim() && !newNote.info.content.trim()) return

        const noteToSave = {
            ...newNote,
            createdAt: Date.now(),
            style: {
                backgroundColor: '#ffffff', ...newNote.style
            }
        }

        noteService.save(noteToSave)
            .then(savedNote => {
                setNotes(prevNotes => [savedNote, ...prevNotes])
                showSuccessMsg(noteToSave.id ? 'Note Edited' : 'Note Added')
            })
            .catch(() => {
                showErrorMsg(noteToSave.id ? 'Problem editing note' : 'Problem adding note')
            })
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => {
                setNotes(prevNotes => prevNotes.filter((note) => note.id !== noteId))
                showSuccessMsg('Note trashed')
            })
            .catch(() => showErrorMsg('Problem trashed'))
    }

    function onCopyNote(note) {
        const newNote = structuredClone(note)
        newNote.id = ''
        newNote.info.title = `Copy of ${note.info.title}`
        newNote.createdAt = Date.now()
        newNote.style = { backgroundColor: '#ffffff', ...note.style }

        noteService.save(newNote)
            .then(savedNote => {
                setNotes(prevNotes => [savedNote, ...prevNotes])
                showSuccessMsg('Note copied')
            })
            .catch(() => showErrorMsg('Error copying note'))
    }

    function onEditNote(note) {
        setSelectedNote(note)
    }

    function onCloseModal() {
        setSelectedNote(null)
    }

    function updateNotes(prevNotes, savedNote) {
        return prevNotes.map(note => note.id === savedNote.id ? savedNote : note)
    }

    function onSaveEditedNote(updatedNote) {
        noteService.save(updatedNote)
            .then(savedNote => {
                setNotes(prev => updateNotes(prev, savedNote))
                showSuccessMsg("Note updated")
                onCloseModal()
            })
            .catch(() => showErrorMsg("Error updating note"))
    }

    function onTogglePin(updatedNote) {
        noteService.save(updatedNote)
            .then(savedNote => {
                setNotes(prev => updateNotes(prev, savedNote))
                showSuccessMsg(savedNote.isPinned ? 'Note pinned' : 'Note unpinned')
            })
            .catch(() => showErrorMsg('Error updating note'))
    }

    function onSetBackgroundColor(updatedNote) {
        noteService.save(updatedNote)
            .then(savedNote => {
                setNotes(prev => updateNotes(prev, savedNote))
                showSuccessMsg('Note color updated')
            })
            .catch(() => showErrorMsg('Error updating note'))
    }

    function onSetFilter(filterBy) {
        setFilterBy(prev => ({ ...filterBy }))
    }

    function onSearchFocus(isFocused) {
        setIsSearchFocused(isFocused)

        if (isFocused) {
            setFilterBy(prev => ({ ...DefaultFilterRef }))
        }
    }

    return (
        <section className="container">
            <NoteFilter
                filterBy={filterBy}
                onSetFilter={onSetFilter}
                onSearchFocus={onSearchFocus}
            />

            <NoteComposer
                onSaveNote={onSaveNote}
            />

            <h1>Notes app</h1>
            {!isSearchFocused && <NoteList
                notes={notes}
                onRemoveNote={onRemoveNote}
                onEditNote={onEditNote}
                onCopyNote={onCopyNote}
                onTogglePin={onTogglePin}
                onSetBackgroundColor={onSetBackgroundColor}
            />}

            {selectedNote && (
                <EditModal
                    note={selectedNote}
                    onClose={onCloseModal}
                    onSave={onSaveEditedNote}
                />
            )}

            {isSearchFocused && <NoteSearchCategory
                filterBy={filterBy}
                onSetFilter={onSetFilter}
                onSearchFocus={onSearchFocus}
            />}

        </section>
    )
}