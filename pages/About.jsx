
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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, ut, aliquam consectetur maxime dicta eum laudantium iusto quam eaque nostrum ratione mollitia quasi repellat! Sunt incidunt sit rem distinctio ratione.
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
