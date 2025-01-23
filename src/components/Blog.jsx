import React, { useEffect, useState } from "react";
import { getResponse } from "../helper/index";
import '../styles/Blog.css'


const Blog = () => {

    const [blog, setBlog] = useState({});

    async function getBlogInfo() {
        await getResponse('blog').then(res => {
            setBlog(res);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getBlogInfo();
    }, [])


    return (
        <article className="blog-container">
            <h1 className="blog-title">{blog?.title}</h1>
            <section className="reviews-section">
                {blog?.reviews?.map((review, idx) => (
                    <aside key={idx} className="review-card">
                        <p className="review-text">❝{review?.reviews}❞</p>
                        <p className="review-ratings">
                            <p className="review-ratings">
                                {Array(Math.floor(review?.ratings?.value || 0)) // Full stars
                                    .fill('★')
                                    .join('')}
                                {review?.ratings?.value % 1 !== 0 ? '⯨' : ''} {/* Half star if applicable */}
                                {Array(5 - Math.ceil(review?.ratings?.value || 0)) // Empty stars
                                    .fill('☆')
                                    .join('')}
                            </p>
                        </p>
                        <div className="reviewer-info">
                            <img
                                src={review?.profile?.url}
                                alt={review?.name}
                                className="reviewer-profile"
                            />
                            <div className="reviewer-details">
                                <h4 className="reviewer-name">{review?.name}</h4>
                                <h5 className="reviewer-location">{review?.location}</h5>
                            </div>
                        </div>
                    </aside>
                ))}
            </section>
        </article>

    )
}

export default Blog;