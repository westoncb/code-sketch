import React, { useRef, useEffect, useState } from 'react';

const ContextBar = () => {
  const [contextItems, setContextItems] = useState([
    { id: 1, text: 'Context 1' },
    { id: 2, text: 'Context 2' },
    { id: 3, text: 'Context 3' },
  ]);
  const scrollContainerRef = useRef(null);
  const nextId = useRef(4);

  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const addContext = () => {
    setContextItems([...contextItems, { id: nextId.current, text: `Context ${nextId.current}` }]);
    nextId.current += 1;
  };

  const removeContext = (id) => {
    setContextItems(contextItems.filter(item => item.id !== id));
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    paddingBottom: "0px",
    borderTop: '2px solid var(--border-color)',
    backgroundColor: 'var(--panel-bg)',
    fontFamily: 'var(--font-family)',
  };

  const titleStyle = {
    marginRight: '8px',
    fontWeight: 'bold',
    color: 'var(--text-color)',
    whiteSpace: 'nowrap',
  };

  const addButtonStyle = {
    marginRight: '8px',
    padding: '2px 12px',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--button-text)',
    border: '2px solid var(--border-color)',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '2px 2px 0px var(--border-color)',
    transition: 'all var(--transition-speed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px', // Match the height of context items
  };

  const scrollContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    flexGrow: 1,
    gap: '8px',
    paddingBottom: '8px',
    alignItems: 'center', // Align items vertically in the center
  };

  const contextItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '2px 12px',
    backgroundColor: '#e0e0a0',
    border: '2px dashed var(--border-color)',
    borderRadius: '4px',
    color: 'var(--text-color)',
    whiteSpace: 'nowrap',
    boxShadow: '3px 3px 0px rgba(0,0,0,0.2)',
    height: '32px', // Fixed height to match add button
  };

  const removeButtonStyle = {
    marginLeft: '8px',
    padding: '0 4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-color)',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      <span style={titleStyle}>context:</span>
      <button
        style={addButtonStyle}
        onClick={addContext}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--hover-bg)';
          e.target.style.boxShadow = '1px 1px 0px var(--border-color)';
          e.target.style.transform = 'translate(1px, 1px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--bg-color)';
          e.target.style.boxShadow = '2px 2px 0px var(--border-color)';
          e.target.style.transform = 'none';
        }}
      >
        +
      </button>
      <div ref={scrollContainerRef} style={scrollContainerStyle}>
        {contextItems.map((item) => (
          <div
            key={item.id}
            style={contextItemStyle}
          >
            <span>{item.text}</span>
            <button
              style={removeButtonStyle}
              onClick={() => removeContext(item.id)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextBar;
