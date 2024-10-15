import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { java } from '@codemirror/lang-java';
import { rust } from '@codemirror/lang-rust';
import useStore from '../stores/store';
import useConfigStore from '../stores/configStore';

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
  comments: {
    padding: 'var(--spacing-medium)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    maxHeight: "15%",
    overflowY: "scroll"
  },
  modelName: {
    backgroundColor: "var(--llm-message-bg)",
    padding: "5px",
    borderBottom: '2px solid var(--border-color)',
    borderTop: '2px solid var(--border-color)',
  }
};

function Code() {
  const code = useStore(state => state.code);
  const editor = useRef(null);
  const [comments, setComments] = React.useState('');
  const llmConfig = useConfigStore((state) => state.llmConfig);

  useEffect(() => {
    if (!editor.current) return;

    const { code: processedCode, language, extractedComments } = processCode(code);
    setComments(extractedComments);

    const languageExtension = getLanguageExtension(language);

    const view = new EditorView({
      doc: processedCode || '',
      extensions: [
        basicSetup,
        oneDark,
        languageExtension,
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' }
        })
      ],
      parent: editor.current
    });

    return () => view.destroy();
  }, [code]);

  return (
    <div style={styles.container}>
      <div ref={editor} style={styles.editor}></div>
      {comments && <div style={styles.modelName}>{llmConfig.modelName + ":"}</div>}
      {comments && <div style={styles.comments}>{comments}</div>}
    </div>
  );
}

const processCode = (input) => {
  const codeTagRegex = /<code\s+target_lang="([^"]+)">([\s\S]*?)<\/code>([\s\S]*)/;
  const match = input.match(codeTagRegex);

  if (match) {
    const targetLang = match[1];
    const codeContent = match[2].trim();
    const extractedComments = match[3].trim();

    const detectedLanguage = detectLanguage(targetLang);

    return {
      code: codeContent,
      language: detectedLanguage,
      extractedComments: extractedComments
    };
  } else {
    return { code: input, language: null, extractedComments: '' };
  }
};

const languageOptions = ['javascript', 'typescript', 'python', 'html', 'css', 'java', 'rust'];

const detectLanguage = (targetLang) => {
  const distances = languageOptions.map(lang => ({
    lang,
    distance: levenshteinDistance(targetLang.toLowerCase(), lang)
  }));

  distances.sort((a, b) => a.distance - b.distance);

  return distances[0].distance <= 2 ? distances[0].lang : null;
};

const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const getLanguageExtension = (language) => {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return javascript();
    case 'python':
      return python();
    case 'html':
      return html();
    case 'css':
      return css();
    case 'java':
      return java();
    case 'rust':
      return rust();
    default:
      return []; // No syntax highlighting
  }
};

export default Code;
