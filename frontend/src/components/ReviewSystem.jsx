import { useState, useEffect } from 'react';
import api from '../api';

function ReviewSystem({ teacherId, userId, canReview, sessionId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [teacherId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/teacher/${teacherId}`);
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/reviews', {
        session_id: sessionId,
        rating,
        review_text: reviewText
      });

      // Refresh reviews
      await fetchReviews();
      setShowForm(false);
      setRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful`);
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, helpful_votes: response.data.helpful_votes }
          : r
      ));
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (count, interactive = false, size = 'text-xl') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => interactive && setRating(star)}
            className={`${size} transition-all ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          >
            <span className={
              star <= (interactive ? (hoveredRating || rating) : count)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }>
              ★
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="card-static">
        <div className="flex items-center justify-center py-8">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="card-static">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
          Reviews & Ratings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-[var(--color-text-primary)] mb-2">
              {averageRating}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(parseFloat(averageRating)))}
            </div>
            <p className="text-[var(--color-text-secondary)]">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-secondary)] w-12">
                  {star} star
                </span>
                <div className="flex-1 h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-[var(--color-text-secondary)] w-8">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      {canReview && sessionId && (
        <div className="card-static">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn-secondary w-full"
            >
              Write a Review
            </button>
          ) : (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Leave a Review
              </h4>
              
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-4">
                  {renderStars(rating, true, 'text-3xl')}
                  <span className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {rating > 0 ? `${rating}/5` : 'Select rating'}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this teacher..."
                  className="input-field h-32"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={submitReview}
                  disabled={rating === 0 || submitting}
                  className="btn-primary flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setRating(0);
                    setReviewText('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="card-static text-center py-8">
            <p className="text-[var(--color-text-secondary)]">
              No reviews yet. Be the first to leave a review!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="card-static">
              <div className="flex items-start gap-4">
                <div className="avatar">
                  {review.student_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          {review.student_name || 'Anonymous'}
                        </span>
                        {review.is_verified_session && (
                          <span className="badge badge-success text-xs">
                            ✓ Verified Session
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating, false, 'text-sm')}
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {review.review_text && (
                    <p className="text-[var(--color-text-primary)] mb-3">
                      {review.review_text}
                    </p>
                  )}

                  {/* Teacher Response */}
                  {review.teacher_response && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          Teacher's Response
                        </span>
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {review.teacher_response_at && formatDate(review.teacher_response_at)}
                        </span>
                      </div>
                      <p className="text-[var(--color-text-primary)]">
                        {review.teacher_response}
                      </p>
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => markHelpful(review.id)}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      <span>👍</span>
                      <span>Helpful ({review.helpful_votes})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSystem;

