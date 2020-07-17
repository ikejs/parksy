exports.getSignup = (req, res) => {
    if(req.user) return res.redirect('/');
    res.render('account/signup', {
        title: "Sign Up",
        noNav: true
    });
}


exports.postPhoneSignup = (req, res, next) => {
    const phoneVerificationToken = Math.floor(1000 + Math.random() * 9000);
    const number = validatePhone(req.body.phone)[0];
    const timeToVerify = 1000 * 60 * 5; // 5 minutes to enter confirmation code before account is deleted.

    if(!validatePhone(req.body.phone, req.body.country).length) {
        return res.send({ errors: [`${req.body.phone} is not a valid phone number for ${req.body.country}`] })
    } else {
        User.findOne({ $and: [ { "phone.number": number }, { "phone.country": req.body.country } ] }, async (err, existingUser) => {
            if (err) { return next(err); }
            if (existingUser && existingUser.phoneVerified) { 
              return res.send({ errors: ["Account with that phone number already exists."] });
            } else if (existingUser) {
              await Promise.all([User.deleteOne({ _id: existingUser._id })]); // delete user if created but phone not verified.
            }
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
    const timeToVerify = 1000 * 60 * 60 * 24; // 1 day to confirm email before expiry.
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
                        password,
                        emailVerificationToken: generateToken()
                    }
                }).then(() => {
                    sendConfirmationEmail(userID, req);
                    return res.send('login');
                });
            });
        });
    });
}


exports.getAnotherEmailConfirmation = (req, res) => {
  User.updateOne({ _id: req.params.userID }, {
    $set: { emailVerificationToken: generateToken() }
  }).then(() => {
      sendConfirmationEmail(req.params.userID, req);
      req.flash('info', { msg: 'Verification email resent.' });
      res.redirect('/');
  });
}


exports.getConfirmEmailToken = (req, res, next) => {
    if (req.user.emailVerified) {
      req.flash('info', { msg: 'The email address has been verified.' });
      return res.redirect('/');
    }
  
    const validationErrors = [];
    if (req.params.token && (!validator.isHexadecimal(req.params.token))) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      return res.redirect('/');
    }
  
    if (req.params.token === req.user.emailVerificationToken) {
      User
        .findOne({ email: req.user.email })
        .then((user) => {
          if (!user) {
            req.flash('errors', { msg: 'There was an error in loading your profile.' });
            return res.redirect('/');
          }
          user.emailVerificationToken = '';
          user.emailVerified = true;
          user = user.save();
          req.flash('success', { msg: 'Your email has been verified!' });
          return res.redirect('/');
        })
        .catch((error) => {
          console.log('Error saving the user profile to the database after email verification', error);
          req.flash('errors', { msg: 'There was an error when updating your profile.  Please try again later.' });
          return res.redirect('/');
        });
    } else {
      req.flash('errors', { msg: 'The verification link was invalid, or is for a different account.' });
      return res.redirect('/');
    }
  };



exports.getLogin = (req, res) => {
    if(req.user) return res.redirect('/');
    res.render('account/login', {
        title: "Login",
        noNav: true
    });
}


exports.postLogin = (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      return res.redirect('/login');
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', info);
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: `Welcome back, ${req.user.firstName}!` });
        res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
  };


  exports.logout = (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.redirect('/');
    });
  };
  