import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const {
    Schema,
    model
} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return !this.isGoogleAccount;
        }
    },
    isGoogleAccount: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') && !this.isGoogleAccount) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (this.isGoogleAccount) {
        throw new Error('Cannot compare passwords for a Google account');
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

export default model('User', userSchema);