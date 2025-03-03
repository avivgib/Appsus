const { NavLink } = ReactRouterDOM

export function MailSideNav(props) {

    return (
        <aside className='mail-side-nav flex column align-center'>
            <NavLink to="/">
                <img src="assets/images/home-logo.png" alt="home" />
            </NavLink>
            {/* <NavLink to="/about">About</NavLink> */}
            <NavLink to="/note">
                <img src="assets/images/keep-logo.png" alt="keep" />
            </NavLink>
            <NavLink to="/mail">
                <img src="assets/images/gmail-logo.png" alt="gmail" />
            </NavLink>
        </aside>
    )
}