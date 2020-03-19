// set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



sendConfirmationEmail = (userID , req) => {
  User.findById(ObjectId(userID), (err, user) => {
    if(err) return console.log(err);
    const { email, firstName, emailVerificationToken } = user;
    sgMail.send({
      to: email,
      from: 'noreply@parksy.com',
      subject: 'Welcome to Parksy! Confirm Your Email',
      html: `
        <center>
        <h1>Welcome to Parksy, ${firstName}!</h1>
        <p>To activate your account, <strong><a target="_blank" href="https://${req.headers.host}/confirm/${emailVerificationToken}">Click Here</a></strong>.</p>
        <p>Or copy/paste this URL into your browser: <a target="_blank" href="/">https://${req.headers.host}/confirm/${emailVerificationToken}</a></p>
        <small>If you did not sign up for parksy.com, ignore this email.</small>
        </center>
      `
    }).catch((err) => {
      if (err.message === 'self signed certificate in certificate chain') {
        return console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
      }
      console.log('ERROR: Could not send verifyEmail email after security downgrade.\n', err);
      req.flash('errors', { msg: 'Error sending the email verification message. Please try again shortly.' });
      return err;
    });
  });
};