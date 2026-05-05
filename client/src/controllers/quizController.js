// client/src/controllers/quizController.js

import { quizService } from '../services/quizService';

export const quizController = {
    async getNoteQuiz(noteId) {
        return quizService.getQuizForNote(noteId);
    },

    generateQuestions(noteContent) {
        return quizService.generateQuestions(noteContent);
    },
};
