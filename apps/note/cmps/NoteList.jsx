import { NotePreview } from "./NotePreview.jsx"

export function NoteList({ notes, onRemoveNote, onEditNote }) {
    return (
        <section className='note-list'>
            {notes.map(note => (
                <article key={note.id} className='note-card' onClick={() => onEditNote(note)}>

                    <div className="note-content" >
                        <NotePreview note={note} />
                    </div>

                    <section className="note-options" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => onEditNote(note)}>Edit note</button>
                        <button onClick={() => onRemoveNote(note.id)}>Delete note</button>
                    </section>
                </article>
            ))}
        </section>

    )
}
