import Card, { CardHeader, CardBody } from '../ui/Card';
import './Dashboard.css';

export default function ChartCard({ title, type }) {
  // Placeholder for real charts (e.g. Recharts or Chart.js)
  return (
    <Card className="h-full">
      <CardHeader>{title}</CardHeader>
      <CardBody>
        <div className="chart-container">
          <p>Chart Visualization ({type})</p>
        </div>
      </CardBody>
    </Card>
  );
}
