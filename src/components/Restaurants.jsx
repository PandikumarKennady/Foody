import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants, getRestaurantsByCity } from '../helper/index';
import { initializePersonalize, getUserCity, setUserCity, getSupportedCities } from '../services/personalize.service';
import '../styles/Restaurants.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaMapMarkerAlt, FaPhone, FaStar, FaMotorcycle, FaUtensils } from 'react-icons/fa';

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [cityFilter, setCityFilter] = useState('all'); // 'all' or specific city

    useEffect(() => {
        initPersonalizationAndFetch();
    }, []);

    const initPersonalizationAndFetch = async () => {
        // Force refresh to always read current URL query params
        // This ensures ?city=tuty works when navigating to this page
        const { city, fromQueryParam } = await initializePersonalize({ forceRefresh: true });
        setSelectedCity(city);
        setCityFilter(city); // Default to user's city from URL or detection
        
        console.log(`[Restaurants] Initialized with city: ${city}, fromQueryParam: ${fromQueryParam}`);
        await fetchRestaurants(city);
    };

    const fetchRestaurants = async (city = null) => {
        try {
            setLoading(true);
            setError(null);
            
            let data;
            if (city && city !== 'all') {
                console.log(`[Restaurants] Fetching restaurants for city: ${city}`);
                data = await getRestaurantsByCity(city);
                console.log(`[Restaurants] Found ${data?.length || 0} restaurants for ${city}`);
            } else {
                console.log('[Restaurants] Fetching all restaurants');
                data = await getRestaurants();
            }
            setRestaurants(data);
        } catch (err) {
            console.error('Error fetching restaurants:', err);
            setError('Failed to load restaurants. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCityFilterChange = async (city) => {
        setCityFilter(city);
        if (city !== 'all') {
            setUserCity(city);
            setSelectedCity(city);
        }
        await fetchRestaurants(city);
    };

    // Filter restaurants based on search
    const filteredRestaurants = restaurants.filter(restaurant => {
        const query = searchQuery.toLowerCase();
        const name = (restaurant?.title || '').toLowerCase();
        const tagline = (restaurant?.tag_line || '').toLowerCase();
        const address = (restaurant?.address || '').toLowerCase();
        const cuisines = (restaurant?.cuisine_type || []).join(' ').toLowerCase();
        
        return name.includes(query) || tagline.includes(query) || 
               address.includes(query) || cuisines.includes(query);
    });

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="restaurants-page">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Finding the best restaurants...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="restaurants-page">
                    <div className="error-container">
                        <span style={{ fontSize: '4rem' }}>😕</span>
                        <h2>{error}</h2>
                        <button 
                            className="btn btn-primary"
                            onClick={fetchRestaurants}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="restaurants-page">
                <header className="restaurants-header">
                    <h1>Our Partner <span>Restaurants</span></h1>
                    <p className="restaurants-subtitle">
                        Discover amazing food from top-rated restaurants in {cityFilter === 'all' ? 'all cities' : cityFilter}
                    </p>
                </header>

                {/* City Filter and Search */}
                <div className="restaurant-filters">
                    <div className="city-filter-tabs">
                        <button 
                            className={`city-tab ${cityFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleCityFilterChange('all')}
                        >
                            All Cities
                        </button>
                        {getSupportedCities().map(city => (
                            <button 
                                key={city}
                                className={`city-tab ${cityFilter === city ? 'active' : ''}`}
                                onClick={() => handleCityFilterChange(city)}
                            >
                                📍 {city}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="restaurant-search">
                        <input
                            type="text"
                            placeholder="Search restaurants by name, cuisine, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="restaurant-search-input"
                        />
                        {searchQuery && (
                            <button 
                                className="clear-search-btn"
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <p className="restaurants-count">
                    Showing <span>{filteredRestaurants.length}</span> restaurants
                    {searchQuery && ` matching "${searchQuery}"`}
                </p>

                {filteredRestaurants.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-state-icon">🍽️</span>
                        <h2>No restaurants found</h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {searchQuery 
                                ? 'Try a different search term'
                                : 'No restaurants available at the moment.'
                            }
                        </p>
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')} 
                                className="btn btn-secondary" 
                                style={{ marginTop: '1rem' }}
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <main className="restaurants-grid">
                        {filteredRestaurants.map((restaurant, idx) => (
                            <article 
                                key={restaurant.uid || idx} 
                                className="restaurant-card"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <Link 
                                    to={`/foods?restaurant=${encodeURIComponent(restaurant.title)}`}
                                    className="restaurant-link"
                                >
                                    {/* Restaurant Logo/Image */}
                                    <div className="restaurant-image-wrapper">
                                        <img
                                            src={restaurant?.logo?.url || restaurant?.cover_image?.url || 'https://via.placeholder.com/400x200?text=Restaurant'}
                                            alt={restaurant?.title}
                                            className="restaurant-image"
                                            loading="lazy"
                                        />
                                        {restaurant?.ratings?.rating && (
                                            <span className="restaurant-rating">
                                                <FaStar /> {restaurant.ratings.rating}
                                            </span>
                                        )}
                                        {restaurant?.delivery_available && (
                                            <span className="delivery-badge">
                                                <FaMotorcycle /> Delivery
                                            </span>
                                        )}
                                    </div>

                                    {/* Restaurant Info */}
                                    <div className="restaurant-info">
                                        <h2 className="restaurant-name">{restaurant?.title}</h2>
                                        {restaurant?.tag_line && (
                                            <p className="restaurant-tagline">{restaurant.tag_line}</p>
                                        )}
                                        
                                        {/* Cuisine Tags */}
                                        {restaurant?.cuisine_type && restaurant.cuisine_type.length > 0 && (
                                            <div className="cuisine-tags">
                                                {restaurant.cuisine_type.slice(0, 3).map((cuisine, i) => (
                                                    <span key={i} className="cuisine-tag">
                                                        <FaUtensils /> {cuisine}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Address */}
                                        <div className="restaurant-meta">
                                            <p className="restaurant-address">
                                                <FaMapMarkerAlt />
                                                <span>{restaurant?.address}, {restaurant?.city}</span>
                                            </p>
                                            {restaurant?.phone && (
                                                <p className="restaurant-phone">
                                                    <FaPhone />
                                                    <span>{restaurant.phone}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* View Menu Button */}
                                        <div className="view-menu-btn">
                                            View Menu →
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </main>
                )}
            </div>
            <Footer />
        </>
    );
}

