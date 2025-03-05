
export function NoteFolderList({ onSetStatusInFilterBy, filterBy }) {


    const { status } = filterBy

    return (
        <section className='note-folder'>
            <ul className='clean-list'>

                {['notes', 'work', 'personal', 'inspiration', 'trash'].map(label => {
                    return <li key={label} className={status === label ? 'active' : ''}
                        onClick={() => onSetStatusInFilterBy(label)}>
                        <span className={status === label ? `fa ${label}` : ` fare ${label}`}></span>
                        <button>{label}</button>
                        <span className='unread-emails'>
                        </span>
                    </li>
                })}
            </ul>
        </section>
    )
}