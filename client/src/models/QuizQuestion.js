// client/src/models/QuizQuestion.js

export class QuizQuestion {
    constructor({ id, question, options, correctAnswer, noteId }) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.noteId = noteId;
    }
}

export const createQuizQuestion = ({ id, question, options, correctAnswer, noteId }) => {
    return new QuizQuestion({ id, question, options, correctAnswer, noteId });
};
