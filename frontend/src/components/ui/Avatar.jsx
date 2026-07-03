import { getInitials } from '../../utils/formatters';
import './Avatar.css';

export default function Avatar({ src, name, size = 'md', className = '' }) {
  if (src) {
    return (
      <img 
        src={src} 
        alt={name || 'Avatar'} 
        className={`avatar-img avatar--${size} ${className}`} 
      />
    );
  }

  return (
    <div className={`avatar-initials avatar--${size} ${className}`} title={name}>
      {getInitials(name)}
    </div>
  );
}
