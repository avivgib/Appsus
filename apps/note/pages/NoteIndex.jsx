import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { noteService } from "../services/note.service.js"
import { NoteList } from "../cmps/NoteList.jsx"
import { NoteComposer } from "../cmps/NoteComposer.jsx"
import { NoteEditModal } from "../cmps/NoteEditModal.jsx"
import { NoteSearchCategory } from "../cmps/NoteSearchCategory.jsx"
import { NoteFolderList } from "../cmps/NoteFolderList.jsx"
import { NoteHeader } from "../cmps/NoteHeader.jsx"


const { useState, useEffect, useRef } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [selectedNote, setSelectedNote] = useState(null)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [filterBy, setFilterBy] = useState({ ...noteService.getDefaultFilter() })

    const DefaultFilterRef = useRef({ ...filterBy })
    const [isFoldersClose, setIsFoldersClose] = useState(false)

    useEffect(() => {
        loadNotes()
    }, [filterBy])

    function loadNotes() {
        noteService.query(filterBy)
            .then(setNotes)
            .catch(() => setNotes([]))
    }

    function onSaveNote(newNote) {
        if (!newNote.info.title.trim() && !newNote.info.content.trim() && !newNote.info.image) return Promise.resolve()

        const noteToSave = {
            ...newNote,
            createdAt: Date.now(),
            style: {
                backgroundColor: '#ffffff', ...newNote.style
            }
        }

        return noteService.save(noteToSave)
            .then(savedNote => {
                setNotes(prevNotes => [savedNote, ...prevNotes])
                showSuccessMsg(noteToSave.id ? 'Note Edited' : 'Note Added')
                return savedNote
            })
            .catch(err => {
                console.error('Error saving note:', err)
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
        const newNote = structuredClone({ ...note })
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
            setFilterBy(prev => ({ ...DefaultFilterRef.current }))
        }
    }

    function onUpdateLabels(updatedNote) {
        noteService.save(updatedNote)
            .then(savedNote => {
                setNotes(prev => updateNotes(prev, savedNote))
                showSuccessMsg('Note label updated')
            })
            .catch(() => showErrorMsg('Error updating label note'))
    }

    function onSetStatusInFilterBy(status) {
        onSearchFocus(false)
        setFilterBy(prev => ({ ...prev, status: status }))
    }


    function onToggleFolders() {
        setIsFoldersClose(prev => prev = !isFoldersClose)
    }

    function onClosefolders() {
        if (window.innerWidth < 850) {
            setIsFoldersClose(false)
        }
    }


    return (
        <section className="container note-main-layout">

            <NoteHeader
                filterBy={filterBy}
                onSetFilter={onSetFilter}
                onSearchFocus={onSearchFocus}
                onToggleFolders={onToggleFolders}
                isFoldersClose={isFoldersClose}
            />

            <NoteFolderList onSetStatusInFilterBy={onSetStatusInFilterBy} filterBy={filterBy} onClosefolders={onClosefolders} />

            <div className='main-content'>

                {!isSearchFocused && (
                    <React.Fragment>
                        <NoteComposer onSaveNote={onSaveNote} />
                        <NoteList
                            notes={notes}
                            onRemoveNote={onRemoveNote}
                            onEditNote={onEditNote}
                            onCopyNote={onCopyNote}
                            onTogglePin={onTogglePin}
                            onSetBackgroundColor={onSetBackgroundColor}
                            onUpdateLabels={onUpdateLabels}
                        />
                    </React.Fragment>
                )}

                {isSearchFocused && <NoteSearchCategory
                    filterBy={filterBy}
                    onSetFilter={onSetFilter}
                    onSearchFocus={onSearchFocus}
                />}

                {selectedNote && (
                    <NoteEditModal
                        note={selectedNote}
                        onClose={onCloseModal}
                        onSave={onSaveEditedNote}
                    />
                )}
            </div>

        </section>
    )
}