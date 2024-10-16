import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { MiniStatusConfig } from '../client-types';
import Button from "./Button";
import useStore from '../stores/store';

const styles: { [key: string]: CSSProperties } = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(196, 207, 161, 0.35)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  popup: {
    backgroundColor: 'rgba(139, 149, 109, 0.9)',
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
    width: 160,
    height: 144,
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

// Game Boy Color inspired palette
const palette = [
  '#332c50', '#46878f', '#94e344', '#e2f3e4',
  '#5e315b', '#8c3f5d', '#ba6156', '#f2a65e',
  '#2b2b26', '#6a6b04', '#a2db3c', '#c6f68d',
  '#563c5c', '#9b6a6c', '#e69b7b', '#f6e989',
];

const GRID_WIDTH = 40;
const GRID_HEIGHT = 36;
const CELL_SIZE = 4;

const createInitialGrid = () => {
  const grid = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push(Math.floor(Math.random() * palette.length));
    }
    grid.push(row);
  }
  return grid;
};

const updateGrid = (grid: number[][]) => {
  const newGrid = grid.map(row => [...row]);

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const neighbors = [
        grid[(y - 1 + GRID_HEIGHT) % GRID_HEIGHT][(x - 1 + GRID_WIDTH) % GRID_WIDTH],
        grid[(y - 1 + GRID_HEIGHT) % GRID_HEIGHT][x],
        grid[(y - 1 + GRID_HEIGHT) % GRID_HEIGHT][(x + 1) % GRID_WIDTH],
        grid[y][(x - 1 + GRID_WIDTH) % GRID_WIDTH],
        grid[y][(x + 1) % GRID_WIDTH],
        grid[(y + 1) % GRID_HEIGHT][(x - 1 + GRID_WIDTH) % GRID_WIDTH],
        grid[(y + 1) % GRID_HEIGHT][x],
        grid[(y + 1) % GRID_HEIGHT][(x + 1) % GRID_WIDTH],
      ];

      const currentState = grid[y][x];
      const neighborCounts = neighbors.reduce((acc, state) => {
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {});

      let maxCount = 0;
      let dominantState = currentState;

      for (const [state, count] of Object.entries(neighborCounts)) {
        if (typeof count === 'number' && count > maxCount) {
          maxCount = count;
          dominantState = Number(state);
        }
      }

      if (maxCount > 3) {
        newGrid[y][x] = dominantState;
      } else if (maxCount < 2) {
        newGrid[y][x] = (currentState + 1) % palette.length;
      }
    }
  }

  return newGrid;
};

const MiniStatus: React.FC<{ config: MiniStatusConfig }> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState(() => createInitialGrid());
  const setMiniStatus = useStore(state => state.setMiniStatus);

  useEffect(() => {
    if (!config || !config.showSpinner) return;

    const intervalId = setInterval(() => {
      setGrid(prevGrid => updateGrid(prevGrid));
    }, 150);

    return () => clearInterval(intervalId);
  }, [config]);

  useEffect(() => {
    if (!config || !config.showSpinner) return;

    const intervalId = setInterval(() => {
      setGrid(() => createInitialGrid());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!config || !config.showSpinner) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        ctx.fillStyle = palette[grid[y][x]];
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }, [grid, config]);

  if (!config) return null;

  const { showSpinner, message, onConfirm } = config;

  const confirmAndClose = () => {
    setMiniStatus(null);
    onConfirm();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        {showSpinner && (
          <canvas ref={canvasRef} width={160} height={144} style={styles.canvas} />
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
