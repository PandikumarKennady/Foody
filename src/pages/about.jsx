import React from 'react'
import Navbar from '../components/Navbar'
import Blog from '../components/Blog'
import Footer from '../components/Footer'
import Report from '../components/Report'
import Contact from '../components/Contact'

export default function About() {
  return (
    <div>
        <Navbar />
       <Blog  id="blog"/>
       <Report id="report"/>
       <Contact id="contact" />
        <Footer />
    </div>
  )
}