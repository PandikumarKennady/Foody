import {React, useEffect, useState} from 'react';
import { getNavBarRes } from '../helper/index';
import '../styles/Navbar.css'
import { Link } from 'react-router-dom';

export default function Navbar(){

    const [navBar, setNavBar] = useState({});

    async function getNavInfo() {
        await getNavBarRes().then(res => {
            setNavBar(res);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getNavInfo();
    }, [])
    
    
    return(
        <nav>
            <h1>{navBar.title}</h1>
            <ul>
                <li>
                    <Link to={"/"}>Home</Link>
                </li>
                    <li><a href={navBar?.order?.href}>{navBar?.order?.title}</a></li>
                    <li><a href={navBar.add_a_restaurant_?.href}>{navBar.add_a_restaurant_?.title}</a></li>
                     <li><a href={navBar.login?.href}>{navBar.login?.title}</a></li>
                    <li><a href={navBar.signup?.href}>{navBar.signup?.title}</a></li>
            </ul>
        </nav>
    )
}