import React from 'react';
import Button from './Button';

function ActionButtons() {
  return (
    <div className="action-buttons">
      <Button onClick={() => console.log('Check')}>check</Button>
      <Button onClick={() => console.log('Generate')}>generate</Button>
    </div>
  );
}

export default ActionButtons;
