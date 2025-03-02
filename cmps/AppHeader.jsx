const { Link, NavLink, useLocation } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function AppHeader() {

    const [currPage, setCurrPage] = useState(null)
    const location = useLocation()

    useEffect(() => {
        if (location.pathname) {
            onSetCurrPage(location.pathname)
        }
    }, [location.pathname])

    function onSetCurrPage(pathname) {
        setCurrPage(pathname)
    }

    return <header className="app-header">
        <Link to={currPage || '/'}>
            <div className='main-logo'>
                <DynamicLogo currPage={currPage} />
            </div>
        </Link>

        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/mail">Mail</NavLink>
            <NavLink to="/note">Note</NavLink>
        </nav>
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
                <img src="assets/images/gmail-logo.png" className='logo-img' alt="gmail" />
                <div className='page-name'>Gmail</div>
            </React.Fragment>
        case '/note':
            return <React.Fragment>
                <img src="assets/images/keep-logo.png" className='logo-img' alt="gmail" />
                <div className='page-name'>Keep</div>
            </React.Fragment>
    }
}

