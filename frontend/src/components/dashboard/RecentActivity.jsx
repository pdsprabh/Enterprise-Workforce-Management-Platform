import Card, { CardHeader, CardBody } from '../ui/Card';
import { formatRelativeTime } from '../../utils/formatters';
import './Dashboard.css';

export default function RecentActivity({ activities }) {
  return (
    <Card className="h-full">
      <CardHeader>Recent Activity</CardHeader>
      <CardBody>
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-item__indicator">
                <div className={`activity-item__dot bg-${activity.type}`}></div>
                <div className="activity-item__line"></div>
              </div>
              <div className="activity-item__content">
                <h4 className="activity-item__action">{activity.action}</h4>
                <p className="activity-item__desc">{activity.description}</p>
                <span className="activity-item__time">{formatRelativeTime(activity.time)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
