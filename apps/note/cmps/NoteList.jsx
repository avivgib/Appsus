import { NotePreview } from "./NotePreview.jsx"

export function NoteList({notes, onRemoveNote}) {
    return (
        <section className='note-list'>
            {notes.map(note => (
                <article key={note.id} className='note-card'>

                    <NotePreview note={note} />

                    {/* add edit modal by clicking on note-options class */}
                    <section className="note-options"> 
                        <button onClick={() => onRemoveNote(note.id)}>Delete note</button>
                    </section>

                </article>
            ))}
        </section>

    )
}
