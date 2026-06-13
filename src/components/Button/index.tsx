import { useWebHaptics } from 'web-haptics/react';
import './button.css';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { trigger } = useWebHaptics();

  return (
    <button
      {...props}
      className={`button ${props.className || ''}`}
      onClick={(e) => {
        trigger([{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }]); // Trigger haptic feedback
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    >
      {props.children}
    </button>
  );
};
