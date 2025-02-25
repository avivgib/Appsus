const {useState} = React

export function EditModal({ note, onSaveNote, onClose }) {
    const [editedNote, setEditedNote] = useState(note)

    function handleChange({ target: { name, value } }) {
        setEditedNote(prev => ({ ...prev, info: { ...prev.info, [name]: value } }))
    }

    // function handleSave() {
    //     onSaveNote(editedNote)
    // }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <input type="text" name="title" value={editedNote.info.title} onChange={handleChange} />
                <textarea name="content" value={editedNote.info.content} onChange={handleChange}></textarea>
                {/* <button onClick={handleSave}>Save</button> */}
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}
