export function InputSection(props) {
    const {
        inputContainerRef,
        isFullInputOpen,
        toggleAddInput,
        newNote,
        handleChangeInfo
    } = props

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
