import React, { useState, useEffect, useRef } from 'react';

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(196, 207, 161, 0.4)', // Semi-transparent bg-color
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: 'rgba(139, 149, 109, 0.9)', // Semi-transparent panel-bg
    border: '2px solid var(--border-color)',
    boxShadow: 'var(--box-shadow)',
    borderRadius: '5px',
    padding: 'var(--spacing-large)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-medium)',
  },
  canvas: {
    width: '64px',
    height: '64px',
    border: '1px solid var(--border-color)',
  },
  statusText: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    color: 'var(--text-color)',
    textAlign: 'center',
    maxWidth: '200px',
  },
};

const LoadingIndicator = ({ status }) => {
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (status === null) return;

    const intervalId = setInterval(() => {
      setFrame(prevFrame => (prevFrame + 1) % 16); // 16 frames for a complete cycle
    }, 100); // Update every 100ms

    return () => clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Gameboy-inspired colors
    const lightColor = '#c4cfa1'; // Light green
    const darkColor = '#8b956d';  // Dark green

    const stripeWidth = 8; // Width of each stripe
    const stripeSpacing = stripeWidth * 2; // Space between stripes of the same color

    ctx.clearRect(0, 0, 64, 64);

    // Draw diagonal stripes
    for (let i = -64; i < 64 * 2; i += stripeSpacing) {
      ctx.beginPath();
      ctx.moveTo(i + frame * 2, 0);
      ctx.lineTo(i + 64 + frame * 2, 64);
      ctx.lineWidth = stripeWidth;
      ctx.strokeStyle = lightColor;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i + stripeWidth + frame * 2, 0);
      ctx.lineTo(i + 64 + stripeWidth + frame * 2, 64);
      ctx.lineWidth = stripeWidth;
      ctx.strokeStyle = darkColor;
      ctx.stroke();
    }

    // Draw border
    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 64, 64);

  }, [frame, status]);

  if (status === null) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <canvas ref={canvasRef} width="64" height="64" style={styles.canvas} />
        {status && <div style={styles.statusText}>{status}</div>}
      </div>
    </div>
  );
};

export default LoadingIndicator;
