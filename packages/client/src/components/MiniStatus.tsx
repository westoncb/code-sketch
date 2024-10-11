import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { MiniStatusConfig } from '../client-types';
import Button from "./Button";
import useStore from '../store';

const styles: { [key: string]: CSSProperties } = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(196, 207, 161, 0.35)', // Semi-transparent bg-color
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
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
    width: 64,
    height: 64,
    border: '1px solid var(--border-color)',
  },
  message: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    color: 'var(--text-color)',
    textAlign: 'center',
    maxWidth: 200,
  },
  button: {
    marginTop: 'var(--spacing-medium)',
  },
};

const MiniStatus: React.FC<{ config: MiniStatusConfig }> = ({config}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);
  const setMiniStatus = useStore(state => state.setMiniStatus);

  useEffect(() => {
    if (!config || !config.showSpinner) return;

    const intervalId = setInterval(() => {
      setFrame(prevFrame => (prevFrame + 1) % 16);
    }, 100);

    return () => clearInterval(intervalId);
  }, [config]);

  useEffect(() => {
    if (!config || !config.showSpinner) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lightColor = '#c4cfa1';
    const darkColor = '#8b956d';
    const stripeWidth = 8;
    const stripeSpacing = stripeWidth * 2;

    ctx.clearRect(0, 0, 64, 64);

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

    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 64, 64);
  }, [frame, config]);

  // console.log("rendering!!", config)

  if (!config) return null;

  const { showSpinner, message, onConfirm } = config;

  const confirmAndClose = () => {
    setMiniStatus(null);
    onConfirm()
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        {showSpinner && (
          <canvas ref={canvasRef} width={64} height={64} style={styles.canvas} />
        )}
        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}
        {onConfirm && (
          <Button onClick={confirmAndClose} style={styles.button}>
            Okay
          </Button>
        )}
      </div>
    </div>
  );
};

export default MiniStatus;
