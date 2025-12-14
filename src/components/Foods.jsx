import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { getFoodsPaginated } from '../helper/index';
import '../styles/Foods.css'
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaSearch, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';

const ITEMS_PER_PAGE = 15;
const SCROLL_THRESHOLD = 400;

// Available filter options
const CATEGORIES = ['Top Trends', 'South Indian Meals', 'Sea Foods', 'Chineese', 'Drinks'];
const AVAILABILITY_OPTIONS = [
    { label: 'All Day', value: 'all' },
    { label: 'Breakfast (6AM - 11AM)', value: 'breakfast' },
    { label: 'Lunch (11AM - 3PM)', value: 'lunch' },
    { label: 'Evening (3PM - 7PM)', value: 'evening' },
    { label: 'Dinner (7PM - 11PM)', value: 'dinner' }
];
const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under ₹100', min: 0, max: 100 },
    { label: '₹100 - ₹200', min: 100, max: 200 },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: 'Above ₹500', min: 500, max: Infinity }
];

export default function Foods() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    const restaurantFromUrl = params.get('restaurant');

    const [food, setFood] = useState([]);
    const [allFood, setAllFood] = useState([]); // Store all fetched foods for filtering
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: categoryFromUrl || '',
        availability: 'all',
        priceRange: 0,
        restaurant: restaurantFromUrl || ''
    });
    const [restaurants, setRestaurants] = useState([]);
    
    // Refs
    const observerRef = useRef();
    const loadMoreRef = useRef(null);
    const searchInputRef = useRef(null);

    // Extract unique restaurants from food data
    useEffect(() => {
        if (allFood.length > 0) {
            const uniqueRestaurants = [...new Set(
                allFood.map(dish => dish?.restaurant?.[0]?.title || dish?.mess_name).filter(Boolean)
            )].sort();
            setRestaurants(uniqueRestaurants);
        }
    }, [allFood]);

    // Filter foods based on search and filters
    const filteredFoods = useMemo(() => {
        let result = [...allFood];
        
        // Search by name or restaurant
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(dish => {
                const title = (dish?.title || '').toLowerCase();
                const messName = (dish?.restaurant?.[0]?.title || dish?.mess_name || '').toLowerCase();
                const description = (dish?.description || '').toLowerCase();
                return title.includes(query) || messName.includes(query) || description.includes(query);
            });
        }
        
        // Filter by category
        if (filters.category) {
            result = result.filter(dish => 
                dish?.category?.includes(filters.category)
            );
        }
        
        // Filter by restaurant
        if (filters.restaurant) {
            result = result.filter(dish => {
                const restaurantName = dish?.restaurant?.[0]?.title || dish?.mess_name || '';
                return restaurantName === filters.restaurant;
            });
        }
        
        // Filter by price range
        const priceRange = PRICE_RANGES[filters.priceRange];
        if (priceRange && filters.priceRange > 0) {
            result = result.filter(dish => {
                const price = dish?.rate || 0;
                return price >= priceRange.min && price < priceRange.max;
            });
        }
        
        // Filter by availability
        if (filters.availability !== 'all') {
            result = result.filter(dish => {
                const availFrom = dish?.avail_from || '';
                const availUntil = dish?.avail_until || '';
                
                // Parse time to check availability
                const parseTime = (timeStr) => {
                    if (!timeStr) return null;
                    const match = timeStr.match(/(\d+)(AM|PM)/i);
                    if (!match) return null;
                    let hour = parseInt(match[1]);
                    if (match[2].toUpperCase() === 'PM' && hour !== 12) hour += 12;
                    if (match[2].toUpperCase() === 'AM' && hour === 12) hour = 0;
                    return hour;
                };
                
                const fromHour = parseTime(availFrom);
                const untilHour = parseTime(availUntil);
                
                if (fromHour === null || untilHour === null) return true; // Include if can't parse
                
                switch (filters.availability) {
                    case 'breakfast':
                        return fromHour <= 6 && untilHour >= 11;
                    case 'lunch':
                        return fromHour <= 11 && untilHour >= 15;
                    case 'evening':
                        return fromHour <= 15 && untilHour >= 19;
                    case 'dinner':
                        return fromHour <= 19 || untilHour >= 23 || untilHour <= 2;
                    default:
                        return true;
                }
            });
        }
        
        return result;
    }, [allFood, searchQuery, filters]);

    // Update displayed food when filters change
    useEffect(() => {
        setFood(filteredFoods);
    }, [filteredFoods]);

    // Scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Track scroll position for scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initial fetch - now fetches all items for client-side filtering
    const fetchAllFoods = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch more items for filtering (up to 100)
            const { entries } = await getFoodsPaginated({
                limit: 100,
                skip: 0
            });
            
            setAllFood(entries);
            setFood(entries);
            setHasMore(false); // Disable infinite scroll when filtering
        } catch (err) {
            console.error('Error fetching foods:', err);
            setError('Failed to load food items. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load more function (for infinite scroll when not filtering)
    const loadMoreFoods = useCallback(async () => {
        if (loadingMore || !hasMore || searchQuery || filters.category || filters.restaurant || filters.priceRange > 0 || filters.availability !== 'all') return;
        
        try {
            setLoadingMore(true);
            
            const { entries, hasMore: more } = await getFoodsPaginated({
                limit: ITEMS_PER_PAGE,
                skip: skip
            });
            
            setAllFood(prev => [...prev, ...entries]);
            setFood(prev => [...prev, ...entries]);
            setHasMore(more);
            setSkip(prev => prev + ITEMS_PER_PAGE);
        } catch (err) {
            console.error('Error loading more foods:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [skip, hasMore, loadingMore, searchQuery, filters]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    loadMoreFoods();
                }
            },
            { 
                root: null,
                rootMargin: '100px',
                threshold: 0.1 
            }
        );
        
        observerRef.current = observer;
        
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
        
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loadingMore, loading, loadMoreFoods]);

    // Initial fetch on mount
    useEffect(() => {
        fetchAllFoods();
    }, [fetchAllFoods]);

    // Update filters from URL
    useEffect(() => {
        if (categoryFromUrl) {
            setFilters(prev => ({ ...prev, category: categoryFromUrl }));
        }
    }, [categoryFromUrl]);

    useEffect(() => {
        if (restaurantFromUrl) {
            setFilters(prev => ({ ...prev, restaurant: restaurantFromUrl }));
            setShowFilters(true); // Show filters when coming from restaurant page
        }
    }, [restaurantFromUrl]);

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setFilters({
            category: '',
            availability: 'all',
            priceRange: 0,
            restaurant: ''
        });
    };

    // Check if any filter is active
    const hasActiveFilters = searchQuery || filters.category || filters.restaurant || filters.priceRange > 0 || filters.availability !== 'all';

    // Handle search input
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="foods-page">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Loading delicious dishes...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="foods-page">
                    <div className="error-container">
                        <span style={{ fontSize: '4rem' }}>😕</span>
                        <h2>{error}</h2>
                        <button 
                            className="btn btn-primary"
                            onClick={() => fetchAllFoods()}
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
            <div className="foods-page">
                <header className="foods-header">
                    <h1>
                        {filters.restaurant ? (
                            <><span>{filters.restaurant}</span> Menu</>
                        ) : filters.category ? (
                            <>Explore <span>{filters.category}</span></>
                        ) : (
                            <>Discover Our <span>Menu</span></>
                        )}
                    </h1>
                    <p className="foods-subtitle">
                        {filters.restaurant
                            ? `Delicious dishes served at ${filters.restaurant}`
                            : filters.category 
                            ? `Browse our selection of ${filters.category.toLowerCase()} dishes`
                            : 'Fresh, delicious food from the best local restaurants'
                        }
                    </p>
                </header>

                {/* Search and Filter Section */}
                <div className="search-filter-section">
                    {/* Search Bar */}
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search dishes, restaurants..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchQuery('')}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <button 
                        className={`filter-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter />
                        <span>Filters</span>
                        {hasActiveFilters && <span className="filter-badge">{
                            [filters.category, filters.restaurant, filters.priceRange > 0, filters.availability !== 'all']
                                .filter(Boolean).length
                        }</span>}
                        <FaChevronDown className={`chevron ${showFilters ? 'rotated' : ''}`} />
                    </button>
                </div>

                {/* Expandable Filters Panel */}
                <div className={`filters-panel ${showFilters ? 'expanded' : ''}`}>
                    <div className="filters-grid">
                        {/* Category Filter */}
                        <div className="filter-group">
                            <label className="filter-label">Category</label>
                            <select 
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Restaurant Filter */}
                        <div className="filter-group">
                            <label className="filter-label">Restaurant</label>
                            <select 
                                value={filters.restaurant}
                                onChange={(e) => handleFilterChange('restaurant', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Restaurants</option>
                                {restaurants.map(rest => (
                                    <option key={rest} value={rest}>{rest}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="filter-group">
                            <label className="filter-label">Price Range</label>
                            <select 
                                value={filters.priceRange}
                                onChange={(e) => handleFilterChange('priceRange', parseInt(e.target.value))}
                                className="filter-select"
                            >
                                {PRICE_RANGES.map((range, idx) => (
                                    <option key={idx} value={idx}>{range.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Availability Filter */}
                        <div className="filter-group">
                            <label className="filter-label">Availability</label>
                            <select 
                                value={filters.availability}
                                onChange={(e) => handleFilterChange('availability', e.target.value)}
                                className="filter-select"
                            >
                                {AVAILABILITY_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            <FaTimes />
                            Clear All Filters
                        </button>
                    )}
                </div>

                {/* Active Filters Tags */}
                {hasActiveFilters && (
                    <div className="active-filters">
                        {searchQuery && (
                            <span className="filter-tag">
                                Search: "{searchQuery}"
                                <button onClick={() => setSearchQuery('')}><FaTimes /></button>
                            </span>
                        )}
                        {filters.category && (
                            <span className="filter-tag">
                                {filters.category}
                                <button onClick={() => handleFilterChange('category', '')}><FaTimes /></button>
                            </span>
                        )}
                        {filters.restaurant && (
                            <span className="filter-tag">
                                {filters.restaurant}
                                <button onClick={() => handleFilterChange('restaurant', '')}><FaTimes /></button>
                            </span>
                        )}
                        {filters.priceRange > 0 && (
                            <span className="filter-tag">
                                {PRICE_RANGES[filters.priceRange].label}
                                <button onClick={() => handleFilterChange('priceRange', 0)}><FaTimes /></button>
                            </span>
                        )}
                        {filters.availability !== 'all' && (
                            <span className="filter-tag">
                                {AVAILABILITY_OPTIONS.find(o => o.value === filters.availability)?.label}
                                <button onClick={() => handleFilterChange('availability', 'all')}><FaTimes /></button>
                            </span>
                        )}
                    </div>
                )}

                {/* Results Count */}
                <div className="results-info">
                    <p className="foods-count">
                        Showing <span>{food.length}</span> {food.length === 1 ? 'dish' : 'dishes'}
                        {hasActiveFilters && ` (filtered from ${allFood.length})`}
                    </p>
                </div>

                {food.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-state-icon">🍽️</span>
                        <h2>No dishes found</h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {hasActiveFilters 
                                ? 'Try adjusting your search or filters'
                                : 'No dishes available at the moment.'
                            }
                        </p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <main className="food-container">
                            {food.map((dish, idx) => (
                                <article 
                                    key={dish.uid || idx} 
                                    className="food-card"
                                    style={{ 
                                        animationDelay: `${(idx % ITEMS_PER_PAGE) * 0.05}s` 
                                    }}
                                >
                                    <Link to={dish?.url?.startsWith('/foods') ? dish.url : `/foods${dish.url}`} style={{ textDecoration: 'none' }}>
                                        <div className="image-wrapper">
                                            <img
                                                src={dish?.dish_image?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                                alt={dish?.title}
                                                className="food-image"
                                                loading="lazy"
                                            />
                                            {(dish?.ratings?.value || dish?.ratings?.rating) && (
                                                <span className="rating-badge">
                                                    ★ {dish.ratings.value || dish.ratings.rating}
                                                </span>
                                            )}
                                        </div>
                                        <div className="food-details">
                                            <div className="left-section">
                                                <h2 className="dish-title">{dish?.title}</h2>
                                                <h3 className="mess-name">{dish?.restaurant?.[0]?.title || dish?.mess_name || 'Restaurant'}</h3>
                                                <h4 className="mess-address">{dish?.restaurant?.[0]?.address || dish?.mess_address || ''}</h4>
                                            </div>
                                            <div className="right-sections">
                                                <p className="price">₹{dish?.rate}</p>
                                                <p className="avail-time">
                                                    {dish?.avail_from} - {dish?.avail_until}
                                                </p>
                                            </div>
                                        </div>
                                        {dish?.category && dish.category.length > 0 && (
                                            <ul className="categories">
                                                {dish.category.slice(0, 3).map((cat, catIdx) => (
                                                    <li key={catIdx} className="category-item">
                                                        <h4>#{cat}</h4>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </Link>
                                </article>
                            ))}
                        </main>

                        {/* Infinite scroll trigger - only when not filtering */}
                        {!hasActiveFilters && (
                            <div 
                                ref={loadMoreRef} 
                                className="load-more-trigger"
                            >
                                {loadingMore && (
                                    <div className="loading-more">
                                        <div className="loading-spinner-small"></div>
                                        <p>Loading more dishes...</p>
                                    </div>
                                )}
                                {!hasMore && food.length > ITEMS_PER_PAGE && (
                                    <div className="end-of-list">
                                        <span>🍽️</span>
                                        <p>You've explored all {food.length} dishes!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
            
            {/* Scroll to Top Button */}
            <button 
                className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <svg viewBox="0 0 24 24">
                    <path d="M12 4l-8 8h5v8h6v-8h5z" />
                </svg>
            </button>
        </>
    );
}
