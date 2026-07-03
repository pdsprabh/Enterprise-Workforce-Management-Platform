import './LoadingSpinner.css';

export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  if (fullScreen) {
    return (
      <div className="spinner-overlay">
        <div className={`spinner spinner--${size}`} />
      </div>
    );
  }

  return <div className={`spinner spinner--${size}`} />;
}
