// client/src/services/quizService.js

import { quizRepository } from '../repositories/quizRepository';
import { createQuizQuestion } from '../models/QuizQuestion';

function normalizeText(text) {
    return (text || '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function generateQuestions(noteContent) {
    const content = normalizeText(noteContent);
    const sentences = content
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

    const firstSentence = sentences[0] || 'What is the main point of this note?';
    const secondSentence = sentences[1] || 'The note is about the main idea.';
    const thirdSentence = sentences[2] || 'It contains important learning highlights.';

    return [
        createQuizQuestion({
            id: 1,
            noteId: null,
            question: 'What is the main idea of the note?',
            options: [firstSentence, secondSentence, thirdSentence, 'I am not sure'],
            correctAnswer: firstSentence,
        }),
        createQuizQuestion({
            id: 2,
            noteId: null,
            question: 'Which sentence best summarizes the note?',
            options: [secondSentence, thirdSentence, firstSentence, 'None of the above'],
            correctAnswer: firstSentence,
        }),
        createQuizQuestion({
            id: 3,
            noteId: null,
            question: 'What should you remember from this note?',
            options: [thirdSentence, firstSentence, secondSentence, 'No important facts'],
            correctAnswer: firstSentence,
        }),
    ];
}

export const quizService = {
    generateQuestions,
    getQuizForNote: (noteId) => quizRepository.fetchByNoteId(noteId),
};
