import React, { useState, useEffect } from 'react';
import './ReviewSlider.scss';
import reviewsData from './data/reviews.json';

const ReviewSlider = () => {
  const [reviews, setReviews] = useState(reviewsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  const reviewsToShow = 3; 

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + reviewsToShow >= reviews.length ? 0 : prevIndex + reviewsToShow
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - reviewsToShow : prevIndex - reviewsToShow
    );
  };

  const handleAddReviewClick = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newReviewName && newReviewText) {
      const newReview = {
        id: reviews.length + 1,
        name: newReviewName,
        text: newReviewText,
      };
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setNewReviewName('');
      setNewReviewText('');
      setIsFormVisible(false);
    }
  };

  const handleCancelClick = () => {
    setNewReviewName('');
    setNewReviewText('');
    setIsFormVisible(false);
  };

  return (
    <div className="review-slider">
      <div className="review-content">
        {reviews.slice(currentIndex, currentIndex + reviewsToShow).map((review) => (
          <div key={review.id} className="review-card">
            <h3>{review.name}</h3>
            <p>{review.text}</p>
          </div>
        ))}
      </div>
      <button className="prev" onClick={handlePrev}>
        &lt;
      </button>
      <button className="next" onClick={handleNext}>
        &gt;
      </button>
      <div className="add-review">
        <button onClick={handleAddReviewClick}>Add Review</button>
      </div>

      {isFormVisible && (
        <div className="review-form">
          <h3>Add a New Review</h3>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={newReviewName}
              onChange={(e) => setNewReviewName(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Review"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              required
            ></textarea>
            <div className="form-buttons">
              <button type="submit">Submit Review</button>
              <button type="button" onClick={handleCancelClick}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewSlider;

