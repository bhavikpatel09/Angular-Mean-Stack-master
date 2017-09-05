import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    //username: String,
    //email: { type: String, unique: true, lowercase: true, trim: true },
    //password: String,
    //role: String
    local: {
        username: String,
        email: { type: String, unique: true, lowercase: true, trim: true },
        password: String,
        role: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
});

// Before saving the user, hash the password
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next(err); }
        bcrypt.hash(user.local.password, salt, function (error, hash) {
            if (error) { return next(error); }
            user.local.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.local.password, function (err, isMatch) {
        if (err) { return callback(err); }
        callback(null, isMatch);
    });
};

// Omit the password when returning a user
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.local.password;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);

export default User;
