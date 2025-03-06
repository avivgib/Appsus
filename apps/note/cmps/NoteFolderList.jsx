
export function NoteFolderList({ onSetStatusInFilterBy, filterBy, onClosefolders }) {


    const { status } = filterBy

    return (
        <section className='note-folder'>
            <ul className='clean-list'>

                {['notes', 'work', 'personal', 'inspiration', 'trash'].map(label => {
                    return <li key={label} className={status === label ? 'active' : ''}
                        onClick={() => { onSetStatusInFilterBy(label); onClosefolders() }}>
                        <span className={(label === 'notes' || label === 'trash') ? `fare ${label}` : `fa tag`}>
                        </span>
                        <button>{label}</button>
                        <span className='unread-emails'>
                        </span>
                    </li>
                })}
            </ul>
        </section>
    )
}