const { useState, useEffect } = React

export function EditModal({ note, onClose, onSave }) {
    const [editedNote, setEditedNote] = useState(note)

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
        const notesAreDifferent = JSON.stringify(editedNote) !== JSON.stringify(note);

        if (notesAreDifferent) {
            onSave(editedNote)
            setTimeout(onClose, 1500);
        } else {
            onClose()
        }
    }

    return (
        <div className="modal-overlay show" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-body">
                    <input type="text" name="title" value={editedNote.info.title} onChange={handleChange} />
                    <textarea name="content" rows={13} value={editedNote.info.content} onChange={handleChange}></textarea>
                </div>

                <div className="modal-footer">
                    <button className="close-btn" onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    )
}
