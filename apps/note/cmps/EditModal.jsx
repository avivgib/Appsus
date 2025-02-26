const { useState, useEffect, useRef } = React

export function EditModal({ note, onClose, onSave }) {
    const [editedNote, setEditedNote] = useState(note)
    const textareaRef = useRef(null)

    useEffect(() => {
        setEditedNote(note)
    }, [note])

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
            setTimeout(onClose, 1500)
        } else {
            onClose()
        }
    }

    function handleContentSize(event) {
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight}px`;
    }

    return (
        <div className="modal-overlay show" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

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
