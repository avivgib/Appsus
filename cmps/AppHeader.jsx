const { Link, NavLink, useLocation } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function AppHeader() {

    const [currPage, setCurrPage] = useState(null)
    const [isFoldersClose, setIsFoldersClose] = useState(false)
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
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/mail">Mail</NavLink>
            <NavLink to="/note">Note</NavLink>
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

