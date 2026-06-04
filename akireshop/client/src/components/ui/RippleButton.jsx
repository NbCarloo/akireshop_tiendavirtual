import { useState } from 'react';

export default function RippleButton({ children, className = '', onClick, type = 'button', disabled = false }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);

    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripples.map(r => (
        <span
          key={r.id}
          className="ripple-effect absolute rounded-full pointer-events-none bg-white/25"
          style={{
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </button>
  );
}
