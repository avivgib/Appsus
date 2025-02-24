export function NotePreview({ note }) {
    const { info } = note

    function truncateContent(content) {
        const maxLength = 400
        const lengthToSlice = 389

        if (content.length >= maxLength) {
            return content.slice(0, lengthToSlice) + '...'
        }

        return content
    }

    return (
        <section className="note-preview">
            <h3>{info.title || ''}</h3>
            <div className="note-content">{truncateContent(info.content)}</div>
        </section>
    )
}