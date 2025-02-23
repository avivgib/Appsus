import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { noteService } from "../services/note.service.js"
import { NoteList } from "../cmps/NoteList.jsx"

const { useState, useEffect, useRef } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(() => [])

    useEffect(() => {
        console.log('Fetching notes...')
        loadNotes()
    }, [])


    function loadNotes() {
        noteService.query()
            .then(prevNotes => {
                console.log('Notes from service: ', prevNotes)
                setNotes(prevNotes)
            })
            .catch(err => {
                console.error('Error loading notes', err)
                setNotes([])
            })
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => {
                setNotes(prevNotes => prevNotes.filter((note) => note.id !== noteId))
                showSuccessMsg('Note trashed')
            })
            .catch(() => showErrorMsg('Note unpinned and trashed'))
    }

    return (
        <section className="container">
            <h1>Notes app</h1>
            <NoteList notes={notes} onRemoveNote={onRemoveNote} />

        </section>
    )
}
