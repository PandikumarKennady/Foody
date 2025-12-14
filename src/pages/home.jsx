import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import Collections from '../components/Collections';
import Blog from '../components/Blog';
import Footer from '../components/Footer';

export default function Home() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={`app-container ${isLoaded ? 'loaded' : ''}`}>
            <Navbar />
            <main>
                <Carousel />
                <Collections />
                <Blog />
            </main>
            <Footer />
        </div>
    )
}
