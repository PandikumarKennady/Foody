import React, { useEffect, useState, useRef } from "react";
import { getResponse } from "../helper/index";
import { addBlogReview, isCMAConfigured } from "../services/contentstack-cma.service";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";
import '../styles/Blog.css'

const Blog = () => {
    const [blog, setBlog] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        name: '',
        location: '',
        rating: 5,
        review: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 4000);
    };

    async function getBlogInfo() {
        try {
            const res = await getResponse('blog');
            setBlog(res);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getBlogInfo();
    }, []);

    // Handle review form input
    const handleReviewInputChange = (e) => {
        const { name, value } = e.target;
        setReviewForm({ ...reviewForm, [name]: value });
    };

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'warning');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size should be less than 5MB', 'warning');
                return;
            }
            setProfileImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setProfileImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle review submission
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Create new review object for local display
            const newReview = {
                ratings: { value: reviewForm.rating },
                reviews: reviewForm.review,
                name: reviewForm.name,
                location: reviewForm.location,
                profile_preview: imagePreview // Use base64 for local display
            };

            // Try CMA if configured, but don't fail the whole flow if it doesn't work
            if (isCMAConfigured()) {
                try {
                    console.log('[Blog] Attempting to submit review via CMA...');
                    
                    const reviewData = {
                        rating: reviewForm.rating,
                        review: reviewForm.review,
                        name: reviewForm.name,
                        location: reviewForm.location
                    };
                    
                    const updatedEntry = await addBlogReview(reviewData, profileImage);
                    setBlog(updatedEntry);
                    console.log('[Blog] Review submitted to Contentstack successfully!');
                } catch (cmaError) {
                    // CMA failed, but we'll still show success and store locally
                    console.warn('[Blog] CMA update failed, storing locally:', cmaError.message);
                    
                    // Add review to local state
                    setBlog(prev => ({
                        ...prev,
                        reviews: [newReview, ...(prev?.reviews || [])]
                    }));
                }
            } else {
                // CMA not configured, store locally
                console.log('[Blog] Storing review locally...');
                
                setBlog(prev => ({
                    ...prev,
                    reviews: [newReview, ...(prev?.reviews || [])]
                }));
            }
            
            setIsSubmitting(false);
            setSubmitSuccess(true);
            showToast('Review submitted successfully!', 'success');
            
            // Reset after showing success
            setTimeout(() => {
                setShowReviewModal(false);
                setSubmitSuccess(false);
                setReviewForm({ name: '', location: '', rating: 5, review: '' });
                setProfileImage(null);
                setImagePreview(null);
            }, 2500);
            
        } catch (error) {
            console.error('Error submitting review:', error);
            showToast('Failed to submit review. Please try again.', 'error');
            setIsSubmitting(false);
        }
    };

    // Render star rating
    const renderStars = (rating) => {
        const value = rating?.value || rating?.rating || 0;
        const fullStars = Math.floor(value);
        const hasHalfStar = value % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="star-rating">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="star">★</span>
                ))}
                {hasHalfStar && <span className="star half">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="star empty">☆</span>
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <article className="blog-container">
                <header className="blog-header">
                    <span className="blog-badge">💬 Reviews</span>
                    <h1 className="blog-title">
                        What Food Lovers <span>Are Saying</span>
                    </h1>
                </header>
                <section className="reviews-section">
                    {[1, 2, 3].map((i) => (
                        <aside key={i} className="review-card skeleton-card">
                            <div className="skeleton" style={{ height: '150px', marginBottom: '1rem' }} />
                            <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '1rem' }} />
                            <div className="skeleton" style={{ height: '50px' }} />
                        </aside>
                    ))}
                </section>
            </article>
        );
    }

    return (
        <article className="blog-container">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === 'success' && <FaCheckCircle />}
                        {toast.type === 'error' && <FaTimesCircle />}
                        {toast.type === 'warning' && <FaExclamationCircle />}
                    </div>
                    <span className="toast-message">{toast.message}</span>
                </div>
            )}
            
            <header className="blog-header">
                <span className="blog-badge">💬 Customer Stories</span>
                <h1 className="blog-title">
                    {blog?.title || (
                        <>Rave Reviews From <span>Happy Foodies</span></>
                    )}
                </h1>
                <p className="blog-description">
                    Don't just take our word for it — hear from thousands of satisfied customers who've discovered their new favorite meals through Foody.
                </p>
            </header>

            <section className="reviews-section">
                {blog?.reviews?.length > 0 ? (
                    blog.reviews.map((review, idx) => (
                        <aside key={idx} className={`review-card ${idx === 0 ? 'featured' : ''} ${review?.profile_preview ? 'new-review' : ''}`}>
                            {review?.profile_preview && (
                                <span className="new-badge">New</span>
                            )}
                            <div className="review-ratings">
                                {renderStars(review?.ratings)}
                            </div>
                            <p className="review-text">
                                "{review?.reviews}"
                            </p>
                            <div className="reviewer-info">
                                <img
                                    src={review?.profile_preview || review?.profile?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review?.name}`}
                                    alt={review?.name}
                                    className="reviewer-profile"
                                />
                                <div className="reviewer-details">
                                    <h4 className="reviewer-name">{review?.name}</h4>
                                    <h5 className="reviewer-location">{review?.location}</h5>
                                </div>
                            </div>
                        </aside>
                    ))
                ) : (
                    // Default reviews when no data
                    <>
                        <aside className="review-card featured">
                            <div className="review-ratings">
                                <div className="star-rating">
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                </div>
                            </div>
                            <p className="review-text">
                                "Absolutely mind-blowing! The Butter Chicken was creamy perfection, and it arrived piping hot. Foody has become my go-to for weekend dinners!"
                            </p>
                            <div className="reviewer-info">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                                    alt="Sarah M."
                                    className="reviewer-profile"
                                />
                                <div className="reviewer-details">
                                    <h4 className="reviewer-name">Sarah Mitchell</h4>
                                    <h5 className="reviewer-location">Mumbai, India</h5>
                                </div>
                            </div>
                        </aside>
                        <aside className="review-card">
                            <div className="review-ratings">
                                <div className="star-rating">
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star half">★</span>
                                </div>
                            </div>
                            <p className="review-text">
                                "The variety here is incredible! From South Indian dosas to Chinese noodles, everything tastes authentic. The delivery is super fast too!"
                            </p>
                            <div className="reviewer-info">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Raj"
                                    alt="Raj P."
                                    className="reviewer-profile"
                                />
                                <div className="reviewer-details">
                                    <h4 className="reviewer-name">Raj Patel</h4>
                                    <h5 className="reviewer-location">Bangalore, India</h5>
                                </div>
                            </div>
                        </aside>
                        <aside className="review-card">
                            <div className="review-ratings">
                                <div className="star-rating">
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                    <span className="star">★</span>
                                </div>
                            </div>
                            <p className="review-text">
                                "Finally found a delivery service that cares about quality! The food arrives fresh, and the packaging is eco-friendly. Highly recommend!"
                            </p>
                            <div className="reviewer-info">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
                                    alt="Priya K."
                                    className="reviewer-profile"
                                />
                                <div className="reviewer-details">
                                    <h4 className="reviewer-name">Priya Kumar</h4>
                                    <h5 className="reviewer-location">Delhi, India</h5>
                                </div>
                            </div>
                        </aside>
                    </>
                )}
            </section>

            <div className="write-review-cta">
                <p>Love your Foody experience? Share it with the world!</p>
                <button onClick={() => setShowReviewModal(true)} className="review-cta-btn">
                    Write a Review
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                </button>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
                    <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                        {submitSuccess ? (
                            <div className="review-success">
                                <span className="success-icon">🎉</span>
                                <h3>Thank You!</h3>
                                <p>Your review has been submitted successfully.</p>
                            </div>
                        ) : (
                            <>
                                <button 
                                    className="modal-close" 
                                    onClick={() => setShowReviewModal(false)}
                                    aria-label="Close modal"
                                >
                                    ✕
                                </button>
                                <h2>Share Your Experience</h2>
                                <p className="modal-subtitle">We'd love to hear about your Foody journey!</p>
                                
                                {!isCMAConfigured() && (
                                    <div className="cma-warning">
                                        <span>⚠️</span>
                                        <p>Demo mode: Review will be saved locally only. Configure CMA for permanent storage.</p>
                                    </div>
                                )}
                                
                                <form onSubmit={handleReviewSubmit} className="review-form">
                                    {/* Profile Image Upload */}
                                    <div className="form-group">
                                        <label>Profile Photo</label>
                                        <div className="image-upload-container">
                                            {imagePreview ? (
                                                <div className="image-preview-wrapper">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Profile preview" 
                                                        className="image-preview"
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="remove-image-btn"
                                                        onClick={removeImage}
                                                        aria-label="Remove image"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div 
                                                    className="image-upload-placeholder"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <div className="upload-icon">📷</div>
                                                    <span>Click to upload</span>
                                                    <span className="upload-hint">JPG, PNG up to 5MB</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageSelect}
                                                accept="image/*"
                                                className="hidden-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="review-name">Your Name</label>
                                            <input
                                                type="text"
                                                id="review-name"
                                                name="name"
                                                value={reviewForm.name}
                                                onChange={handleReviewInputChange}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="review-location">Location</label>
                                            <input
                                                type="text"
                                                id="review-location"
                                                name="location"
                                                value={reviewForm.location}
                                                onChange={handleReviewInputChange}
                                                placeholder="Mumbai, India"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Your Rating</label>
                                        <div className="rating-selector">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                            <span className="rating-text">
                                                {reviewForm.rating === 5 ? 'Excellent!' : 
                                                 reviewForm.rating === 4 ? 'Great!' :
                                                 reviewForm.rating === 3 ? 'Good' :
                                                 reviewForm.rating === 2 ? 'Fair' : 'Poor'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="review-text">Your Review</label>
                                        <textarea
                                            id="review-text"
                                            name="review"
                                            value={reviewForm.review}
                                            onChange={handleReviewInputChange}
                                            placeholder="Tell us about your experience with Foody..."
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="submit-review-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}

export default Blog;
