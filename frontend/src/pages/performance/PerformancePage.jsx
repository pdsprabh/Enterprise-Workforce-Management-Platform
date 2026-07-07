import { useState, useEffect } from 'react';
import TabNav from '../../components/ui/TabNav';
import GoalCard from '../../components/performance/GoalCard';
import ReviewCard from '../../components/performance/ReviewCard';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../components/ui/Toast';
import api from '../../api/axiosInstance';
import './PerformancePage.css';

const TABS = [
  { key: 'goals', label: 'My Goals' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'feedback', label: 'Feedback' },
];

export default function PerformancePage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const res = await api.get('/performance/me');
        const data = res.data.data;
        if (data) {
          // Map _id to id for components
          setGoals((data.goals || []).map(g => ({ ...g, id: g._id })));
          setReviews((data.reviews || []).map(r => ({ ...r, id: r._id })));
          setFeedback((data.feedback || []).map(f => ({ ...f, id: f._id })));
        }
      } catch (err) {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load performance data.' });
      } finally {
        setLoading(false);
      }
    }
    fetchPerformance();
  }, []);

  // Fix showToast calls in PerformancePage — addToast is the correct hook method
  const handleUpdateGoal = async (goalId, newProgress, newStatus) => {
    try {
      await api.put(`/performance/goals/${goalId}`, { progress: newProgress, status: newStatus });
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, progress: newProgress, status: newStatus } : g));
      addToast({ type: 'success', message: 'Goal updated successfully' });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Failed to update goal' });
    }
  };

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
            {goals.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                No goals assigned yet.
              </p>
            ) : (
              goals.map((goal) => <GoalCard key={goal.id} goal={goal} onUpdate={handleUpdateGoal} />)
            )}
          </div>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div className="reviews-grid">
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                No reviews yet.
              </p>
            ) : (
              reviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </div>
        )}

        {/* Feedback */}
        {activeTab === 'feedback' && (
          <div className="feedback-grid">
            {feedback.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                No feedback received yet.
              </p>
            ) : (
              feedback.map((fb) => (
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
