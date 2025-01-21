import React from 'react'

import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import Collections from '../components/Collections';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div>
            <Navbar />
            <Carousel />
            <Collections />
            <Footer />
        </div>
    )
}