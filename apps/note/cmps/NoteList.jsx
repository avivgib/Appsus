import { NotePreview } from "./NotePreview.jsx"
const { useNavigate } = ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onEditNote }) {

    const navigate = useNavigate()

    function onNoteToMail(note) {
        const { title, content } = note.info
        navigate(`/mail?title=${title}&content=${content}`)
    }

    return (
        <section className='note-list'>
            {notes.map(note => (
                <article key={note.id} className='note-card' onClick={() => onEditNote(note)}>

                    <div className="note-details" >
                        <NotePreview note={note} />
                    </div>

                    <section className="note-options" onClick={(e) => e.stopPropagation()}>
                        <button className='fare trash-can' onClick={() => onRemoveNote(note.id)}></button>
                        <button className='fare envelope' onClick={() => onNoteToMail(note)}></button>
                        {/* <div className='psado'></div> */}
                    </section>
                </article>
            ))}
        </section>

    )
}
