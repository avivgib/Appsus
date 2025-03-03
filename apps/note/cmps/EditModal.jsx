const { useState, useEffect, useRef } = React

export function EditModal({ note, onClose, onSave }) {
    const [editedNote, setEditedNote] = useState(note)
    const textareaRef = useRef(null)
    const modalContentRef = useRef(null)

    useEffect(() => {
        setEditedNote(note)
        adjustModalHeight()
    }, [note])

    function adjustModalHeight() {
        const textarea = textareaRef.current
        const modalContent = modalContentRef.current
        if (textarea && modalContent) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }

        const titleInputHeight = modalContent.querySelector('input').offsetHeight
        const footerHeight = modalContent.querySelector('.modal-footer').offsetHeight
        const padding = 40
        const newHeight = textarea.scrollHeight + titleInputHeight + footerHeight + padding

        modalContent.style.height = `${Math.min(newHeight, window.innerHeight * 0.8)}px`
        modalContent.style.overflowY = newHeight > window.innerHeight * 0.8 ? 'auto' : 'hidden'
    }

    function handleChange({ target: { name, value } }) {
        setEditedNote(prev => ({
            ...prev,
            info: { ...prev.info, [name]: value }
        }))
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
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight}px`;
        adjustModalHeight()
    }

    return (
        <div className="modal-overlay show" onClick={handleClose}>
            <div ref={modalContentRef} className="modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="modal-body">
                    <input type="text" name="title" value={editedNote.info.title} onChange={handleChange} />

                    <textarea
                        ref={textareaRef}
                        name="content"
                        value={editedNote.info.content}
                        onChange={handleChange}
                        onInput={handleContentSize}
                    />

                </div>

                <div className="modal-footer">
                    <button className="close-btn" onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    )
}
