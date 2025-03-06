const { useState, useEffect, useRef } = React

export function NoteEditModal({ note, onClose, onSave }) {
    const [editedNote, setEditedNote] = useState(note || { info: { title: '', content: '', image: '' } })
    const textareaRef = useRef(null)
    const modalContentRef = useRef(null)
    const imageRef = useRef(null)

    useEffect(() => {
        setEditedNote(note)
        setTimeout(adjustModalHeight, 0)
    }, [note])

    function adjustModalHeight() {
        const textarea = textareaRef.current
        const modalContent = modalContentRef.current
        const image = imageRef.current

        if (!modalContent) return

        const titleInputHeight = modalContent.querySelector('input').offsetHeight || 0
        const footerHeight = modalContent.querySelector('.modal-footer').offsetHeight || 0
        const padding = 40
        const imgHeight = image ? image.offsetHeight : 0

        let contentHeight = 0
        if (textarea) {
            const textValue = textarea.value.trim()
            if (textValue) {
                textarea.style.height = "auto"
                textarea.style.height = `${textarea.scrollHeight}px`
                contentHeight = textarea.scrollHeight
            }
        }

        const newHeight = contentHeight || imgHeight
        const totalHeight = titleInputHeight + footerHeight + newHeight + padding

        modalContent.style.height = `${Math.min(totalHeight, window.innerHeight * 0.8)}px`
        modalContent.style.overflowY = totalHeight > window.innerHeight * 0.8 ? 'auto' : 'hidden'
    }

    function handleChange({ target: { name, value } }) {
        setEditedNote(prev => ({
            ...prev,
            info: { ...prev.info, [name]: value }
        }))
    }

    function handleImageDelete() {
        setEditedNote(prev => ({
            ...prev,
            info: { ...prev.info, image: '' }
        }))
        setTimeout(adjustModalHeight, 0)
    }

    function handleClose() {
        const notesAreDifferent = JSON.stringify(editedNote) !== JSON.stringify(note)

        if (notesAreDifferent) {
            onSave(editedNote)
        } else {
            onClose()
        }
    }

    function handleContentSize(event) {
        event.target.style.height = "auto"
        event.target.style.height = `${event.target.scrollHeight}px`
        adjustModalHeight()
    }

    return (
        <div className="modal-overlay show" onClick={handleClose}>
            <div ref={modalContentRef} className="modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="modal-body">
                    <input
                        type="text"
                        name="title"
                        value={editedNote.info.title}
                        onChange={handleChange}
                        placeholder="Title"
                    />

                    {editedNote.type !== 'NoteImg' && (
                        <textarea
                            ref={textareaRef}
                            name="content"
                            value={editedNote.info.content}
                            onChange={handleChange}
                            onInput={handleContentSize}
                            placeholder="Note"
                        />
                    )}

                    {editedNote.type === 'NoteImg' && (
                        editedNote.info.image ? (
                            <div className="image-container">
                                <img ref={imageRef} src={editedNote.info.image} alt="Attached" className="note-image" />
                                <button className="delete-image-btn fa trash" onClick={handleImageDelete}></button>
                            </div>
                        ) : (
                            <div className="no-image-available">No Image Available!</div>
                        )
                    )}
                </div>

                <div className="modal-footer">
                    <button className="edit-close-btn" onClick={handleClose}>Close</button>
                </div>
            </div>
        </div >
    )
}
