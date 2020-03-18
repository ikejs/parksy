exports.getSignup = (req, res) => {
    res.render('account/signup');
}


exports.postPhoneSignup = (req, res, next) => {
    const phoneVerificationToken = Math.floor(1000 + Math.random() * 9000);
    const number = validatePhone(req.body.phone)[0];
    const timeToVerify = 1000 * 60 * 5; // 5 minutes to enter confirmation code before account is deleted.

    if(!validatePhone(req.body.phone, req.body.country).length) {
        return res.send({ errors: [`${req.body.phone} is not a valid phone number for ${req.body.country}`] })
    } else {
        User.findOne({ $and: [ { "phone.number": number }, { "phone.country": req.body.country } ] }, (err, existingUser) => {
            if (err) { return next(err); }
            if (existingUser) { return res.send({ errors: ["Account with that phone number already exists."] }) }
            new User({
                phone: { number, country: req.body.country },
                phoneVerificationToken,
                phoneVerificationExpires: Date.now() + timeToVerify
            }).save().then(user => {
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
}


exports.postCheckCode = (req, res) => {
    User
    .findOne({ _id: req.body.userID })
    .where('phoneVerificationExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        return res.send({ errors: ["Invalid or expired verification code. Please refresh and try again."] })
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
                    return res.send({ errors: ["Incorrect code. Please try again."] })
                }
            });
        } else {
            // check code for a login
        }
      }
    });
}


exports.postSignup = (req, res, next) => {
    const errors = [];
    if (!validator.isEmail(req.body.email)) errors.push('Please enter a valid email address.');
    if (!validator.isLength(req.body.password, { min: 8 })) errors.push('Password must be at least 8 characters long');

    if (errors.length) {
        return res.send({ errors })
    }

    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            return res.send({ errors: ["Account with that email address already exists."] })
        }
        // hash password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { return next(err); }
            bcrypt.hash(req.body.password, salt, (err, password) => {
                if (err) { return next(err); }
                // finish user object
                const { firstName, lastName, email, userID } = req.body;
                User.updateOne({ _id: req.body.userID }, {
                    $set: {
                        firstName,
                        lastName,
                        email,
                        password
                    }
                }).then(() => {
                    sendConfirmationEmail(userID);
                    return res.send('login');
                });
            });
        });
    });
}