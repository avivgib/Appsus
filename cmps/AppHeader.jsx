import { NavigationBox } from "./NavigationBox.jsx"

const { Link, NavLink, useLocation } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function AppHeader() {

    const [currPage, setCurrPage] = useState(null)
    const [isFoldersClose, setIsFoldersClose] = useState(false)
    const [isNavOpen, setIsNavOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        if (location.pathname) {
            onSetCurrPage(location.pathname)
        }
    }, [location.pathname])

    // useEffect(() => {
    //     if (location.state) {
    //         if (Object.hasOwn(location.state, 'isFoldersClose')) {
    //             const { isFoldersClose } = location.state
    //             setIsFoldersClose(isFoldersClose)
    //         }
    //     }
    // }, [location.state])




    function onSetCurrPage(pathname) {
        setCurrPage(pathname)
    }
    function onClosefolders() {
        setIsFoldersClose(prev => prev = !isFoldersClose)
    }

    function onToggleNav() {
        setIsNavOpen(prev => prev = !isNavOpen)
    }

    return <header className="app-header">
        <div className='flex align-center'>
            <button
                className={`bars-btn fa bars ${isFoldersClose ? 'folders-close' : ''}`}
                onClick={onClosefolders}
            ></button>
            <Link to={currPage || '/'}>
                <div className='main-logo'>
                    <DynamicLogo currPage={currPage} />
                </div>
            </Link>
        </div>

        <nav>
            <button className='btn-nav' onClick={onToggleNav}>
                <img src="assets/images/9-point.svg" alt="point" className='nav-point' />
                {isNavOpen && <NavigationBox onToggleNav={onToggleNav} />}
            </button>
        </nav>


        <div className="black-wrapper" onClick={onClosefolders}></div>

    </header>
}


function DynamicLogo({ currPage }) {
    switch (currPage) {
        case '/':
            return <div className='page-name'>Apsus</div>
        case '/about':
            return <div className='page-name'>About</div>
        case '/mail':
            return <React.Fragment>
                <img src="assets/images/gmail-logo.png" className='logo-img gmail' alt="gmail" />
                <div className='page-name'>Gmail</div>
            </React.Fragment>
        case '/note':
            return <React.Fragment>
                <img src="assets/images/keep-logo.png" className='logo-img keep' alt="gmail" />
                <div className='page-name'>Keep</div>
            </React.Fragment>
    }
}

