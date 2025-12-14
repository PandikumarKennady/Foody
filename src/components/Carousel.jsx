import React, { useEffect, useState, useCallback } from "react";
import { getCarouselItemsWithVariant, getCarouselItems } from "../helper/index";
import { 
  initializePersonalize, 
  setUserCity, 
  getSupportedCities, 
  getVariantAlias, 
  isFromQueryParam, 
  trackImpression,
  getRawVariantAliases 
} from "../services/personalize.service";
import '../styles/Carousel.css'
import { Link } from "react-router-dom";

/**
 * Carousel Component with Contentstack Personalize Edge SDK Integration
 * 
 * Fetches personalized carousel items from CMS using Personalize Edge SDK.
 * Supports URL query parameter for city-based experiences: ?city=tuticorin
 * 
 * The SDK fetches variants via x-cs-variant-uid header in CDA requests.
 * Reference: https://www.contentstack.com/docs/developers/sdks/personalize-edge-sdk/javascript
 */

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [slides, setSlides] = useState([]);
    const [userCity, setUserCityState] = useState('');
    const [showCitySelector, setShowCitySelector] = useState(false);
    const [isQueryParamMode, setIsQueryParamMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentVariant, setCurrentVariant] = useState('');

    /**
     * Fetch carousel items from CMS with personalization variant
     * Uses Personalize Edge SDK to get variant aliases for CDA requests
     * Falls back to base content when no variant is available for a city
     */
    async function fetchCarouselData() {
        setIsLoading(true);
        try {
            // Initialize personalization using Edge SDK
            // Priority: URL query param (?city=tuticorin) -> Edge SDK variants -> IP detection -> localStorage -> default
            const { city, variantAlias, fromQueryParam, sdkAliases } = await initializePersonalize();
            
            setUserCityState(city);
            setIsQueryParamMode(fromQueryParam || false);
            setCurrentVariant(variantAlias);
            
            console.log(`[Carousel] Initialized with Edge SDK - City: ${city}, Variant: ${variantAlias || '(none - using base content)'}, FromQueryParam: ${fromQueryParam}`);
            if (sdkAliases && Object.keys(sdkAliases).length > 0) {
                console.log(`[Carousel] SDK Variant Aliases:`, sdkAliases);
            } else {
                console.log(`[Carousel] No variant aliases from SDK for city: ${city} - will use base/default content`);
            }
            
            let carouselItems = [];
            
            // Fetch carousel items from CMS with the variant alias (if available)
            // The content service uses x-cs-variant-uid header to get personalized content
            if (variantAlias) {
                carouselItems = await getCarouselItemsWithVariant(variantAlias);
                console.log(`[Carousel] Fetched ${carouselItems?.length || 0} items with variant: ${variantAlias}`);
            }
            
            // Fallback: If no variant alias or no items returned, fetch base/default carousel items
            if (!carouselItems || carouselItems.length === 0) {
                console.log(`[Carousel] No personalized content for ${city}, fetching base carousel items...`);
                carouselItems = await getCarouselItems();
                console.log(`[Carousel] Fetched ${carouselItems?.length || 0} base carousel items`);
            }
            
            if (carouselItems && carouselItems.length > 0) {
                const mappedSlides = carouselItems.map(item => ({
                    uid: item.uid,
                    image: item.cover_image?.url || item.image?.url || '',
                    title: item.title || 'Discover Delicious',
                    subtitle: item.subtitle || '',
                    description: item.description || 'Amazing food awaits you',
                    ctaText: item.cta_text || 'Explore Menu',
                    ctaLink: item.cta_link || '/foods'
                }));
                
                setSlides(mappedSlides);
                setCurrentSlide(0);
                
                console.log(`[Carousel] Loaded ${mappedSlides.length} slides for ${city}${variantAlias ? ` with variant: ${variantAlias}` : ' (base content)'}`);
                
                // Track impression for personalization analytics via Edge SDK
                if (variantAlias) {
                    trackImpression('carousel_experience', variantAlias);
                }
            } else {
                console.log('[Carousel] No carousel items found from CMS');
                setSlides([]);
            }
        } catch (err) {
            console.error('Error fetching carousel:', err);
            setSlides([]);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Handle city change from dropdown
     * Updates Edge SDK attributes and refetches personalized content
     * Falls back to base content when no variant is available for the selected city
     */
    const handleCityChange = async (city) => {
        // setUserCity is now async as it updates Edge SDK
        const cityChanged = await setUserCity(city);
        
        if (cityChanged) {
            setUserCityState(city);
            setShowCitySelector(false);
            setIsQueryParamMode(false);
            
            // Get the updated variant alias (may include SDK aliases)
            const newVariantAlias = getVariantAlias();
            setCurrentVariant(newVariantAlias);
            
            console.log(`[Carousel] City changed to: ${city}, New variant: ${newVariantAlias || '(none - using base content)'}`);
            
            // Log SDK aliases for debugging
            const aliases = getRawVariantAliases();
            if (Object.keys(aliases).length > 0) {
                console.log(`[Carousel] SDK Aliases after city change:`, aliases);
            } else {
                console.log(`[Carousel] No variant aliases from SDK for ${city} - will use base content`);
            }
            
            // Refetch carousel items with new variant
            setIsLoading(true);
            try {
                let carouselItems = [];
                
                // Try to fetch with variant alias first
                if (newVariantAlias) {
                    carouselItems = await getCarouselItemsWithVariant(newVariantAlias);
                    console.log(`[Carousel] Fetched ${carouselItems?.length || 0} items with variant: ${newVariantAlias}`);
                }
                
                // Fallback: If no variant alias or no items returned, fetch base carousel items
                if (!carouselItems || carouselItems.length === 0) {
                    console.log(`[Carousel] No personalized content for ${city}, fetching base carousel items...`);
                    carouselItems = await getCarouselItems();
                    console.log(`[Carousel] Fetched ${carouselItems?.length || 0} base carousel items`);
                }
                
                if (carouselItems && carouselItems.length > 0) {
                    const mappedSlides = carouselItems.map(item => ({
                        uid: item.uid,
                        image: item.cover_image?.url || item.image?.url || '',
                        title: item.title || 'Discover Delicious',
                        subtitle: item.subtitle || '',
                        description: item.description || 'Amazing food awaits you',
                        ctaText: item.cta_text || 'Explore Menu',
                        ctaLink: item.cta_link || '/foods'
                    }));
                    
                    setSlides(mappedSlides);
                    setCurrentSlide(0);
                    
                    // Track impression for new variant
                    if (newVariantAlias) {
                        trackImpression('carousel_experience', newVariantAlias);
                    }
                } else {
                    console.log(`[Carousel] No carousel items found for ${city}`);
                    setSlides([]);
                }
            } catch (err) {
                console.error('Error fetching carousel for new city:', err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchCarouselData();
    }, []);

    // Auto-slide functionality
    const nextSlide = useCallback(() => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }
    }, [slides.length]);

    const prevSlide = () => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        }
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    useEffect(() => {
        if (!isAutoPlaying || slides.length === 0) return;
        
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, slides.length]);

    const currentSlideData = slides[currentSlide] || {};

    // Loading state
    if (isLoading) {
        return (
            <section className="hero-carousel">
                <div className="carousel-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading personalized content...</p>
                </div>
            </section>
        );
    }

    // No slides state
    if (slides.length === 0) {
        return (
            <section className="hero-carousel">
                <div className="carousel-empty">
                    <h2>Welcome to Foody</h2>
                    <p>Discover amazing food in {userCity || 'your city'}</p>
                    <Link to="/foods" className="btn-primary">
                        Explore Menu
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="hero-carousel">
            {/* Background Slides */}
            <div className="carousel-slides">
                {slides.map((slide, index) => (
                    <div
                        key={slide.uid || index}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />
                ))}
            </div>

            {/* Overlay */}
            <div className="carousel-overlay" />

            {/* City Selector */}
            <div className="city-selector-container">
                <button 
                    className="city-selector-btn"
                    onClick={() => setShowCitySelector(!showCitySelector)}
                >
                    📍 {userCity || 'Select City'}
                    {isQueryParamMode && <span className="query-param-indicator" title="Experience from URL">✨</span>}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>
                {showCitySelector && (
                    <div className="city-dropdown">
                        {getSupportedCities().map(city => (
                            <button
                                key={city}
                                className={`city-option ${city === userCity ? 'active' : ''}`}
                                onClick={() => handleCityChange(city)}
                            >
                                {city}
                                {city === userCity && <span className="checkmark">✓</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Variant Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && currentVariant && (
                <div className="variant-debug" style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.85)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    zIndex: 100,
                    maxWidth: '250px',
                    lineHeight: '1.4'
                }}>
                    <div style={{ marginBottom: '4px', fontWeight: 'bold', color: '#4ade80' }}>
                        🎯 Personalize Edge SDK
                    </div>
                    <div>City: {userCity}</div>
                    <div>Variant: {currentVariant}</div>
                    {isQueryParamMode && (
                        <div style={{ color: '#fbbf24', marginTop: '4px' }}>
                            ✨ From URL: ?city=...
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="carousel-content">
                <span className="carousel-badge">
                    🔥 Trending in {userCity || 'Your City'}
                    {isQueryParamMode && <span className="experience-badge"> (Personalized)</span>}
                </span>
                <h1 className="carousel-title" key={currentSlide}>
                    {currentSlideData.title}
                </h1>
                {currentSlideData.subtitle && (
                    <p className="carousel-subtitle">
                        {currentSlideData.subtitle}
                    </p>
                )}
                <p className="carousel-description">
                    {currentSlideData.description}
                </p>

                <div className="carousel-cta">
                    <Link to={currentSlideData.ctaLink || "/foods"} className="btn-primary">
                        {currentSlideData.ctaText || "Explore Menu"}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                    <a href="#categories" className="btn-secondary">
                        Browse Categories
                    </a>
                </div>

                {/* Stats */}
                <div className="hero-stats">
                    <div className="hero-stat">
                        <span className="hero-stat-number">500+</span>
                        <span className="hero-stat-label">Dishes</span>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-number">50+</span>
                        <span className="hero-stat-label">Restaurants</span>
                    </div>
                    <div className="hero-stat">
                        <span className="hero-stat-number">10k+</span>
                        <span className="hero-stat-label">Happy Customers</span>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button 
                        className="carousel-nav carousel-nav-prev" 
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <button 
                        className="carousel-nav carousel-nav-next" 
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="carousel-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <span>Scroll to explore</span>
                <div className="scroll-mouse" />
            </div>
        </section>
    );
}
