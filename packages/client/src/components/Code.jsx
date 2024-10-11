import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';

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

function Code({text}) {
  const editor = useRef(null);

  console.log("got that text comin thru", text);

  useEffect(() => {
    if (!editor.current) return;

    const view = new EditorView({
      doc: text || '// Code content will appear here',
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
        {/* Placeholder for future buttons */}
      </div>
    </div>
  );
}

export default Code;
