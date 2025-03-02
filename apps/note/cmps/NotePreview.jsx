export function NotePreview({ note }) {
    if (!note || !note.info) {
        return <section className="note-preview"><h3>No Title</h3><div className="note-content">No Content</div></section>
    }

    const { info } = note

    function truncateContent(content) {
        const maxLength = 400
        const lengthToSlice = 389
        return content.length >= maxLength ? content.slice(0, lengthToSlice) + '...' : content
    }

    return (
        <section className="note-preview">
            <h3>{info.title || 'No Title'}</h3>
            <div className="note-content">{truncateContent(info.content || '')}</div>
        </section>
    )
}
