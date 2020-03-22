const userSchema = new mongoose.Schema({
    phone: { type: Object, unique: true },
    phoneVerificationToken: Number,
    phoneVerificationExpires: Date,
    phoneVerified: Boolean,
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerified: Boolean,
    tokens: Array,
    lots : [{ type: mongoose.Schema.Types.ObjectId, ref: "lot" }]
}, { timestamps: true });

// Helper method for validating user's password.
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
