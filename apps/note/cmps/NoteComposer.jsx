import { noteService } from "../services/note.service.js"

const { useState, useEffect, useRef } = React
const { useSearchParams, useLocation } = ReactRouterDOM


export function NoteComposer({ onSaveNote }) {
    const [newNote, setNewNote] = useState(noteService.getEmptyNote())
    const [isFullInputOpen, setIsFullInputOpen] = useState(false)
    // console.log(newNote);

    const emptyNoteRef = useRef(noteService.getEmptyNote())
    const inputContainerRef = useRef(null)

    const location = useLocation()
    // console.log(searchParams);


    useEffect(() => {
        if (location.state) {
            if (Object.hasOwn(location.state, 'mailToNote')) {
                const { mailToNote } = location.state
                setNoteToMail(mailToNote)
            }
        }
    }, [location.state])


    function setNoteToMail(mail) {
        console.log(mail);
        // const subject = searchParams.get('subject') || ''
        // const body = searchParams.get('body') || ''
        // // console.log(subject, body);
        const { subject, body } = mail
        toggleAddInput()
        setNewNote(prev => ({ ...prev, info: { ...prev.info, title: subject, content: body } }))
    }

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
            <textarea
                name="content"
                className="content-input"
                placeholder="Take a note..."
                value={newNote.info.content}
                onChange={handleChangeInfo}
                rows="1"
            />

            {/* <div
                contentEditable="true"
                className="content-input"
                data-placeholder="Take a note..."
                onInput={(e) => handleChangeInfo({ target: { name: "content", value: e.target.innerText } })}
                suppressContentEditableWarning={true}
            ></div> */}

        </div>
    )
}
