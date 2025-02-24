import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js";
import { noteService } from "../services/note.service.js";
import { NoteList } from "../cmps/NoteList.jsx";
import { InputSection } from "../cmps/InputSection.jsx";

const { useState, useEffect, useRef } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [noteToEdit, setNoteToEdit] = useState(noteService.getEmptyNote())
    const [isFullInputOpen, setIsFullInputOpen] = useState(false)
    const inputContainerRef = useRef(null);

    useEffect(() => {
        loadNotes()
    }, [])

    useEffect(() => {
        function handleClickOutside({ target }) {
            if (inputContainerRef.current && !inputContainerRef.current.contains(target)) {
                setIsFullInputOpen(false)
                if (noteToEdit.info.title.trim() || noteToEdit.info.content.trim()) {
                    onSaveNote()
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [noteToEdit])

    function loadNotes() {
        noteService.query()
            .then(setNotes)
            .catch(() => setNotes([]))
    }

    function onSaveNote() {
        const title = noteToEdit.info.title.trim()
        const content = noteToEdit.info.content.trim()

        if (!title && !content) return

        const newNote = { ...noteToEdit, createdAt: Date.now() }

        noteService.save(newNote)
            .then(savedNote => {
                setNotes(prevNotes => [savedNote, ...prevNotes])
                showSuccessMsg(newNote.id ? 'Note Edited' : 'Note Added')
                setNoteToEdit(noteService.getEmptyNote())
            })
            .catch(() => {
                setNoteToEdit(newNote)
                showErrorMsg(newNote.id ? 'Problem editing note' : 'Problem adding note')
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

    function handleChangeInfo({ target: { name, value } }) {
        setNoteToEdit(prev => ({ ...prev, info: { ...prev.info, [name]: value } }))
    }

    return (
        <section className="container">
            <InputSection
                inputContainerRef={inputContainerRef}
                isFullInputOpen={isFullInputOpen}
                toggleAddInput={() => setIsFullInputOpen(prev => !prev)}
                noteToEdit={noteToEdit}
                handleChangeInfo={handleChangeInfo}
            />

            <h1>Notes app</h1>
            <NoteList notes={notes} onRemoveNote={onRemoveNote} />
        </section>
    )
}