import { useState, useEffect, useRef } from 'react';
import './ReviewSlider.scss';
import reviewsData from '~/shared/mock-data-reviews.json';
import placeholderImage from '@/assets/images/imageProfile.SVG';
import { ReviewNote } from '../../../modules/reviewFetcher';


const REWIEW_BASE = 'https://test-2fc1a-default-rtdb.europe-west1.firebasedatabase.app/notes.json';

const gradients = [
  'linear-gradient(147deg, #e9d02d 0%, #f30661 74%)',
  'linear-gradient(147deg, #ff9966 0%, #ff5e62 74%)',
  'linear-gradient(147deg, #00c6ff 0%, #0072ff 74%)',
  'linear-gradient(147deg, #7b4397 0%, #dc2430 74%)',
  'linear-gradient(147deg, #ff7e5f 0%, #feb47b 74%)',
  'linear-gradient(147deg, #43cea2 0%, #185a9d 74%)',
  'linear-gradient(147deg, #00b09b 0%, #96c93d 74%)',
  'linear-gradient(147deg, #ff512f 0%, #dd2476 74%)',
  'linear-gradient(147deg, #56ccf2 0%, #2f80ed 74%)',
  'linear-gradient(147deg, #834d9b 0%, #d04ed6 74%)'
];

const ReviewSlider = () => {
  const [reviews, setReviews] = useState(reviewsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(1);
  const [currentGradient, setCurrentGradient] = useState(gradients[0]);
  const reviewsRef = useRef([]);
  const [fade, setFade] = useState(true);

  const reviewsToShow = 1;

  useEffect(() => {
    const reviewNote = new ReviewNote(REWIEW_BASE);
    reviewNote.fetchNotes().then(fetchedReviews => {
      if (fetchedReviews) {
        const reviewsArray = Object.values(fetchedReviews);
        setReviews(prevReviews => [...prevReviews, ...reviewsArray]);
      }
    });
  }, []);

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
      changeBackground();
    }, 200);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? reviews.length - reviewsToShow : prevIndex - reviewsToShow
      );
      setFade(true);
      changeBackground();
    }, 200);
  };

  const changeBackground = () => {
    const randomIndex = Math.floor(Math.random() * gradients.length);
    setCurrentGradient(gradients[randomIndex]);
  };

  const handleAddReviewClick = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const reviewNote = new ReviewNote(REWIEW_BASE);
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
      
      await reviewNote.submitNote({
        name: newReviewName,
        text: newReviewText,
        rating: newReviewRating,
      });
  
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
      <div
        className={`review-slider ${fade ? 'fade-in' : 'fade-out'}`}
        style={{background: currentGradient }}
      >
        <div className="review-content">
          {reviews.slice(currentIndex, currentIndex + reviewsToShow).map((review, index) => (
            <div
              key={review.id}
              className="review-card"
              ref={(el) => (reviewsRef.current[index] = el)}
            >
              <div className="review-slider__profile-picture">
                <img src={placeholderImage} alt={`${review.name}'s profile`}/>
              </div>
              <div className="review-slider__name">{review.name}</div>
              <div className="rating">{renderStars(review.rating)}</div>
              <p className="review-slider__text">{review.text}</p>
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






