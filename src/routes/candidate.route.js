import { Router } from 'express';
import {
    addVote,
    createCandidate,
    deleteCandidate,
    editCandidate,
    getCandidatesInOrder,
} from '../controllers/candidate.controller.js';
import { authMiddleware } from '../utils/authMiddleware.js';
import { roleChecker, voterChecker } from '../utils/roleChecker.js';
import upload, { checkFileUpload } from '../multer/multer.js';

const candidateRouter = Router();

candidateRouter
    .route('/create')
    .post(
        authMiddleware,
        roleChecker,
        upload.single('pic'),
        checkFileUpload,
        createCandidate
    );
candidateRouter
    .route('/edit/:id')
    .put(
        authMiddleware,
        roleChecker,
        upload.single('pic'),
        checkFileUpload,
        editCandidate
    );
candidateRouter
    .route('/delete/:id')
    .delete(authMiddleware, roleChecker, deleteCandidate);
candidateRouter.route('/countvotes').get(authMiddleware, getCandidatesInOrder);
candidateRouter.route('/vote/:id').post(authMiddleware, voterChecker, addVote);

export default candidateRouter;
