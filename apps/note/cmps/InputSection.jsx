export function InputSection({ isFullInputOpen, toggleAddInput, inputRef, noteContent, setNoteContent }) {
    return (
        <div
            ref={inputRef}
            className={`input-container ${isFullInputOpen ? 'expanded' : ''}`}
            onClick={toggleAddInput}
        >

            {isFullInputOpen && (
                <input className="extra-input" placeholder="Title" />
            )}
            <input
                className="add-note-input"
                placeholder="Take a note..."
                value={noteContent}
                onChange={({ target }) => setNoteContent(target.value)}
            />
        </div>
    )
}