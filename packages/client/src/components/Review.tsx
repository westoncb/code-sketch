import React, { useState, useEffect, useCallback } from 'react';
import Button from "./Button";
import useStore from "../stores/store";
import useConfigStore from "../stores/configStore";
import axios from 'axios';
import { getRefineSketchPrompt } from '../prompts';

const styles = {
  container: {
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  reviewContent: {
    flex: 1,
    overflowY: 'auto' as const,
    backgroundColor: 'var(--note-bg)',
    padding: 'var(--spacing-medium)',
    borderBottom: "2px solid black",
    borderRadius: '4px',
  },
  buttonPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-medium)',
    backgroundColor: 'var(--panel-bg)',
  },
  status: {
    fontSize: 'var(--font-size-medium)',
    fontWeight: "bold"
  },
};

const llmQuestionStyles = {
  container: {
    backgroundColor: 'var(--llm-message-bg)',
    padding: 'var(--spacing-medium)',
    margin: 'var(--spacing-medium) 0',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  modelName: {
    fontWeight: 'bold',
    marginBottom: 'var(--spacing-small)',
  },
  question: {
    marginBottom: 'var(--spacing-medium)',
  },
  textarea: {
    minHeight: '4em',
    padding: 'var(--spacing-small)',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    resize: 'vertical' as const,
  },
};

interface QuestionObject {
  question: string;
  userResponse?: string;
}

interface ParsedContent {
  type: 'text' | 'question';
  content: string;
  questionIndex?: number;
}

function SketchReview() {
  const { modelName } = useConfigStore((state) => state.llmConfig);
  const { review, sketch, setSketch, setMiniStatus} = useStore((state) => ({
    review: state.review,
    sketch: state.sketch,
    setSketch: state.setSketch,
    setMiniStatus: state.setMiniStatus
  }));

  const [parsedContent, setParsedContent] = useState<ParsedContent[]>([]);
  const [questions, setQuestions] = useState<QuestionObject[]>([]);


  const parseReview = useCallback(() => {
     if (!review) return;

     const newQuestions: QuestionObject[] = [];
     const newParsedContent: ParsedContent[] = [];

     const questionRegex = /<LLMQuestion\s+question="([^"]+)"(?:\s+userResponse="([^"]+)")?[^>]*>([\s\S]*?)<\/LLMQuestion>|<LLMQuestion\s+question="([^"]+)"(?:\s+userResponse="([^"]+)")?[^>]*\/>/g;
     let lastIndex = 0;
     let match;

     while ((match = questionRegex.exec(review)) !== null) {
       if (match.index > lastIndex) {
         newParsedContent.push({
           type: 'text',
           content: review.slice(lastIndex, match.index),
         });
       }

       const [fullMatch, question1, userResponse1, content, question2, userResponse2] = match;
       const question = question1 || question2;
       const userResponse = userResponse1 || userResponse2;

       newQuestions.push({ question, userResponse });
       newParsedContent.push({
         type: 'question',
         content: question,
         questionIndex: newQuestions.length - 1,
       });

       if (content) {
         newParsedContent.push({
           type: 'text',
           content: content.trim(),
         });
       }

       lastIndex = match.index + fullMatch.length;
     }

     if (lastIndex < review.length) {
       newParsedContent.push({
         type: 'text',
         content: review.slice(lastIndex),
       });
     }

     setParsedContent(newParsedContent);
     setQuestions(newQuestions);
   }, [review]);

  useEffect(() => {
    parseReview();
  }, [parseReview]);

  const handleQuestionResponse = (index: number, response: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].userResponse = response.trim() || undefined;
    setQuestions(updatedQuestions);
  };

  const refineSketch = async () => {
    let reconstructedReview = '';
    parsedContent.forEach((item) => {
      if (item.type === 'text') {
        reconstructedReview += item.content;
      } else if (item.type === 'question' && item.questionIndex !== undefined) {
        const q = questions[item.questionIndex];
        reconstructedReview += `<LLMQuestion question="${q.question}"${q.userResponse ? ` userResponse="${q.userResponse}"` : ''}/>`;
      }
    });

    try {
      setMiniStatus({ message: "Refining sketch..", displayRegion: "left", showSpinner: true });
      const response = await axios.post('/api/infer', {
        prompt: getRefineSketchPrompt(reconstructedReview),
        systemPrompt: ""
      });
      setSketch(response.data.result);
      setMiniStatus(null);
    } catch (error) {
      setMiniStatus({message: 'Error refining sketch: ' + error.response.data.error, displayRegion: "right", onConfirm: () =>{}});
      console.error('Error refining sketch:', error.response.data.error);
    }
  };

  const unansweredQuestions = questions.filter(q => !q.userResponse).length;

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div style={styles.container}>
      <div style={styles.reviewContent}>
        {parsedContent.map((item, index) => {
          if (item.type === 'question' && item.questionIndex !== undefined) {
            return (
              <LLMQuestion
                key={index}
                modelName={modelName}
                question={questions[item.questionIndex]}
                onResponse={(response) => handleQuestionResponse(item.questionIndex!, response)}
              />
            );
          }
          return <pre key={index} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{renderContent(item.content)}</pre>;
        })}
      </div>
      <div style={styles.buttonPanel}>
        <span style={styles.status}>
          Unanswered questions: {unansweredQuestions}
        </span>
        <Button onClick={refineSketch}>Refine Sketch</Button>
      </div>
    </div>
  );
}

interface LLMQuestionProps {
  modelName: string;
  question: QuestionObject;
  onResponse: (response: string) => void;
}

const LLMQuestion: React.FC<LLMQuestionProps> = ({ modelName, question, onResponse }) => {
  const [inputValue, setInputValue] = useState(question.userResponse || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onResponse(newValue);
  };

  return (
    <div style={llmQuestionStyles.container}>
      <div style={llmQuestionStyles.modelName}>{modelName}</div>
      <div style={llmQuestionStyles.question}>{question.question}</div>
      <textarea
        value={inputValue}
        onChange={handleChange}
        style={llmQuestionStyles.textarea}
        placeholder="Type your response here..."
      />
    </div>
  );
};

export default SketchReview;
