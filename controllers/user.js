const User = require('../models/User');

exports.getSignup = (req, res) => {
    res.render('account/signup');
}

exports.postPhoneSignup = (req, res, next) => {
    const code = Math.floor(1000 + Math.random() * 9000);
    User.findOne({ phone: req.body.phone }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) { return res.send({ err: "Account with that phone number already exists." }) }
        new User({
            phone: req.body.phone,
            code
        }).save().then(user => {
            console.log(user);
            if (err) {
                return next(err);
            } else {
                twilio.messages.create({
                    body: `Your Parksy verification code is: ${code}`,
                    from: process.env.TWILIO_NUMBER,
                    to: req.body.phone
                }).then(() => {
                    res.send(user._id);
                });
            }
        });
    });
}

exports.postCheckCode = (req, res) => {
    if(req.body.signup) {
        User.findOne({ _id: req.body.userID }).then(user => {
            if(req.body.code === user.code) {
                return res.send(user)
            } else {
                return res.send({ err: "Incorrect code. Please try again." })
            }
        });
    } else {
        // check code for a login
    }
}

exports.postSignup = (req, res) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

    if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('/signup');
    }

    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        group: req.query.g
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('/signup');
        }
        user.save((err) => {
            if (err) {
                return next(err); 
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
}