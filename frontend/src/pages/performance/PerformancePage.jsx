import { useState } from 'react';
import TabNav from '../../components/ui/TabNav';
import GoalCard from '../../components/performance/GoalCard';
import ReviewCard from '../../components/performance/ReviewCard';
import { mockGoals, mockReviews, mockFeedback } from '../../utils/mockData';
import { formatDate } from '../../utils/formatters';
import './PerformancePage.css';

const TABS = [
  { key: 'goals', label: 'My Goals' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'feedback', label: 'Feedback' },
];

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState('goals');

  return (
    <div className="performance-page">
      <div className="performance-page__header">
        <h1 className="performance-page__title">Performance</h1>
      </div>

      <div className="performance-page__tabs">
        <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="performance-page__content" role="tabpanel">
        {/* Goals */}
        {activeTab === 'goals' && (
          <div className="goals-grid">
            {mockGoals.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                No goals assigned yet.
              </p>
            ) : (
              mockGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
            )}
          </div>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div className="reviews-grid">
            {mockReviews.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                No reviews yet.
              </p>
            ) : (
              mockReviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </div>
        )}

        {/* Feedback */}
        {activeTab === 'feedback' && (
          <div className="feedback-grid">
            {mockFeedback.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                No feedback received yet.
              </p>
            ) : (
              mockFeedback.map((fb) => (
                <div key={fb.id} className="feedback-card">
                  <div>
                    <span className="feedback-card__from">{fb.from}</span>
                    <span className="feedback-card__role"> — {fb.role}</span>
                  </div>
                  <p className="feedback-card__message">"{fb.message}"</p>
                  <p className="feedback-card__date">{formatDate(fb.date)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
