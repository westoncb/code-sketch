import React, { useRef, useEffect, useState } from 'react';
import useStore from '../stores/store';
import ModalDialog from './ModalDialog';
import Button from "./Button"

const ContextBar = () => {
  const { context, addContextItem, removeContextItem, updateContextItem } = useStore();
  const nextId = useRef(context.length + 1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const openModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('contextText');

    if (editingItem) {
      updateContextItem(context.findIndex(item => item.id === editingItem.id), { content: text });
    } else {
      const newItem = { id: nextId.current, content: text };
      addContextItem(newItem);
      nextId.current += 1;
    }

    closeModal();
  };

  const removeContext = (index) => {
    removeContextItem(index);
  };

  const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: '6px',
      borderTop: '2px solid var(--border-color)',
      backgroundColor: 'var(--panel-bg)',
      fontFamily: 'var(--font-family)',
      overflow: 'hidden', // Prevent vertical scrolling
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
      height: '32px',
      flexShrink: 0, // Prevent button from shrinking
    };

    const scrollContainerStyle = {
      display: 'flex',
      overflowX: 'auto',
      flexGrow: 1,
      gap: '8px',
      padding: '4px 0', // Add vertical padding
      alignItems: 'center',
      msOverflowStyle: 'none', // Hide scrollbar in IE and Edge
      scrollbarWidth: 'none', // Hide scrollbar in Firefox
    };

    const contextItemStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: '2px 8px',
      backgroundColor: '#e0e0a0',
      border: '2px dashed var(--border-color)',
      borderRadius: '4px',
      color: 'var(--text-color)',
      whiteSpace: 'nowrap',
      boxShadow: '3px 3px 0px rgba(0,0,0,0.2)',
      height: '32px',
      fontFamily: "'Roboto Condensed', Arial Narrow, sans-serif",
      fontSize: '12px',
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flexShrink: 0,
      cursor: "pointer"
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

  const truncateText = (text, maxLength = 25) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  return (
    <div style={containerStyle}>
      <span style={titleStyle}>context:</span>
      <button
        style={addButtonStyle}
        onClick={() => openModal()}
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
      <div style={scrollContainerStyle}>
        {context.map((item, index) => (
          <div
            key={item.id}
            style={contextItemStyle}
            onClick={() => openModal(item)}
          >
            <span>{truncateText(item.content)}</span>
            <button
              style={removeButtonStyle}
              onClick={(e) => {
                e.stopPropagation();
                removeContext(index);
              }}
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

      <ModalDialog
        title={editingItem ? "Edit Context Item" : "Add Context Item"}
        visible={isModalOpen}
        onClose={closeModal}
      >
        <form style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "stretch"}} onSubmit={handleSubmit}>
        <textarea
                  tabIndex='0'
                  name="contextText"
                  defaultValue={editingItem ? editingItem.content : ''}
                  placeholder="Enter additional context for the LLM"
                  style={{
                    height: '200px',  // Adjust this value as needed
                    padding: '8px',
                    marginBottom: '16px',
                    backgroundColor: "var(--note-bg)",
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    resize: 'vertical',  // Allows vertical resizing
                    fontFamily: 'inherit',  // Use the same font as the rest of the app
                    fontSize: '14px',  // Adjust as needed
                    lineHeight: '1.5',  // Improves readability for multiline text
                  }}
                  autoFocus
                />
          <Button
            type="submit"
          >
            {editingItem ? "Update" : "Add"}
          </Button>
        </form>
      </ModalDialog>
    </div>
  );
};

export default ContextBar;
