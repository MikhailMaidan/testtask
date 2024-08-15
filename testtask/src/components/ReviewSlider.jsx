import React, { useState, useEffect, useRef } from 'react';
import './ReviewSlider.scss';
import reviewsData from './data/reviews.json';
import placeholderImage from '../images/imageProfile.png'; 

const ReviewSlider = () => {
  const [reviews, setReviews] = useState(reviewsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(1);
  const [maxHeight, setMaxHeight] = useState(0);
  const reviewsRef = useRef([]);
  const [fade, setFade] = useState(true);

  const reviewsToShow = 1;

  useEffect(() => {
    const heights = reviewsRef.current.map((ref) => ref.offsetHeight);
    const max = Math.max(...heights);
    setMaxHeight(max);
  }, [reviews]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length, currentIndex]);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + reviewsToShow >= reviews.length ? 0 : prevIndex + reviewsToShow
      );
      setFade(true);
    }, 200); 
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? reviews.length - reviewsToShow : prevIndex - reviewsToShow
      );
      setFade(true);
    }, 200); 
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
        rating: newReviewRating,
      };
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setNewReviewName('');
      setNewReviewText('');
      setNewReviewRating(1); 
      setIsFormVisible(false);
    }
  };

  const handleCancelClick = () => {
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewRating(1); 
    setIsFormVisible(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'filled-star' : 'empty-star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <div className={`review-slider ${fade ? 'fade-in' : 'fade-out'}`} style={{ height: maxHeight }}>
        <div className="review-content">
          {reviews.slice(currentIndex, currentIndex + reviewsToShow).map((review, index) => (
            <div
              key={review.id}
              className="review-card"
              ref={(el) => (reviewsRef.current[index] = el)}
            >
              <img src={placeholderImage} alt={`${review.name}'s profile`} className="profile-picture" />
              <h3>{review.name}</h3>
              <div className="rating">{renderStars(review.rating)}</div>
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
      </div>

      {isFormVisible ? (
        <div className="review-form-bottom">
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
            <div className="rating-selection">
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit">Submit Review</button>
              <button type="button" onClick={handleCancelClick}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="add-review-bottom">
          <button onClick={handleAddReviewClick}>Add Review</button>
        </div>
      )}
    </>
  );
};

export default ReviewSlider;



