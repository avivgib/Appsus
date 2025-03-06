import { NotePreview } from "./NotePreview.jsx"
import { ColorPicker } from "./ColorPicker.jsx"
import { LabelPicker } from "../../../cmps/LabelPicker.jsx"
import { utilService } from "../../../services/util.service.js"

const { useState } = React
const { useNavigate } = ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onEditNote, onCopyNote, onTogglePin, onSetBackgroundColor, onUpdateLabels }) {
    const navigate = useNavigate()
    const pinnedNotes = notes.filter(note => note.isPinned)
    const otherNotes = notes.filter(note => !note.isPinned)

    const [activeNote, setActiveNote] = useState(null)
    const [labels, setLabels] = useState(utilService.getNotesLabels() || [])

    function onNoteToMail(note) {
        navigate('/mail', { state: { noteToMail: note } })
    }

    function onPinNote(noteId) {
        const noteToUpdate = notes.find(note => note.id === noteId)
        if (noteToUpdate) {
            const updatedNote = { ...noteToUpdate, isPinned: !noteToUpdate.isPinned }
            onTogglePin(updatedNote)
        }
    }

    function onToggleLabelPicker(noteId) {
        setActiveNote(noteId)
        const note = notes.find(note => note.id === noteId)
        setLabels(Array.isArray(note.labels) ? note.labels : [])
    }

    function onSetNoteLabels(labels) {
        const noteToUpdate = notes.find(note => note.id === activeNote)
        if (noteToUpdate) {
            noteToUpdate.labels = labels
            console.log(noteToUpdate);
            onUpdateLabels(noteToUpdate)
        }
        setActiveNote(null)
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
                                ></button>

                                <div className="note-details">
                                    <NotePreview note={note} />
                                </div>

                                <section className="note-options" onClick={(e) => e.stopPropagation()}>
                                    <button className='fare trash' onClick={() => onRemoveNote(note.id)}></button>
                                    <button className='fare envelope' onClick={() => onNoteToMail(note)}></button>
                                    <ColorPicker
                                        note={note}
                                        onSetBackgroundColor={onSetBackgroundColor}
                                        color={note.style.backgroundColor || '#ffffff'}
                                    />
                                    <button className='fare copy' onClick={() => onCopyNote(note)}></button>
                                    <button className='fa tag' onClick={() => onToggleLabelPicker(note.id)} >
                                        {activeNote === note.id &&
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
                                    <button className='fare trash' onClick={() => onRemoveNote(note.id)}></button>
                                    <button className='fare envelope' onClick={() => onNoteToMail(note)}></button>
                                    <ColorPicker
                                        note={note}
                                        onSetBackgroundColor={onSetBackgroundColor}
                                        color={note.style.backgroundColor || '#ffffff'}
                                    />
                                    <button className='fare copy' onClick={() => onCopyNote(note)}></button>
                                    <button className='fa tag' onClick={() => onToggleLabelPicker(note.id)} >
                                        {activeNote === note.id &&
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