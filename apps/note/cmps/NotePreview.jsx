export function NotePreview({ note }) {
    if (!note || !note.info) {
        return <section className="note-preview"><h3>No Title</h3><div className="note-content">No Content</div></section>
    }

    const { info, type } = note

    function truncateContent(content) {
        const maxLength = 400
        const lengthToSlice = 389
        return content.length >= maxLength ? content.slice(0, lengthToSlice) + '...' : content
    }

    function getYouTubeVideoId(url) {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        const match = url.match(regExp)
        return match ? match[1] : null
    }

    const videoId = type === 'NoteVideo' ? (info.videoId || getYouTubeVideoId(info.content)) : null

    return (
        <section className="note-preview">
            <h3>{info.title || 'No title'}</h3>
            {type === 'NoteVideo' && videoId ? (
                <div className="video-preview">
                    <iframe
                        width="100%"
                        height="150"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                        }}
                    ></iframe>
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt="YouTube video preview"
                        style={{ display: 'none', width: '100%', height: 'auto' }}
                    />
                </div>
            ) : type === 'NoteImg' && info.image ? (
                <div className="image-preview">
                    <img
                        src={info.image}
                        alt={info.title || 'Note image'}
                        style={{ width: '100%', height: 'auto', maxHeight: '150px' }}
                    />
                    {info.content && <div className="note-content">{truncateContent(info.content)}</div>}
                </div>
            ) : (
                <div className="note-content">{truncateContent(info.content || '')}</div>
            )}
        </section>
    )
}