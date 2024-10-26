import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';

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
        refreshToken: {
            type: String, // Stores the latest refresh token
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

//store password in hased form using bcrypt before document stored in doc
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//generate token /accessToken
userSchema.methods.generateToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname,
            role: this.role,
            nationalId: this.nationalId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.EXPIRES_TOKEN }
    );
};

//GENEREATE REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname,
            role: this.role,
            nationalId: this.nationalId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.EXPIRES_REFRESH_TOKEN }
    );
};

//check password bcrypt
userSchema.methods.checkPassword = function (password) {
    const isPwCorrect = bcrypt.compare(password, this.password);
    return isPwCorrect;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
