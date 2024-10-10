import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import Button from './Button';
import ContextBar from './ContextBar';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  editor: {
    flex: 1,
    overflow: 'auto',
  },
  buttonPanel: {
    display: 'flex',
    justifyContent: 'center',
    padding: 'var(--spacing-medium)',
    borderTop: '2px solid var(--border-color)',
  },
};

function Sketch({ onAction }) {
  const editor = useRef(null);

  useEffect(() => {
    if (!editor.current) return;

    const view = new EditorView({
      doc: '// Your code sketch here',
      extensions: [
        basicSetup,
        oneDark,
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' }
        })
      ],
      parent: editor.current
    });

    return () => view.destroy();
  }, []);

  return (
    <div style={styles.container}>
      <div ref={editor} style={styles.editor}></div>
      <div style={styles.buttonPanel}>
        <Button onClick={() => onAction('check')}>Check</Button>
        <Button onClick={() => onAction('generate')}>Generate</Button>
      </div>
      <ContextBar />
    </div>
  );
}

export default Sketch;
