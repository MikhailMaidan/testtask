import React, { useState, useEffect } from 'react';
import './ReviewSlider.scss';
import reviewsData from './data/reviews.json';

const ReviewSlider = () => {
  const [reviews, setReviews] = useState(reviewsData);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const addReview = async (name, text) => {
    // Simulate API request
    const newReview = {
      id: reviews.length + 1,
      name,
      text,
    };
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  return (
    <div className="review-slider">
      <div className="review-content">
        <h3>{reviews[currentIndex].name}</h3>
        <p>{reviews[currentIndex].text}</p>
      </div>
      <button className="prev" onClick={handlePrev}>
        &lt;
      </button>
      <button className="next" onClick={handleNext}>
        &gt;
      </button>
      <div className="add-review">
        <button
          onClick={() =>
            addReview('New User', 'This is a new review added via API.')
          }
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default ReviewSlider;
