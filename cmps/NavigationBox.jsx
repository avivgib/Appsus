
const { Link, NavLink, useLocation } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function NavigationBox({ onToggleNav }) {

    const navRef = useRef()

    useEffect(() => {

        setTimeout(() => {
            document.addEventListener('click', handleClickOutside)
        }, 100)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    function handleClickOutside({ target }) {
        if (target !== navRef.current) {
            console.log(target);
            onToggleNav()
        }
    }



    return (
        <section ref={navRef} className='navigation-box' onClick={(event) => { event.stopPropagation() }} >
            <NavLink to="/" onClick={onToggleNav}>
                <img src="assets/images/home-logo.png" alt="home" className='btn-logo' />
                <span className='btn-name'>Home</span>
            </NavLink>
            <NavLink to="/about" onClick={onToggleNav}>
                <img src="assets/images/home-logo.png" alt="about" className='btn-logo' />
                <span className='btn-name'>About</span>
            </NavLink>
            <NavLink to="/mail" onClick={onToggleNav}>
                <img src="assets/images/gmail-logo.png" alt="gmail" className='btn-logo' />
                <span className='btn-name'>Gmail</span>
            </NavLink>
            <NavLink to="/note" onClick={onToggleNav}>
                <img src="assets/images/keep-logo.png" alt="keep" className='btn-logo' />
                <span className='btn-name'>Keep</span>
            </NavLink>
        </section>
    )
}