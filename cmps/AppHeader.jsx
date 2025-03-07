import { NavigationBox } from "./NavigationBox.jsx"

const { Link, NavLink, useLocation } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function AppHeader() {

    const [currPage, setCurrPage] = useState(null)
    const [isNavOpen, setIsNavOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        if (location.pathname) {
            onSetCurrPage(location.pathname)
        }
    }, [location.pathname])

    function onSetCurrPage(pathname) {
        setCurrPage(pathname)
    }

    function onToggleNav() {
        setIsNavOpen(prev => prev = !isNavOpen)
    }

    return <header className="app-header">
        <div className='flex align-center'>
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

    </header>
}


function DynamicLogo({ currPage }) {
    switch (currPage) {
        case '/':
            return <React.Fragment>
                <img src="assets/images/home-logo.png" className='logo-img' alt="home" />
                <div className='page-name'>Appsus</div>
            </React.Fragment>
        case '/about':
            return <React.Fragment>
                <img src="assets/images/home-logo.png" className='logo-img' alt="about" />
                <div className='page-name'>About</div>
            </React.Fragment>
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

