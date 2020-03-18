const User = require('../models/User');


exports.getSignup = (req, res) => {
    res.render('account/signup');
}

exports.postPhoneSignup = (req, res, next) => {
    const phoneVerificationToken = Math.floor(1000 + Math.random() * 9000);
    const number = validatePhone(req.body.phone)[0];
    const country = validatePhone(req.body.phone)[1];
    const timeToVerify = 1000 * 60 * 5; // 5 minutes

    User.findOne({ "phone.number": number }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) { return res.send({ err: "Account with that phone number already exists." }) }
        new User({
            phone: { number, country },
            phoneVerificationToken,
            phoneVerificationExpires: Date.now() + timeToVerify
        }).save().then(user => {
            console.log(user);
            if (err) {
                return res.send({ err })
            } else {
                twilio.messages.create({
                    body: `Your Parksy verification code is: ${phoneVerificationToken}`,
                    from: process.env.TWILIO_NUMBER,
                    to: user.phone.number
                }).then(() => {
                    res.send(user._id);
                });
                sleep(timeToVerify).then(() => {
                    if(err) { return console.log(`FAILED TO REMOVE UNVERIFIED USER: ${user}`) }
                    if(!user.phoneVerified) {
                        return User.deleteOne({ _id: user._id });
                    }
                });
            }
        });
    });
}

exports.postCheckCode = (req, res) => {
    User
    .findOne({ _id: req.body.userID })
    .where('phoneVerificationExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        return res.send({ err: "Invalid or expired verification code. Please refresh and try again." })
      } else {
        if(req.body.signup) {
            User.findOne({ _id: req.body.userID }).then(user => {
                if(parseInt(req.body.code) === user.phoneVerificationToken) {
                    user.phoneVerificationToken = '';
                    user.phoneVerificationExpires = '';
                    user.phoneVerified = true;
                    user.save((err) => {
                        if(err) { return res.send({ err }) }
                        return res.send(user)
                    })
                } else {
                    return res.send({ err: "Incorrect code. Please try again." })
                }
            });
        } else {
            // check code for a login
        }
      }
    });
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