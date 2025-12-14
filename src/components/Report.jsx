import React, { useState } from 'react'
import '../styles/Report.css'
import axios from 'axios'
import { FaTimesCircle } from 'react-icons/fa'

const Report = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    // Show toast notification
    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'error' });
        }, 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const name = e.target.name?.value;
        const email = e.target.mail?.value;
        const query = e.target.query?.value;

        try {
            await axios.post('https://app.contentstack.com/automations-api/run/15a4152cf31e449296f89fc9fa781368', {
                "entry": {
                    "title": name + email,
                    "form": {
                        "name": name,
                        "email": email,
                        "fraud_issue": query
                    }
                }
            });
            setIsSubmitted(true);
        } catch (err) {
            console.log(err);
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="fraud-report-container" id='report'>
                <div className="form-success">
                    <span className="form-success-icon">✅</span>
                    <h3>Report Submitted Successfully!</h3>
                    <p>Thank you for helping us maintain a safe community. Our team will review your report and take appropriate action.</p>
                    <button 
                        className="form-submit-button" 
                        onClick={() => setIsSubmitted(false)}
                        style={{ maxWidth: '200px' }}
                    >
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fraud-report-container" id='report'>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    <div className="toast-icon">
                        <FaTimesCircle />
                    </div>
                    <span className="toast-message">{toast.message}</span>
                </div>
            )}
            
            <h1 className="fraud-report-title">
                Report <span>Suspicious Activity</span>
            </h1>
            <p className="fraud-report-subtitle">
                Help us keep Foody safe. Report any fraudulent restaurants, misleading information, or suspicious behavior.
            </p>

            <div className="report-info">
                <span className="report-info-icon">🛡️</span>
                <p>
                    Your report is confidential. We take all reports seriously and will investigate within 24-48 hours.
                </p>
            </div>

            <form className="fraud-report-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        id='name'
                        required
                        minLength="3"
                        maxLength="50"
                        className="form-input"
                        name='name'
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mail">Email Address</label>
                    <input
                        type="email"
                        name="mail"
                        id="mail"
                        required
                        placeholder="your.email@example.com"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="query">Describe the Issue</label>
                    <textarea
                        placeholder="Please provide details about the fraudulent activity, including restaurant name, order details, and what happened..."
                        required
                        id='query'
                        className="form-textarea"
                        name='query'
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    className="form-submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Report
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

export default Report
