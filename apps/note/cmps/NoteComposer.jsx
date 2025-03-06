import { noteService } from "../services/note.service.js"

const { useState, useEffect, useRef } = React
const { useSearchParams, useLocation } = ReactRouterDOM

export function NoteComposer({ onSaveNote }) {
    // const [newNote, setNewNote] = useState(noteService.getEmptyNote())
    // console.log(newNote)

    const [isFullInputOpen, setIsFullInputOpen] = useState(false)
    const [noteType, setNoteType] = useState('NoteTxt')
    const [newNote, setNewNote] = useState({
        type: 'NoteTxt',
        info: { title: '', content: '' }
    })
    const [iframeError, setIframeError] = useState(false)

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
    }, [newNote, onSaveNote])

    function setNoteToMail(mail) {
        // console.log(mail)

        const { subject, body } = mail
        toggleAddInput()
        setNewNote(prev => ({ ...prev, info: { ...prev.info, title: subject, content: body } }))
    }

    function handleChangeInfo({ target: { name, value } }) {
        setNewNote(prev => ({ ...prev, info: { ...prev.info, [name]: value } }))

        if (name === 'content' && noteType === 'NoteVideo') {
            setIframeError(false)
        }
    }

    function toggleAddInput() {
        setIsFullInputOpen(prev => !prev)
    }

    function toggleToVideoNote() {
        setNoteType('NoteVideo')
        setNewNote(prev => ({
            ...prev,
            type: 'NoteVideo',
            info: { title: '', content: '' }
        }))
        toggleAddInput()
    }

    function getYouTubeVideoId(url) {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        const match = url.match(regExp)
        return match ? match[1] : null
    }

    const videoId = noteType === 'NoteVideo' ? getYouTubeVideoId(newNote.info.content) : null

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
                    placeholder={noteType === 'NoteVideo' ? "Video Title" : "Title"}
                    value={newNote.info.title}
                    onChange={handleChangeInfo}
                />
            )}
            <div className="textarea-wrapper">
                <textarea
                    name="content"
                    className="content-input"
                    placeholder={noteType === 'NoteVideo' ? "Enter video URL..." : "Take a note..."}
                    value={newNote.info.content}
                    onChange={handleChangeInfo}
                    rows={isFullInputOpen ? "3" : "1"}
                />

                {isFullInputOpen && noteType === 'NoteVideo' && videoId && (
                    <div className="video-preview">
                        {!iframeError ? (<iframe
                            width="100%"
                            height="200"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        ) : (
                            <img
                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                alt="YouTube video preview"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )
                        }
                    </div>
                )}

                <div className="buttons-wrapper">
                    <button
                        className="film-btn fa film"
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleToVideoNote()
                        }}
                        title="Create video note"
                    ></button>
                </div>
            </div>
        </div>
    )
}
{/* {!isFullInputOpen && noteType !== 'NoteVideo' && (
                        <section className="note-type-btns">
                            video
                            <button
                                className="film-btn fa film"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleToVideoNote()
                                }}
                            >
                            </button>

                            image
                            <button
                                className="image-btn fare image"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleToVideoNote()
                                }}
                            >
                            </button>

                            list
                            <button
                                className="list-btn fare square-check"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleToVideoNote()
                                }}
                            >
                            </button>
                        </section>
                    )} */}

{/* {!isFullInputOpen && (
                        <button
                            className="save-btn"
                            onClick={(e) => {
                                e.stopPropagation()
                                if (newNote.info.title.trim() || newNote.info.content.trim()) {
                                    onSaveNote(newNote)
                                    setNewNote(prev => emptyNoteRef.current)
                                }
                            }}
                        >
                        </button>
                    )} */}
//                 </div>
//             </div>
//         </div>
//     )
// }