import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import Button from './Button';
import ContextBar from './ContextBar';

const styles = {
  sketchContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden', // Prevent any potential overflow
  },
  codeEditorContainer: {
    flex: 1,
    overflow: 'hidden', // Hide overflow, let CodeMirror handle scrolling
    borderBottom: '2px solid var(--border-color)',
  },
  actionButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: 'var(--spacing-medium)',
    borderBottom: '2px solid var(--border-color)',
  },
  button: {
    margin: '0 var(--spacing-small)',
  },
};

function Sketch() {
  const editor = useRef();

  useEffect(() => {
    if (!editor.current) return;

    const view = new EditorView({
      doc: '// Your code sketch here',
      extensions: [
        basicSetup,
        javascript(),
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
    <div style={styles.sketchContainer}>
      <div style={styles.codeEditorContainer} ref={editor}></div>
      <div style={styles.actionButtonsContainer}>
        <Button style={styles.button} onClick={() => console.log('Check')}>check</Button>
        <Button style={styles.button} onClick={() => console.log('Generate')}>generate</Button>
      </div>
      <ContextBar />
    </div>
  );
}

export default Sketch;
