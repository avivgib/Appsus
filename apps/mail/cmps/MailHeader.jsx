import { NavigationBox } from "../../../cmps/NavigationBox.jsx"
import { MailFilter } from "./MailFilter.jsx"

const { Link, NavLink } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function MailHeader({ isFoldersClose, onToggleFolders, filterBy, onSetFilterBy, defaultFilterByRef }) {

    const [isNavOpen, setIsNavOpen] = useState(false)

    function onToggleNav() {
        setIsNavOpen(prev => prev = !isNavOpen)
    }

    return <header className="mail-header">
        <div className='flex align-center'>
            <button
                className={`bars-btn fa bars ${isFoldersClose ? 'folders-close' : ''}`}
                onClick={onToggleFolders}
            ></button>

            <Link to={'/mail'}>
                <div className='main-logo'>
                    <img src="assets/images/gmail-logo.png" className='logo-img gmail' alt="gmail" />
                    <div className='page-name'>Gmail</div>
                </div>
            </Link>
        </div>

        <MailFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />

        <nav>
            <button className='btn-nav' onClick={onToggleNav}>
                <img src="assets/images/9-point.svg" alt="point" className='nav-point' />
                {isNavOpen && <NavigationBox onToggleNav={onToggleNav} defaultFilterByRef={defaultFilterByRef} />}
            </button>
        </nav>

        <div className="black-wrapper" onClick={onToggleFolders}></div>

    </header>
}