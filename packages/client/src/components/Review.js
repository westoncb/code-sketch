import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
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
        flexDirection: 'column',
    },
    reviewContent: {
        flex: 1,
        overflowY: 'auto',
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
        flexDirection: 'column',
    },
    model: {
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
        resize: 'vertical',
    },
};
function SketchReview() {
    const llmConfig = useConfigStore((state) => state.llmConfig);
    const { review, sketch, setSketch, setMiniStatus } = useStore((state) => ({
        review: state.review,
        sketch: state.sketch,
        setSketch: state.setSketch,
        setMiniStatus: state.setMiniStatus
    }));
    const [parsedContent, setParsedContent] = useState([]);
    const [questions, setQuestions] = useState([]);
    // If we have a new review coming through, clear the old questions
    useEffect(() => {
        setQuestions([]);
    }, [review]);
    const parseReview = useCallback(() => {
        if (!review)
            return;
        const newQuestions = [];
        const newParsedContent = [];
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
    const handleQuestionResponse = (index, response) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].userResponse = response.trim() || undefined;
        setQuestions(updatedQuestions);
    };
    const refineSketch = async () => {
        let reconstructedReview = '';
        parsedContent.forEach((item) => {
            if (item.type === 'text') {
                reconstructedReview += item.content;
            }
            else if (item.type === 'question' && item.questionIndex !== undefined) {
                const q = questions[item.questionIndex];
                reconstructedReview += `<LLMQuestion question="${q.question}"${q.userResponse ? ` userResponse="${q.userResponse}"` : ''}/>`;
            }
        });
        try {
            setMiniStatus({ message: "Refining sketch..", displayRegion: "left", showSpinner: true });
            const response = await axios.post('/api/infer', {
                prompt: getRefineSketchPrompt(reconstructedReview),
                systemPrompt: "",
                config: llmConfig
            });
            setSketch(response.data.result);
            setMiniStatus(null);
        }
        catch (error) {
            setMiniStatus({ message: 'Error refining sketch: ' + error.response.data.error, displayRegion: "right", onConfirm: () => { } });
            console.error('Error refining sketch:', error.response.data.error);
        }
    };
    const unansweredQuestions = questions.filter(q => !q.userResponse).length;
    const renderContent = (content) => {
        const lines = content.split('\n');
        return lines.map((line, index) => (_jsx("pre", { children: _jsxs(React.Fragment, { children: [line, index < lines.length - 1] }) }, index)));
    };
    return (_jsxs("div", { style: styles.container, children: [_jsx("div", { style: styles.reviewContent, children: parsedContent.map((item, index) => {
                    if (item.type === 'question' && item.questionIndex !== undefined) {
                        return (_jsx(LLMQuestion, { model: llmConfig.model, question: questions[item.questionIndex], onResponse: (response) => handleQuestionResponse(item.questionIndex, response) }, index));
                    }
                    return _jsx("pre", { style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' }, children: renderContent(item.content) }, index);
                }) }), _jsxs("div", { style: styles.buttonPanel, children: [_jsxs("span", { style: styles.status, children: ["Unanswered questions: ", unansweredQuestions] }), _jsx(Button, { onClick: refineSketch, children: "Refine Sketch" })] })] }));
}
const LLMQuestion = ({ model, question, onResponse }) => {
    const [inputValue, setInputValue] = useState(question.userResponse || '');
    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onResponse(newValue);
    };
    return (_jsxs("div", { style: llmQuestionStyles.container, children: [_jsx("div", { style: llmQuestionStyles.model, children: model }), _jsx("div", { style: llmQuestionStyles.question, children: question.question }), _jsx("textarea", { value: inputValue, onChange: handleChange, style: llmQuestionStyles.textarea, placeholder: "Type your response here..." })] }));
};
export default SketchReview;
