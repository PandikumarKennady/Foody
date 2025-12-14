import React from "react";
import { useState, useEffect } from "react";
import "../styles/Contact.css"
import { getResponse } from "../helper/index";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

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
        <section className="contact-section">
            <div className="contact-container">
                {/* Header */}
                <header className="contact-header">
                    <h1>Get in <span>Touch</span></h1>
                    <p>We'd love to hear from you. Reach out anytime!</p>
                </header>

                {/* Contact Info Grid */}
                <div className="contact-info-grid">
                    {/* Brand Card */}
                    <article className="contact-brand-card">
                        <div className="brand-logo-section">
                            <div className="brand-icon">
                                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="18" stroke="url(#contactLogoGradient)" strokeWidth="2.5" fill="none" />
                                    <path d="M12 10 L12 18 M10 10 L10 14 M14 10 L14 14 M12 18 L12 30" 
                                          stroke="url(#contactLogoGradient)" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M22 8 Q24 6 22 4" stroke="url(#contactLogoGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                                    <path d="M26 10 Q28 8 26 6" stroke="url(#contactLogoGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
                                    <ellipse cx="26" cy="22" rx="8" ry="4" fill="url(#contactLogoGradient)" opacity="0.2" />
                                    <path d="M18 22 Q22 18 34 22 Q34 30 26 30 Q18 30 18 22" fill="url(#contactLogoGradient)" />
                                    <defs>
                                        <linearGradient id="contactLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#FF6B35" />
                                            <stop offset="50%" stopColor="#FF8C42" />
                                            <stop offset="100%" stopColor="#FFD93D" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="brand-text">
                                <h2>{contact?.brand_name || 'Foody'}</h2>
                                <span className="brand-tagline">taste the joy</span>
                            </div>
                        </div>
                        <address className="brand-address">
                            <FaMapMarkerAlt className="address-icon" />
                            <span>{contact?.address || 'Loading address...'}</span>
                        </address>
                    </article>

                    {/* Phone Card */}
                    <article className="contact-card">
                        <div className="contact-card-header">
                            <div className="contact-card-icon phone-icon">
                                <FaPhoneAlt />
                            </div>
                            <h3>Phone</h3>
                        </div>
                        <ul className="contact-list">
                            {contact?.mobile?.map((nbr, idx) => (
                                <li key={idx}>
                                    <a href={`tel:${nbr}`}>{nbr}</a>
                                </li>
                            )) || <li className="loading">Loading...</li>}
                        </ul>
                    </article>

                    {/* Email Card */}
                    <article className="contact-card">
                        <div className="contact-card-header">
                            <div className="contact-card-icon email-icon">
                                <FaEnvelope />
                            </div>
                            <h3>Email</h3>
                        </div>
                        <ul className="contact-list">
                            {contact?.email?.map((id, idx) => (
                                <li key={idx}>
                                    <a href={`mailto:${id}`}>{id}</a>
                                </li>
                            )) || <li className="loading">Loading...</li>}
                        </ul>
                    </article>
                </div>
            </div>
        </section>
    )
}
