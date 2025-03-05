import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"
import { LabelPicker } from "../../../cmps/LabelPicker.jsx"

// const { useState, useEffect } = React
const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onEditNote, onCopyNote, onTogglePin, onSetBackgroundColor, onUpdateLabels }) {
    const navigate = useNavigate()
    const pinnedNotes = notes.filter(note => note.isPinned)
    const otherNotes = notes.filter(note => !note.isPinned)

    const [pickNote, setPickNote] = useState(null)
    const [labels, setLabels] = useState(null)


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

    function onToggleLabelPicker(noteId) {
        setPickNote(noteId)
        const note = notes.find(note => note.id === noteId)
        setLabels(note.labels)
    }

    function onSetNoteLabels(ev, type, labels) {
        const noteToUpdate = notes.find(note => note.id === pickNote)
        noteToUpdate.labels = labels
        console.log(noteToUpdate);
        onUpdateLabels(noteToUpdate)
        setPickNote(null)
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
                                <button
                                    className={`pin-btn fa ${note.isPinned ? 'thumbtack' : 'thumbtack-slash'}`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onPinNote(note.id)
                                    }}
                                    style={{ position: 'absolute', top: '8px', right: '8px' }}
                                    data-action={note.isPinned ? 'Unpin note' : 'Pin note'}
                                ></button>

                                <div className="note-details">
                                    <NotePreview note={note} />
                                </div>

                                <section className="note-options" onClick={(e) => e.stopPropagation()}>
                                    <button data-action="Remove" className='fare trash' onClick={() => onRemoveNote(note.id)}></button>
                                    <button data-action="Send to Mail" className='fare envelope' onClick={() => onNoteToMail(note)}></button>
                                    <ColorPicker
                                        note={note}
                                        onSetBackgroundColor={onSetBackgroundColor}
                                        color={note.style.backgroundColor || '#ffffff'}
                                    />
                                    <button data-action="Copy" className='fare copy' onClick={() => onCopyNote(note)}></button>
                                    <button data-action="Add label" className='fa tag' onClick={() => onToggleLabelPicker(note.id)} >
                                        {pickNote === note.id &&
                                            <LabelPicker
                                                labels={labels}
                                                handleChanges={onSetNoteLabels}
                                            />}
                                    </button>
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
                                    <button data-action="Remove" className='fare trash' onClick={() => onRemoveNote(note.id)}></button>
                                    <button data-action="Send to Mail" className='fare envelope' onClick={() => onNoteToMail(note)}></button>
                                    <ColorPicker
                                        note={note}
                                        onSetBackgroundColor={onSetBackgroundColor}
                                        color={note.style.backgroundColor || '#ffffff'}
                                    />
                                    <button data-action="Copy" className='fare copy' onClick={() => onCopyNote(note)}></button>
                                    <button data-action="Add label" className='fa tag' onClick={() => onToggleLabelPicker(note.id)} >
                                        {pickNote === note.id &&
                                            <LabelPicker
                                                labels={labels}
                                                handleChanges={onSetNoteLabels}
                                            />}
                                    </button>
                                </section>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section >
    )
}