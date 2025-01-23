import React from "react";
import { useState, useEffect } from "react";
import "../styles/Contact.css"
import { getResponse } from "../helper/index";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

export default function Contact() {

    const [contact, setContact] = useState({});

    async function getContactInfo() {
        await getResponse('contact_us').then(res => {
            setContact(res);
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getContactInfo();
    }, [])


    return (
        <article class="contact-info">
            <section class="brand-details">
                <h1>{contact?.brand_name}</h1>
                <address>{contact?.address}</address>
            </section>

            <section class="contact-details">
                <h3>Phone</h3>
                <ul class="contact-list">
                    {contact?.mobile?.map((nbr, idx) => {
                        return (
                            <li key={idx}>
                                <FaPhoneAlt className="icon" />
                                {nbr}
                            </li>
                        );
                    })}
                </ul>
                <h3>Email</h3>
                <ul class="contact-list">
                    {contact?.email?.map((id, idx) => {
                        return (
                            <li key={idx}>
                                <IoIosMail className="icon" />
                                {id}
                            </li>
                        );
                    })}
                </ul>
            </section>
        </article>

    )
}

