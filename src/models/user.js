import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            minLength: [10, 'Min length of phone is 10  digits.'],
            trim: true,
            unique: [true, 'Phone should be unique.'],
        },
        email: {
            type: String,
            validate: [validator.isEmail, 'Enter a valid email.'],
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        nationalId: {
            type: String,
            required: true,
            unique: [true, 'National Id should be unique.'],
        },
        role: {
            type: String,
            enum: ['voter', 'admin'],
        },
        hasVoted: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
        },
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
