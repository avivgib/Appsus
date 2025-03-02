import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"
import { noteService } from "../services/note.service.js"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onEditNote }) {
    const [updatedNotes, setUpdatedNotes] = useState(notes)
    const navigate = useNavigate()

    useEffect(() => {
        setUpdatedNotes(notes)
    }, [notes])

    function onNoteToMail(note) {
        const { title, content } = note.info
        navigate(`/mail?title=${title}&content=${content}`)
    }

    function onSetNoteStyle(updatedNote) {
        setUpdatedNotes(prevNotes =>
            prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note)
        )
        onUpdateNote(updatedNote)
    }

    function onUpdateNote(updatedNote) {
        noteService.save(updatedNote)
            .then(() => showSuccessMsg('Note updated'))
            .catch(() => showErrorMsg('Error updating note'))
    }

    return (
        <section className='note-list'>
            {updatedNotes.map(note => (
                <article
                    key={note.id}
                    className='note-card'
                    style={{ backgroundColor: note.style.backgroundColor || '#ffffff' }}
                    onClick={() => onEditNote(note)}
                >
                    <div className="note-details">
                        <NotePreview note={note} />
                    </div>

                    <section className="note-options" onClick={(e) => e.stopPropagation()}>
                        <button className='fare trash-can' onClick={() => onRemoveNote(note.id)}></button>
                        <button className='fare envelope' onClick={() => onNoteToMail(note)}></button>
                        <ColorPicker
                            note={note}
                            onSetNoteStyle={onSetNoteStyle}
                            color={note.style.backgroundColor}
                        />
                    </section>
                </article>
            ))}
        </section>
    )
}