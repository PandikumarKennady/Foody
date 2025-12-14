import React, { useEffect, useState } from 'react';
import { getNavBarRes } from '../helper/index';
import '../styles/Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Custom Logo Component
const FoodyLogo = () => (
    <div className="brand-logo">
        <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Plate base */}
                <circle cx="20" cy="20" r="18" stroke="url(#logoGradient)" strokeWidth="2.5" fill="none" />
                <circle cx="20" cy="20" r="14" stroke="url(#logoGradient)" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.5" />
                
                {/* Fork */}
                <path d="M12 10 L12 18 M10 10 L10 14 M14 10 L14 14 M12 18 L12 30" 
                      stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                
                {/* Steam lines */}
                <path d="M22 8 Q24 6 22 4" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                <path d="M26 10 Q28 8 26 6" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
                <path d="M30 8 Q32 6 30 4" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                
                {/* Food bowl */}
                <ellipse cx="26" cy="22" rx="8" ry="4" fill="url(#logoGradient)" opacity="0.2" />
                <path d="M18 22 Q22 18 34 22 Q34 30 26 30 Q18 30 18 22" fill="url(#logoGradient)" />
                
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B35" />
                        <stop offset="50%" stopColor="#FF8C42" />
                        <stop offset="100%" stopColor="#FFD93D" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <div className="logo-text">
            <span className="logo-main">Foody</span>
            <span className="logo-tagline">taste the joy</span>
        </div>
    </div>
);

export default function Navbar() {
    const [navBar, setNavBar] = useState({});
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, isRestaurantAdmin, logout } = useAuth();

    async function getNavInfo() {
        try {
            const res = await getNavBarRes();
            setNavBar(res);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getNavInfo();
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowProfileMenu(false);
    }, [location]);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.profile-dropdown')) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={isScrolled ? 'scrolled' : ''}>
            <Link to="/" className="logo-link">
                <FoodyLogo />
            </Link>

            {/* Mobile Menu Toggle */}
            <div 
                className={`menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={isMobileMenuOpen ? 'open' : ''}>
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/foods" className={location.pathname === '/foods' || location.pathname.startsWith('/foods/') ? 'active' : ''}>
                        Menu
                    </Link>
                </li>
                <li>
                    <Link to="/restaurants" className={location.pathname === '/restaurants' ? 'active' : ''}>
                        Restaurants
                    </Link>
                </li>
                {navBar?.order && (
                    <li>
                        <a href={navBar.order.href}>{navBar.order.title}</a>
                    </li>
                )}
                <li>
                    <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                        About
                    </Link>
                </li>
                
                {/* Auth Section */}
                {isAuthenticated ? (
                    <li className="profile-dropdown">
                        <button 
                            className="profile-trigger"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowProfileMenu(!showProfileMenu);
                            }}
                        >
                            <span className="profile-avatar">
                                {user?.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                            <span className="profile-name">{user?.name?.split(' ')[0]}</span>
                            <svg className={`dropdown-arrow ${showProfileMenu ? 'open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        
                        {showProfileMenu && (
                            <div className="profile-menu">
                                <div className="profile-menu-header">
                                    <span className="menu-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                    <div className="menu-user-info">
                                        <span className="menu-user-name">{user?.name}</span>
                                        <span className="menu-user-email">{user?.email}</span>
                                    </div>
                                </div>
                                <div className="profile-menu-divider"></div>
                                {isRestaurantAdmin && (
                                    <Link to="/admin/dashboard" className="profile-menu-item">
                                        <span>📊</span> Dashboard
                                    </Link>
                                )}
                                <Link to="/orders" className="profile-menu-item">
                                    <span>📦</span> My Orders
                                </Link>
                                <div className="profile-menu-divider"></div>
                                <button onClick={handleLogout} className="profile-menu-item logout">
                                    <span>🚪</span> Logout
                                </button>
                            </div>
                        )}
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to="/login" className={`nav-auth-btn login ${location.pathname === '/login' ? 'active' : ''}`}>
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/signup" className="nav-auth-btn signup">
                                Sign Up
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
