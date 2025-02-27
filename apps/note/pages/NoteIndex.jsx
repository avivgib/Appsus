import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { noteService } from "../services/note.service.js"
import { NoteList } from "../cmps/NoteList.jsx"
import { NoteComposer } from "../cmps/NoteComposer.jsx"
import { EditModal } from "../cmps/EditModal.jsx"

const { useState, useEffect, useRef } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [selectedNote, setSelectedNote] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])


    function loadNotes() {
        noteService.query()
            .then(setNotes)
            .catch(() => setNotes([]))
    }

    function onSaveNote(newNote) {
        const title = newNote.info.title.trim()
        const content = newNote.info.content.trim()

        if (!title && !content) return

        const noteToSave = { ...newNote, createdAt: Date.now() }

        noteService.save(noteToSave)
            .then(savedNote => {
                setNotes(prevNotes => [savedNote, ...prevNotes])
                showSuccessMsg(noteToSave.id ? 'Note Edited' : 'Note Added')
                // setNewNote(noteService.getEmptyNote())
            })
            .catch(() => {
                // setNewNote(noteToSave)
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

    function onEditNote(note) {
        setSelectedNote(note)
    }

    function onCloseModal() {
        setSelectedNote(null)
    }

    function onSaveEditedNote(updatedNote) {
        noteService.save(updatedNote)
            .then(savedNote => {
                setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id ? savedNote : note))
                showSuccessMsg("Note updated")
                onCloseModal()
            })
            .catch(() => showErrorMsg("Error updating note"))
    }

    return (
        <section className="container">
            <NoteComposer
                onSaveNote={onSaveNote}
            />

            <h1>Notes app</h1>
            <NoteList
                notes={notes}
                onRemoveNote={onRemoveNote}
                onEditNote={onEditNote}
            />

            {selectedNote && (
                <EditModal
                    note={selectedNote}
                    onClose={onCloseModal}
                    onSave={onSaveEditedNote}
                />
            )}
        </section>
    )
}