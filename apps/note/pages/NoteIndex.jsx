import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { noteService } from "../services/note.service.js"
import { NoteList } from "../cmps/NoteList.jsx"
import { InputSection } from "../cmps/InputSection.jsx"

const { useState, useEffect, useRef } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(() => [])
    const [noteContent, setNoteContent] = useState('')
    const [isFullInputOpen, setIsFullInputOpen] = useState(false)
    const inputRef = useRef(null)

    useEffect(() => {
        console.log('Fetching notes...')
        loadNotes()
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsFullInputOpen(false)
                setNoteContent('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
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

    function toggleAddInput() {
        if (!isFullInputOpen) {
            setNoteContent('')
        }
        setIsFullInputOpen(prev => !prev)
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
            <InputSection 
                isFullInputOpen={isFullInputOpen}
                toggleAddInput={toggleAddInput}
                inputRef={inputRef}
                noteContent={noteContent}
                setNoteContent={setNoteContent}
            />
            
            <h1>Notes app</h1>
            <NoteList notes={notes} onRemoveNote={onRemoveNote} />

        </section>
    )
}
