exports.getSellerDashboard = (req, res) => {
    res.render('seller/dashboard', {
        title: "Seller Dashboard",
        seller: true
    });
}

exports.getNew = (req, res) => {
    res.render('seller/new', {
        title: "Create New Parking Listing"
    });
}

exports.postNew = (req, res) => {    
    const imagePath = `${req.user._id}-${ObjectId()}.jpg`
    S3.upload(req.files.image.tempFilePath, imagePath, {
        resize: { width: 400 }
    })
    .then(r => {
        console.log(r);


        // add to DB


        req.flash('success', { msg: 'Listing created!' })
        res.redirect('/sell')
    })
    .catch(e => {
        console.error(e);
        req.flash('errors', { msg: `${e}` })
        return res.redirect('/sell/new');
    });
}
