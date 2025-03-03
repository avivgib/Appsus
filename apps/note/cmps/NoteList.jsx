import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"

// const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onEditNote, onCopyNote, onTogglePin, onSetBackgroundColor }) {
    const navigate = useNavigate()

    function onNoteToMail(note) {
        const { title, content } = note.info
        navigate(`/mail?title=${title}&content=${content}`)
    }

    function onPinNote(noteId) {
        const noteToUpdate = notes.find(note => note.id === noteId)
        if (noteToUpdate) {
            const updatedNote = { ...noteToUpdate, isPinned: !noteToUpdate.isPinned }
            onTogglePin(updatedNote)
        }
    }

    return (
        <section className='note-list'>

            {notes.map(note => (
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
                        <button
                            className={`pin-btn fa ${note.isPinned ? 'thumbtack' : 'thumbtack-slash'}`}
                            onClick={() => onPinNote(note.id)}
                        ></button>
                        <button className='fare trash' onClick={() => onRemoveNote(note.id)}></button>
                        <button className='fare envelope' onClick={() => onNoteToMail(note)}></button>
                        <ColorPicker
                            note={note}
                            onSetBackgroundColor={onSetBackgroundColor}
                            color={note.style.backgroundColor || '#ffffff'}
                        />
                        <button className='fare copy' onClick={() => onCopyNote(note)}></button>
                    </section>
                </article>
            ))}
        </section>
    )
}


