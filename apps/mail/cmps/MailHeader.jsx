const { Link, NavLink } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function MailHeader({ isFoldersClose, onToggleFolders }) {

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

        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/mail">Mail</NavLink>
            <NavLink to="/note">Note</NavLink>
        </nav>

        <div className="black-wrapper" onClick={onToggleFolders}></div>

    </header>
}