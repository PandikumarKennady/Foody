import React, { useEffect, useState, useMemo } from 'react';
import { getResponse } from '../helper/index';
import '../styles/Collections.css'
import { Link, useSearchParams } from 'react-router-dom';

export default function Collections() {
    const [collection, setCollection] = useState({});
    const [isLoading, setIsLoading] = useState(true);
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

    async function getCollectionInfo() {
        try {
            const res = await getResponse('categories');
            setCollection(res);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCollectionInfo();
    }, []);

    // Default captivating descriptions for categories
    const categoryDescriptions = {
        'Top Trends': 'What everyone\'s craving right now',
        'South Indian Meals': 'Authentic flavors from the South',
        'Sea Foods': 'Fresh catches, ocean to plate',
        'Chineese': 'Wok-fired perfection',
        'Drinks': 'Refresh your soul',
        'default': 'Discover something delicious'
    };

    return (
        <article className="collection-container" id="categories">
            <header className="collection-header">
                <span className="collection-badge">✨ Curated For You</span>
                <h1 className="collection-title">
                    {collection?.title || (
                        <>Explore Culinary <span>Destinations</span></>
                    )}
                </h1>
                <p className="collection-description">
                    {collection?.description || 
                        'From sizzling street food to gourmet delights — dive into a world of flavors crafted by the finest local kitchens.'
                    }
                </p>
            </header>

            {isLoading ? (
                <section className="category-section">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="category-card skeleton-card">
                            <div className="skeleton" style={{ height: '200px' }} />
                        </div>
                    ))}
                </section>
            ) : (
                <section className="category-section">
                    {collection?.category?.map((category, index) => (
                        <aside key={index} className="category-card">
                            <Link to={buildPath(category?.category_link?.href || '/foods')} className="category-link">
                                <img
                                    src={category?.image?.url}
                                    alt={category?.category_link?.title}
                                    className="category-image"
                                    loading="lazy"
                                />
                                <div className="category-overlay">
                                    <span className="category-count">
                                        {Math.floor(Math.random() * 50) + 10}+ dishes
                                    </span>
                                </div>
                            </Link>
                            <div className="category-content">
                                <h3 className="category-title">{category?.category_link?.title}</h3>
                                <p className="category-tagline">
                                    {categoryDescriptions[category?.category_link?.title] || categoryDescriptions.default}
                                </p>
                            </div>
                        </aside>
                    ))}
                </section>
            )}

            <div className="collection-view-all">
                <Link to={buildPath("/foods")}>
                    View All Dishes
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </Link>
            </div>
        </article>
    );
}
