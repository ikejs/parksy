exports.getSellerDashboard = (req, res) => {


    User.findById(req.user._id).then(async user => {

        const lots = [];

        await Promise.all(user.lots.map(async lotID => {
            await Lot.findById(lotID).then(lot => lots.unshift(lot));
        }));

        res.render('seller/dashboard', {
            title: "Seller Dashboard",
            seller: true,
            lots: JSON.parse(JSON.stringify(lots))
        });
    })
    
}

exports.getNew = (req, res) => {
    res.render('seller/new', {
        title: "New Parking Lot Listing",
        GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY
    });
}

exports.postNew = (req, res) => {

    const { lotName, lotAddress, description } = req.body;

    User.findById(req.user._id).then(user => {
        // create lot
        const lotID = ObjectId();
        const lot = new Lot({
            _id: lotID,
            lotName,
            address: lotAddress,
            description,
            openSalesDate: new Date(),
            openLotDate: new Date(),
            spaces: []
        });
        
        // upload lot image
        const imagePath = `${user._id}-${lotID}.jpg`
        S3.upload(req.files.image.tempFilePath, imagePath, {
            resize: { width: 400 }
        }).then(() => {
            lot.imageURLs = [`https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${imagePath}`];
            lot.save()
            .then(() => {
                user.lots.unshift(lot._id);
                user.save()
                .then(() => {
                    req.flash('success', { msg: 'Listing created!' })
                    res.redirect('/sell');
                });
            });
        }).catch(e => {
            console.error(e);
            req.flash('errors', { msg: `${e}` })
            return res.redirect('/sell/new');
        });
        
    });


}
