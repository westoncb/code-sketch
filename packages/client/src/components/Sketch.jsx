import React, { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import Button from './Button';
import ContextBar from './ContextBar';
import axios from 'axios';
import { genCodePrompt } from '../prompts';
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
    justifyContent: 'center',
    padding: 'var(--spacing-medium)',
    borderTop: '2px solid var(--border-color)',
  },
};

function Sketch() {
  const editor = useRef(null);
  const { setMiniStatus, setCode, setActiveResultPanel, context } = useStore((state) => ({
    setMiniStatus: state.setMiniStatus,
    setCode: state.setCode,
    setActiveResultPanel: state.setActiveResultPanel,
    context: state.context,
  }));


  useEffect(() => {
    if (!editor.current) return;

    const view = new EditorView({
      doc: testSketch,
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

  const systemPrompt = "you are a helpful chatbot";
  const prompt = genCodePrompt(testSketch, context);

  const generate = async () => {
    try {
      setMiniStatus({ message: "Generating code from sketch..", displayRegion: "right", showSpinner: true });
      const response = await axios.post('/api/infer', {
        prompt,
        systemPrompt
      });
      setActiveResultPanel(ResultPanel.code)
      setCode(response.data.result);
      setMiniStatus(null);
    } catch (error) {
      setMiniStatus({message: 'Error generating code: ' + error.response.data.error, displayRegion: "right", onConfirm: () =>{}});
      console.error('Error generating code:', error.response.data.error);
    }
  }

  return (
    <div style={styles.container}>
      <div ref={editor} style={styles.editor}></div>
      <div style={styles.buttonPanel}>
        <Button style={{marginRight: "8px"}} onClick={() => {}}>Check</Button>
        <Button onClick={generate}>Generate</Button>
      </div>
      <ContextBar />
    </div>
  );
}

const testSketch = `<code_sketch>
      [purpose]: to act as an abstraction over a variety of possible LLM 'services,' which might be network APIs like OpenAI or Anthropic or OpenRouter, or might be some method of invoking an LLM locally—perhaps through a shell command invoking Ollama.
      [target_lang]: Typescript
      [custom_config]: {
          comments: terse but fairly complete
          styleInspiration: react core source code
      }


      <sketch>
          // general note: should be stateful on whether user has selected, OpenAI, Anthropic, or Ollama, in addition to the selected model. If the user wants to use Ollama we should start it up by using "ollama run \${ model_name }" so it's ready to go by inference time. Should use node's "child - process" system for Ollama interaction.

          class LLM {
              // insert: enum for LLM providers; choose appropriate name. Should include entries for OpenAI, and Anthropic
              // insert: BaseConfig, OpenAIConfig, AnthropicConfig, and OllamaConfig types
              // insert: an "InferenceResult" type, has an id, result, and indicates error vs success

              constructor() {
                  // should build up an API keys map by reading from a .env file where we have an entry for OpenAI and one for Anthropic; ollama doesn't require a key
              }

              infer(prompt, systemPrompt, config: LLMConfig /*not sure how to handle this type-wise since the type depends on the selected provider.. maybe we should have something like LLMConfig<Provider> ?*/) {
                  // the config param should have sensible defaults when user doesn't explicitly define something
              }

              selectLLM(provider, modelName)
              getActiveInferences() // should return an array of Promise<InferenceResult> for each still-running inference
              getErrorInferences()
              removeErrorInference(id)
              cancelInference(id)
              restartInference(id)
          }
      </sketch>
  </code_sketch>
`;

export default Sketch;
