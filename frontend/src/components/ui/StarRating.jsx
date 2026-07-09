import './StarRating.css';

/**
 * StarRating — read-only star rating display with half-star support.
 *
 * @param {number} rating   - e.g., 3.5
 * @param {number} maxRating - default 5
 * @param {'sm'|'md'|'lg'} size
 */
export default function StarRating({ rating = 0, maxRating = 5, size = 'md' }) {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    let type = 'empty';
    if (rating >= i) type = 'full';
    else if (rating >= i - 0.5) type = 'half';
    stars.push(<span key={i} className={`star star--${type} star--${size}`} aria-hidden="true">★</span>);
  }

  return (
    <span
      className={`star-rating star-rating--${size}`}
      role="img"
      aria-label={`Rating: ${rating} out of ${maxRating}`}
    >
      {stars}
      <span className="star-rating__value">{rating.toFixed(1)}</span>
    </span>
  );
}
