import React, { useEffect, useState, useMemo } from 'react';
import { getResponse } from '../helper/index';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/Footer.css'

// Footer Logo Component
const FooterLogo = () => (
    <div className="footer-brand-logo">
        <div className="footer-logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="url(#footerLogoGradient)" strokeWidth="2.5" fill="none" />
                <circle cx="20" cy="20" r="14" stroke="url(#footerLogoGradient)" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.5" />
                <path d="M12 10 L12 18 M10 10 L10 14 M14 10 L14 14 M12 18 L12 30" 
                      stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 8 Q24 6 22 4" stroke="url(#footerLogoGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                <path d="M26 10 Q28 8 26 6" stroke="url(#footerLogoGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
                <path d="M30 8 Q32 6 30 4" stroke="url(#footerLogoGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                <ellipse cx="26" cy="22" rx="8" ry="4" fill="url(#footerLogoGradient)" opacity="0.2" />
                <path d="M18 22 Q22 18 34 22 Q34 30 26 30 Q18 30 18 22" fill="url(#footerLogoGradient)" />
                <defs>
                    <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B35" />
                        <stop offset="50%" stopColor="#FF8C42" />
                        <stop offset="100%" stopColor="#FFD93D" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <div className="footer-logo-text">
            <span className="footer-logo-main">Foody</span>
            <span className="footer-logo-tagline">taste the joy</span>
        </div>
    </div>
);

export default function Footer() {
    const [footer, setFooter] = useState({});
    const [searchParams] = useSearchParams();
    
    // Get the city query param to preserve across navigation
    const cityParam = searchParams.get('city');
    
    /**
     * Build a path with preserved query parameters (specifically 'city')
     */
    const buildPath = useMemo(() => {
        return (basePath) => {
            if (cityParam) {
                const separator = basePath.includes('?') ? '&' : '?';
                return `${basePath}${separator}city=${encodeURIComponent(cityParam)}`;
            }
            return basePath;
        };
    }, [cityParam]);

    async function getFooterInfo() {
        try {
            const res = await getResponse('foody_footer');
            setFooter(res);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getFooterInfo();
    }, []);

    const currentYear = new Date().getFullYear();

    // Default footer content
    const defaultLinks = {
        company: [
            { title: 'About Us', href: '/about' },
            { title: 'Careers', href: '/careers' },
            { title: 'Partner With Us', href: '/partner' },
            { title: 'Blog', href: '/blog' }
        ],
        support: [
            { title: 'Help Center', href: '/help' },
            { title: 'Report an Issue', href: '#report' },
            { title: 'FAQ', href: '/faq' },
            { title: 'Contact Us', href: '/contact' }
        ],
        legal: [
            { title: 'Terms of Service', href: '/terms' },
            { title: 'Privacy Policy', href: '/privacy' },
            { title: 'Cookie Policy', href: '/cookies' }
        ]
    };

    return (
        <footer>
            <div className="footer-top">
                <div className="footer-brand">
                    <Link to={buildPath("/")} className="footer-brand-link">
                        <FooterLogo />
                    </Link>
                    <p className="footer-tagline">
                        Delivering happiness, one meal at a time. Fresh, fast, and always delicious.
                    </p>
                    <div className="footer-app-cta">
                        <span>Get the app</span>
                        <div className="app-store-buttons">
                            <a href="#" className="app-button" aria-label="Download on App Store">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                            </a>
                            <a href="#" className="app-button" aria-label="Get it on Google Play">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <section className="footer-links">
                    {footer.fooder_classes?.length > 0 ? (
                        footer.fooder_classes.map((item, index) => {
                            if (item.class !== undefined) {
                                return (
                                    <aside key={index}>
                                        <h3>{item?.class?.class_title}</h3>
                                        <ul>
                                            {item?.class?.links?.map((instance, idx) => (
                                                <li key={idx}>
                                                    <a href={instance?.href}>{instance?.title}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </aside>
                                );
                            } else {
                                return (
                                    <aside key={index}>
                                        <h3>Connect With Us</h3>
                                        <ul className="social">
                                            {item?.social?.app?.map((app, idx) => (
                                                <li key={idx}>
                                                    <a href={app?.app_profile_url?.href} aria-label={app?.app_profile_url?.title}>
                                                        <img src={app?.icon?.url} alt="" />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </aside>
                                );
                            }
                        })
                    ) : (
                        <>
                            <aside>
                                <h3>Company</h3>
                                <ul>
                                    {defaultLinks.company.map((link, idx) => (
                                        <li key={idx}><a href={link.href}>{link.title}</a></li>
                                    ))}
                                </ul>
                            </aside>
                            <aside>
                                <h3>Support</h3>
                                <ul>
                                    {defaultLinks.support.map((link, idx) => (
                                        <li key={idx}><a href={link.href}>{link.title}</a></li>
                                    ))}
                                </ul>
                            </aside>
                            <aside>
                                <h3>Legal</h3>
                                <ul>
                                    {defaultLinks.legal.map((link, idx) => (
                                        <li key={idx}><a href={link.href}>{link.title}</a></li>
                                    ))}
                                </ul>
                            </aside>
                            <aside>
                                <h3>Connect With Us</h3>
                                <ul className="social">
                                    <li><a href="#" aria-label="Facebook">📘</a></li>
                                    <li><a href="#" aria-label="Instagram">📸</a></li>
                                    <li><a href="#" aria-label="Twitter">🐦</a></li>
                                    <li><a href="#" aria-label="LinkedIn">💼</a></li>
                                </ul>
                            </aside>
                        </>
                    )}
                </section>
            </div>

            <hr />

            <div className="footer-bottom">
                <p>
                    {footer?.copyright_information || `© ${currentYear} Foody. Crafted with ❤️ for food lovers everywhere.`}
                </p>
                <div className="footer-bottom-links">
                    <a href="/terms">Terms</a>
                    <a href="/privacy">Privacy</a>
                    <a href="/cookies">Cookies</a>
                </div>
            </div>
        </footer>
    );
}
