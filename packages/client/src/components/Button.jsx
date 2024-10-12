import React from 'react';

const styles = {
  button: {
    marginRight: '8px',
    padding: '2px 12px',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--button-text)',
    border: '2px solid #3f3f3f',
    borderRadius: '2px',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '1px 1px 0px #3f3f3f',
    transition: 'all var(--transition-speed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px', // Match the height of context items
  },
};

function Button({ onClick, children, style = {} }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      style={{
        ...styles.button,
        ...(isHovered ? styles.hover : {}),
        ...style,
      }}
      onClick={onClick}
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
      {children}
    </button>
  );
}

export default Button;
