import { noteService } from "../services/note.service.js"

const { useState, useEffect, useRef } = React

export function InputSection({ onSaveNote }) {
    const [newNote, setNewNote] = useState(noteService.getEmptyNote())
    const [isFullInputOpen, setIsFullInputOpen] = useState(false)

    const emptyNoteRef = useRef(noteService.getEmptyNote())
    const inputContainerRef = useRef(null)

    useEffect(() => {
        function handleClickOutside({ target }) {
            if (inputContainerRef.current && !inputContainerRef.current.contains(target)) {
                setIsFullInputOpen(false)
                if (newNote.info.title.trim() || newNote.info.content.trim()) {
                    onSaveNote(newNote)
                    setNewNote(prev => emptyNoteRef.current)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [newNote])

    function handleChangeInfo({ target: { name, value } }) {
        setNewNote(prev => ({ ...prev, info: { ...prev.info, [name]: value } }))
    }

    function toggleAddInput() {
        setIsFullInputOpen(prev => !prev)
    }

    return (
        <div
            ref={inputContainerRef}
            className={`input-container ${isFullInputOpen ? "expanded" : ""}`}
            onClick={() => !isFullInputOpen && toggleAddInput()}
        >
            {isFullInputOpen && (
                <input
                    name="title"
                    className="title-input"
                    placeholder="Title"
                    value={newNote.info.title}
                    onChange={handleChangeInfo}
                />
            )}
            <input
                name="content"
                className="content-input"
                placeholder="Take a note..."
                value={newNote.info.content}
                onChange={handleChangeInfo}
            />
        </div>
    )
}
