import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    party: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    pic: {
        publicId: String,
        secureUrl: String,
    },

    votes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            votedAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],

    voteCount: {
        type: Number,
        default: 0,
    },
});

const Candidate =
    mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);
export default Candidate;
