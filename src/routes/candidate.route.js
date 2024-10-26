import { Router } from 'express';
import {
    addVote,
    createCandidate,
    deleteCandidate,
    editCandidate,
    getCandidatesInOrder,
} from '../controllers/candidate.controller.js';
import { authMiddleware } from '../utils/authMiddleware.js';
import { roleChecker } from '../utils/roleChecker.js';

const candidateRouter = Router();

candidateRouter
    .route('/create')
    .post(authMiddleware, roleChecker, createCandidate);
candidateRouter
    .route('/edit/:id')
    .put(authMiddleware, roleChecker, editCandidate);
candidateRouter
    .route('/delete/:id')
    .delete(authMiddleware, roleChecker, deleteCandidate);
candidateRouter.route('/vote/:id').post(authMiddleware, roleChecker, addVote);
candidateRouter
    .route('/vote/all')
    .get(authMiddleware, roleChecker, getCandidatesInOrder);

export default candidateRouter;
