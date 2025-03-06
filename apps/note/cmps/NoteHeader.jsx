import { NavigationBox } from "../../../cmps/NavigationBox.jsx"
import { NoteFilter } from "./NoteFilter.jsx"


const { Link, NavLink } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function NoteHeader({ filterBy, onSetFilter, onSearchFocus, isFoldersClose, onToggleFolders, }) {

    const [isNavOpen, setIsNavOpen] = useState(false)

    function onToggleNav() {
        setIsNavOpen(prev => prev = !isNavOpen)
    }

    return (
        <section className='note-header'>
            <div className='flex align-center'>
                <button
                    className={`bars-btn fa bars ${isFoldersClose ? 'folders-close' : ''}`}
                    onClick={onToggleFolders}
                ></button>
                <Link to={'/note'}>
                    <div className='main-logo'>
                        <img src="assets/images/keep-logo.png" className='logo-img keep' alt="gmail" />
                        <div className='page-name'>Keep</div>
                    </div>
                </Link>
            </div>

            <NoteFilter
                filterBy={filterBy}
                onSetFilter={onSetFilter}
                onSearchFocus={onSearchFocus}
            />

            <nav>
                <button className='btn-nav' onClick={onToggleNav}>
                    <img src="assets/images/9-point.svg" alt="point" className='nav-point' />
                    {isNavOpen && <NavigationBox onToggleNav={onToggleNav} />}
                </button>
            </nav>


            <div className="black-wrapper" onClick={onToggleFolders}></div>
        </section>
    )
}