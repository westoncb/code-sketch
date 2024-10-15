import React, { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import Button from './Button';
import ContextBar from './ContextBar';
import axios from 'axios';
import { genCodePrompt, genReviewPrompt } from '../prompts';
import useStore from '../stores/store';
import { ResultPanel } from '../client-types';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative'
  },
  editor: {
    flex: 1,
    overflow: 'auto',
  },
  buttonPanel: {
    display: 'flex',
    justifyContent: 'right',
    padding: 'var(--spacing-medium)',
    borderTop: '2px solid var(--border-color)',
  },
};

function Sketch() {
  const editor = useRef(null);
  const editorView = useRef(null);

  const { setMiniStatus, setCode, setReview, setActiveResultPanel, context, sketch, setSketch } = useStore((state) => ({
    setMiniStatus: state.setMiniStatus,
    setCode: state.setCode,
    setReview: state.setReview,
    setActiveResultPanel: state.setActiveResultPanel,
    context: state.context,
    sketch: state.sketch,
    setSketch: state.setSketch
  }));


  useEffect(() => {
    if (!editor.current) return;

    const view = new EditorView({
      doc: sketch,
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

    editorView.current = view;

    return () => view.destroy();
  }, [sketch]);

  const getEditorContent = () => {
    if (editorView.current) {
      return editorView.current.state.doc.toString();  // Get the document contents as a string
    }
    return '';
  };

  const systemPrompt = "";

  const generateCode = async () => {
    try {
      setMiniStatus({ message: "Generating code from sketch..", displayRegion: "right", showSpinner: true });
      const response = await axios.post('/api/infer', {
        prompt: genCodePrompt(getEditorContent(), context),
        systemPrompt
      });
      setSketch(getEditorContent());
      setActiveResultPanel(ResultPanel.code);
      setCode(response.data.result);
      setMiniStatus(null);
    } catch (error) {
      setMiniStatus({message: 'Error generating code: ' + error.response.data.error, displayRegion: "right", onConfirm: () =>{}});
      console.error('Error generating code:', error.response.data.error);
    }
  }

  const generateReview = async () => {
    try {
      setMiniStatus({ message: "Generating review from sketch..", displayRegion: "right", showSpinner: true });
      const response = await axios.post('/api/infer', {
        prompt: genReviewPrompt(getEditorContent(), context),
        systemPrompt
      });
      setSketch(getEditorContent());
      setActiveResultPanel(ResultPanel.review);
      setReview(response.data.result);
      setMiniStatus(null);
    } catch (error) {
      setMiniStatus({message: 'Error generating review: ' + error.response?.data.error, displayRegion: "right", onConfirm: () =>{}});
      console.error('Error generating review:', error);
    }
  }

  return (
    <div style={styles.container}>
      <div ref={editor} style={styles.editor}></div>
      <div style={styles.buttonPanel}>
        <Button style={{marginRight: "8px", flexGrow: 1}} onClick={generateReview}>Review Sketch</Button>
        <Button style={{flexGrow: 1}} onClick={generateCode}>Generate Code</Button>
      </div>
      <ContextBar />
    </div>
  );
}

export default Sketch;
