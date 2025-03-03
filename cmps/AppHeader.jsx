import { MailFilter } from "../apps/mail/cmps/MailFilter.jsx"
import { mailService } from "../apps/mail/services/mail.service.js"


const { Link, NavLink, useLocation, useSearchParams } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function AppHeader() {

    const [currPage, setCurrPage] = useState(null)
    const [isFoldersClose, setIsFoldersClose] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState({ ...mailService.getFilterFromSearchParams(searchParams) })
    const location = useLocation()

    useEffect(() => {
        setSearchParams(filterBy)
    }, [filterBy])

    useEffect(() => {
        const isStatus = searchParams.get('status') ? true : false
        if (isStatus) {
            setFilterBy(prev => ({ ...mailService.getFilterFromSearchParams(searchParams) }))
        }
    }, [searchParams])

    function onSetFilterBy(editFilterBy) {
        setFilterBy(editFilterBy)
    }

    useEffect(() => {
        if (location.pathname) {
            onSetCurrPage(location.pathname)
        }
    }, [location.pathname])

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

        {currPage === '/mail' && <MailFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />}

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

