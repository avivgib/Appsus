
export function About() {
    return (
        <section className="about">
            <h1>About Us</h1>

            <div className='creator-box aviv'>
                <div className='creator-img'>
                    <img src="assets/images/aviv.jpg" alt="" />
                </div>
                <div className='creator-info'>
                    <div className='name'>
                        Aviv
                    </div>
                    <p className='about-me'>
                        Hello, my name is Aviv. I'm 35 years old and a student at Coding Academy.
                    </p>
                </div>
            </div>

            <div className='creator-box eliad'>
                <div className='creator-img'>
                    <img src="assets/images/eliad.jpeg" alt="" />
                </div>
                <div className='creator-info'>
                    <div className='name'>
                        Eliad
                    </div>
                    <p className='about-me'>
                        Hello, my name is Eliad. I'm 30 years old and currently learning programming.
                    </p>
                </div>
            </div>


        </section>
    )
}
