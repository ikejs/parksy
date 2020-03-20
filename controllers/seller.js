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