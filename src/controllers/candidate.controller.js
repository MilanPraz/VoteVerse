import Candidate from '../models/candidate.js';
import { ApiError } from '../utils/apiError.js';
import { asynchandler } from '../utils/ASynchandler.js';
import { sendResponse } from '../utils/sendResponse.js';
import User from '../models/user.js';

// CREATE CANDIDATE CONTROLLER
export const createCandidate = asynchandler(async (req, res) => {
    const { fullname, party, age } = req.body;

    // Basic validation
    if (!fullname || !party || !age) {
        throw new ApiError(
            400,
            'All fields (fullname, party, age) are required'
        );
    }

    // Check if the candidate already exists by full name and party
    const existingCandidate = await Candidate.findOne({ fullname, party });
    if (existingCandidate) {
        throw new ApiError(
            409,
            'Candidate with this name and party already exists'
        );
    }

    // Create a new candidate document
    const newCandidate = await Candidate.create({
        fullname,
        party,
        age,
    });

    // Send response
    sendResponse(res, 201, 'Candidate created successfully', {
        candidate: newCandidate,
    });
});
//EDIT CANDIDATE
export const editCandidate = asynchandler(async (req, res) => {
    const { id } = req.params;
    const candaidateUpdate = req.body;

    const updatedCandidate = await Candidate.findByIdAndUpdate(
        id,
        candaidateUpdate,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!updatedCandidate) throw new ApiError(404, 'Candidate not found');

    sendResponse(
        res,
        201,
        'Successfully updated the candidate.',
        updatedCandidate
    );
});
//DELETE CANDIDATE
export const deleteCandidate = asynchandler(async (req, res) => {
    const { id } = req.params;

    const deletedCandidate = await Candidate.findByIdAndDelete(id);
    if (!deletedCandidate) throw new ApiError(404, 'Candidate not found.');

    sendResponse(201, 'Candidate Deleted Successfully.');
});

//voter votes
export const addVote = asynchandler(async (req, res) => {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);

    if (!candidate) throw new ApiError(404, 'Candidate not found!');

    //user id will be provided from auth
    let voterId = req.userId;
    //check of voter exist?
    const voter = await User.findById(voterId);
    if (!voter) throw new ApiError(401, 'User not found!');
    //check if vooter is admin
    if (voter.role === 'admin')
        throw new ApiError(403, 'Admins are not allowed to vote');

    //check if the user already voted or not
    const alreadyVoted = candidate.votes.find(
        (vote) => vote.userId.toString() === voterId
    );

    if (alreadyVoted)
        throw new ApiError(401, 'You have already voted this candidate!');

    candidate.votes.push({
        userId: voterId,
        votedAt: Date.now(),
    });
    candidate.voteCount += 1;
    await candidate.save();
    voter.hasVoted = true;
    await voter.save();

    sendResponse(res, 200, 'Voted Successfully!');
});

//get candidates on basis of votes order

export const getCandidatesInOrder = asynchandler(async (req, res) => {
    //candidates list in descending order
    const candidates = await Candidate.find().sort({ voteCount: 'desc' });

    sendResponse(res, 200, 'Candidates according to highest votes', candidates);
});
