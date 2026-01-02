import { useEffect } from 'react';

export const triggerConfetti = () => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];
  const confettiCount = 50;
  const container = document.body;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
    container.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
  }
};

const ConfettiStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-100vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }

      .confetti-piece {
        position: fixed;
        width: 10px;
        height: 10px;
        top: -10px;
        z-index: 9999;
        animation: confetti-fall linear forwards;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  return null;
};

export default ConfettiStyles;
