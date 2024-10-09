import React from 'react';

const styles = {
  button: {
    padding: 'var(--spacing-small) var(--spacing-medium)',
    border: '2px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--button-text)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    cursor: 'pointer',
    transition: 'background-color var(--transition-speed)',
  },
  hover: {
    backgroundColor: 'var(--hover-bg)',
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}

export default Button;
