// client/src/repositories/quizRepository.js

import api from '../services/api';

export const quizRepository = {
    fetchByNoteId: (noteId) => api.get(`/notes/${noteId}/quiz`),
};
