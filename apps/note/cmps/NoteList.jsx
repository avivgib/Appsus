import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"

// const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onEditNote, onCopyNote, onTogglePin, onSetBackgroundColor }) {
    const navigate = useNavigate()
    const pinnedNotes = notes.filter(note => note.isPinned)
    const otherNotes = notes.filter(note => !note.isPinned)
    
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

            {pinnedNotes.length > 0 && (
                <div className="pinned-section">
                    <h2 className="section-title">Pinned</h2>
                    <div className="notes-container">
                        {pinnedNotes.map(note => (
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
                    </div>
                </div>
            )}

            {otherNotes.length > 0 && (
                <div className="others-section">

                    {pinnedNotes.length > 0 && <h2 className="section-title">Others</h2>}
                    
                    <div className="notes-container">
                        {otherNotes.map(note => (
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
                    </div>
                </div>
            )}
        </section >
    )
}